import { internalMutation, internalQuery, query } from "./_generated/server";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { workflow } from "./emailWorkflows";

// Re-export actions from stripeActions.ts
export { createCheckoutSession, createPortalSession, syncSubscription } from "./stripeActions";

const PLAN_PRICES: Record<string, { plan: "free" | "starter" | "pro" | "scale"; limit: number }> = {
  // These will be set in Stripe Dashboard - use env vars or hardcode after creation
  // Format: price_xxx -> { plan, limit }
};

function getPlanFromPriceId(priceId: string): { plan: "free" | "starter" | "pro" | "scale"; limit: number } {
  // Check hardcoded mappings first
  if (PLAN_PRICES[priceId]) {
    return PLAN_PRICES[priceId];
  }

  // Fallback: Parse from price metadata or use defaults based on amount
  // In production, configure price IDs in env vars
  const priceIdLower = priceId.toLowerCase();
  if (priceIdLower.includes("starter") || priceIdLower.includes("1000")) {
    return { plan: "starter", limit: 1000 };
  }
  if (priceIdLower.includes("scale") || priceIdLower.includes("10000")) {
    return { plan: "scale", limit: 10000 };
  }
  // Default to pro
  return { plan: "pro", limit: 3000 };
}

export const getSubscription = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const quota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!quota) return null;

    return {
      plan: quota.plan,
      monthlyLimit: quota.monthlyLimit,
      stripeSubscriptionId: quota.stripeSubscriptionId,
      stripeSubscriptionStatus: quota.stripeSubscriptionStatus,
      stripePriceId: quota.stripePriceId,
      currentPeriodEnd: quota.currentPeriodEnd,
      cancelAtPeriodEnd: quota.cancelAtPeriodEnd,
    };
  },
});

// Query to get stripeCustomerId from Better Auth user table
export const getStripeCustomer = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Query Better Auth user table via component adapter
    // userId here is actually the _id of the user document from Better Auth
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });

    if (!user || !user.stripeCustomerId) return null;

    return {
      userId,
      stripeCustomerId: user.stripeCustomerId,
    };
  },
});

// Internal query for actions to use
export const getStripeCustomerInternal = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Query Better Auth user table via component adapter
    // userId here is actually the _id of the user document from Better Auth
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });

    if (!user || !user.stripeCustomerId) return null;

    return {
      userId,
      stripeCustomerId: user.stripeCustomerId,
    };
  },
});

// Internal mutations called by webhooks

export const ensureStripeCustomer = internalMutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, { userId, stripeCustomerId }) => {
    // Update Better Auth user with stripeCustomerId
    // userId here is actually the _id of the user document from Better Auth
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: userId }],
        update: { stripeCustomerId },
      },
    });
  },
});

export const handleCheckoutCompleted = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripeCustomerId: v.string(),
    userId: v.string(),
    priceId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    const {
      stripeSubscriptionId,
      stripeCustomerId,
      userId,
      priceId,
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    } = args;
    const { plan, limit } = getPlanFromPriceId(priceId);

    // Upsert quota
    const existingQuota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingQuota) {
      await ctx.db.patch(existingQuota._id, {
        plan,
        monthlyLimit: limit,
        stripeSubscriptionId,
        stripeSubscriptionStatus: status,
        stripePriceId: priceId,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      });
    } else {
      await ctx.db.insert("quotas", {
        userId,
        plan,
        monthlyLimit: limit,
        stripeSubscriptionId,
        stripeSubscriptionStatus: status,
        stripePriceId: priceId,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      });
    }

    // Update Better Auth user with stripeCustomerId
    // userId here is actually the _id of the user document from Better Auth
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [{ field: "_id", value: userId }],
        update: { stripeCustomerId },
      },
    });

    // Start post-upgrade email workflow
    await workflow.start(ctx, internal.emailWorkflows.postUpgradeWorkflow, { userId });
  },
});

export const syncSubscriptionFromWebhook = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.string(),
    priceId: v.string(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Find quota by subscription ID
    const quotas = await ctx.db.query("quotas").collect();
    const quota = quotas.find((q) => q.stripeSubscriptionId === args.stripeSubscriptionId);

    if (!quota) {
      console.error("Quota not found for subscription:", args.stripeSubscriptionId);
      return;
    }

    const previousCancelAtPeriodEnd = quota.cancelAtPeriodEnd;
    const { plan, limit } = getPlanFromPriceId(args.priceId);

    await ctx.db.patch(quota._id, {
      plan,
      monthlyLimit: limit,
      stripeSubscriptionStatus: args.status,
      stripePriceId: args.priceId,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
    });

    // Start cancellation email workflow when cancelAtPeriodEnd flips to true
    if (args.cancelAtPeriodEnd && !previousCancelAtPeriodEnd) {
      await workflow.start(ctx, internal.emailWorkflows.cancellationWorkflow, {
        userId: quota.userId,
      });
    }
  },
});

export const handleInvoicePaid = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    periodEnd: v.number(),
  },
  handler: async (ctx, { stripeSubscriptionId, periodEnd }) => {
    const quotas = await ctx.db.query("quotas").collect();
    const quota = quotas.find((q) => q.stripeSubscriptionId === stripeSubscriptionId);

    if (!quota) {
      console.error("Quota not found for subscription:", stripeSubscriptionId);
      return;
    }

    await ctx.db.patch(quota._id, {
      stripeSubscriptionStatus: "active",
      currentPeriodEnd: periodEnd,
    });
  },
});

export const handlePaymentFailed = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, { stripeSubscriptionId }) => {
    const quotas = await ctx.db.query("quotas").collect();
    const quota = quotas.find((q) => q.stripeSubscriptionId === stripeSubscriptionId);

    if (!quota) {
      console.error("Quota not found for subscription:", stripeSubscriptionId);
      return;
    }

    await ctx.db.patch(quota._id, {
      stripeSubscriptionStatus: "past_due",
    });
  },
});

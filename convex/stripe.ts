import { internalMutation, internalQuery, query, type MutationCtx } from "./_generated/server";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { workflow } from "./emailWorkflows";
import {
  findQuotaBySubscriptionId,
  reconcileQuotaForUser,
  normalizePeriodEndMillis,
} from "./billing/reconcile";

// Re-export actions from stripeActions.ts
export { createCheckoutSession, createPortalSession, syncSubscription } from "./stripeActions";

type StripeComponentSubscription = {
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  userId?: string;
  metadata?: Record<string, unknown>;
};

function normalizeString(value: string): string {
  return value.trim();
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getUserIdFromComponentSubscription(subscription: StripeComponentSubscription | null): string {
  if (!subscription) return "";

  const userIdFromField = normalizeOptionalString(subscription.userId);
  if (userIdFromField) return userIdFromField;

  const metadataUserId = normalizeOptionalString(subscription.metadata?.userId);
  return metadataUserId;
}

async function updateStripeCustomerForUser(
  ctx: MutationCtx,
  userId: string,
  stripeCustomerId: string
): Promise<void> {
  const normalizedUserId = normalizeString(userId);
  const normalizedStripeCustomerId = normalizeString(stripeCustomerId);
  if (!normalizedUserId || !normalizedStripeCustomerId) return;

  await ctx.runMutation(components.betterAuth.adapter.updateOne, {
    input: {
      model: "user",
      where: [{ field: "_id", value: normalizedUserId }],
      update: { stripeCustomerId: normalizedStripeCustomerId },
    },
  });
}

async function resolveUserIdByStripeCustomer(
  ctx: MutationCtx,
  stripeCustomerId: string
): Promise<string> {
  const normalizedStripeCustomerId = normalizeString(stripeCustomerId);
  if (!normalizedStripeCustomerId) return "";

  const userId = await ctx.runQuery(internal.stripe.getUserIdByStripeCustomerId, {
    stripeCustomerId: normalizedStripeCustomerId,
  });

  return normalizeOptionalString(userId);
}

async function getComponentSubscription(
  ctx: MutationCtx,
  stripeSubscriptionId: string
): Promise<StripeComponentSubscription | null> {
  const normalizedSubscriptionId = normalizeString(stripeSubscriptionId);
  if (!normalizedSubscriptionId) return null;

  const subscription = await ctx.runQuery(components.stripe.public.getSubscription, {
    stripeSubscriptionId: normalizedSubscriptionId,
  });

  if (!subscription) return null;

  return {
    stripeSubscriptionId: normalizeString(subscription.stripeSubscriptionId),
    stripeCustomerId: normalizeString(subscription.stripeCustomerId),
    status: normalizeString(subscription.status),
    priceId: normalizeString(subscription.priceId),
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    userId: normalizeOptionalString(subscription.userId) || undefined,
    metadata: subscription.metadata,
  };
}

export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });
    if (!user) throw new Error("Account not found");

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
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

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

export const getUserIdByStripeCustomerId = internalQuery({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, { stripeCustomerId }) => {
    const normalizedStripeCustomerId = stripeCustomerId.trim();
    if (!normalizedStripeCustomerId) return null;

    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "stripeCustomerId", value: normalizedStripeCustomerId }],
    });

    return user?._id ?? null;
  },
});

// Internal mutations called by webhooks

export const ensureStripeCustomer = internalMutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, { userId, stripeCustomerId }) => {
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
    const stripeSubscriptionId = normalizeString(args.stripeSubscriptionId);
    const stripeCustomerId = normalizeString(args.stripeCustomerId);
    const userId = normalizeString(args.userId);
    const priceId = normalizeString(args.priceId);

    if (!stripeSubscriptionId) {
      throw new Error("Cannot handle checkout completion without a stripeSubscriptionId");
    }
    if (!stripeCustomerId) {
      throw new Error("Cannot handle checkout completion without a stripeCustomerId");
    }
    if (!userId) {
      throw new Error("Cannot handle checkout completion without a userId");
    }
    if (!priceId) {
      throw new Error("Cannot handle checkout completion without a priceId");
    }

    const result = await reconcileQuotaForUser(ctx, {
      userId,
      source: "checkout",
      subscription: {
        stripeSubscriptionId,
        stripeCustomerId,
        userId,
        status: args.status,
        priceId,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      },
    });

    await updateStripeCustomerForUser(ctx, userId, stripeCustomerId);

    const shouldStartPostUpgradeWorkflow =
      (result.previousPlan === null || result.previousPlan === "free") && result.currentPlan !== "free";

    if (shouldStartPostUpgradeWorkflow) {
      await workflow.start(ctx, internal.emailWorkflows.postUpgradeWorkflow, { userId });
    }
  },
});

export const syncSubscriptionFromWebhook = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    status: v.string(),
    priceId: v.string(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    stripeCustomerId: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stripeSubscriptionId = normalizeString(args.stripeSubscriptionId);
    if (!stripeSubscriptionId) {
      throw new Error("Cannot sync subscription without a stripeSubscriptionId");
    }

    const normalizedExplicitUserId = normalizeOptionalString(args.userId);
    const normalizedStripeCustomerId = normalizeOptionalString(args.stripeCustomerId);
    const normalizedPriceId = normalizeString(args.priceId);

    const quotaBySubscription = await findQuotaBySubscriptionId(ctx, stripeSubscriptionId);
    const componentSubscription = await getComponentSubscription(ctx, stripeSubscriptionId);

    let resolvedUserId = quotaBySubscription?.userId ?? "";
    if (!resolvedUserId && normalizedExplicitUserId) {
      resolvedUserId = normalizedExplicitUserId;
    }
    if (!resolvedUserId && normalizedStripeCustomerId) {
      resolvedUserId = await resolveUserIdByStripeCustomer(ctx, normalizedStripeCustomerId);
    }
    if (!resolvedUserId) {
      const userIdFromComponentSubscription = getUserIdFromComponentSubscription(componentSubscription);
      if (userIdFromComponentSubscription) {
        resolvedUserId = userIdFromComponentSubscription;
      }
    }

    const effectiveStripeCustomerId =
      normalizedStripeCustomerId || normalizeOptionalString(componentSubscription?.stripeCustomerId);

    if (!resolvedUserId && effectiveStripeCustomerId) {
      resolvedUserId = await resolveUserIdByStripeCustomer(ctx, effectiveStripeCustomerId);
    }

    if (!resolvedUserId) {
      console.error("BILLING_SUBSCRIPTION_UNRESOLVED", {
        eventType: "customer.subscription.updated",
        stripeSubscriptionId,
        stripeCustomerId: effectiveStripeCustomerId,
        providedUserId: normalizedExplicitUserId,
        status: args.status,
        priceId: normalizedPriceId,
      });
      return;
    }

    const effectivePriceId = normalizedPriceId || normalizeOptionalString(componentSubscription?.priceId);
    const result = await reconcileQuotaForUser(ctx, {
      userId: resolvedUserId,
      source: "webhook",
      subscription: {
        stripeSubscriptionId,
        stripeCustomerId: effectiveStripeCustomerId || undefined,
        userId: resolvedUserId,
        status: normalizeString(args.status),
        priceId: effectivePriceId,
        currentPeriodEnd: normalizePeriodEndMillis(args.currentPeriodEnd),
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      },
    });

    if (effectiveStripeCustomerId) {
      await updateStripeCustomerForUser(ctx, resolvedUserId, effectiveStripeCustomerId);
    }

    if (args.cancelAtPeriodEnd && !result.previousCancelAtPeriodEnd) {
      await workflow.start(ctx, internal.emailWorkflows.cancellationWorkflow, {
        userId: resolvedUserId,
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
    const normalizedSubscriptionId = normalizeString(stripeSubscriptionId);
    if (!normalizedSubscriptionId) return;

    const quota = await findQuotaBySubscriptionId(ctx, normalizedSubscriptionId);
    if (quota) {
      await ctx.db.patch(quota._id, {
        stripeSubscriptionStatus: "active",
        currentPeriodEnd: normalizePeriodEndMillis(periodEnd),
      });
      return;
    }

    const componentSubscription = await getComponentSubscription(ctx, normalizedSubscriptionId);
    const resolvedUserId =
      getUserIdFromComponentSubscription(componentSubscription) ||
      (componentSubscription?.stripeCustomerId
        ? await resolveUserIdByStripeCustomer(ctx, componentSubscription.stripeCustomerId)
        : "");

    if (!resolvedUserId) {
      console.error("BILLING_INVOICE_PAID_UNRESOLVED", {
        stripeSubscriptionId: normalizedSubscriptionId,
      });
      return;
    }

    await reconcileQuotaForUser(ctx, {
      userId: resolvedUserId,
      source: "webhook",
      subscription: {
        stripeSubscriptionId: normalizedSubscriptionId,
        stripeCustomerId: componentSubscription?.stripeCustomerId,
        userId: resolvedUserId,
        status: "active",
        priceId: componentSubscription?.priceId ?? "",
        currentPeriodEnd: normalizePeriodEndMillis(periodEnd),
        cancelAtPeriodEnd: componentSubscription?.cancelAtPeriodEnd ?? false,
      },
    });
  },
});

export const handlePaymentFailed = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
  },
  handler: async (ctx, { stripeSubscriptionId }) => {
    const normalizedSubscriptionId = normalizeString(stripeSubscriptionId);
    if (!normalizedSubscriptionId) return;

    const quota = await findQuotaBySubscriptionId(ctx, normalizedSubscriptionId);
    if (quota) {
      await ctx.db.patch(quota._id, {
        stripeSubscriptionStatus: "past_due",
      });
      return;
    }

    const componentSubscription = await getComponentSubscription(ctx, normalizedSubscriptionId);
    const resolvedUserId =
      getUserIdFromComponentSubscription(componentSubscription) ||
      (componentSubscription?.stripeCustomerId
        ? await resolveUserIdByStripeCustomer(ctx, componentSubscription.stripeCustomerId)
        : "");

    if (!resolvedUserId) {
      console.error("BILLING_PAYMENT_FAILED_UNRESOLVED", {
        stripeSubscriptionId: normalizedSubscriptionId,
      });
      return;
    }

    await reconcileQuotaForUser(ctx, {
      userId: resolvedUserId,
      source: "webhook",
      subscription: {
        stripeSubscriptionId: normalizedSubscriptionId,
        stripeCustomerId: componentSubscription?.stripeCustomerId,
        userId: resolvedUserId,
        status: "past_due",
        priceId: componentSubscription?.priceId ?? "",
        currentPeriodEnd: componentSubscription?.currentPeriodEnd ?? Date.now(),
        cancelAtPeriodEnd: componentSubscription?.cancelAtPeriodEnd ?? false,
      },
    });
  },
});

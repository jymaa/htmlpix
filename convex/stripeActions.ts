"use node";

import { action } from "./_generated/server";
import { internal, components } from "./_generated/api";
import { v } from "convex/values";
import { StripeSubscriptions } from "@convex-dev/stripe";

const stripeClient = new StripeSubscriptions(components.stripe, {});

export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args): Promise<{ sessionId: string; url: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Get or create customer
    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId,
      email: identity.email ?? undefined,
      name: identity.name ?? undefined,
    });

    // Store customer mapping
    await ctx.runMutation(internal.stripe.ensureStripeCustomer, {
      userId,
      stripeCustomerId: customer.customerId,
    });

    // Create checkout session
    const session = await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: args.successUrl,
      cancelUrl: args.cancelUrl,
      metadata: { userId },
      subscriptionMetadata: { userId },
    });

    return session;
  },
});

export const createPortalSession = action({
  args: {
    returnUrl: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Get customer
    const customerDoc = await ctx.runQuery(internal.stripe.getStripeCustomerInternal, { userId });
    if (!customerDoc) {
      throw new Error("No billing account found");
    }

    const session = await stripeClient.createCustomerPortalSession(ctx, {
      customerId: customerDoc.stripeCustomerId,
      returnUrl: args.returnUrl,
    });

    return session.url;
  },
});

export const syncSubscription = action({
  args: { sessionId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, _args): Promise<boolean> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    // Check if user has any subscriptions synced
    const subscriptions = await ctx.runQuery(components.stripe.public.listSubscriptionsByUserId, {
      userId,
    });
    if (subscriptions.length === 0) return false;

    const latestSubscription = subscriptions
      .slice()
      .sort((a, b) => b.currentPeriodEnd - a.currentPeriodEnd)[0];
    if (!latestSubscription) return false;

    await ctx.runMutation(internal.stripe.handleCheckoutCompleted, {
      stripeSubscriptionId: latestSubscription.stripeSubscriptionId,
      stripeCustomerId: latestSubscription.stripeCustomerId,
      userId,
      priceId: latestSubscription.priceId,
      status: latestSubscription.status,
      currentPeriodEnd: latestSubscription.currentPeriodEnd,
      cancelAtPeriodEnd: latestSubscription.cancelAtPeriodEnd,
    });

    return true;
  },
});

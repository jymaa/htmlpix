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
  handler: async (ctx, { sessionId }): Promise<boolean> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user has any subscriptions synced
    const subscriptions = await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId: identity.subject }
    );

    // If user has subscriptions, they've completed checkout
    return subscriptions.length > 0;
  },
});

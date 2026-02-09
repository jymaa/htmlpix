"use node";

import { action } from "./_generated/server";
import { internal, components } from "./_generated/api";
import { v } from "convex/values";
import { StripeSubscriptions } from "@convex-dev/stripe";
import { isAllowedCheckoutPriceId } from "./billing/plans";
import {
  pickBestSubscriptionForEntitlement,
  shouldBlockCheckoutFromSubscriptions,
} from "./billing/reconcile";

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
    const priceId = args.priceId.trim();
    if (!isAllowedCheckoutPriceId(priceId)) {
      throw new Error("Unsupported billing plan. Please select a valid plan from settings.");
    }

    const subscriptions = await ctx.runQuery(components.stripe.public.listSubscriptionsByUserId, {
      userId,
    });
    if (shouldBlockCheckoutFromSubscriptions(subscriptions)) {
      throw new Error("You already have an active subscription. Use the billing portal to change plans.");
    }

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
      priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: args.successUrl,
      cancelUrl: args.cancelUrl,
      metadata: { userId },
      subscriptionMetadata: { userId },
      extraParams: {
        allow_promotion_codes: true,
      },
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

    const bestSubscription = pickBestSubscriptionForEntitlement(subscriptions);
    if (!bestSubscription) return false;

    await ctx.runMutation(internal.stripe.handleCheckoutCompleted, {
      stripeSubscriptionId: bestSubscription.stripeSubscriptionId,
      stripeCustomerId: bestSubscription.stripeCustomerId,
      userId,
      priceId: bestSubscription.priceId,
      status: bestSubscription.status,
      currentPeriodEnd: bestSubscription.currentPeriodEnd,
      cancelAtPeriodEnd: bestSubscription.cancelAtPeriodEnd,
    });

    return true;
  },
});

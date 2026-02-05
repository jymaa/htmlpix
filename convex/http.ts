import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { components } from "./_generated/api";
import { registerRoutes } from "@convex-dev/stripe";
import { internal } from "./_generated/api";

const http = httpRouter();
authComponent.registerRoutes(http, createAuth);

registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "checkout.session.completed": async (ctx, event) => {
      const session = event.data.object;
      if (session.mode === "subscription" && session.subscription) {
        // Get subscription details from the event
        // Note: We need to fetch subscription from Stripe component
        const subscriptions = await ctx.runQuery(
          components.stripe.public.listSubscriptionsByUserId,
          { userId: (session.metadata?.userId as string) || "" }
        );
        const sub = subscriptions.find(
          (s: { stripeSubscriptionId: string }) => s.stripeSubscriptionId === session.subscription
        );

        await ctx.runMutation(internal.stripe.handleCheckoutCompleted, {
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          userId: (session.metadata?.userId as string) || "",
          priceId: sub?.priceId || "",
          status: sub?.status || "active",
          currentPeriodEnd: sub?.currentPeriodEnd || Date.now() + 30 * 24 * 60 * 60 * 1000,
          cancelAtPeriodEnd: sub?.cancelAtPeriodEnd || false,
        });
      }
    },
    "customer.subscription.updated": async (ctx, event) => {
      const subscription = event.data.object as unknown as {
        id: string;
        status: string;
        items: { data: Array<{ price: { id: string } }> };
        current_period_end: number;
        cancel_at_period_end: boolean;
      };
      await ctx.runMutation(internal.stripe.syncSubscriptionFromWebhook, {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id || "",
        currentPeriodEnd: subscription.current_period_end * 1000,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    },
    "customer.subscription.deleted": async (ctx, event) => {
      const subscription = event.data.object as unknown as {
        id: string;
        items: { data: Array<{ price: { id: string } }> };
        current_period_end: number;
      };
      await ctx.runMutation(internal.stripe.syncSubscriptionFromWebhook, {
        stripeSubscriptionId: subscription.id,
        status: "canceled",
        priceId: subscription.items.data[0]?.price.id || "",
        currentPeriodEnd: subscription.current_period_end * 1000,
        cancelAtPeriodEnd: false,
      });
    },
    "invoice.paid": async (ctx, event) => {
      const invoice = event.data.object as { subscription?: string; lines: { data: Array<{ period: { end: number } }> } };
      if (invoice.subscription) {
        await ctx.runMutation(internal.stripe.handleInvoicePaid, {
          stripeSubscriptionId: invoice.subscription as string,
          periodEnd: invoice.lines.data[0]?.period.end
            ? invoice.lines.data[0].period.end * 1000
            : Date.now(),
        });
      }
    },
    "invoice.payment_failed": async (ctx, event) => {
      const invoice = event.data.object as { subscription?: string };
      if (invoice.subscription) {
        await ctx.runMutation(internal.stripe.handlePaymentFailed, {
          stripeSubscriptionId: invoice.subscription as string,
        });
      }
    },
  },
});

export default http;

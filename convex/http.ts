import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
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
        const stripeSubscriptionId = session.subscription as string;
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer.trim() : "";
        if (!stripeCustomerId) {
          throw new Error(
            `checkout.session.completed missing stripeCustomerId for subscription ${stripeSubscriptionId}`
          );
        }
        const userIdFromSessionMetadata =
          typeof session.metadata?.userId === "string" ? session.metadata.userId.trim() : "";

        const sub = await ctx.runQuery(components.stripe.public.getSubscription, {
          stripeSubscriptionId,
        });
        if (!sub || !sub.priceId) {
          throw new Error(
            `Subscription ${stripeSubscriptionId} not synced yet while processing checkout.session.completed`
          );
        }

        const userIdFromSubscription =
          typeof sub?.userId === "string" ? sub.userId.trim() : "";
        const userIdFromSubscriptionMetadata =
          typeof sub?.metadata?.userId === "string" ? sub.metadata.userId.trim() : "";

        let userId =
          userIdFromSessionMetadata || userIdFromSubscription || userIdFromSubscriptionMetadata;

        if (!userId && stripeCustomerId) {
          const userIdFromCustomer = await ctx.runQuery(internal.stripe.getUserIdByStripeCustomerId, {
            stripeCustomerId,
          });
          userId = userIdFromCustomer?.trim() ?? "";
        }

        if (!userId) {
          await ctx.runMutation(internal.stripe.syncSubscriptionFromWebhook, {
            stripeSubscriptionId,
            status: sub.status,
            priceId: sub.priceId,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            stripeCustomerId,
            userId: userIdFromSessionMetadata || userIdFromSubscriptionMetadata || undefined,
          });
          console.error("BILLING_CHECKOUT_USER_RESOLUTION_FAILED", {
            eventType: "checkout.session.completed",
            sessionId: session.id,
            stripeSubscriptionId,
            stripeCustomerId,
          });
          throw new Error(
            `Unable to resolve userId for checkout.session.completed: session=${session.id} subscription=${stripeSubscriptionId} customer=${stripeCustomerId}`
          );
        }

        await ctx.runMutation(internal.stripe.handleCheckoutCompleted, {
          stripeSubscriptionId,
          stripeCustomerId,
          userId,
          priceId: sub.priceId,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        });
      }
    },
    "customer.subscription.updated": async (ctx, event) => {
      const subscription = event.data.object as unknown as {
        id: string;
        customer?: string | { id?: string };
        metadata?: { userId?: string };
        status: string;
        items: { data: Array<{ price: { id: string } }> };
        current_period_end: number;
        cancel_at_period_end: boolean;
      };
      const stripeCustomerId =
        typeof subscription.customer === "string" ? subscription.customer.trim() : "";
      const userId = typeof subscription.metadata?.userId === "string" ? subscription.metadata.userId.trim() : "";
      await ctx.runMutation(internal.stripe.syncSubscriptionFromWebhook, {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id || "",
        currentPeriodEnd: subscription.current_period_end * 1000,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripeCustomerId: stripeCustomerId || undefined,
        userId: userId || undefined,
      });
    },
    "customer.subscription.deleted": async (ctx, event) => {
      const subscription = event.data.object as unknown as {
        id: string;
        customer?: string | { id?: string };
        metadata?: { userId?: string };
        items: { data: Array<{ price: { id: string } }> };
        current_period_end: number;
      };
      const stripeCustomerId =
        typeof subscription.customer === "string" ? subscription.customer.trim() : "";
      const userId = typeof subscription.metadata?.userId === "string" ? subscription.metadata.userId.trim() : "";
      await ctx.runMutation(internal.stripe.syncSubscriptionFromWebhook, {
        stripeSubscriptionId: subscription.id,
        status: "canceled",
        priceId: subscription.items.data[0]?.price.id || "",
        currentPeriodEnd: subscription.current_period_end * 1000,
        cancelAtPeriodEnd: false,
        stripeCustomerId: stripeCustomerId || undefined,
        userId: userId || undefined,
      });
    },
    "invoice.paid": async (ctx, event) => {
      const invoice = event.data.object as {
        subscription?: string;
        lines: { data: Array<{ period: { end: number } }> };
      };
      if (invoice.subscription) {
        await ctx.runMutation(internal.stripe.handleInvoicePaid, {
          stripeSubscriptionId: invoice.subscription as string,
          periodEnd: invoice.lines.data[0]?.period.end ? invoice.lines.data[0].period.end * 1000 : Date.now(),
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

http.route({
  path: "/unsubscribe",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const category = url.searchParams.get("category");

    if (!token || !category) {
      return new Response(unsubscribePage("Invalid unsubscribe link.", false), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    const success = await ctx.runMutation(internal.emailHelpers.processUnsubscribe, {
      token,
      category,
    });

    if (success) {
      return new Response(
        unsubscribePage(`You've been unsubscribed from ${category.replace("_", " ")} emails.`, true),
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response(unsubscribePage("Invalid or expired unsubscribe link.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }),
});

function unsubscribePage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe — HTMLPix</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fafafa}
.card{background:#fff;border-radius:12px;padding:48px;max-width:420px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.1)}
h1{font-size:20px;margin:0 0 12px;color:${success ? "#333" : "#c00"}}
p{color:#666;margin:0 0 24px;font-size:14px;line-height:1.5}
a{color:#ff4d00;text-decoration:none;font-size:14px}</style></head>
<body><div class="card">
<h1>${success ? "Done!" : "Oops"}</h1>
<p>${message}</p>
<a href="https://htmlpix.com">Back to HTMLPix</a>
</div></body></html>`;
}

export default http;

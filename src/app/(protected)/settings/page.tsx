"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { LogOut } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 8,
    renders: 1000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 15,
    renders: 3000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 35,
    renders: 10000,
    priceId: process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID || "",
  },
];

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const subscription = useQuery(api.stripe.getSubscription, userId ? { userId } : "skip");
  const quota = useQuery(api.apiKeys.getUserQuota, userId ? { userId } : "skip");

  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const createPortal = useAction(api.stripe.createPortalSession);

  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planId: string) => {
    if (!priceId) {
      alert("Price ID not configured. Please set NEXT_PUBLIC_STRIPE_*_PRICE_ID environment variables.");
      return;
    }

    setLoading(planId);
    try {
      const baseUrl = window.location.origin;
      const { url } = await createCheckout({
        priceId,
        successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/settings`,
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading("portal");
    try {
      const url = await createPortal({
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = () => {
    authClient.signOut();
  };

  const usagePercent = quota ? Math.round((quota.currentUsage / quota.monthlyLimit) * 100) : 0;
  const hasSubscription = subscription?.stripeSubscriptionId;
  const isActive = subscription?.stripeSubscriptionStatus === "active";
  const isCanceled = subscription?.stripeSubscriptionStatus === "canceled";
  const periodEndDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>

      {/* Account Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="text-sm">{session?.user?.email ?? "—"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription === undefined || quota === undefined ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : hasSubscription ? (
            <>
              <div className="flex items-center gap-4">
                <Badge variant={isActive ? "default" : isCanceled ? "secondary" : "destructive"}>
                  {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                </Badge>
                <Badge variant={isActive ? "outline" : "destructive"}>
                  {isActive ? "Active" : isCanceled ? "Canceled" : subscription.stripeSubscriptionStatus}
                </Badge>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <p className="text-sm text-amber-600">
                  Your subscription will end on {periodEndDate}. You will retain access until then.
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Usage</span>
                  <span>
                    {quota?.currentUsage.toLocaleString()} / {quota?.monthlyLimit.toLocaleString()} renders
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full transition-all ${usagePercent > 80 ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
              </div>

              {periodEndDate && !subscription.cancelAtPeriodEnd && (
                <p className="text-sm text-muted-foreground">
                  Next billing date: {periodEndDate}
                </p>
              )}

              <Button onClick={handleManageBilling} disabled={loading === "portal"}>
                {loading === "portal" ? "Opening..." : "Manage Billing"}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don&apos;t have an active subscription yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Choose a plan below to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {hasSubscription ? "Change Plan" : "Choose a Plan"}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.recommended ? "border-primary" : ""} ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-4 bg-primary px-2 py-1 text-xs font-medium text-primary-foreground rounded">
                    Recommended
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 bg-secondary px-2 py-1 text-xs font-medium rounded">
                    Current Plan
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.renders.toLocaleString()} renders/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li>All export formats (PNG, JPEG, WebP)</li>
                    <li>Custom viewports up to 4096px</li>
                    <li>Google Fonts support</li>
                    <li>API access</li>
                    <li>Email support</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    disabled={isCurrentPlan || loading === plan.id}
                    onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  >
                    {loading === plan.id
                      ? "Loading..."
                      : isCurrentPlan
                        ? "Current Plan"
                        : hasSubscription
                          ? "Switch to " + plan.name
                          : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>Sign out of your account on this device</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

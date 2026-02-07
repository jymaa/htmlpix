"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

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

const features = [
  "All export formats (PNG, JPEG, WebP)",
  "Custom viewports up to 4096px",
  "Google Fonts support",
  "API access",
  "Email support",
];

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const subscription = useQuery(api.stripe.getSubscription, userId ? { userId } : "skip");
  const quota = useQuery(api.apiKeys.getUserQuota, userId ? { userId } : "skip");

  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const createPortal = useAction(api.stripe.createPortalSession);

  const [loading, setLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planId: string) => {
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
      setErrorMessage("Failed to start checkout. Please try again.");
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
      setErrorMessage("Failed to open billing portal. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = () => {
    authClient.signOut();
  };

  const usagePercent = quota ? Math.round((quota.currentUsage / quota.monthlyLimit) * 100) : 0;
  const isFreePlan = subscription?.plan === "free";
  const hasSubscription = subscription?.stripeSubscriptionId || isFreePlan;
  const isActive = subscription?.stripeSubscriptionStatus === "active" || isFreePlan;
  const isCanceled = subscription?.stripeSubscriptionStatus === "canceled";
  const periodEndDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  const dataReady = subscription !== undefined && quota !== undefined;

  return (
    <>
      <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account, billing, and subscription</p>
        </div>

        {/* Account + Billing row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Account */}
          <Card className="relative overflow-hidden">
            <div className="border-primary/20 absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2" />
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
                Account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="h-10 w-10 border object-cover" />
                ) : (
                  <div className="bg-muted flex h-10 w-10 items-center justify-center border">
                    <User className="text-muted-foreground h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-bebas-neue)] text-2xl leading-none">
                    {session?.user?.name ?? "—"}
                  </div>
                  <div className="text-muted-foreground mt-0.5 truncate font-mono text-xs">
                    {session?.user?.email ?? "—"}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs tracking-wider uppercase"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Current Plan summary */}
          <Card className="relative overflow-hidden">
            <div className="border-primary/20 absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2" />
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
                Current Plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!dataReady ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ) : hasSubscription ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-bebas-neue)] text-3xl">
                      {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                    </span>
                    <Badge
                      variant={isActive ? "outline" : isCanceled ? "secondary" : "destructive"}
                      className="text-[10px]"
                    >
                      {isActive ? "Active" : isCanceled ? "Canceled" : subscription.stripeSubscriptionStatus}
                    </Badge>
                  </div>

                  {/* Usage bar */}
                  <div>
                    <div className="text-muted-foreground flex justify-between font-mono text-[10px] tracking-widest uppercase">
                      <span>Usage</span>
                      <span>
                        {quota?.currentUsage.toLocaleString()} / {quota?.monthlyLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-border mt-1.5 h-1.5 w-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          usagePercent > 90
                            ? "bg-destructive"
                            : usagePercent > 70
                              ? "bg-amber-500"
                              : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <p className="text-sm text-amber-600">
                      Ends {periodEndDate} — you retain access until then.
                    </p>
                  )}

                  {periodEndDate && !subscription.cancelAtPeriodEnd && !isFreePlan && (
                    <p className="text-muted-foreground font-mono text-[10px]">
                      Next billing: {periodEndDate}
                    </p>
                  )}

                  {!isFreePlan && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs tracking-wider uppercase"
                      onClick={handleManageBilling}
                      disabled={loading === "portal"}
                    >
                      {loading === "portal" ? "Opening..." : "Manage Billing"}
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-muted-foreground font-[family-name:var(--font-bebas-neue)] text-3xl">
                    No Plan
                  </span>
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    Choose a plan below to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide">
              {hasSubscription ? "Change Plan" : "Choose a Plan"}
            </h2>
            <div className="bg-border h-px flex-grow" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrentPlan = subscription?.plan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative border-2 p-6 transition-all hover:-translate-y-0.5 ${
                    plan.recommended
                      ? "border-primary"
                      : isCurrentPlan
                        ? "border-foreground"
                        : "border-border"
                  }`}
                >
                  {plan.recommended && !isCurrentPlan && (
                    <div className="bg-primary absolute -top-3 left-6 px-3 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                      Popular
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="bg-foreground text-background absolute -top-3 left-6 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                      Current
                    </div>
                  )}

                  <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl">{plan.name}</h3>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs">
                    {plan.renders.toLocaleString()} renders/month
                  </p>

                  <div className="border-border/50 mt-4 border-t pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-[family-name:var(--font-bebas-neue)] text-4xl">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">/mo</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="text-muted-foreground flex items-center gap-2 text-sm">
                        <div className="bg-primary h-1 w-1" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`mt-6 w-full font-mono text-xs tracking-widest uppercase ${
                      plan.recommended && !isCurrentPlan ? "" : ""
                    }`}
                    variant={plan.recommended && !isCurrentPlan ? "default" : "outline"}
                    disabled={isCurrentPlan || loading === plan.id}
                    onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  >
                    {loading === plan.id
                      ? "Loading..."
                      : isCurrentPlan
                        ? "Current Plan"
                        : hasSubscription && !isFreePlan
                          ? "Switch to " + plan.name
                          : "Get Started"}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Free tier note */}
          <p className="text-muted-foreground mt-4 font-mono text-[10px]">
            Free tier (50 renders/mo) is auto-provisioned when you create your first API key. No card
            required.
          </p>
        </div>
      </div>
    </>
  );
}

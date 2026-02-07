"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlueprintSpinner } from "@/components/ui/blueprint-spinner";

const MIN_VISIBLE_MS = 900;
const FALLBACK_REDIRECT_MS = 4500;

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const syncSubscription = useAction(api.stripe.syncSubscription);
  const [status, setStatus] = useState<"syncing" | "redirecting" | "error">(sessionId ? "syncing" : "error");
  const [showManualLink, setShowManualLink] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let isCancelled = false;
    const startedAt = Date.now();

    const sync = async () => {
      try {
        await syncSubscription({ sessionId });
      } catch (error) {
        console.error("Failed to sync subscription:", error);
        // Webhook still syncs subscription, continue users to dashboard.
      } finally {
        const elapsed = Date.now() - startedAt;
        const waitMs = Math.max(0, MIN_VISIBLE_MS - elapsed);

        window.setTimeout(() => {
          if (isCancelled) return;
          setStatus("redirecting");
          router.replace("/dashboard");
        }, waitMs);
      }
    };

    void sync();

    return () => {
      isCancelled = true;
    };
  }, [router, sessionId, syncSubscription]);

  useEffect(() => {
    if (status === "error") return;

    const timer = window.setTimeout(() => {
      setShowManualLink(true);
      window.location.assign("/dashboard");
    }, FALLBACK_REDIRECT_MS);

    return () => window.clearTimeout(timer);
  }, [status]);

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Unable to verify checkout</CardTitle>
            <CardDescription>
              We couldn&apos;t verify this checkout session. Your payment may still finish in the background.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href="/dashboard">
              <Button>Open Dashboard</Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">Billing Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle>Upgrade confirmed</CardTitle>
          <CardDescription>
            {status === "syncing"
              ? "Finalizing your subscription and account access."
              : "Taking you to your dashboard now."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <BlueprintSpinner size="md" label={status === "syncing" ? "Finalizing" : "Redirecting"} />
          <p className="text-muted-foreground text-sm">
            This usually takes a second. You&apos;ll be redirected automatically.
          </p>
          {showManualLink && (
            <Link href="/dashboard">
              <Button>Continue to Dashboard</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

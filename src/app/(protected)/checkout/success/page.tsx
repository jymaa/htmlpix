"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const syncSubscription = useAction(api.stripe.syncSubscription);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const sync = async () => {
      try {
        await syncSubscription({ sessionId });
        setSynced(true);
        setStatus("success");
      } catch (error) {
        console.error("Failed to sync subscription:", error);
        // Still show success - webhook will handle it
        setStatus("success");
      }
    };

    sync();
  }, [sessionId, syncSubscription]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your checkout session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button>Return to Settings</Button>
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
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Setting up your subscription..."
              : "Your subscription is now active."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the dashboard...
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

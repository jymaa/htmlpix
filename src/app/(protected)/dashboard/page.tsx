"use client";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const quota = useQuery(api.apiKeys.getUserQuota, userId ? { userId } : "skip");
  const apiKeys = useQuery(api.apiKeys.listUserKeys, userId ? { userId } : "skip");
  const renders = useQuery(api.apiKeys.getUserRenders, userId ? { userId, limit: 10 } : "skip");
  const onboardingStatus = useQuery(api.users.hasCompletedOnboarding, userId ? { userId } : "skip");

  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding if user has no API keys and hasn't completed onboarding
  useEffect(() => {
    if (apiKeys !== undefined && onboardingStatus !== undefined) {
      const hasNoKeys = apiKeys.length === 0;
      const notCompleted = !onboardingStatus.completed;
      if (hasNoKeys && notCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [apiKeys, onboardingStatus]);

  const usagePercent = quota ? Math.round((quota.currentUsage / quota.monthlyLimit) * 100) : 0;

  return (
    <div className="space-y-8">
      {userId && (
        <OnboardingModal
          userId={userId}
          open={showOnboarding}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your API usage and manage your keys</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-2xl">
              {quota === undefined ? (
                <Skeleton className="h-6 w-16" />
              ) : quota === null ? (
                <Badge variant="outline">No Plan</Badge>
              ) : (
                <Badge variant={quota.plan === "starter" ? "secondary" : "default"}>
                  {quota.plan.charAt(0).toUpperCase() + quota.plan.slice(1)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Usage</CardDescription>
            <CardTitle className="text-2xl">
              {quota === undefined ? (
                <Skeleton className="h-8 w-24" />
              ) : quota === null ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                <>
                  {quota.currentUsage.toLocaleString()} / {quota.monthlyLimit.toLocaleString()}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quota === undefined ? (
              <Skeleton className="h-2 w-full" />
            ) : quota === null ? (
              <Link href="/billing">
                <Button variant="outline" size="sm">
                  Choose a Plan
                </Button>
              </Link>
            ) : (
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full transition-all ${usagePercent > 80 ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>API Keys</CardDescription>
            <CardTitle className="text-2xl">
              {apiKeys ? apiKeys.filter((k) => k.active).length : <Skeleton className="h-8 w-8" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/api-keys">
              <Button variant="outline" size="sm">
                Manage Keys
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Renders</CardTitle>
          <CardDescription>Your last 10 render requests</CardDescription>
        </CardHeader>
        <CardContent>
          {renders === undefined ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : renders.length === 0 ? (
            <p className="text-muted-foreground">No renders yet. Make your first API call to see it here.</p>
          ) : (
            <div className="space-y-2">
              {renders.map((render) => (
                <div
                  key={render._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={render.status === "success" ? "default" : "destructive"}>
                      {render.status}
                    </Badge>
                    <span className="font-mono text-sm text-muted-foreground">
                      {render.externalId.slice(0, 12)}...
                    </span>
                    <span className="text-sm text-muted-foreground">{render.format}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{render.renderMs}ms</span>
                    <span>{new Date(render.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

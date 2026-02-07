"use client";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { OnboardingModal } from "@/components/OnboardingModal";

const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  starter: 1000,
  pro: 3000,
  scale: 10000,
};

const NEXT_PLAN: Record<string, { name: string; renders: string; price: number }> = {
  free: { name: "Starter", renders: "1,000", price: 8 },
  starter: { name: "Pro", renders: "3,000", price: 15 },
};

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const quota = useQuery(api.apiKeys.getUserQuota, userId ? { userId } : "skip");
  const apiKeys = useQuery(api.apiKeys.listUserKeys, userId ? { userId } : "skip");
  const renders = useQuery(api.apiKeys.getUserRenders, userId ? { userId, limit: 10 } : "skip");
  const onboardingStatus = useQuery(api.users.hasCompletedOnboarding, userId ? { userId } : "skip");

  const getImageUrls = useAction(api.images.getImageUrls);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

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

  // Fetch image URLs for renders that have imageKeys
  const fetchImageUrls = useCallback(async () => {
    if (!renders || renders.length === 0) return;
    const keysToFetch = renders
      .filter((r) => r.imageKey && !imageUrls[r.imageKey])
      .map((r) => r.imageKey!);
    if (keysToFetch.length === 0) return;
    try {
      const urls = await getImageUrls({ imageKeys: keysToFetch });
      setImageUrls((prev) => ({ ...prev, ...urls }));
    } catch {
      // Silently fail
    }
  }, [renders, imageUrls, getImageUrls]);

  useEffect(() => {
    fetchImageUrls();
  }, [fetchImageUrls]);

  const usagePercent = quota ? Math.round((quota.currentUsage / quota.monthlyLimit) * 100) : 0;
  const isFreePlan = quota?.plan === "free" || quota?.plan === "starter";
  const nextPlan = quota ? NEXT_PLAN[quota.plan] : null;
  const activeKeyCount = apiKeys ? apiKeys.filter((k) => k.active).length : 0;

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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Plan Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
              Current Plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quota === undefined ? (
              <Skeleton className="h-10 w-24" />
            ) : quota === null ? (
              <div>
                <span className="font-[family-name:var(--font-bebas-neue)] text-4xl text-muted-foreground">
                  No Plan
                </span>
                <div className="mt-3">
                  <Link href="/settings">
                    <Button size="sm" className="font-mono text-xs uppercase tracking-wider">
                      Choose Plan
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-4xl">
                    {quota.plan.charAt(0).toUpperCase() + quota.plan.slice(1)}
                  </span>
                  {quota.plan !== "scale" && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {PLAN_LIMITS[quota.plan]?.toLocaleString()} renders/mo
                    </span>
                  )}
                </div>
                {quota.plan === "scale" && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    10,000 renders/mo
                  </p>
                )}
              </div>
            )}
          </CardContent>
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2 border-primary/20" />
        </Card>

        {/* Usage Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
              Monthly Usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quota === undefined ? (
              <Skeleton className="h-10 w-32" />
            ) : quota === null ? (
              <span className="font-[family-name:var(--font-bebas-neue)] text-4xl text-muted-foreground">
                —
              </span>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-4xl">
                    {quota.currentUsage.toLocaleString()}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    / {quota.monthlyLimit.toLocaleString()}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden bg-border">
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
                <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                  {usagePercent}% used this cycle
                </p>
              </div>
            )}
          </CardContent>
          <div className="absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2 border-primary/20" />
        </Card>

        {/* API Keys Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
              Active Keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys === undefined ? (
              <Skeleton className="h-10 w-12" />
            ) : (
              <div>
                <span className="font-[family-name:var(--font-bebas-neue)] text-4xl">
                  {activeKeyCount}
                </span>
                <div className="mt-3">
                  <Link href="/api-keys">
                    <Button variant="outline" size="sm" className="font-mono text-xs uppercase tracking-wider">
                      Manage Keys
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          <div className="absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2 border-primary/20" />
        </Card>
      </div>

      {/* Upgrade CTA Banner */}
      {isFreePlan && nextPlan && quota && (
        <div className="relative overflow-hidden border-2 border-foreground bg-foreground p-6 text-background md:p-8">
          {/* Background pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(245,240,232,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(245,240,232,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-1 font-mono text-[10px] tracking-widest text-primary uppercase">
                Upgrade Available
              </div>
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide md:text-3xl">
                Unlock {nextPlan.renders} renders/mo with {nextPlan.name}
              </h3>
              <p className="mt-1 font-mono text-sm text-background/50">
                {quota.plan === "free"
                  ? "You're on the free tier. Upgrade to remove limits and ship faster."
                  : `Scale beyond ${PLAN_LIMITS[quota.plan]?.toLocaleString()} renders. Only $${nextPlan.price}/mo.`}
              </p>
            </div>
            <Link href="/settings" className="shrink-0">
              <Button
                size="lg"
                className="bg-primary font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/90"
              >
                Upgrade to {nextPlan.name} — ${nextPlan.price}/mo
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Renders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Renders</CardTitle>
            <CardDescription>Your last 10 render requests</CardDescription>
          </div>
          {renders && renders.length > 0 && (
            <Link href="/media">
              <Button variant="outline" size="sm" className="font-mono text-xs uppercase tracking-wider">
                View All
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {renders === undefined ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : renders.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40">
                  <rect x="3" y="3" width="18" height="18" rx="0" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">No renders yet. Make your first API call to see it here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Table header */}
              <div className="hidden grid-cols-[40px_1fr_80px_80px_80px_140px] items-center gap-3 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:grid">
                <span />
                <span>Image</span>
                <span>Format</span>
                <span>Status</span>
                <span>Time</span>
                <span>Date</span>
              </div>
              {renders.map((render) => {
                const imgUrl = render.imageKey ? imageUrls[render.imageKey] : null;
                return (
                  <div
                    key={render._id}
                    className="group grid grid-cols-[40px_1fr_auto] items-center gap-3 border-t border-border/50 px-3 py-2.5 transition-colors hover:bg-muted/30 md:grid-cols-[40px_1fr_80px_80px_80px_140px]"
                  >
                    {/* Thumbnail */}
                    <div className="h-8 w-8 overflow-hidden border bg-muted/20">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={render.externalId}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="h-1 w-1 bg-muted-foreground/20" />
                        </div>
                      )}
                    </div>

                    {/* Image ID — full, linked */}
                    <div className="min-w-0">
                      {render.imageKey && imgUrl ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate font-mono text-sm transition-colors hover:text-primary"
                            >
                              {render.externalId}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>Open image in new tab</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="block truncate font-mono text-sm text-muted-foreground">
                          {render.externalId}
                        </span>
                      )}
                    </div>

                    {/* Mobile: compact meta */}
                    <div className="flex items-center gap-2 md:hidden">
                      <Badge
                        variant={render.status === "success" ? "default" : "destructive"}
                        className="text-[10px]"
                      >
                        {render.status}
                      </Badge>
                    </div>

                    {/* Desktop columns */}
                    <Badge
                      variant="outline"
                      className="hidden w-fit font-mono text-[10px] uppercase md:inline-flex"
                    >
                      {render.format}
                    </Badge>
                    <Badge
                      variant={render.status === "success" ? "default" : "destructive"}
                      className="hidden w-fit text-[10px] md:inline-flex"
                    >
                      {render.status}
                    </Badge>
                    <span className="hidden font-mono text-xs text-muted-foreground md:block">
                      {render.renderMs}ms
                    </span>
                    <span className="hidden font-mono text-xs text-muted-foreground md:block">
                      {new Date(render.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnboardingModal } from "@/components/OnboardingModal";
import Image from "next/image";
import { usePlausible } from "next-plausible";

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

type Render = {
  _id: string;
  _creationTime: number;
  apiKeyId: string;
  userId: string;
  externalId: string;
  status: "success" | "error";
  htmlHash: string;
  contentHash?: string;
  format: string;
  renderMs: number;
  imageKey?: string;
  imageUrl?: string;
  createdAt: number;
};

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const quota = useQuery(api.apiKeys.getUserQuota, userId ? {} : "skip");
  const apiKeys = useQuery(api.apiKeys.listUserKeys, userId ? {} : "skip");
  const renders = useQuery(api.apiKeys.getUserRenders, userId ? { limit: 10 } : "skip");
  const onboardingStatus = useQuery(api.users.hasCompletedOnboarding, userId ? {} : "skip");

  const [dismissed, setDismissed] = useState(false);
  const [hasOpenedOnboarding, setHasOpenedOnboarding] = useState(false);
  const plausible = usePlausible();
  const [selectedRender, setSelectedRender] = useState<Render | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (dismissed || hasOpenedOnboarding || apiKeys === undefined || onboardingStatus === undefined) {
      return;
    }

    if (apiKeys.length === 0 && !onboardingStatus.completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasOpenedOnboarding(true);
    }
  }, [dismissed, hasOpenedOnboarding, apiKeys, onboardingStatus]);

  // Keep onboarding open once it starts until the user completes/dismisses it.
  const shouldShowOnboarding = !dismissed && hasOpenedOnboarding && onboardingStatus?.completed === false;

  const usagePercent = quota ? Math.round((quota.currentUsage / quota.monthlyLimit) * 100) : 0;
  const isFreePlan = quota?.plan === "free" || quota?.plan === "starter";
  const nextPlan = quota ? NEXT_PLAN[quota.plan] : null;
  const activeKeyCount = apiKeys ? apiKeys.filter((k) => k.active).length : 0;
  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <OnboardingModal
        open={shouldShowOnboarding}
        onComplete={() => {
          setDismissed(true);
        }}
      />

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your API usage and manage your keys</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Plan Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
              Current Plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quota === undefined ? (
              <Skeleton className="h-10 w-24" />
            ) : quota === null ? (
              <div>
                <span className="text-muted-foreground font-[family-name:var(--font-bebas-neue)] text-4xl">
                  No Plan
                </span>
                <div className="mt-3">
                  <Link href="/settings">
                    <Button size="sm" className="font-mono text-xs tracking-wider uppercase">
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
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {PLAN_LIMITS[quota.plan]?.toLocaleString()} renders/mo
                    </span>
                  )}
                </div>
                {quota.plan === "scale" && (
                  <p className="text-muted-foreground mt-1 font-mono text-xs">10,000 renders/mo</p>
                )}
              </div>
            )}
          </CardContent>
          {/* Decorative corner accent */}
          <div className="border-primary/20 absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2" />
        </Card>

        {/* Usage Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
              Monthly Usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quota === undefined ? (
              <Skeleton className="h-10 w-32" />
            ) : quota === null ? (
              <span className="text-muted-foreground font-[family-name:var(--font-bebas-neue)] text-4xl">
                —
              </span>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-4xl">
                    {quota.currentUsage.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-mono text-sm">
                    / {quota.monthlyLimit.toLocaleString()}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="bg-border mt-3 h-1.5 w-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      usagePercent > 90 ? "bg-destructive" : usagePercent > 70 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
                <p className="text-muted-foreground mt-1.5 font-mono text-[10px]">
                  {usagePercent}% used this cycle
                </p>
              </div>
            )}
          </CardContent>
          <div className="border-primary/20 absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2" />
        </Card>

        {/* API Keys Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-[10px] tracking-widest uppercase">
              Active Keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys === undefined ? (
              <Skeleton className="h-10 w-12" />
            ) : (
              <div>
                <span className="font-[family-name:var(--font-bebas-neue)] text-4xl">{activeKeyCount}</span>
                <div className="mt-3">
                  <Link href="/api-keys">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-mono text-xs tracking-wider uppercase"
                    >
                      Manage Keys
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          <div className="border-primary/20 absolute top-0 right-0 h-8 w-8 border-r-2 border-b-2" />
        </Card>
      </div>

      {/* Upgrade CTA Banner */}
      {isFreePlan && nextPlan && quota && (
        <div className="border-foreground bg-foreground text-background relative overflow-hidden border-2 p-6 md:p-8">
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
              <div className="text-primary mb-1 font-mono text-[10px] tracking-widest uppercase">
                Upgrade Available
              </div>
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide md:text-3xl">
                Unlock {nextPlan.renders} renders/mo with {nextPlan.name}
              </h3>
              <p className="text-background/50 mt-1 font-mono text-sm">
                {quota.plan === "free"
                  ? "You're on the free tier. Upgrade to remove limits and ship faster."
                  : `Scale beyond ${PLAN_LIMITS[quota.plan]?.toLocaleString()} renders. Only $${nextPlan.price}/mo.`}
              </p>
            </div>
            <Link
              href="/settings"
              className="shrink-0"
              onClick={() => plausible("Plan Selected", { props: { plan: nextPlan.name.toLowerCase(), source: "dashboard" } })}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 font-mono text-xs font-bold tracking-widest text-white uppercase"
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
            <Link href="/renders">
              <Button variant="outline" size="sm" className="font-mono text-xs tracking-wider uppercase">
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
              <div className="border-muted-foreground/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center border-2 border-dashed">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-muted-foreground/40"
                >
                  <rect x="3" y="3" width="18" height="18" rx="0" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-muted-foreground text-sm">
                No renders yet. Make your first API call to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Table header */}
              <div className="text-muted-foreground hidden grid-cols-[40px_1fr_80px_80px_80px_140px] items-center gap-3 px-3 py-2 font-mono text-[10px] tracking-widest uppercase md:grid">
                <span />
                <span>Image</span>
                <span>Format</span>
                <span>Status</span>
                <span>Time</span>
                <span>Date</span>
              </div>
              {renders.map((render: Render) => {
                const imgUrl = render.imageUrl ?? null;
                return (
                  <button
                    key={render._id}
                    type="button"
                    onClick={() => setSelectedRender(render as Render)}
                    className="group border-border/50 hover:bg-muted/30 focus:ring-ring grid w-full grid-cols-[40px_1fr_auto] items-center gap-3 border-t px-3 py-2.5 text-left transition-colors focus:ring-2 focus:outline-none md:grid-cols-[40px_1fr_80px_80px_80px_140px]"
                  >
                    {/* Thumbnail */}
                    <div className="bg-muted/20 h-8 w-8 overflow-hidden border">
                      {imgUrl ? (
                        <Image
                          width={32}
                          height={32}
                          unoptimized
                          src={imgUrl}
                          alt={render.externalId}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="bg-muted-foreground/20 h-1 w-1" />
                        </div>
                      )}
                    </div>

                    {/* Image ID */}
                    <div className="min-w-0">
                      <span className="group-hover:text-primary block truncate font-mono text-sm transition-colors">
                        {render.externalId}
                      </span>
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
                    <span className="text-muted-foreground hidden font-mono text-xs md:block">
                      {render.renderMs}ms
                    </span>
                    <span className="text-muted-foreground hidden font-mono text-xs md:block">
                      {formatDate(render.createdAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRender} onOpenChange={(open) => !open && setSelectedRender(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm font-normal tracking-wider">
              RENDER {selectedRender?.externalId}
            </DialogTitle>
          </DialogHeader>
          {selectedRender && (
            <div className="space-y-4">
              <div className="bg-muted/20 overflow-hidden border">
                {selectedRender.imageUrl ? (
                  <Image
                    src={selectedRender.imageUrl}
                    alt={`Render ${selectedRender.externalId}`}
                    className="max-h-[400px] w-full object-contain"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      {selectedRender.status === "error" ? "Render failed" : "Image not available"}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Status
                  </span>
                  <div>
                    <Badge variant={selectedRender.status === "success" ? "default" : "destructive"}>
                      {selectedRender.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Format
                  </span>
                  <p className="font-mono uppercase">{selectedRender.format}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Render Time
                  </span>
                  <p className="font-mono">{selectedRender.renderMs}ms</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Date
                  </span>
                  <p className="font-mono text-sm">{formatDate(selectedRender.createdAt)}</p>
                </div>
                {selectedRender.imageKey && (
                  <div className="col-span-2 space-y-1">
                    <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                      Image Key
                    </span>
                    <p className="text-muted-foreground truncate font-mono text-xs">
                      {selectedRender.imageKey}
                    </p>
                  </div>
                )}
              </div>

              {selectedRender.imageUrl && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={() => handleCopyUrl(selectedRender.imageUrl!)}
                  >
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button variant="outline" size="sm" className="font-mono text-xs" asChild>
                    <a href={selectedRender.imageUrl} target="_blank" rel="noopener noreferrer">
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

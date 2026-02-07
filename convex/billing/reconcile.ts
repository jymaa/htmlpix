import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { resolvePlanByPriceId } from "./plans";

const FREE_MONTHLY_LIMIT = 50;

const CHECKOUT_BLOCKING_STATUSES = new Set(["active", "trialing"]);
const PLAN_RANK: Record<QuotaPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  scale: 3,
};

type QuotaPlan = Doc<"quotas">["plan"];

type QuotaSummary = Pick<Doc<"quotas">, "_id" | "_creationTime" | "stripeSubscriptionId">;

export type SubscriptionSnapshot = {
  stripeSubscriptionId: string;
  stripeCustomerId?: string;
  userId?: string;
  status: string;
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
};

export type SubscriptionLike = {
  stripeSubscriptionId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  metadata?: Record<string, unknown>;
  userId?: string;
};

export type QuotaState = {
  plan: QuotaPlan;
  monthlyLimit: number;
  stripeSubscriptionId?: string;
  stripeSubscriptionStatus?: string;
  stripePriceId?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
};

export type ReconcileResult = {
  quotaId: Id<"quotas">;
  previousPlan: QuotaPlan | null;
  previousCancelAtPeriodEnd: boolean;
  currentPlan: QuotaPlan;
  createdNewQuota: boolean;
  hadUnmappedPrice: boolean;
};

function compareByRecencyDesc(a: { _creationTime: number; _id: Id<"quotas"> }, b: { _creationTime: number; _id: Id<"quotas"> }): number {
  if (a._creationTime !== b._creationTime) {
    return b._creationTime - a._creationTime;
  }
  return String(b._id).localeCompare(String(a._id));
}

export function normalizePeriodEndMillis(periodEnd: number): number {
  if (!Number.isFinite(periodEnd) || periodEnd <= 0) {
    return Date.now();
  }

  return periodEnd < 1_000_000_000_000 ? periodEnd * 1000 : periodEnd;
}

export function selectCanonicalQuota(
  quotas: QuotaSummary[],
  preferredStripeSubscriptionId?: string
): QuotaSummary | null {
  if (quotas.length === 0) return null;

  const normalizedPreferred = preferredStripeSubscriptionId?.trim() ?? "";
  if (normalizedPreferred) {
    const matching = quotas
      .filter((quota) => quota.stripeSubscriptionId === normalizedPreferred)
      .sort(compareByRecencyDesc);
    if (matching.length > 0) {
      return matching[0]!;
    }
  }

  return quotas.slice().sort(compareByRecencyDesc)[0] ?? null;
}

export function applySubscriptionEventToQuotaState(
  current: QuotaState,
  event: Omit<SubscriptionSnapshot, "stripeCustomerId" | "userId">,
  resolvedPlan: { plan: Exclude<QuotaPlan, "free">; monthlyLimit: number } | null
): { next: QuotaState; hadUnmappedPrice: boolean } {
  const normalizedPriceId = event.priceId.trim();
  const hadUnmappedPrice = Boolean(normalizedPriceId) && resolvedPlan === null;

  const next: QuotaState = {
    ...current,
    stripeSubscriptionId: event.stripeSubscriptionId,
    stripeSubscriptionStatus: event.status,
    stripePriceId: normalizedPriceId || current.stripePriceId,
    currentPeriodEnd: normalizePeriodEndMillis(event.currentPeriodEnd),
    cancelAtPeriodEnd: event.cancelAtPeriodEnd,
  };

  if (resolvedPlan) {
    const currentRank = PLAN_RANK[current.plan];
    const nextRank = PLAN_RANK[resolvedPlan.plan];
    const isDowngrade = nextRank < currentRank;
    const isCurrentPeriodStillActive =
      typeof current.currentPeriodEnd === "number" &&
      Number.isFinite(current.currentPeriodEnd) &&
      current.currentPeriodEnd > Date.now();

    const shouldDeferDowngrade = isDowngrade && isCurrentPeriodStillActive;
    if (shouldDeferDowngrade) {
      console.warn("BILLING_DOWNGRADE_DEFERRED", {
        fromPlan: current.plan,
        toPlan: resolvedPlan.plan,
        currentPeriodEnd: current.currentPeriodEnd,
      });
    }

    if (!shouldDeferDowngrade) {
      next.plan = resolvedPlan.plan;
      next.monthlyLimit = resolvedPlan.monthlyLimit;
    }
  }

  return { next, hadUnmappedPrice };
}

export function shouldBlockCheckoutFromSubscriptions(subscriptions: Array<Pick<SubscriptionLike, "status">>): boolean {
  return subscriptions.some((subscription) => CHECKOUT_BLOCKING_STATUSES.has(subscription.status));
}

const STATUS_PRIORITY: Record<string, number> = {
  active: 6,
  trialing: 5,
  past_due: 4,
  unpaid: 3,
  incomplete: 2,
  canceled: 1,
  incomplete_expired: 0,
};

export function pickBestSubscriptionForEntitlement(subscriptions: SubscriptionLike[]): SubscriptionLike | null {
  if (subscriptions.length === 0) return null;

  const sorted = subscriptions.slice().sort((a, b) => {
    const aPriority = STATUS_PRIORITY[a.status] ?? 2;
    const bPriority = STATUS_PRIORITY[b.status] ?? 2;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    if (a.currentPeriodEnd !== b.currentPeriodEnd) {
      return b.currentPeriodEnd - a.currentPeriodEnd;
    }

    return b.stripeSubscriptionId.localeCompare(a.stripeSubscriptionId);
  });

  return sorted[0] ?? null;
}

function buildMetadataBackfillPatch(canonical: Doc<"quotas">, duplicates: Doc<"quotas">[]): Partial<Doc<"quotas">> {
  const patch: Partial<Doc<"quotas">> = {};

  for (const duplicate of duplicates) {
    if (!patch.stripeSubscriptionId && !canonical.stripeSubscriptionId && duplicate.stripeSubscriptionId) {
      patch.stripeSubscriptionId = duplicate.stripeSubscriptionId;
    }
    if (!patch.stripePriceId && !canonical.stripePriceId && duplicate.stripePriceId) {
      patch.stripePriceId = duplicate.stripePriceId;
    }
    if (!patch.stripeSubscriptionStatus && !canonical.stripeSubscriptionStatus && duplicate.stripeSubscriptionStatus) {
      patch.stripeSubscriptionStatus = duplicate.stripeSubscriptionStatus;
    }
    if (!patch.currentPeriodEnd && !canonical.currentPeriodEnd && duplicate.currentPeriodEnd) {
      patch.currentPeriodEnd = duplicate.currentPeriodEnd;
    }
    if (
      patch.cancelAtPeriodEnd === undefined &&
      canonical.cancelAtPeriodEnd === undefined &&
      duplicate.cancelAtPeriodEnd !== undefined
    ) {
      patch.cancelAtPeriodEnd = duplicate.cancelAtPeriodEnd;
    }
  }

  return patch;
}

export async function findQuotaBySubscriptionId(
  ctx: MutationCtx,
  stripeSubscriptionId: string
): Promise<Doc<"quotas"> | null> {
  const normalizedSubscriptionId = stripeSubscriptionId.trim();
  if (!normalizedSubscriptionId) return null;

  return (
    (await ctx.db
      .query("quotas")
      .withIndex("by_stripeSubscriptionId", (q) => q.eq("stripeSubscriptionId", normalizedSubscriptionId))
      .first()) ?? null
  );
}

export async function collapseDuplicateQuotasForUser(
  ctx: MutationCtx,
  userId: string,
  preferredStripeSubscriptionId?: string
): Promise<Doc<"quotas"> | null> {
  const quotas = await ctx.db
    .query("quotas")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();

  if (quotas.length === 0) return null;

  const canonicalSummary = selectCanonicalQuota(quotas, preferredStripeSubscriptionId);
  if (!canonicalSummary) return null;

  const canonical = quotas.find((quota) => quota._id === canonicalSummary._id);
  if (!canonical) return null;

  const duplicates = quotas.filter((quota) => quota._id !== canonical._id).sort(compareByRecencyDesc);

  if (duplicates.length > 0) {
    const backfillPatch = buildMetadataBackfillPatch(canonical, duplicates);
    if (Object.keys(backfillPatch).length > 0) {
      await ctx.db.patch(canonical._id, backfillPatch);
    }

    for (const duplicate of duplicates) {
      await ctx.db.delete(duplicate._id);
    }

    console.warn("BILLING_DUPLICATE_QUOTAS_COLLAPSED", {
      userId,
      canonicalQuotaId: canonical._id,
      removedQuotaIds: duplicates.map((duplicate) => duplicate._id),
    });
  }

  const refreshedCanonical = await ctx.db.get(canonical._id);
  return refreshedCanonical ?? null;
}

export async function reconcileQuotaForUser(
  ctx: MutationCtx,
  args: {
    userId: string;
    subscription: SubscriptionSnapshot;
    source: "checkout" | "webhook" | "self_heal";
  }
): Promise<ReconcileResult> {
  const normalizedUserId = args.userId.trim();
  if (!normalizedUserId) {
    throw new Error("Cannot reconcile subscription without a userId");
  }

  const normalizedSubscriptionId = args.subscription.stripeSubscriptionId.trim();
  if (!normalizedSubscriptionId) {
    throw new Error("Cannot reconcile subscription without a stripeSubscriptionId");
  }

  const canonical = await collapseDuplicateQuotasForUser(
    ctx,
    normalizedUserId,
    normalizedSubscriptionId
  );

  const previousPlan = canonical?.plan ?? null;
  const resolvedPlan = resolvePlanByPriceId(args.subscription.priceId);
  const currentState: QuotaState = canonical
    ? {
        plan: canonical.plan,
        monthlyLimit: canonical.monthlyLimit,
        stripeSubscriptionId: canonical.stripeSubscriptionId,
        stripeSubscriptionStatus: canonical.stripeSubscriptionStatus,
        stripePriceId: canonical.stripePriceId,
        currentPeriodEnd: canonical.currentPeriodEnd,
        cancelAtPeriodEnd: canonical.cancelAtPeriodEnd,
      }
    : {
        plan: "free",
        monthlyLimit: FREE_MONTHLY_LIMIT,
      };

  const { next, hadUnmappedPrice } = applySubscriptionEventToQuotaState(
    currentState,
    {
      stripeSubscriptionId: normalizedSubscriptionId,
      status: args.subscription.status,
      priceId: args.subscription.priceId,
      currentPeriodEnd: args.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: args.subscription.cancelAtPeriodEnd,
    },
    resolvedPlan
  );

  if (hadUnmappedPrice) {
    console.error("BILLING_UNMAPPED_PRICE", {
      userId: normalizedUserId,
      stripeSubscriptionId: normalizedSubscriptionId,
      stripeCustomerId: args.subscription.stripeCustomerId,
      source: args.source,
      priceId: args.subscription.priceId,
    });
  }

  let quotaId: Id<"quotas">;
  if (canonical) {
    await ctx.db.patch(canonical._id, next);
    quotaId = canonical._id;
  } else {
    quotaId = await ctx.db.insert("quotas", {
      userId: normalizedUserId,
      plan: next.plan,
      monthlyLimit: next.monthlyLimit,
      stripeSubscriptionId: next.stripeSubscriptionId,
      stripeSubscriptionStatus: next.stripeSubscriptionStatus,
      stripePriceId: next.stripePriceId,
      currentPeriodEnd: next.currentPeriodEnd,
      cancelAtPeriodEnd: next.cancelAtPeriodEnd,
    });
  }

  return {
    quotaId,
    previousPlan,
    previousCancelAtPeriodEnd: canonical?.cancelAtPeriodEnd ?? false,
    currentPlan: next.plan,
    createdNewQuota: !canonical,
    hadUnmappedPrice,
  };
}

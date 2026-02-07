import { describe, expect, test } from "bun:test";
import {
  applySubscriptionEventToQuotaState,
  pickBestSubscriptionForEntitlement,
  selectCanonicalQuota,
  shouldBlockCheckoutFromSubscriptions,
  type QuotaState,
  type SubscriptionLike,
} from "./reconcile";

describe("billing reconciliation", () => {
  test("selectCanonicalQuota prefers matching subscription row", () => {
    const quotas = [
      {
        _id: "q_old" as any,
        _creationTime: 10,
        stripeSubscriptionId: "sub_target",
      },
      {
        _id: "q_new" as any,
        _creationTime: 20,
        stripeSubscriptionId: "sub_other",
      },
    ];

    const canonical = selectCanonicalQuota(quotas, "sub_target");
    expect(String(canonical?._id)).toBe("q_old");
  });

  test("selectCanonicalQuota falls back to newest row", () => {
    const quotas = [
      {
        _id: "q_old" as any,
        _creationTime: 10,
        stripeSubscriptionId: "sub_old",
      },
      {
        _id: "q_new" as any,
        _creationTime: 20,
        stripeSubscriptionId: "sub_new",
      },
    ];

    const canonical = selectCanonicalQuota(quotas, "sub_missing");
    expect(String(canonical?._id)).toBe("q_new");
  });

  test("unknown price keeps existing entitlement (freeze behavior)", () => {
    const current: QuotaState = {
      plan: "starter",
      monthlyLimit: 1000,
      stripeSubscriptionId: "sub_1",
      stripeSubscriptionStatus: "active",
      stripePriceId: "price_starter",
      currentPeriodEnd: 100,
      cancelAtPeriodEnd: false,
    };

    const { next, hadUnmappedPrice } = applySubscriptionEventToQuotaState(
      current,
      {
        stripeSubscriptionId: "sub_1",
        status: "active",
        priceId: "price_unknown",
        currentPeriodEnd: 200,
        cancelAtPeriodEnd: true,
      },
      null
    );

    expect(hadUnmappedPrice).toBeTrue();
    expect(next.plan).toBe("starter");
    expect(next.monthlyLimit).toBe(1000);
    expect(next.stripeSubscriptionStatus).toBe("active");
    expect(next.cancelAtPeriodEnd).toBeTrue();
  });

  test("mapped price updates entitlement and status transition", () => {
    const current: QuotaState = {
      plan: "pro",
      monthlyLimit: 3000,
      stripeSubscriptionId: "sub_1",
      stripeSubscriptionStatus: "active",
      stripePriceId: "price_pro",
      currentPeriodEnd: 100,
      cancelAtPeriodEnd: false,
    };

    const { next } = applySubscriptionEventToQuotaState(
      current,
      {
        stripeSubscriptionId: "sub_1",
        status: "past_due",
        priceId: "price_scale",
        currentPeriodEnd: 300,
        cancelAtPeriodEnd: false,
      },
      { plan: "scale", monthlyLimit: 10000 }
    );

    expect(next.plan).toBe("scale");
    expect(next.monthlyLimit).toBe(10000);
    expect(next.stripeSubscriptionStatus).toBe("past_due");
  });

  test("downgrade is deferred until current period ends", () => {
    const current: QuotaState = {
      plan: "scale",
      monthlyLimit: 10000,
      stripeSubscriptionId: "sub_1",
      stripeSubscriptionStatus: "active",
      stripePriceId: "price_scale",
      currentPeriodEnd: Date.now() + 5 * 24 * 60 * 60 * 1000,
      cancelAtPeriodEnd: true,
    };

    const { next } = applySubscriptionEventToQuotaState(
      current,
      {
        stripeSubscriptionId: "sub_1",
        status: "active",
        priceId: "price_starter",
        currentPeriodEnd: current.currentPeriodEnd!,
        cancelAtPeriodEnd: false,
      },
      { plan: "starter", monthlyLimit: 1000 }
    );

    expect(next.plan).toBe("scale");
    expect(next.monthlyLimit).toBe(10000);
    expect(next.stripePriceId).toBe("price_starter");
    expect(next.cancelAtPeriodEnd).toBeFalse();
  });

  test("downgrade applies after current period has ended", () => {
    const current: QuotaState = {
      plan: "scale",
      monthlyLimit: 10000,
      stripeSubscriptionId: "sub_1",
      stripeSubscriptionStatus: "active",
      stripePriceId: "price_scale",
      currentPeriodEnd: Date.now() - 60_000,
      cancelAtPeriodEnd: true,
    };

    const { next } = applySubscriptionEventToQuotaState(
      current,
      {
        stripeSubscriptionId: "sub_1",
        status: "active",
        priceId: "price_starter",
        currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
        cancelAtPeriodEnd: false,
      },
      { plan: "starter", monthlyLimit: 1000 }
    );

    expect(next.plan).toBe("starter");
    expect(next.monthlyLimit).toBe(1000);
  });

  test("replaying the same webhook event is idempotent", () => {
    const base: QuotaState = {
      plan: "starter",
      monthlyLimit: 1000,
    };

    const event = {
      stripeSubscriptionId: "sub_1",
      status: "active",
      priceId: "price_starter",
      currentPeriodEnd: 500,
      cancelAtPeriodEnd: false,
    };

    const resolvedPlan = { plan: "starter" as const, monthlyLimit: 1000 };
    const once = applySubscriptionEventToQuotaState(base, event, resolvedPlan).next;
    const twice = applySubscriptionEventToQuotaState(once, event, resolvedPlan).next;

    expect(twice).toEqual(once);
  });

  test("checkout is blocked when active or trialing subscriptions exist", () => {
    expect(
      shouldBlockCheckoutFromSubscriptions([{ status: "active" }, { status: "canceled" }])
    ).toBeTrue();
    expect(
      shouldBlockCheckoutFromSubscriptions([{ status: "trialing" }, { status: "past_due" }])
    ).toBeTrue();
    expect(shouldBlockCheckoutFromSubscriptions([{ status: "canceled" }])).toBeFalse();
  });

  test("pickBestSubscriptionForEntitlement prefers active/trialing subscriptions", () => {
    const subscriptions: SubscriptionLike[] = [
      {
        stripeSubscriptionId: "sub_canceled",
        status: "canceled",
        priceId: "price_starter",
        currentPeriodEnd: 1000,
        cancelAtPeriodEnd: true,
        stripeCustomerId: "cus_1",
      },
      {
        stripeSubscriptionId: "sub_active",
        status: "active",
        priceId: "price_pro",
        currentPeriodEnd: 900,
        cancelAtPeriodEnd: false,
        stripeCustomerId: "cus_1",
      },
    ];

    const best = pickBestSubscriptionForEntitlement(subscriptions);
    expect(best?.stripeSubscriptionId).toBe("sub_active");
  });
});

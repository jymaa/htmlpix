import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { getConfiguredPriceIds, isAllowedCheckoutPriceId, resolvePlanByPriceId } from "./plans";

const ENV_KEYS = [
  "STRIPE_STARTER_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
  "STRIPE_SCALE_PRICE_ID",
  "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
  "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
  "NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID",
] as const;

const ORIGINAL_ENV = new Map<string, string | undefined>(
  ENV_KEYS.map((key) => [key, process.env[key]])
);

function resetEnv() {
  for (const key of ENV_KEYS) {
    const original = ORIGINAL_ENV.get(key);
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
}

describe("billing plans", () => {
  beforeEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    resetEnv();
  });

  test("resolves plans from server env vars", () => {
    process.env.STRIPE_STARTER_PRICE_ID = "price_starter_server";

    expect(resolvePlanByPriceId("price_starter_server")).toEqual({
      plan: "starter",
      monthlyLimit: 1000,
    });
  });

  test("falls back to NEXT_PUBLIC env vars when server vars are absent", () => {
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID = "price_pro_public";

    expect(resolvePlanByPriceId("price_pro_public")).toEqual({
      plan: "pro",
      monthlyLimit: 3000,
    });
  });

  test("server env vars take precedence over NEXT_PUBLIC vars", () => {
    process.env.STRIPE_SCALE_PRICE_ID = "price_scale_server";
    process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID = "price_scale_public";

    expect(resolvePlanByPriceId("price_scale_server")).toEqual({
      plan: "scale",
      monthlyLimit: 10000,
    });
    expect(resolvePlanByPriceId("price_scale_public")).toBeNull();
  });

  test("unknown price ids are rejected", () => {
    process.env.STRIPE_STARTER_PRICE_ID = "price_starter_server";

    expect(resolvePlanByPriceId("price_unknown")).toBeNull();
    expect(isAllowedCheckoutPriceId("price_unknown")).toBeFalse();
    expect(isAllowedCheckoutPriceId("price_starter_server")).toBeTrue();
  });

  test("returns configured price ids only", () => {
    process.env.STRIPE_STARTER_PRICE_ID = "price_starter_server";
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID = "price_pro_public";

    expect(getConfiguredPriceIds()).toEqual([
      "price_starter_server",
      "price_pro_public",
    ]);
  });
});

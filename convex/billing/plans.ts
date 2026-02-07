export type PaidPlan = "starter" | "pro" | "scale";

export type ResolvedPaidPlan = {
  plan: PaidPlan;
  monthlyLimit: number;
  priceId: string;
};

type PlanConfig = {
  plan: PaidPlan;
  monthlyLimit: number;
  serverEnv: string;
  publicEnv: string;
};

const PLAN_CONFIGS: PlanConfig[] = [
  {
    plan: "starter",
    monthlyLimit: 1000,
    serverEnv: "STRIPE_STARTER_PRICE_ID",
    publicEnv: "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
  },
  {
    plan: "pro",
    monthlyLimit: 3000,
    serverEnv: "STRIPE_PRO_PRICE_ID",
    publicEnv: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
  },
  {
    plan: "scale",
    monthlyLimit: 10000,
    serverEnv: "STRIPE_SCALE_PRICE_ID",
    publicEnv: "NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID",
  },
];

function readEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function normalizePriceId(priceId: string): string {
  return priceId.trim();
}

function getConfiguredPlans(): ResolvedPaidPlan[] {
  const configured: ResolvedPaidPlan[] = [];

  for (const config of PLAN_CONFIGS) {
    const priceId = readEnv(config.serverEnv) || readEnv(config.publicEnv);
    if (!priceId) continue;

    configured.push({
      plan: config.plan,
      monthlyLimit: config.monthlyLimit,
      priceId,
    });
  }

  return configured;
}

export function resolvePlanByPriceId(priceId: string): Omit<ResolvedPaidPlan, "priceId"> | null {
  const normalized = normalizePriceId(priceId);
  if (!normalized) return null;

  const match = getConfiguredPlans().find((entry) => entry.priceId === normalized);
  if (!match) return null;

  return {
    plan: match.plan,
    monthlyLimit: match.monthlyLimit,
  };
}

export function isAllowedCheckoutPriceId(priceId: string): boolean {
  return resolvePlanByPriceId(priceId) !== null;
}

export function getConfiguredPriceIds(): string[] {
  return getConfiguredPlans().map((entry) => entry.priceId);
}

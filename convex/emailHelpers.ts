import { internalMutation, internalQuery } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { usageAggregate } from "./usage";

export const canSendEmail = internalQuery({
  args: { userId: v.string(), category: v.string() },
  handler: async (ctx, { userId, category }): Promise<boolean> => {
    if (category === "transactional") return true;

    const prefs = await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!prefs) return true;
    return !prefs.unsubscribedCategories.includes(category);
  },
});

export const wasEmailSent = internalQuery({
  args: { userId: v.string(), emailType: v.string() },
  handler: async (ctx, { userId, emailType }): Promise<boolean> => {
    const event = await ctx.db
      .query("emailEvents")
      .withIndex("by_userId_emailType", (q) => q.eq("userId", userId).eq("emailType", emailType))
      .first();
    return !!event;
  },
});

export const recordEmailSent = internalMutation({
  args: { userId: v.string(), emailType: v.string() },
  handler: async (ctx, { userId, emailType }) => {
    await ctx.db.insert("emailEvents", {
      userId,
      emailType,
      sentAt: Date.now(),
    });
  },
});

export const getUserInfo = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<{ name: string; email: string } | null> => {
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [{ field: "_id", value: userId }],
    });

    if (!user || !user.email) return null;
    return {
      name: (user.name as string) || (user.email as string).split("@")[0],
      email: user.email as string,
    };
  },
});

export const getUserPlan = internalQuery({
  args: { userId: v.string() },
  handler: async (
    ctx,
    { userId }
  ): Promise<{
    plan: string;
    monthlyLimit: number;
    currentUsage: number;
    cancelAtPeriodEnd: boolean;
  }> => {
    const quota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const usage = quota
      ? await usageAggregate.count(ctx, {
          bounds: {
            lower: { key: [userId, year, month], inclusive: true },
            upper: { key: [userId, year, month], inclusive: true },
          },
        })
      : 0;

    return {
      plan: quota?.plan ?? "free",
      monthlyLimit: quota?.monthlyLimit ?? 50,
      currentUsage: usage,
      cancelAtPeriodEnd: quota?.cancelAtPeriodEnd ?? false,
    };
  },
});

export const getUnsubscribeToken = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<string | null> => {
    const prefs = await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return prefs?.unsubscribeToken ?? null;
  },
});

export const ensureEmailPreferences = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<string> => {
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing.unsubscribeToken;

    const token = generateToken();
    await ctx.db.insert("emailPreferences", {
      userId,
      unsubscribedCategories: [],
      unsubscribeToken: token,
      updatedAt: Date.now(),
    });
    return token;
  },
});

export const processUnsubscribe = internalMutation({
  args: { token: v.string(), category: v.string() },
  handler: async (ctx, { token, category }): Promise<boolean> => {
    if (category === "transactional") return false;

    const prefs = await ctx.db
      .query("emailPreferences")
      .withIndex("by_unsubscribeToken", (q) => q.eq("unsubscribeToken", token))
      .first();

    if (!prefs) return false;

    if (!prefs.unsubscribedCategories.includes(category)) {
      await ctx.db.patch(prefs._id, {
        unsubscribedCategories: [...prefs.unsubscribedCategories, category],
        updatedAt: Date.now(),
      });
    }
    return true;
  },
});

export const findInactiveUsers = internalQuery({
  args: {},
  handler: async (ctx): Promise<string[]> => {
    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Get all users with API keys (they've been active at some point)
    const apiKeys = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const userIds = [...new Set(apiKeys.map((k) => k.userId))];
    const inactiveUsers: string[] = [];

    for (const userId of userIds) {
      // Check last render
      const lastRender = await ctx.db
        .query("renders")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .order("desc")
        .first();

      if (!lastRender || lastRender.createdAt < fourteenDaysAgo) {
        // Check if we already sent a re-engagement email this month
        const reEngagementEvents = await ctx.db
          .query("emailEvents")
          .withIndex("by_userId_emailType", (q) => q.eq("userId", userId).eq("emailType", "re_engagement"))
          .collect();

        const sentThisMonth = reEngagementEvents.some((e) => e.sentAt > oneMonthAgo);

        if (!sentThisMonth) {
          inactiveUsers.push(userId);
        }
      }
    }

    return inactiveUsers;
  },
});

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

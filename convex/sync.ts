import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { usageAggregate } from "./usage";

export const getAuthData = query({
  args: {},
  handler: async (ctx) => {
    const keys = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const quotas = await ctx.db.query("quotas").collect();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const quotasWithUsage = await Promise.all(
      quotas.map(async (q) => {
        const usage = await usageAggregate.count(ctx, {
          bounds: {
            lower: { key: [q.userId, year, month], inclusive: true },
            upper: { key: [q.userId, year, month], inclusive: true },
          },
        });
        return { ...q, currentUsage: usage };
      })
    );

    return {
      keys,
      quotas: quotasWithUsage,
    };
  },
});

export const ingestRenders = mutation({
  args: {
    renders: v.array(
      v.object({
        externalId: v.string(),
        apiKeyId: v.id("apiKeys"),
        userId: v.string(),
        status: v.union(v.literal("success"), v.literal("error")),
        htmlHash: v.string(),
        format: v.string(),
        renderMs: v.number(),
        imageKey: v.optional(v.string()),
        createdAt: v.number(),
      })
    ),
  },
  handler: async (ctx, { renders }) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    for (const r of renders) {
      const existing = await ctx.db
        .query("renders")
        .withIndex("by_externalId", (q) => q.eq("externalId", r.externalId))
        .first();

      if (existing) continue;

      await ctx.db.insert("renders", r);

      if (r.status === "success") {
        const usageDoc = await ctx.db.insert("usageMonthly", {
          userId: r.userId,
          year,
          month,
        });
        await usageAggregate.insert(ctx, {
          _id: usageDoc,
          _creationTime: Date.now(),
          userId: r.userId,
          year,
          month,
        });
      }
    }
  },
});

export const insertUsage = internalMutation({
  args: {
    userId: v.string(),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, { userId, year, month }) => {
    const usageDoc = await ctx.db.insert("usageMonthly", {
      userId,
      year,
      month,
    });
    await usageAggregate.insert(ctx, {
      _id: usageDoc,
      _creationTime: Date.now(),
      userId,
      year,
      month,
    });
  },
});

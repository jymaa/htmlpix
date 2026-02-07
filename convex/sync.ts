import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { usageAggregate } from "./usage";
import { workflow } from "./emailWorkflows";

function validateServerSecret(secret: string) {
  const expected = process.env.SERVER_SECRET;
  if (!expected) throw new Error("SERVER_SECRET not configured");
  if (secret !== expected) throw new Error("Invalid server secret");
}

export const getAuthData = query({
  args: { serverSecret: v.string() },
  handler: async (ctx, { serverSecret }) => {
    validateServerSecret(serverSecret);
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
        return {
          ...q,
          currentUsage: usage,
          stripeSubscriptionStatus: q.stripeSubscriptionStatus,
          currentPeriodEnd: q.currentPeriodEnd,
        };
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
    serverSecret: v.string(),
    renders: v.array(
      v.object({
        externalId: v.string(),
        apiKeyId: v.id("apiKeys"),
        userId: v.string(),
        status: v.union(v.literal("success"), v.literal("error")),
        htmlHash: v.string(),
        contentHash: v.optional(v.string()),
        format: v.string(),
        renderMs: v.number(),
        imageKey: v.optional(v.string()),
        createdAt: v.number(),
      })
    ),
  },
  handler: async (ctx, { serverSecret, renders }) => {
    validateServerSecret(serverSecret);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Track which users had successful renders in this batch
    const usersWithSuccessfulRenders = new Set<string>();

    for (const r of renders) {
      const existing = await ctx.db
        .query("renders")
        .withIndex("by_externalId", (q) => q.eq("externalId", r.externalId))
        .first();

      if (existing) continue;

      await ctx.db.insert("renders", r);

      if (r.status === "success") {
        usersWithSuccessfulRenders.add(r.userId);
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

    // Check email triggers for users with successful renders
    for (const userId of usersWithSuccessfulRenders) {
      // Check for first render ever
      const firstRenderSent = await ctx.db
        .query("emailEvents")
        .withIndex("by_userId_emailType", (q) => q.eq("userId", userId).eq("emailType", "first_render"))
        .first();

      if (!firstRenderSent) {
        // Count total successful renders
        const allRenders = await ctx.db
          .query("renders")
          .withIndex("by_userId", (q) => q.eq("userId", userId))
          .filter((q) => q.eq(q.field("status"), "success"))
          .collect();

        if (
          allRenders.length <= renders.filter((r) => r.userId === userId && r.status === "success").length
        ) {
          // These are their first renders ever
          await workflow.start(ctx, internal.emailWorkflows.firstRenderWorkflow, { userId });
        }
      }

      // Check usage milestones
      const quota = await ctx.db
        .query("quotas")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

      const monthlyLimit = quota?.monthlyLimit ?? 50;
      const currentUsage = await usageAggregate.count(ctx, {
        bounds: {
          lower: { key: [userId, year, month], inclusive: true },
          upper: { key: [userId, year, month], inclusive: true },
        },
      });

      const usagePercent = currentUsage / monthlyLimit;

      if (usagePercent >= 1) {
        const emailType100 = `usage_100_${year}_${month}`;
        const sent100 = await ctx.db
          .query("emailEvents")
          .withIndex("by_userId_emailType", (q) => q.eq("userId", userId).eq("emailType", emailType100))
          .first();
        if (!sent100) {
          await workflow.start(ctx, internal.emailWorkflows.usage100Workflow, { userId });
        }
      } else if (usagePercent >= 0.75) {
        const emailType75 = `usage_75_${year}_${month}`;
        const sent75 = await ctx.db
          .query("emailEvents")
          .withIndex("by_userId_emailType", (q) => q.eq("userId", userId).eq("emailType", emailType75))
          .first();
        if (!sent75) {
          await workflow.start(ctx, internal.emailWorkflows.usage75Workflow, { userId });
        }
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

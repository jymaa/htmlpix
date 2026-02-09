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

export const ingestRenderEvents = mutation({
  args: {
    serverSecret: v.string(),
    events: v.array(
      v.object({
        userId: v.string(),
        templateId: v.string(),
        tv: v.optional(v.string()),
        canonicalPath: v.string(),
        contentHash: v.string(),
        status: v.union(v.literal("success"), v.literal("error")),
        cached: v.boolean(),
        format: v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp")),
        renderMs: v.number(),
        errorCode: v.optional(v.string()),
        createdAt: v.number(),
      })
    ),
  },
  handler: async (ctx, { serverSecret, events }) => {
    validateServerSecret(serverSecret);
    const now = Date.now();

    const usersWithUsageIncrement = new Set<string>();

    for (const event of events) {
      await ctx.db.insert("renderEvents", event);

      if (event.status === "success" && !event.cached) {
        usersWithUsageIncrement.add(event.userId);

        const usageDoc = await ctx.db.insert("usageMonthly", {
          userId: event.userId,
          year: new Date(event.createdAt).getFullYear(),
          month: new Date(event.createdAt).getMonth() + 1,
        });
        await usageAggregate.insert(ctx, {
          _id: usageDoc,
          _creationTime: now,
          userId: event.userId,
          year: new Date(event.createdAt).getFullYear(),
          month: new Date(event.createdAt).getMonth() + 1,
        });
      }

      if (event.status === "success") {
        const existing = await ctx.db
          .query("renderArtifacts")
          .withIndex("by_contentHash", (q) => q.eq("contentHash", event.contentHash))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, {
            canonicalPath: event.canonicalPath,
            format: event.format,
            templateId: event.templateId,
            tv: event.tv,
            updatedAt: event.createdAt,
          });
        } else {
          await ctx.db.insert("renderArtifacts", {
            contentHash: event.contentHash,
            canonicalPath: event.canonicalPath,
            format: event.format,
            templateId: event.templateId,
            tv: event.tv,
            createdAt: event.createdAt,
            updatedAt: event.createdAt,
          });
        }
      }
    }

    // Keep existing email milestone behavior by checking users whose billable usage changed.
    for (const userId of usersWithUsageIncrement) {
      const current = new Date();
      const year = current.getFullYear();
      const month = current.getMonth() + 1;

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

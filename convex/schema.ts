import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  apiKeys: defineTable({
    userId: v.string(),
    keyHash: v.string(),
    keyPrefix: v.string(),
    name: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_keyHash", ["keyHash"]),

  quotas: defineTable({
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("scale")),
    monthlyLimit: v.number(),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

  renderArtifacts: defineTable({
    contentHash: v.string(),
    canonicalPath: v.string(),
    format: v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp")),
    templateId: v.string(),
    tv: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_contentHash", ["contentHash"]),

  renderEvents: defineTable({
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
    .index("by_userId", ["userId"])
    .index("by_contentHash", ["contentHash"])
    .index("by_userId_createdAt", ["userId", "createdAt"]),

  templates: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    jsx: v.string(),
    variables: v.array(
      v.object({
        name: v.string(),
        type: v.optional(v.union(v.literal("string"), v.literal("number"), v.literal("url"))),
        defaultValue: v.optional(v.string()),
      })
    ),
    googleFonts: v.optional(v.array(v.string())),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    format: v.optional(v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp"))),
    isPublic: v.boolean(),
    isStarter: v.optional(v.boolean()),
    tier: v.optional(v.union(v.literal("free"), v.literal("paid"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_isPublic", ["isPublic"]),

  usageMonthly: defineTable({
    userId: v.string(),
    year: v.number(),
    month: v.number(),
  }).index("by_userId_year_month", ["userId", "year", "month"]),

  emailPreferences: defineTable({
    userId: v.string(),
    unsubscribedCategories: v.array(v.string()),
    unsubscribeToken: v.string(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_unsubscribeToken", ["unsubscribeToken"]),

  emailEvents: defineTable({
    userId: v.string(),
    emailType: v.string(),
    sentAt: v.number(),
  })
    .index("by_userId_emailType", ["userId", "emailType"])
    .index("by_userId", ["userId"]),
});

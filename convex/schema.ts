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
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    monthlyLimit: v.number(),
  }).index("by_userId", ["userId"]),

  renders: defineTable({
    apiKeyId: v.id("apiKeys"),
    userId: v.string(),
    externalId: v.string(),
    status: v.union(v.literal("success"), v.literal("error")),
    htmlHash: v.string(),
    format: v.string(),
    renderMs: v.number(),
    imageKey: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_userId", ["userId"]),

  usageMonthly: defineTable({
    userId: v.string(),
    year: v.number(),
    month: v.number(),
  })
    .index("by_userId_year_month", ["userId", "year", "month"]),
});

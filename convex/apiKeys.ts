import { query, mutation } from "./_generated/server";
import { components } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { usageAggregate } from "./usage";

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "hpx_";
  for (let i = 0; i < 24; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function authenticateUser(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> }; runQuery: Function }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const userId = identity.subject;
  const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
    model: "user",
    where: [{ field: "_id", value: userId }],
  });
  if (!user) throw new Error("Account not found");
  return userId;
}

const IMAGE_BASE_URL = process.env.API_BASE_URL || "https://api.htmlpix.com";

function publicImageUrl(canonicalPath: string): string {
  if (canonicalPath.startsWith("http://") || canonicalPath.startsWith("https://")) return canonicalPath;
  return `${IMAGE_BASE_URL}${canonicalPath}`;
}

export const listUserKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await authenticateUser(ctx);
    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return keys.map((key) => ({
      _id: key._id,
      keyPrefix: key.keyPrefix,
      name: key.name,
      active: key.active,
      createdAt: key.createdAt,
      revokedAt: key.revokedAt,
    }));
  },
});

export const createKey = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await authenticateUser(ctx);

    // Auto-provision free quota if user has no quota yet
    const existingQuota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!existingQuota) {
      await ctx.db.insert("quotas", {
        userId,
        plan: "free",
        monthlyLimit: 50,
      });
    }

    // Free users are limited to 1 API key
    const plan = existingQuota?.plan ?? "free";
    if (plan === "free") {
      const existingKeys = await ctx.db
        .query("apiKeys")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
      if (existingKeys.length >= 1) {
        throw new Error("Free plan is limited to 1 API key. Upgrade your plan to create more.");
      }
    }

    const rawKey = generateApiKey();
    const keyHash = await hashKey(rawKey);
    const keyPrefix = rawKey.slice(0, 12);

    const keyId = await ctx.db.insert("apiKeys", {
      userId,
      keyHash,
      keyPrefix,
      name,
      active: true,
      createdAt: Date.now(),
    });

    return { keyId, rawKey };
  },
});

export const revokeKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, { keyId }) => {
    const userId = await authenticateUser(ctx);
    const key = await ctx.db.get(keyId);
    if (!key || key.userId !== userId) throw new Error("Key not found");
    await ctx.db.patch(keyId, {
      active: false,
      revokedAt: Date.now(),
    });
  },
});

export const reactivateKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, { keyId }) => {
    const userId = await authenticateUser(ctx);
    const key = await ctx.db.get(keyId);
    if (!key || key.userId !== userId) throw new Error("Key not found");
    await ctx.db.patch(keyId, {
      active: true,
      revokedAt: undefined,
    });
  },
});

export const deleteKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, { keyId }) => {
    const userId = await authenticateUser(ctx);
    const key = await ctx.db.get(keyId);
    if (!key || key.userId !== userId) throw new Error("Key not found");
    await ctx.db.delete(keyId);
  },
});

export const renameKey = mutation({
  args: {
    keyId: v.id("apiKeys"),
    name: v.string(),
  },
  handler: async (ctx, { keyId, name }) => {
    const userId = await authenticateUser(ctx);
    const key = await ctx.db.get(keyId);
    if (!key || key.userId !== userId) throw new Error("Key not found");
    await ctx.db.patch(keyId, { name });
  },
});

export const getUserQuota = query({
  args: {},
  handler: async (ctx) => {
    const userId = await authenticateUser(ctx);
    const quota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!quota) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const currentUsage = await usageAggregate.count(ctx, {
      bounds: {
        lower: { key: [userId, year, month], inclusive: true },
        upper: { key: [userId, year, month], inclusive: true },
      },
    });

    return { ...quota, currentUsage };
  },
});

export const getUserRenders = query({
  args: {
    limit: v.optional(v.number()),
    cachedFilter: v.optional(v.boolean()),
  },
  handler: async (ctx, { limit, cachedFilter }) => {
    const userId = await authenticateUser(ctx);
    let q = (ctx.db as any)
      .query("renderEvents")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .order("desc");

    if (cachedFilter !== undefined) {
      q = q.filter((f: any) => f.eq(f.field("cached"), cachedFilter));
    }

    const events = await q.take(limit ?? 50);

    return events.map((event: any) => ({
      ...event,
      externalId: event.contentHash.slice(0, 12),
      imageKey: `${event.contentHash}.${event.format}`,
      imageUrl: event.status === "success" ? publicImageUrl(event.canonicalPath) : undefined,
    }));
  },
});

export const getUserRendersPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    statusFilter: v.optional(v.union(v.literal("success"), v.literal("error"))),
    formatFilter: v.optional(v.string()),
    cachedFilter: v.optional(v.boolean()),
  },
  handler: async (ctx, { paginationOpts, statusFilter, formatFilter, cachedFilter }) => {
    const userId = await authenticateUser(ctx);
    let q = (ctx.db as any)
      .query("renderEvents")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .order("desc");

    if (statusFilter) {
      q = q.filter((f: any) => f.eq(f.field("status"), statusFilter));
    }
    if (formatFilter) {
      q = q.filter((f: any) => f.eq(f.field("format"), formatFilter));
    }
    if (cachedFilter !== undefined) {
      q = q.filter((f: any) => f.eq(f.field("cached"), cachedFilter));
    }

    const result = await q.paginate(paginationOpts);

    // Batch-resolve template names
    const templateIds = [...new Set(result.page.map((e: any) => e.templateId as string))] as string[];
    const templateMap: Record<string, string> = {};
    for (const tid of templateIds) {
      try {
        const tmpl = await (ctx.db as any).get(tid);
        if (tmpl) templateMap[tid] = tmpl.name;
      } catch {
        // template may have been deleted
      }
    }

    const page = result.page.map((event: any) => ({
      ...event,
      externalId: event.contentHash.slice(0, 12),
      imageKey: `${event.contentHash}.${event.format}`,
      imageUrl: event.status === "success" ? publicImageUrl(event.canonicalPath) : undefined,
      templateName: templateMap[event.templateId] ?? event.templateId.slice(0, 8),
    }));

    return { ...result, page };
  },
});

import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { usageAggregate } from "./usage";
import { r2 } from "./images";

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

export const listUserKeys = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
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
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { userId, name }) => {
    const rawKey = generateApiKey();
    const keyHash = await hashKey(rawKey);
    const keyPrefix = rawKey.slice(0, 12);

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
    await ctx.db.patch(keyId, {
      active: false,
      revokedAt: Date.now(),
    });
  },
});

export const reactivateKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, { keyId }) => {
    await ctx.db.patch(keyId, {
      active: true,
      revokedAt: undefined,
    });
  },
});

export const deleteKey = mutation({
  args: { keyId: v.id("apiKeys") },
  handler: async (ctx, { keyId }) => {
    await ctx.db.delete(keyId);
  },
});

export const renameKey = mutation({
  args: {
    keyId: v.id("apiKeys"),
    name: v.string(),
  },
  handler: async (ctx, { keyId, name }) => {
    await ctx.db.patch(keyId, { name });
  },
});

export const getUserQuota = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
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
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit }) => {
    const renders = await ctx.db
      .query("renders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit ?? 50);

    return Promise.all(
      renders.map(async (render) => {
        let imageUrl: string | undefined;
        if (render.imageKey) {
          try {
            imageUrl = await r2.getUrl(render.imageKey);
          } catch {
            // Signed URL generation failed
          }
        }
        return { ...render, imageUrl };
      })
    );
  },
});

export const getUserRendersPaginated = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
    statusFilter: v.optional(v.union(v.literal("success"), v.literal("error"))),
    formatFilter: v.optional(v.string()),
  },
  handler: async (ctx, { userId, paginationOpts, statusFilter, formatFilter }) => {
    let q = ctx.db
      .query("renders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc");

    if (statusFilter) {
      q = q.filter((f) => f.eq(f.field("status"), statusFilter));
    }
    if (formatFilter) {
      q = q.filter((f) => f.eq(f.field("format"), formatFilter));
    }

    const result = await q.paginate(paginationOpts);

    const page = await Promise.all(
      result.page.map(async (render) => {
        let imageUrl: string | undefined;
        if (render.imageKey) {
          try {
            imageUrl = await r2.getUrl(render.imageKey);
          } catch {
            // Signed URL generation failed — leave undefined
          }
        }
        return { ...render, imageUrl };
      })
    );

    return { ...result, page };
  },
});

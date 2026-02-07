import { R2 } from "@convex-dev/r2";
import { components, internal } from "./_generated/api";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { cdnUrl } from "./helpers/cdn";

export const r2 = new R2(components.r2);

export const generateUploadUrl = action({
  args: {},
  handler: async () => {
    return await r2.generateUploadUrl();
  },
});

export const uploadImage = action({
  args: {
    renderId: v.string(),
    contentType: v.string(),
    base64Data: v.string(),
    imageKey: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { renderId, contentType, base64Data, imageKey }
  ): Promise<{ key: string; url: string; linked: boolean }> => {
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: contentType });
    const key = await r2.store(
      ctx,
      blob,
      imageKey ? { key: imageKey, type: contentType } : { type: contentType }
    );

    const linked: boolean = await ctx.runMutation(internal.images.linkToRender, {
      renderId,
      imageKey: key,
    });

    const url = cdnUrl(key);
    return { key, url, linked };
  },
});

export const linkToRender = internalMutation({
  args: {
    renderId: v.string(),
    imageKey: v.string(),
  },
  handler: async (ctx, { renderId, imageKey }) => {
    const render = await ctx.db
      .query("renders")
      .withIndex("by_externalId", (q) => q.eq("externalId", renderId))
      .first();

    if (render) {
      await ctx.db.patch(render._id, { imageKey });
      return true;
    }
    return false;
  },
});

export const linkImageToRender = action({
  args: {
    renderId: v.string(),
    imageKey: v.string(),
  },
  handler: async (ctx, { renderId, imageKey }): Promise<boolean> => {
    return await ctx.runMutation(internal.images.linkToRender, { renderId, imageKey });
  },
});

export const getRenderByExternalId = internalQuery({
  args: { renderId: v.string() },
  handler: async (ctx, { renderId }) => {
    return await ctx.db
      .query("renders")
      .withIndex("by_externalId", (q) => q.eq("externalId", renderId))
      .first();
  },
});

export const getRenderByContentHash = internalQuery({
  args: { contentHash: v.string() },
  handler: async (ctx, { contentHash }) => {
    return await ctx.db
      .query("renders")
      .withIndex("by_contentHash", (q) => q.eq("contentHash", contentHash))
      .filter((q) => q.eq(q.field("status"), "success"))
      .first();
  },
});

export const checkCachedRender = action({
  args: { contentHash: v.string() },
  handler: async (
    ctx,
    { contentHash }
  ): Promise<{
    cached: boolean;
    externalId?: string;
    imageKey?: string;
  }> => {
    const render = await ctx.runQuery(internal.images.getRenderByContentHash, { contentHash });
    if (!render?.imageKey) {
      return { cached: false };
    }
    return {
      cached: true,
      externalId: render.externalId,
      imageKey: render.imageKey,
    };
  },
});

export const getImageUrl = action({
  args: { imageKey: v.string() },
  handler: async (_, { imageKey }) => {
    return cdnUrl(imageKey);
  },
});

export const getImageUrlByRender = action({
  args: { renderId: v.string() },
  handler: async (ctx, { renderId }): Promise<string | null> => {
    const render = await ctx.runQuery(internal.images.getRenderByExternalId, { renderId });
    if (!render?.imageKey) return null;
    return cdnUrl(render.imageKey);
  },
});

export const deleteImage = action({
  args: { imageKey: v.string() },
  handler: async (ctx, { imageKey }) => {
    await r2.deleteObject(ctx, imageKey);
  },
});

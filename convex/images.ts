import { R2 } from "@convex-dev/r2";
import { components, internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";

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
  },
  handler: async (ctx, { renderId, contentType, base64Data }) => {
    const buffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([buffer], { type: contentType });
    const key = await r2.store(ctx, blob, { type: contentType });

    await ctx.runMutation(internal.images.linkToRender, { renderId, imageKey: key });

    const url = await r2.getUrl(key);
    return { key, url };
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
    }
  },
});

export const getImageUrl = action({
  args: { imageKey: v.string() },
  handler: async (_, { imageKey }) => {
    return await r2.getUrl(imageKey);
  },
});

export const deleteImage = action({
  args: { imageKey: v.string() },
  handler: async (ctx, { imageKey }) => {
    await r2.deleteObject(ctx, imageKey);
  },
});

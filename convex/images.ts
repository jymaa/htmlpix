import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const IMAGE_BASE_URL = process.env.API_BASE_URL || "https://api.htmlpix.com";

function publicImageUrl(canonicalPath: string): string {
  if (canonicalPath.startsWith("http://") || canonicalPath.startsWith("https://")) return canonicalPath;
  return `${IMAGE_BASE_URL}${canonicalPath}`;
}

export const getRenderByContentHash = internalQuery({
  args: { contentHash: v.string() },
  handler: async (ctx, { contentHash }) => {
    return await (ctx.db as any)
      .query("renderArtifacts")
      .withIndex("by_contentHash", (q: any) => q.eq("contentHash", contentHash))
      .first();
  },
});

export const checkCachedRender = query({
  args: { contentHash: v.string() },
  handler: async (ctx, { contentHash }): Promise<{ cached: boolean; canonicalPath?: string }> => {
    const artifact = await (ctx.db as any)
      .query("renderArtifacts")
      .withIndex("by_contentHash", (q: any) => q.eq("contentHash", contentHash))
      .first();
    if (!artifact) return { cached: false };
    return { cached: true, canonicalPath: artifact.canonicalPath };
  },
});

export const getImageUrl = query({
  args: { canonicalPath: v.string() },
  handler: async (_, { canonicalPath }) => publicImageUrl(canonicalPath),
});

export const getImageUrlByRender = query({
  args: { contentHash: v.string() },
  handler: async (ctx, { contentHash }): Promise<string | null> => {
    const artifact = await (ctx.db as any)
      .query("renderArtifacts")
      .withIndex("by_contentHash", (q: any) => q.eq("contentHash", contentHash))
      .first();
    if (!artifact) return null;
    return publicImageUrl(artifact.canonicalPath);
  },
});

export const deleteImage = mutation({
  args: { contentHash: v.string() },
  handler: async (ctx, { contentHash }) => {
    const artifact = await (ctx.db as any)
      .query("renderArtifacts")
      .withIndex("by_contentHash", (q: any) => q.eq("contentHash", contentHash))
      .first();
    if (artifact) {
      await (ctx.db as any).delete(artifact._id);
    }
  },
});

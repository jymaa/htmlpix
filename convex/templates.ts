import { query, mutation } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";

const variableValidator = v.object({
  name: v.string(),
  type: v.union(v.literal("string"), v.literal("number"), v.literal("url")),
  defaultValue: v.optional(v.string()),
});

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

export const listUserTemplates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await authenticateUser(ctx);
    return await ctx.db
      .query("templates")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const listStarterTemplates = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query("templates")
      .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
      .collect();
    return templates.filter((t) => t.isStarter);
  },
});

export const getTemplate = query({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const userId = await authenticateUser(ctx);
    const template = await ctx.db.get(templateId);
    if (!template) return null;
    if (template.userId !== userId && !template.isPublic) return null;
    return template;
  },
});

export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    html: v.string(),
    css: v.optional(v.string()),
    variables: v.array(variableValidator),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    format: v.optional(v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp"))),
  },
  handler: async (ctx, args) => {
    const userId = await authenticateUser(ctx);
    const now = Date.now();
    return await ctx.db.insert("templates", {
      userId,
      name: args.name,
      description: args.description,
      html: args.html,
      css: args.css,
      variables: args.variables,
      width: args.width,
      height: args.height,
      format: args.format,
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTemplate = mutation({
  args: {
    templateId: v.id("templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    html: v.optional(v.string()),
    css: v.optional(v.string()),
    variables: v.optional(v.array(variableValidator)),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    format: v.optional(v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp"))),
  },
  handler: async (ctx, { templateId, ...updates }) => {
    const userId = await authenticateUser(ctx);
    const existing = await ctx.db.get(templateId);
    if (!existing) throw new Error("Template not found");
    if (existing.userId !== userId) throw new Error("Not authorized");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.html !== undefined) patch.html = updates.html;
    if (updates.css !== undefined) patch.css = updates.css;
    if (updates.variables !== undefined) patch.variables = updates.variables;
    if (updates.width !== undefined) patch.width = updates.width;
    if (updates.height !== undefined) patch.height = updates.height;
    if (updates.format !== undefined) patch.format = updates.format;

    await ctx.db.patch(templateId, patch);
  },
});

export const deleteTemplate = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const userId = await authenticateUser(ctx);
    const template = await ctx.db.get(templateId);
    if (!template || template.userId !== userId) throw new Error("Template not found");
    await ctx.db.delete(templateId);
  },
});

export const cloneTemplate = mutation({
  args: {
    templateId: v.id("templates"),
  },
  handler: async (ctx, { templateId }) => {
    const userId = await authenticateUser(ctx);
    const source = await ctx.db.get(templateId);
    if (!source) throw new Error("Template not found");

    const now = Date.now();
    return await ctx.db.insert("templates", {
      userId,
      name: `${source.name} (Copy)`,
      description: source.description,
      html: source.html,
      css: source.css,
      variables: source.variables,
      width: source.width,
      height: source.height,
      format: source.format,
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

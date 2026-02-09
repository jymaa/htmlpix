import { query, mutation, internalMutation } from "./_generated/server";
import { components } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const variableValidator = v.object({
  name: v.string(),
  type: v.optional(v.union(v.literal("string"), v.literal("number"), v.literal("url"))),
  defaultValue: v.optional(v.string()),
});

async function authenticateUser(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  runQuery: Function;
}) {
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

function validateServerSecret(secret: string) {
  const expected = process.env.SERVER_SECRET;
  if (!expected) throw new Error("SERVER_SECRET not configured");
  if (secret !== expected) throw new Error("Invalid server secret");
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

export const getTemplateForServer = query({
  args: {
    serverSecret: v.string(),
    templateId: v.string(),
  },
  handler: async (ctx, { serverSecret, templateId }) => {
    validateServerSecret(serverSecret);
    const template = await ctx.db.get(templateId as Id<"templates">);
    return template ?? null;
  },
});

export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    jsx: v.string(),
    variables: v.array(variableValidator),
    googleFonts: v.optional(v.array(v.string())),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    format: v.optional(v.union(v.literal("png"), v.literal("jpeg"), v.literal("webp"))),
  },
  handler: async (ctx, args) => {
    const userId = await authenticateUser(ctx);

    const quota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!quota || quota.plan === "free") {
      throw new Error("Upgrade to a paid plan to create custom templates");
    }

    const now = Date.now();
    return await ctx.db.insert("templates", {
      userId,
      name: args.name,
      description: args.description,
      jsx: args.jsx,
      variables: args.variables,
      googleFonts: args.googleFonts,
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
    jsx: v.optional(v.string()),
    variables: v.optional(v.array(variableValidator)),
    googleFonts: v.optional(v.array(v.string())),
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
    if (updates.jsx !== undefined) patch.jsx = updates.jsx;
    if (updates.variables !== undefined) patch.variables = updates.variables;
    if (updates.googleFonts !== undefined) patch.googleFonts = updates.googleFonts;
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
      jsx: source.jsx,
      variables: source.variables,
      googleFonts: source.googleFonts,
      width: source.width,
      height: source.height,
      format: source.format,
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const canCreateTemplates = query({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const userId = await authenticateUser(ctx);
    const quota = await ctx.db
      .query("quotas")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return !!quota && quota.plan !== "free";
  },
});

export const seedDefaultTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("templates")
      .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
      .collect();
    const existingStarters = existing.filter((t) => t.isStarter);
    if (existingStarters.length > 0) return { seeded: 0, skipped: existingStarters.length };

    const now = Date.now();
    const defaults = getDefaultTemplates();
    for (const tmpl of defaults) {
      await ctx.db.insert("templates", {
        ...tmpl,
        userId: "system",
        isPublic: true,
        isStarter: true,
        tier: "free",
        createdAt: now,
        updatedAt: now,
      });
    }
    return { seeded: defaults.length };
  },
});

function getDefaultTemplates() {
  return [
    {
      name: "Blog Post",
      description: "Clean blog post OG card with title, author, date, and category",
      jsx: `const { title, author, date, category } = props;
return (
  <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", backgroundColor: "#0a0a0a", padding: "72px", fontFamily: "Inter, system-ui, sans-serif"}}>
    <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
      <div style={{width: "40px", height: "40px", borderRadius: "9999px", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <span style={{fontSize: "18px", color: "#fff", fontWeight: 700}}>{author ? author[0] : "?"}</span>
      </div>
      <span style={{fontSize: "18px", color: "rgba(255,255,255,0.5)"}}>{author}</span>
      <span style={{fontSize: "18px", color: "rgba(255,255,255,0.3)"}}>{date}</span>
    </div>
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{display: "flex", marginBottom: "24px"}}>
        <span style={{fontSize: "14px", fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "2px", border: "1px solid rgba(99,102,241,0.3)", padding: "6px 16px", borderRadius: "9999px"}}>{category}</span>
      </div>
      <h1 style={{fontSize: "64px", fontWeight: 700, color: "#fafafa", margin: 0, lineHeight: 1.1, letterSpacing: "-1px"}}>{title}</h1>
    </div>
  </div>
);`,
      variables: [
        { name: "title", defaultValue: "How We Scaled to 1M Users" },
        { name: "author", defaultValue: "Jane Smith" },
        { name: "date", defaultValue: "Mar 15, 2026" },
        { name: "category", defaultValue: "Engineering" },
      ],
      googleFonts: ["Inter:wght@400;700"],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Documentation",
      description: "Technical documentation page card with section and description",
      jsx: `const { title, description, site } = props;
return (
  <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", backgroundColor: "#fafafa", padding: "72px", fontFamily: "Inter, system-ui, sans-serif"}}>
    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
      <div style={{width: "48px", height: "48px", background: "#18181b", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <span style={{fontSize: "24px", color: "#fafafa"}}>&lt;/&gt;</span>
      </div>
      <span style={{fontSize: "16px", fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "2px"}}>{site}</span>
    </div>
    <div style={{display: "flex", flexDirection: "column"}}>
      <h1 style={{fontSize: "56px", fontWeight: 700, color: "#18181b", margin: 0, lineHeight: 1.15, letterSpacing: "-1px"}}>{title}</h1>
      <p style={{fontSize: "22px", color: "rgba(0,0,0,0.45)", margin: "16px 0 0 0", lineHeight: 1.5, maxWidth: "700px"}}>{description}</p>
    </div>
  </div>
);`,
      variables: [
        { name: "title", defaultValue: "Authentication" },
        { name: "description", defaultValue: "Set up API key authentication and manage user quotas" },
        { name: "site", defaultValue: "API Reference" },
      ],
      googleFonts: ["Inter:wght@400;700"],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Product Card",
      description: "Product announcement card with name, price, and description",
      jsx: `const { productName, price, description, brand } = props;
return (
  <div style={{display: "flex", width: "100%", height: "100%", backgroundColor: "#0a0a0a", fontFamily: "Inter, system-ui, sans-serif"}}>
    <div style={{flex: 1, padding: "72px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <div style={{display: "flex", flexDirection: "column"}}>
        <span style={{fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px"}}>{brand}</span>
        <h1 style={{fontSize: "64px", fontWeight: 800, color: "#fafafa", margin: 0, lineHeight: 1, letterSpacing: "-2px"}}>{productName}</h1>
        <p style={{fontSize: "22px", color: "rgba(255,255,255,0.5)", margin: "24px 0 0 0", lineHeight: 1.4, maxWidth: "500px"}}>{description}</p>
      </div>
      <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
        <span style={{fontSize: "48px", fontWeight: 800, color: "#22d3ee"}}>{price}</span>
      </div>
    </div>
    <div style={{width: "320px", height: "100%", background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <span style={{fontSize: "80px", fontWeight: 900, color: "rgba(255,255,255,0.15)"}}>{brand ? brand[0] : ""}</span>
    </div>
  </div>
);`,
      variables: [
        { name: "productName", defaultValue: "Acme Pro" },
        { name: "price", defaultValue: "$49/mo" },
        { name: "description", defaultValue: "Ship faster with AI-powered workflows" },
        { name: "brand", defaultValue: "Acme" },
      ],
      googleFonts: ["Inter:wght@400;600;800"],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
  ];
}

import { query, mutation, internalMutation, type QueryCtx, type MutationCtx } from "./_generated/server";

import { components } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const variableValidator = v.object({
  name: v.string(),
  type: v.optional(v.union(v.literal("string"), v.literal("number"), v.literal("url"))),
  defaultValue: v.optional(v.string()),
});

async function authenticateUser(ctx: QueryCtx | MutationCtx) {
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

    const now = Date.now();
    const defaults = getDefaultTemplates();
    const existingByName = new Map(existing.filter((t) => t.isStarter).map((t) => [t.name, t]));

    let inserted = 0;
    let updated = 0;
    for (const tmpl of defaults) {
      const starter = existingByName.get(tmpl.name);
      if (starter) {
        await ctx.db.patch(starter._id, {
          userId: "system",
          name: tmpl.name,
          description: tmpl.description,
          jsx: tmpl.jsx,
          variables: tmpl.variables,
          googleFonts: tmpl.googleFonts,
          width: tmpl.width,
          height: tmpl.height,
          format: tmpl.format,
          isPublic: true,
          isStarter: true,
          tier: "free",
          updatedAt: now,
        });
        updated += 1;
      } else {
        await ctx.db.insert("templates", {
          ...tmpl,
          userId: "system",
          isPublic: true,
          isStarter: true,
          tier: "free",
          createdAt: now,
          updatedAt: now,
        });
        inserted += 1;
      }
    }
    return { inserted, updated, total: defaults.length };
  },
});

function getDefaultTemplates() {
  return [
    {
      name: "Website OG Card",
      description: "HTMLPix marketing OG card with standard and home variants",
      jsx: `const { title, subtitle, tag, variant } = props;
const isHome = variant === "home";
const resolvedTitle = (title && title.trim()) || (isHome ? "HTML IN. IMAGE OUT." : "HTMLPix - HTML to Image API");
const resolvedSubtitle =
  (subtitle && subtitle.trim()) ||
  (isHome ? "Mint once. Reuse everywhere." : "Generate images from HTML/CSS with a single API call.");
const resolvedTag = (tag && tag.trim()) || "HTML TO IMAGE API";

return (
  <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#f5f0e8", color: "#1a1a1a", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 56px", fontFamily: "Space Mono, monospace" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,26,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    <div style={{ position: "absolute", top: "22px", left: "22px", width: "22px", height: "22px", borderTop: "2px solid rgba(26,26,26,0.16)", borderLeft: "2px solid rgba(26,26,26,0.16)" }} />
    <div style={{ position: "absolute", top: "22px", right: "22px", width: "22px", height: "22px", borderTop: "2px solid rgba(26,26,26,0.16)", borderRight: "2px solid rgba(26,26,26,0.16)" }} />
    <div style={{ position: "absolute", bottom: "22px", left: "22px", width: "22px", height: "22px", borderBottom: "2px solid rgba(26,26,26,0.16)", borderLeft: "2px solid rgba(26,26,26,0.16)" }} />
    <div style={{ position: "absolute", bottom: "22px", right: "22px", width: "22px", height: "22px", borderBottom: "2px solid rgba(26,26,26,0.16)", borderRight: "2px solid rgba(26,26,26,0.16)" }} />

    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "30px", height: "30px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#f5f0e8", fontSize: "10px", fontWeight: 700 }}>{"</>"}</span>
        </div>
        <span style={{ fontSize: "12px", letterSpacing: "3px", fontWeight: 700 }}>HTMLPIX</span>
      </div>
      <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(26,26,26,0.35)" }}>api.htmlpix.com</span>
    </div>

    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "900px" }}>
      <div style={{ display: "flex", marginBottom: "18px" }}>
        <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#ff4d00", textTransform: "uppercase", border: "1px solid rgba(255,77,0,0.35)", padding: "6px 12px" }}>{resolvedTag}</span>
      </div>
      <h1 style={{ margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: isHome ? "108px" : "86px", lineHeight: 0.9, letterSpacing: "-1px", color: "#1a1a1a" }}>{resolvedTitle}</h1>
      <div style={{ width: "58px", height: "4px", backgroundColor: "#ff4d00", margin: "16px 0" }} />
      <p style={{ margin: 0, fontSize: "18px", lineHeight: 1.5, color: "rgba(26,26,26,0.55)", maxWidth: "760px" }}>{resolvedSubtitle}</p>
    </div>

    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(26,26,26,0.12)", paddingTop: "12px", fontSize: "10px", letterSpacing: "2px", color: "rgba(26,26,26,0.35)", textTransform: "uppercase" }}>
      <span>1200 x 630</span>
      <span>Signed URL delivery</span>
    </div>
  </div>
);`,
      variables: [
        { name: "title", defaultValue: "HTMLPix - HTML to Image API" },
        {
          name: "subtitle",
          defaultValue: "Generate images from HTML/CSS with a single API call.",
        },
        { name: "tag", defaultValue: "HTML TO IMAGE API" },
        { name: "variant", defaultValue: "standard" },
      ],
      googleFonts: ["Space Mono:wght@400;700", "Bebas Neue:wght@400"],
      width: 1200,
      height: 630,
      format: "webp" as const,
    },
    {
      name: "Blog Post",
      description: "Blueprint-style blog post card with title, author, date, and category",
      jsx: `const { title, author, date, category } = props;
return (
  <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#f5f0e8", color: "#1a1a1a", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "Space Mono, monospace" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <div style={{ position: "absolute", top: "20px", left: "20px", width: "20px", height: "20px", borderTop: "2px solid rgba(26,26,26,0.15)", borderLeft: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", top: "20px", right: "20px", width: "20px", height: "20px", borderTop: "2px solid rgba(26,26,26,0.15)", borderRight: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "20px", height: "20px", borderBottom: "2px solid rgba(26,26,26,0.15)", borderLeft: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "20px", height: "20px", borderBottom: "2px solid rgba(26,26,26,0.15)", borderRight: "2px solid rgba(26,26,26,0.15)" }} />

    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#ff4d00", textTransform: "uppercase", border: "1px solid rgba(255,77,0,0.3)", padding: "5px 12px" }}>{category}</span>
        </div>
        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(26,26,26,0.25)" }}>FIG. 01 — ARTICLE</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "82px", lineHeight: 0.95, letterSpacing: "-1px", color: "#1a1a1a" }}>{title}</h1>
        <div style={{ width: "56px", height: "4px", backgroundColor: "#ff4d00", marginTop: "20px" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(26,26,26,0.1)", paddingTop: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "32px", backgroundColor: "#ff4d00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#f5f0e8", fontSize: "14px", fontWeight: 700 }}>{author ? author[0].toUpperCase() : "?"}</span>
          </div>
          <span style={{ fontSize: "12px", letterSpacing: "1px", color: "rgba(26,26,26,0.5)" }}>{author}</span>
        </div>
        <span style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.3)", textTransform: "uppercase" }}>{date}</span>
      </div>
    </div>
  </div>
);`,
      variables: [
        { name: "title", defaultValue: "How We Scaled to 1M Users" },
        { name: "author", defaultValue: "Jane Smith" },
        { name: "date", defaultValue: "Mar 15, 2026" },
        { name: "category", defaultValue: "Engineering" },
      ],
      googleFonts: ["Space Mono:wght@400;700", "Bebas Neue:wght@400"],
      width: 1200,
      height: 630,
      format: "webp" as const,
    },
    {
      name: "Documentation",
      description: "Terminal-style documentation card with breadcrumb path and section details",
      jsx: `const { title, description, site } = props;
return (
  <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#1a1a1a", color: "#f5f0e8", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "Space Mono, monospace" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,240,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(245,240,232,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#ff5f57" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#febc2e" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: "#28c840" }} />
      </div>
      <span style={{ fontSize: "11px", color: "rgba(245,240,232,0.25)" }}>docs.htmlpix.com</span>
    </div>

    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: "rgba(245,240,232,0.3)" }}>{site}</span>
        <span style={{ fontSize: "11px", color: "rgba(245,240,232,0.15)" }}>/</span>
        <span style={{ fontSize: "11px", color: "#ff4d00" }}>{title}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <div style={{ width: "4px", height: "44px", backgroundColor: "#ff4d00" }} />
          <h1 style={{ margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "72px", lineHeight: 0.95, color: "#f5f0e8" }}>{title}</h1>
        </div>
        <p style={{ margin: 0, fontSize: "18px", lineHeight: 1.6, color: "rgba(245,240,232,0.4)", maxWidth: "700px" }}>{description}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(245,240,232,0.08)", paddingTop: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "24px", height: "24px", backgroundColor: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "8px", fontWeight: 700, color: "#1a1a1a" }}>{"</>"}</span>
          </div>
          <span style={{ fontSize: "10px", letterSpacing: "3px", fontWeight: 700, color: "rgba(245,240,232,0.5)" }}>HTMLPIX</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#28c840" }} />
          <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(245,240,232,0.25)" }}>DOCS</span>
        </div>
      </div>
    </div>
  </div>
);`,
      variables: [
        { name: "title", defaultValue: "Authentication" },
        { name: "description", defaultValue: "Set up API key authentication and manage user quotas" },
        { name: "site", defaultValue: "API Reference" },
      ],
      googleFonts: ["Space Mono:wght@400;700", "Bebas Neue:wght@400"],
      width: 1200,
      height: 630,
      format: "webp" as const,
    },
    {
      name: "Product Card",
      description: "Architectural spec-sheet product card with name, price, and description",
      jsx: `const { productName, price, description, brand } = props;
return (
  <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#f5f0e8", color: "#1a1a1a", overflow: "hidden", display: "flex", fontFamily: "Space Mono, monospace" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <div style={{ position: "absolute", top: "20px", left: "20px", width: "20px", height: "20px", borderTop: "2px solid rgba(26,26,26,0.15)", borderLeft: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", top: "20px", right: "20px", width: "20px", height: "20px", borderTop: "2px solid rgba(26,26,26,0.15)", borderRight: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "20px", height: "20px", borderBottom: "2px solid rgba(26,26,26,0.15)", borderLeft: "2px solid rgba(26,26,26,0.15)" }} />
    <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "20px", height: "20px", borderBottom: "2px solid rgba(26,26,26,0.15)", borderRight: "2px solid rgba(26,26,26,0.15)" }} />

    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", letterSpacing: "4px", fontWeight: 700, color: "rgba(26,26,26,0.35)", textTransform: "uppercase" }}>{brand}</span>
        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(26,26,26,0.2)" }}>SPEC SHEET</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1 style={{ margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "88px", lineHeight: 0.9, letterSpacing: "-1px" }}>{productName}</h1>
        <div style={{ width: "56px", height: "4px", backgroundColor: "#ff4d00", margin: "18px 0" }} />
        <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6, color: "rgba(26,26,26,0.45)", maxWidth: "500px" }}>{description}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(26,26,26,0.1)", paddingTop: "16px" }}>
        <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "52px", color: "#ff4d00", lineHeight: 1 }}>{price}</span>
        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(26,26,26,0.25)", textTransform: "uppercase" }}>Starting price</span>
      </div>
    </div>

    <div style={{ position: "relative", width: "200px", backgroundColor: "#1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <div style={{ width: "60px", height: "60px", border: "2px solid rgba(245,240,232,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "32px", color: "#ff4d00" }}>{brand ? brand[0] : ""}</span>
      </div>
      <div style={{ width: "1px", height: "40px", backgroundColor: "rgba(245,240,232,0.1)" }} />
      <span style={{ fontSize: "9px", letterSpacing: "4px", color: "rgba(245,240,232,0.25)", textTransform: "uppercase" }}>PRODUCT</span>
    </div>
  </div>
);`,
      variables: [
        { name: "productName", defaultValue: "Acme Pro" },
        { name: "price", defaultValue: "$49/mo" },
        { name: "description", defaultValue: "Ship faster with AI-powered workflows" },
        { name: "brand", defaultValue: "Acme" },
      ],
      googleFonts: ["Space Mono:wght@400;700", "Bebas Neue:wght@400"],
      width: 1200,
      height: 630,
      format: "webp" as const,
    },
  ];
}

import { query, mutation, internalMutation } from "./_generated/server";
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
    const template = await (ctx.db as any).get(templateId);
    return template ?? null;
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
      description: "Clean blog post OG card with title, author, and category tag",
      html: `<div class="flex h-[630px] w-[1200px] flex-col justify-between bg-[#0a0a0a] p-[72px]" style="font-family:system-ui">
  <div class="flex items-center gap-3">
    <div style="width:40px;height:40px;border-radius:9999px;background:#6366f1"></div>
    <span style="font-size:18px;color:rgba(255,255,255,0.5)">{{author}}</span>
  </div>
  <div>
    <div style="display:flex;margin-bottom:24px">
      <span style="font-size:14px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:2px;border:1px solid rgba(99,102,241,0.3);padding:6px 16px;border-radius:9999px">{{tag}}</span>
    </div>
    <h1 style="font-size:64px;font-weight:700;color:#fafafa;margin:0;line-height:1.1;letter-spacing:-1px">{{title}}</h1>
    <p style="font-size:24px;color:rgba(255,255,255,0.45);margin:20px 0 0 0;line-height:1.4">{{subtitle}}</p>
  </div>
</div>`,
      css: "",
      variables: [
        { name: "title", type: "string" as const, defaultValue: "How We Scaled to 1M Users" },
        { name: "subtitle", type: "string" as const, defaultValue: "A deep dive into our infrastructure journey" },
        { name: "author", type: "string" as const, defaultValue: "Jane Smith" },
        { name: "tag", type: "string" as const, defaultValue: "Engineering" },
      ],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Product Launch",
      description: "Bold product announcement card with gradient accent",
      html: `<div class="flex h-[630px] w-[1200px] items-center bg-[#0a0a0a]" style="font-family:system-ui">
  <div style="flex:1;padding:72px">
    <div style="display:flex;margin-bottom:32px">
      <span style="font-size:13px;font-weight:700;color:#000;background:#22d3ee;padding:8px 20px;border-radius:9999px;text-transform:uppercase;letter-spacing:2px">{{badge}}</span>
    </div>
    <h1 style="font-size:72px;font-weight:800;color:#fafafa;margin:0;line-height:1;letter-spacing:-2px">{{name}}</h1>
    <p style="font-size:26px;color:rgba(255,255,255,0.5);margin:24px 0 0 0;line-height:1.4;max-width:550px">{{tagline}}</p>
  </div>
  <div style="width:420px;height:100%;background:linear-gradient(135deg,#6366f1 0%,#22d3ee 100%);display:flex;align-items:center;justify-content:center">
    <span style="font-size:120px">{{emoji}}</span>
  </div>
</div>`,
      css: "",
      variables: [
        { name: "name", type: "string" as const, defaultValue: "Acme Pro" },
        { name: "tagline", type: "string" as const, defaultValue: "Ship faster with AI-powered workflows" },
        { name: "badge", type: "string" as const, defaultValue: "Now Available" },
        { name: "emoji", type: "string" as const, defaultValue: "\u{1F680}" },
      ],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Documentation",
      description: "Technical documentation page card with icon and section info",
      html: `<div class="flex h-[630px] w-[1200px] flex-col justify-between bg-[#fafafa] p-[72px]" style="font-family:system-ui">
  <div style="display:flex;align-items:center;gap:16px">
    <div style="width:48px;height:48px;background:#18181b;border-radius:12px;display:flex;align-items:center;justify-content:center">
      <span style="font-size:24px;color:#fafafa">&lt;/&gt;</span>
    </div>
    <span style="font-size:16px;font-weight:600;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:2px">{{section}}</span>
  </div>
  <div>
    <span style="font-size:56px;margin-bottom:16px;display:block">{{icon}}</span>
    <h1 style="font-size:56px;font-weight:700;color:#18181b;margin:0;line-height:1.15;letter-spacing:-1px">{{title}}</h1>
    <p style="font-size:22px;color:rgba(0,0,0,0.45);margin:16px 0 0 0;line-height:1.5;max-width:700px">{{description}}</p>
  </div>
</div>`,
      css: "",
      variables: [
        { name: "title", type: "string" as const, defaultValue: "Authentication" },
        { name: "description", type: "string" as const, defaultValue: "Set up API key authentication and manage user quotas" },
        { name: "section", type: "string" as const, defaultValue: "API Reference" },
        { name: "icon", type: "string" as const, defaultValue: "\u{1F512}" },
      ],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Event",
      description: "Event or webinar invitation card with date and speaker",
      html: `<div class="flex h-[630px] w-[1200px] bg-[#0a0a0a]" style="font-family:system-ui">
  <div style="flex:1;padding:72px;display:flex;flex-direction:column;justify-content:space-between">
    <div>
      <div style="display:flex;gap:12px;margin-bottom:40px">
        <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:9999px">{{date}}</span>
        <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:9999px">{{location}}</span>
      </div>
      <h1 style="font-size:58px;font-weight:700;color:#fafafa;margin:0;line-height:1.1;letter-spacing:-1px">{{title}}</h1>
    </div>
    <div style="display:flex;align-items:center;gap:16px;border-top:1px solid rgba(255,255,255,0.1);padding-top:32px">
      <div style="width:52px;height:52px;border-radius:9999px;background:linear-gradient(135deg,#f59e0b,#ef4444);display:flex;align-items:center;justify-content:center">
        <span style="font-size:22px;color:#fff;font-weight:700">{{speaker_initial}}</span>
      </div>
      <div>
        <p style="font-size:18px;color:#fafafa;margin:0;font-weight:600">{{speaker}}</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.4);margin:4px 0 0 0">{{speaker_title}}</p>
      </div>
    </div>
  </div>
  <div style="width:8px;background:linear-gradient(to bottom,#f59e0b,#ef4444)"></div>
</div>`,
      css: "",
      variables: [
        { name: "title", type: "string" as const, defaultValue: "Building at Scale with Edge Functions" },
        { name: "date", type: "string" as const, defaultValue: "Mar 15, 2026" },
        { name: "location", type: "string" as const, defaultValue: "Online" },
        { name: "speaker", type: "string" as const, defaultValue: "Alex Chen" },
        { name: "speaker_initial", type: "string" as const, defaultValue: "A" },
        { name: "speaker_title", type: "string" as const, defaultValue: "Head of Engineering, Acme Inc" },
      ],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
    {
      name: "Stats Card",
      description: "Dashboard-style metrics card with big number and trend",
      html: `<div class="flex h-[630px] w-[1200px] items-center justify-center bg-[#0a0a0a]" style="font-family:system-ui">
  <div style="text-align:center;max-width:800px">
    <p style="font-size:16px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:3px;margin:0 0 24px 0">{{metric}}</p>
    <h1 style="font-size:144px;font-weight:800;color:#fafafa;margin:0;line-height:1;letter-spacing:-4px">{{value}}</h1>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:32px">
      <span style="font-size:20px;font-weight:700;color:#22c55e">{{delta}}</span>
      <span style="font-size:18px;color:rgba(255,255,255,0.35)">{{period}}</span>
    </div>
  </div>
</div>`,
      css: "",
      variables: [
        { name: "metric", type: "string" as const, defaultValue: "Monthly Active Users" },
        { name: "value", type: "string" as const, defaultValue: "2.4M" },
        { name: "delta", type: "string" as const, defaultValue: "+34%" },
        { name: "period", type: "string" as const, defaultValue: "vs last month" },
      ],
      width: 1200,
      height: 630,
      format: "png" as const,
    },
  ];
}

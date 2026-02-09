# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev:server      # Start rendering server with hot reload (port 3201)
bun run dev:web         # Start Next.js frontend (port 3200)
bunx convex dev         # Start Convex backend dev server
bunx --bun shadcn@latest add <component> <options> # Add a component to the project. Example: bunx --bun shadcn@latest add button

# Build & Deploy
bun run build:server    # Build server to server/dist/
bun run typecheck       # TypeScript check

```

## Architecture

Dual-stack application: OG image / social card rendering API + Next.js web dashboard. Uses Takumi (@takumi-rs/image-response) for HTML→image conversion (no Puppeteer). Templates use Tailwind classes or inline styles only.

### Rendering Server (`server/`)

Bun HTTP server with Takumi for HTML→image conversion, Convex-synced auth/quota, in-memory + disk image cache.

**Endpoints:**

- `POST /v1/image-url` - Mint a signed image URL (requires API key auth)
- `GET /v1/image` - Serve a rendered image via signed URL
- `POST /internal/template-preview` - Render template preview (internal, secret-auth)
- `GET /healthz` - Health check
- `GET /readyz` - Readiness check (auth cache status)

**Core modules:**

- `server/server.ts` - HTTP routes, graceful shutdown
- `server/render/takumiRender.ts` - HTML→image via Takumi with Tailwind, Google Fonts fetching
- `server/render/templateInterpolation.ts` - Template variable interpolation
- `server/validation.ts` - Request validation and size limits
- `server/middleware/auth.ts` - Auth header validation + quota checks
- `server/cache/lmdb.ts` - LMDB cache for auth/quota vitals (Convex is source of truth)
- `server/sync/convexClient.ts` - Convex sync client + auth cache refresh
- `server/lib/signing.ts` - HMAC signing for image URLs
- `server/store/imageStore.ts` - In-memory image cache with TTL
- `server/store/diskImageStore.ts` - Disk image cache with TTL

### Web Frontend (`src/`)

Next.js 16 App Router with Convex backend and Better Auth.

**Structure:**

- `src/app/` - Next.js routes (public/protected route groups)
- `src/components/ui/` - shadcn/ui components
- `src/lib/auth-*.ts` - Better Auth client/server setup
- `convex/` - Convex functions, schema, auth config

### Key Environment Variables

**Server:**

- `PORT`, `BASE_URL` - Server binding + external base URL
- `CONVEX_URL` - Convex backend endpoint for sync/actions (required)
- `SERVER_SECRET` - Shared secret for server↔Convex auth
- `IMAGE_SIGNING_SECRET` - HMAC secret for signed image URLs
- `TEMPLATE_PREVIEW_SECRET` - Shared secret for /internal/template-preview
- `CACHE_PATH` - LMDB cache directory for auth/quota vitals
- `IMAGE_DIR`, `IMAGE_TTL_MS`, `MAX_STORED_IMAGES` - Image cache controls
- `TAKUMI_RENDER_TIMEOUT_MS` - Render timeout (default 10s)
- `AXIOM_TOKEN`, `AXIOM_DATASET` - Optional Axiom logging

**Frontend/Convex:**

- `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL` - Convex endpoints
- `NEXT_PUBLIC_SITE_URL`, `SITE_URL` - Base URLs for auth callbacks
- `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Auth

## Bun Preferences

Use Bun instead of Node.js for all operations.

- `bun <file>` instead of `node` or `ts-node`
- `bun test` instead of jest/vitest
- `bun install` instead of npm/yarn/pnpm
- `bunx` instead of `npx`
- Bun auto-loads .env - don't use dotenv

**Built-in APIs (don't use npm alternatives):**

- `Bun.serve()` - HTTP server (not express)
- `Bun.file` - File I/O (prefer over node:fs)

## Common Pitfalls

### Convex User Schema

If you want to do someting that is user related with the schema, check convex/betterAuth this is where is located all the user related data.

### Convex Action use node

If you add `"use node"`, the file can only define actions (no queries or mutations). Prefer web-safe APIs like `atob` + `Uint8Array` + `Blob`.

If using more than the fetch api from node, you need to use the `use node` directive. If using use node, you can only define actions in that file.

```ts
"use node";
```

### Convex Action Return Types

When an action uses `ctx.runQuery` or `ctx.runMutation`, TypeScript can't infer the return type. Add explicit return type annotations:

```ts
// BAD - causes "implicitly has type 'any'" error
export const myAction = action({
  handler: async (ctx, args) => {
    return await ctx.runQuery(api.something.get, { id: args.id });
  },
});

// GOOD - explicit return type
export const myAction = action({
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    return await ctx.runQuery(api.something.get, { id: args.id });
  },
});
```

## Deployment

Blue-green deployment to VPS. See `deploy.md` for details.

**Requirements for server changes:**

- Must expose `/readyz` endpoint returning 200 when ready
- Must respect `PORT` and `CACHE_PATH` env vars
- Must have `start` script in `server/package.json`

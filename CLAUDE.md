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

Dual-stack application: HTML-to-image rendering API + Next.js web dashboard.

### Rendering Server (`server/`)

Bun HTTP server with Puppeteer for HTML→image conversion.

**Endpoints:**
- `POST /render` - Render HTML to image (requires API key auth)
- `GET /images/:id` - Fetch stored image
- `GET /healthz` - Health check
- `GET /readyz` - Readiness check (browser pool status)

**Core modules:**
- `server/server.ts` - HTTP routes, queue management, graceful shutdown
- `server/render/browserPool.ts` - Puppeteer browser pool with semaphore concurrency
- `server/render/render.ts` - HTML→screenshot with viewport, format, CSS/font injection
- `server/render/requestPolicy.ts` - Request interception, domain allowlist, byte limits
- `server/db/` - SQLite storage for images, renders, API keys

### Web Frontend (`src/`)

Next.js 16 App Router with Convex backend and Better Auth.

**Structure:**
- `src/app/` - Next.js routes (public/protected route groups)
- `src/components/ui/` - shadcn/ui components
- `src/lib/auth-*.ts` - Better Auth client/server setup
- `convex/` - Convex functions, schema, auth config

### Key Environment Variables

**Server:**
- `PORT`, `BASE_URL` - Server binding
- `BROWSER_INSTANCES`, `RENDER_CONCURRENCY` - Pool sizing
- `MAX_QUEUE_LENGTH`, `MAX_ASSET_BYTES` - Request limits
- `API_KEYS` - Format: `key1:client1:rateLimit,key2:client2:rateLimit`
- `DB_PATH` - SQLite path

**Frontend:**
- `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_URL` - Convex endpoints
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
- `bun:sqlite` - SQLite (not better-sqlite3)
- `Bun.file` - File I/O (prefer over node:fs)

## Deployment

Blue-green deployment to VPS. See `deploy.md` for details.

**Requirements for server changes:**
- Must expose `/readyz` endpoint returning 200 when ready
- Must respect `PORT` and `DB_PATH` env vars
- Must have `start` script in `server/package.json`

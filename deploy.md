Deployment Process for api.htmlpix.com                                                                                        
                                                                            
  Server Setup
                                                                                                                                
  - VPS: Ubuntu 25.04, 4 cores, 8GB RAM
  - Runtime: Bun 1.3.8                                                                                                          
  - Process Manager: systemd with blue/green slots
  - Reverse Proxy: Nginx on ports 80/443

  Blue-Green Deployment

  Two identical slots exist at /opt/htmlpix/blue and /opt/htmlpix/green. Only one runs at a time.

  Deploy flow:
  1. Determine which slot is active (blue or green)
  2. Clone/pull code to the inactive slot
  3. Install server deps only: cd server && bun install --frozen-lockfile
  4. Build server bundle: bun build server/server.ts --target=bun --outdir=server/dist
  5. Copy env and set port: blue=3301, green=3302
  6. Start new instance, wait for /readyz to return 200
  7. Update nginx upstream to new port, reload nginx
  8. Stop old instance

  Key Files
  ┌────────────────────────────────────────────┬─────────────────────────────┐
  │                    Path                    │           Purpose           │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ deploy.sh (repo root)                      │ Deployment script           │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /opt/htmlpix/shared/.env                   │ Shared environment config   │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /etc/systemd/system/htmlpix@.service       │ Service template            │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /etc/nginx/sites-available/api.htmlpix.com │ Nginx config                │
  └────────────────────────────────────────────┴─────────────────────────────┘
  Environment Variables

  # Required
  PORT=3301
  BASE_URL=https://api.htmlpix.com
  CONVEX_URL=<convex deployment url>

  # Browser pool
  BROWSER_INSTANCES=1
  RENDER_CONCURRENCY=3

  # Request limits
  MAX_QUEUE_LENGTH=50
  MAX_HTML_LENGTH=500000
  MAX_CSS_LENGTH=200000
  MAX_ASSET_BYTES=10485760

  # Render timing
  DEFAULT_TIMEOUT_MS=5000
  FONT_STABILIZATION_MS=100
  ASSET_WAIT_MS=2000

  # Asset allowlist
  ALLOWED_HOSTS=fonts.googleapis.com,fonts.gstatic.com

  # Cache / storage
  CACHE_PATH=./cache/lmdb
  IMAGE_DIR=./cache/images
  IMAGE_TTL_MS=86400000
  MAX_STORED_IMAGES=1000

  # Upload queue
  UPLOAD_CONCURRENCY=2
  UPLOAD_RETRY_MAX=5
  UPLOAD_RETRY_BASE_MS=500
  UPLOAD_RETRY_MAX_MS=60000

  # Optional
  CORS_ORIGIN=

  Requirements for Code Changes

  1. Must have server/bun.lock - install uses --frozen-lockfile
  2. Must have start script in server/package.json - systemd runs bun run start
  3. Must expose /readyz endpoint - deploy script polls this for health
  4. Must respect PORT env var - server binds to this port
  5. Must set CONVEX_URL env var - required for Convex sync

  Deploy Command

  ssh ubuntu@api.htmlpix.com 'sudo -u deploy /opt/htmlpix/blue/deploy.sh master'

  The script lives in the repo and gets pulled with each deploy.

  Branch

  Default branch is master (not main). Repo: https://github.com/jymaa/htmlpix.git

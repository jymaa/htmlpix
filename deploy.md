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
  3. Build server: bun run build:server
  4. Install server deps only: cd server && bun install --frozen-lockfile
  5. Symlink shared DB: ln -sf /opt/htmlpix/shared/data.db ./server/data.db
  6. Copy env and set port: blue=3301, green=3302
  7. Start new instance, wait for /readyz to return 200
  8. Update nginx upstream to new port, reload nginx
  9. Stop old instance

  Key Files
  ┌────────────────────────────────────────────┬─────────────────────────────┐
  │                    Path                    │           Purpose           │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /opt/htmlpix/deploy.sh                     │ Deployment script           │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /opt/htmlpix/shared/.env                   │ Shared environment config   │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /opt/htmlpix/shared/data.db                │ SQLite database (symlinked) │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /etc/systemd/system/htmlpix@.service       │ Service template            │
  ├────────────────────────────────────────────┼─────────────────────────────┤
  │ /etc/nginx/sites-available/api.htmlpix.com │ Nginx config                │
  └────────────────────────────────────────────┴─────────────────────────────┘
  Environment Variables

  PORT=3301
  BASE_URL=https://api.htmlpix.com
  DB_PATH=./data.db
  BROWSER_INSTANCES=2
  RENDER_CONCURRENCY=4
  MAX_QUEUE_LENGTH=100
  MAX_HTML_LENGTH=500000
  MAX_ASSET_BYTES=10485760
  IMAGE_TTL_MS=3600000
  DEFAULT_TIMEOUT_MS=10000
  API_KEYS=key1:client1:10000,key2:client2:5000
  ALLOWED_HOSTS=fonts.googleapis.com,fonts.gstatic.com

  Requirements for Code Changes

  1. Must have server/bun.lock - install uses --frozen-lockfile
  2. Must have build:server script in root package.json - builds to server/dist/
  3. Must have start script in server/package.json - systemd runs bun run start
  4. Must expose /readyz endpoint - deploy script polls this for health
  5. Must respect PORT env var - server binds to this port
  6. Must handle DB_PATH env var - SQLite path is symlinked

  Deploy Command

  ssh ubuntu@api.htmlpix.com 'sudo -u deploy /opt/htmlpix/deploy.sh master'

  Or if logged in:
  sudo -u deploy deploy   # alias for deploy.sh master

  Branch

  Default branch is master (not main). Repo: https://github.com/jymaa/htmlpix.git
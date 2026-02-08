#!/bin/bash
set -e

REPO="${HTMLPIX_REPO:-https://github.com/jymaa/htmlpix.git}"
BRANCH="${1:-master}"

# Determine active/target slots
if systemctl is-active htmlpix@blue >/dev/null 2>&1; then
    ACTIVE="blue"
    TARGET="green"
    TARGET_PORT="3302"
elif systemctl is-active htmlpix@green >/dev/null 2>&1; then
    ACTIVE="green"
    TARGET="blue"
    TARGET_PORT="3301"
else
    # First deploy — neither running
    ACTIVE=""
    TARGET="blue"
    TARGET_PORT="3301"
fi

echo "Deploying to $TARGET (port $TARGET_PORT)..."
echo "Active slot: ${ACTIVE:-none}"

cd /opt/htmlpix/$TARGET

# Clone/pull
if [ -d ".git" ]; then
    echo "Fetching latest changes..."
    git fetch origin && git reset --hard origin/$BRANCH
else
    echo "Cloning repository..."
    git clone --branch $BRANCH $REPO .
fi

# Install server deps only (puppeteer, lmdb, convex)
echo "Installing server dependencies..."
cd server
/home/deploy/.bun/bin/bun install --frozen-lockfile
cd ..

# Build server bundle (resolves npm deps from server/node_modules)
echo "Building server..."
/home/deploy/.bun/bin/bun build server/server.ts --target=bun --outdir=server/dist --sourcemap

# Copy env and set port
cp /opt/htmlpix/shared/.env ./server/.env
sed -i "s/^PORT=.*/PORT=$TARGET_PORT/" ./server/.env

# Start new instance
echo "Starting $TARGET instance..."
sudo /bin/systemctl restart htmlpix@$TARGET

# Wait for ready
echo "Waiting for readiness..."
for i in {1..30}; do
    if curl -sf http://127.0.0.1:$TARGET_PORT/readyz > /dev/null 2>&1; then
        echo "Instance ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "ERROR: Readiness check timed out. Aborting."
        sudo /bin/systemctl stop htmlpix@$TARGET
        exit 1
    fi
    sleep 1
done

# Switch nginx upstream
echo "Switching traffic to $TARGET..."
sudo /bin/sed -i "s/server 127.0.0.1:33../server 127.0.0.1:$TARGET_PORT/" \
    /etc/nginx/sites-available/api.htmlpix.com
sudo /usr/sbin/nginx -t && sudo /bin/systemctl reload nginx

# Stop old instance (if any)
if [ -n "$ACTIVE" ]; then
    echo "Stopping old instance ($ACTIVE)..."
    sudo /bin/systemctl stop htmlpix@$ACTIVE
fi

echo ""
echo "=========================================="
echo "Deployed to $TARGET (port $TARGET_PORT)"
[ -n "$ACTIVE" ] && echo "Old instance ($ACTIVE) stopped."
echo "=========================================="

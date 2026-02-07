# VPS Security Hardening Plan — api.htmlpix.com

> **Context:** Ubuntu 25.04 VPS, 4 cores / 8GB RAM. Runs a Bun HTTP rendering server (Puppeteer) behind Nginx. Blue-green deployment via systemd (`htmlpix@blue` on port 3301, `htmlpix@green` on port 3302). Frontend is on Vercel (not on this VPS). Convex is the backend database (hosted, not on this VPS).

> **Goal:** Harden this production VPS. Execute each section in order. Verify each step before moving on. Do NOT restart nginx or systemd services until explicitly told to — batch config changes and reload once.

---

## 1. System Updates & Automatic Security Patches

```bash
# Update everything
sudo apt update && sudo apt upgrade -y

# Enable unattended security upgrades
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**Verify:** `cat /etc/apt/apt.conf.d/20auto-upgrades` should show:
```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

Edit `/etc/apt/apt.conf.d/50unattended-upgrades` and ensure these are set:
```
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
```

---

## 2. SSH Hardening

Edit `/etc/ssh/sshd_config`. Set or confirm these values (do NOT just append — find and modify existing lines):

```
Port 22
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding no
PermitEmptyPasswords no
```

If there is an `AllowUsers` or `AllowGroups` directive, ensure `ubuntu` and `deploy` users are included. If not, add:
```
AllowUsers ubuntu deploy
```

**Verify config is valid before restarting:**
```bash
sudo sshd -t
```

Only if valid:
```bash
sudo systemctl restart sshd
```

**IMPORTANT:** Keep your current SSH session open. Open a NEW terminal and test SSH login before closing the old session. If locked out, use VPS provider console.

---

## 3. Firewall (UFW)

```bash
sudo apt install -y ufw

# Default deny incoming, allow outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS (nginx)
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Do NOT allow 3301/3302 — these are internal only (nginx proxies to them)

# Enable
sudo ufw --force enable
sudo ufw status verbose
```

**Verify:** `sudo ufw status` shows only ports 22, 80, 443 allowed. Ports 3301/3302 should NOT be listed.

**Test:** From your local machine, confirm `curl https://api.htmlpix.com/healthz` still works, and `curl http://<vps-ip>:3301/healthz` is refused.

---

## 4. Fail2Ban

```bash
sudo apt install -y fail2ban
```

Create `/etc/fail2ban/jail.local`:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 7200
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**Verify:** `sudo fail2ban-client status sshd` shows the jail is active.

---

## 5. User & Permission Hardening

### 5a. Verify the `deploy` user

```bash
# deploy user should exist and NOT have a password
sudo passwd -S deploy
# Should show "L" (locked) — no password login possible

# deploy user should NOT have sudo without restriction
# Check sudoers
sudo grep -r deploy /etc/sudoers /etc/sudoers.d/
```

The `deploy` user should only be able to run specific commands via sudo. If it currently has unrestricted sudo, create `/etc/sudoers.d/deploy`:
```
deploy ALL=(ALL) NOPASSWD: /bin/systemctl start htmlpix@*, /bin/systemctl stop htmlpix@*, /bin/systemctl restart htmlpix@*, /bin/systemctl reload nginx, /usr/sbin/nginx -t
```

And remove any broader sudo access for `deploy`.

### 5b. File permissions

```bash
# Env file should only be readable by deploy user
sudo chown deploy:deploy /opt/htmlpix/shared/.env
sudo chmod 600 /opt/htmlpix/shared/.env

# Deployment directories
sudo chown -R deploy:deploy /opt/htmlpix/blue /opt/htmlpix/green /opt/htmlpix/shared
sudo chmod 750 /opt/htmlpix/blue /opt/htmlpix/green

# Cache directories
sudo chmod 700 /opt/htmlpix/blue/cache /opt/htmlpix/green/cache 2>/dev/null || true
```

**Verify:** `ls -la /opt/htmlpix/shared/.env` shows `-rw------- deploy deploy`.

---

## 6. Nginx Hardening

Edit `/etc/nginx/sites-available/api.htmlpix.com`. Apply these changes:

### 6a. Security headers

Inside the `server` block for HTTPS (port 443), add:
```nginx
# Security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 6b. Rate limiting

In the `http` block (in `/etc/nginx/nginx.conf` or the site config, wherever appropriate):
```nginx
# Rate limit zones
limit_req_zone $binary_remote_addr zone=render_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;
```

In the site's `server` block, apply to the render endpoint:
```nginx
location = /render {
    limit_req zone=render_limit burst=20 nodelay;
    limit_req_status 429;
    proxy_pass http://htmlpix_upstream;
    # ... existing proxy settings ...
}

location / {
    limit_req zone=general_limit burst=50 nodelay;
    proxy_pass http://htmlpix_upstream;
    # ... existing proxy settings ...
}
```

### 6c. Request size limits

```nginx
# In the server block
client_max_body_size 2m;    # Max request body (HTML + CSS payloads)
client_body_timeout 10s;
client_header_timeout 10s;
send_timeout 30s;

# Hide server version
server_tokens off;
```

### 6d. Block direct IP access

Add a default server block that rejects requests not using the domain name:
```nginx
server {
    listen 80 default_server;
    listen 443 default_server ssl;
    server_name _;

    # Use the same SSL cert or a self-signed one
    ssl_certificate /path/to/cert;       # adjust path
    ssl_certificate_key /path/to/key;    # adjust path

    return 444;
}
```

### 6e. SSL configuration

Ensure these are set (may already exist if using certbot):
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;
```

**Validate and reload:**
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Systemd Service Hardening

Edit `/etc/systemd/system/htmlpix@.service`. Add these security directives under `[Service]`:

```ini
[Service]
# Existing directives...
User=deploy
Group=deploy

# Filesystem isolation
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/opt/htmlpix/%i/cache
PrivateTmp=true
NoNewPrivileges=true

# Network: only allow what's needed
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX AF_NETLINK

# System call filtering (allow Puppeteer/Chromium to work)
# Note: Puppeteer needs clone, mount for sandboxing — use a permissive filter
SystemCallFilter=~@reboot @swap @obsolete

# Resource limits
MemoryMax=6G
TasksMax=512

# Restart policy
Restart=on-failure
RestartSec=5
```

**IMPORTANT:** After editing, test that the service still starts correctly:
```bash
sudo systemctl daemon-reload
# Restart whichever slot is currently active — check which one first:
sudo systemctl status htmlpix@blue htmlpix@green
# Then restart the active one and verify /readyz
```

If the service fails to start after these changes, the most likely culprits are `ProtectSystem=strict` or `SystemCallFilter`. Remove those first and try again.

---

## 8. Puppeteer / Chromium Hardening

The app currently runs Puppeteer with `--no-sandbox`. This is a known concern. To mitigate:

### 8a. Ensure Chromium runs as unprivileged user

Since the systemd service already runs as `deploy` (not root), Chromium inherits this. Verify:
```bash
# While the service is running:
ps aux | grep chrom | grep -v grep
# Should show "deploy" as the user, NOT root
```

### 8b. Restrict Chromium's network access (optional, advanced)

If you want defense-in-depth, create a systemd override that uses network namespacing to only allow Chromium to reach the allowlisted domains. This is complex and may break things — skip if unsure.

### 8c. Tmpfs for Chromium

Chromium uses shared memory. Ensure `/dev/shm` has adequate space:
```bash
df -h /dev/shm
# Should show several hundred MB minimum. If it's tiny:
# sudo mount -o remount,size=512M /dev/shm
```

---

## 9. Secrets Audit

### 9a. Verify .env file contents

```bash
sudo -u deploy cat /opt/htmlpix/shared/.env
```

Check that:
- `SERVER_SECRET` is a strong random value (32+ chars)
- `CONVEX_URL` points to the correct Convex deployment
- `CORS_ORIGIN` is empty or set to a specific origin (NOT `*`)
- No development-only variables are present
- No credentials are duplicated or stale

### 9b. Rotate SERVER_SECRET if it has never been rotated

Generate a new one:
```bash
openssl rand -hex 32
```

Update it in `/opt/htmlpix/shared/.env` AND in Convex environment variables (via Convex dashboard). Then restart the active service slot.

---

## 10. Logging & Monitoring

### 10a. Centralized journald logging

The systemd service already logs to journald. Ensure log persistence:
```bash
sudo mkdir -p /var/log/journal
sudo systemd-tmpfiles --create --prefix /var/log/journal
sudo systemctl restart systemd-journald
```

Set retention in `/etc/systemd/journald.conf`:
```ini
[Journal]
Storage=persistent
SystemMaxUse=1G
MaxRetentionSec=30day
```

```bash
sudo systemctl restart systemd-journald
```

### 10b. Nginx access/error logs

Ensure nginx logs exist and rotate:
```bash
ls -la /var/log/nginx/
# Should have access.log and error.log

# Check logrotate config exists
cat /etc/logrotate.d/nginx
```

If logrotate config is missing, create `/etc/logrotate.d/nginx`:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

---

## 11. Kernel & Network Hardening

Create `/etc/sysctl.d/99-security.conf`:
```ini
# Prevent IP spoofing
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore source-routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# SYN flood protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2

# Log suspicious packets
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# Disable IPv6 if not needed (uncomment if you don't use IPv6)
# net.ipv6.conf.all.disable_ipv6 = 1
# net.ipv6.conf.default.disable_ipv6 = 1

# Prevent SUID binaries from dumping core
fs.suid_dumpable = 0
```

Apply:
```bash
sudo sysctl -p /etc/sysctl.d/99-security.conf
```

---

## 12. Remove Unnecessary Services

```bash
# List listening ports
sudo ss -tlnp

# The only things that should be listening:
#   - :22    sshd
#   - :80    nginx
#   - :443   nginx
#   - :3301 or :3302  htmlpix (bound to 127.0.0.1 or 0.0.0.0 — see below)
#
# If anything else is listening, investigate and disable/remove it.
```

**Check if htmlpix binds to all interfaces or just localhost.** If it binds to `0.0.0.0`, the firewall (step 3) already blocks external access to 3301/3302. But for defense-in-depth, the app should ideally bind to `127.0.0.1`. Check the server config:
- If `Bun.serve()` uses `hostname: "0.0.0.0"`, consider changing to `hostname: "127.0.0.1"` since nginx proxies all traffic. This is an application code change — flag it for the developer rather than changing it on the VPS.

---

## Final Verification Checklist

Run these commands and verify the expected output:

| Check | Command | Expected |
|-------|---------|----------|
| Firewall active | `sudo ufw status` | Active, only 22/80/443 |
| SSH hardened | `sudo sshd -t` | No errors |
| Fail2ban running | `sudo fail2ban-client status` | sshd jail active |
| Nginx headers | `curl -I https://api.htmlpix.com/healthz` | Security headers present |
| HSTS header | `curl -I https://api.htmlpix.com/healthz \| grep Strict` | max-age=31536000 |
| Rate limiting | Send 50 rapid requests to /render | 429 responses after burst |
| .env permissions | `ls -la /opt/htmlpix/shared/.env` | `-rw------- deploy deploy` |
| No root processes | `ps aux \| grep htmlpix` | Running as `deploy` |
| Chromium not root | `ps aux \| grep chrom` | Running as `deploy` |
| Sysctl applied | `sysctl net.ipv4.tcp_syncookies` | = 1 |
| Journald persistent | `ls /var/log/journal/` | Directory exists with logs |
| Auto-updates | `systemctl status unattended-upgrades` | Active |
| Listening ports | `sudo ss -tlnp` | Only 22, 80, 443, 330x |
| App healthy | `curl https://api.htmlpix.com/readyz` | 200 OK |

---

## Summary of Changes

| Layer | What | Why |
|-------|------|-----|
| OS | Auto security updates | Patch vulns automatically |
| SSH | Key-only, no root, max 3 tries | Prevent brute force |
| Firewall | UFW deny all, allow 22/80/443 | Minimize attack surface |
| Fail2Ban | SSH jail, 3 strikes = 2hr ban | Block brute force IPs |
| Users | Scoped sudo for deploy, locked password | Least privilege |
| Permissions | .env 600, dirs 750 | Protect secrets |
| Nginx | Security headers, rate limiting, HSTS | Defense-in-depth |
| Nginx | Hide version, block IP access, TLS 1.2+ | Reduce info leakage |
| Nginx | Request size + timeout limits | Prevent abuse |
| Systemd | ProtectHome, ProtectSystem, NoNewPrivileges | Sandbox the service |
| Systemd | Memory/task limits | Prevent resource exhaustion |
| Kernel | Sysctl hardening | Network-level protection |
| Logging | Persistent journald, log rotation | Audit trail |
| Monitoring | Health check cron | Downtime detection |

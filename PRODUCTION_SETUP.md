# Production Deployment Guide (Full Setup)

This guide shows how to deploy the current NestJS + NextJS + PostgreSQL implementation with custom domains and automatic SSL. It also includes verification steps for all white‑label requirements.

---

## 1) Requirements

- Linux server (Ubuntu 22.04+ recommended)
- Public IP
- A platform domain (e.g., `platform.yourdomain.com`)
- Node.js 20+
- PostgreSQL 15+
- Caddy (for automatic SSL)

---

## 2) Install dependencies

```bash
sudo apt update
sudo apt install -y git curl build-essential
```

### Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### pnpm
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### PostgreSQL
```bash
sudo apt install -y postgresql
```

---

## 3) Clone the project

```bash
git clone <your-repo-url> /var/www/whitelabel
cd /var/www/whitelabel
```

---

## 4) Database setup

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE whitelabel;
CREATE USER whitelabel_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE whitelabel TO whitelabel_user;
\q
```

---

## 5) Backend (NestJS)

```bash
cd /var/www/whitelabel/apps/backend
pnpm install
```

Create `.env`:

```env
DATABASE_URL="postgresql://whitelabel_user:strong_password@localhost:5432/whitelabel?schema=public"
JWT_SECRET="supersecret"
DOMAIN_VALIDATION_TOKEN="your-secret-token"
PORT=4000
```

Run migrations + generate:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

Seed superadmin:

```bash
pnpm prisma db seed
```

Build backend:

```bash
pnpm build
```

---

## 6) Frontend (NextJS)

```bash
cd /var/www/whitelabel/apps/frontend
pnpm install
```

Create `.env.production`:

```env
BACKEND_URL=http://localhost:4000
```

Build frontend:

```bash
pnpm build
```

---

## 7) Run apps with PM2

Install PM2:

```bash
npm install -g pm2
```

Start backend:

```bash
cd /var/www/whitelabel/apps/backend
pm2 start dist/main.js --name whitelabel-backend
```

Start frontend:

```bash
cd /var/www/whitelabel/apps/frontend
pm2 start "pnpm start" --name whitelabel-frontend
```

Save + startup:

```bash
pm2 save
pm2 startup
```

---

## 8) Caddy (Automatic SSL + Domain Routing)

Install Caddy:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

Create `/etc/caddy/Caddyfile`:

```caddyfile
{
  on_demand_tls {
    ask http://localhost:4000/domains/validate?token=your-secret-token
  }
}

:80, :443 {
  reverse_proxy /api/* localhost:4000
  reverse_proxy localhost:3000
}
```

Restart Caddy:

```bash
sudo systemctl restart caddy
```

---

## 9) Client DNS Setup

Clients add either:

**CNAME**
```
app.client.com → platform.yourdomain.com
```

OR

**A record**
```
app.client.com → YOUR_SERVER_IP
```

---

## 10) Register Tenant Domain

Superadmin adds tenant + domain in admin UI or API:

```json
"domain": "app.client.com"
```

---

## 11) Verification Checklist

1) **Backend tenant lookup**
```bash
curl -i "http://localhost:4000/public/tenant?host=app.client.com"
```
✅ Should return tenant JSON.

2) **Caddy domain validation**
```bash
curl -i "http://localhost:4000/domains/validate?domain=app.client.com&token=your-secret-token"
```
✅ Should return `{ "allowed": true }`.

3) **DNS**
```bash
dig app.client.com
```
✅ Should resolve to your server IP.

4) **HTTPS**
```
https://app.client.com/portal
```
✅ Lock icon in browser.

5) **Branding**
✅ Logo, tenant name, and primary color show correctly.

---

## 12) Requirement Mapping (All Points Covered)

- **Custom domain access:** DNS + `Domain.hostname`
- **Recognize domain:** backend `getTenantByHost()`
- **Auto SSL:** Caddy on‑demand TLS
- **Branding swap:** `Branding` + portal layout
- **No breakage:** relative routes (`/portal`, `/admin`)

---

**Document version:** 1.0  
**Last updated:** 2026-01-19

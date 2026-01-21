# White‑Label Domain Platform – Production Documentation

This document describes the production design and operational flow for the white‑label domain system implemented in this project. It includes system behavior, domain/SSL flow, branding, tenant routing, and the required steps clients must follow to configure their domains.

---

## 1) Purpose

The platform allows each client (tenant) to access the service through their own domain while masking the original platform domain. When a user visits a tenant’s domain, the platform responds with that tenant’s branding (logo, name, colors, support details) and fully functional navigation.

---

## 2) Key Requirements and How They Are Met

### A) Custom Domain Access
Each tenant is associated with a custom domain in the database. When a user visits that domain, the platform recognizes it and serves tenant‑specific content.

**How it works**
- The tenant domain is stored in the `Domain` table (unique per tenant).
- The application reads the HTTP `Host` header from incoming requests.
- The tenant is resolved by matching the Host header to a stored domain.

### B) DNS (CNAME / A record)
Clients point their domain to the platform using DNS records.

**Supported records**
1. **CNAME** (recommended)  
   Points the client’s subdomain to the platform domain.
2. **A record**  
   Points the client’s subdomain directly to the server IP.

### C) Automatic SSL Certificates
SSL certificates are issued automatically for each client domain.  

**How it works**
- The reverse proxy terminates HTTPS and automatically requests certificates for valid tenant domains.
- The platform exposes a domain validation endpoint that ensures only registered domains receive certificates.

### D) Branding Replacement
All branding is tenant‑specific and stored in the database.

**Branding includes**
- Tenant name (display name)
- Logo (uploaded file)
- Primary color
- Support email

**How it works**
- The portal layout fetches tenant data using the Host header.
- The UI renders tenant branding (logo, name, color, support details).

### E) Navigation Consistency
Navigation works on every tenant domain without broken links.

**How it works**
- The frontend uses relative routes (e.g., `/portal`, `/admin/login`).
- This keeps URLs domain‑agnostic and consistent across tenant domains.

---

## 3) System Components

### Backend (NestJS)
Responsibilities:
- Tenant and domain management
- Domain validation for SSL issuance
- Branding storage and retrieval

Core behaviors:
- Resolve tenant by Host header
- Ensure domain uniqueness
- Provide public tenant metadata for the portal

### Frontend (NextJS)
Responsibilities:
- Render tenant portal
- Render admin interface
- Apply tenant branding dynamically

Core behaviors:
- Reads Host header
- Requests tenant data from backend
- Renders portal with branding

### Database (PostgreSQL + Prisma)
Core tables:
- **Tenant**: tenant identity and timestamps
- **Domain**: maps tenant → domain
- **Branding**: logo, primary color, app name, support email

---

## 4) Tenant Lifecycle (Production)

### Step 1 — Create Tenant (Admin)
- Superadmin creates a tenant in the admin UI.
- Tenant includes:
  - Name
  - Domain (unique)
  - Branding (logo, name, colors, support email)

### Step 2 — Domain Becomes Active
- The tenant domain is stored in the `Domain` table.
- SSL is allowed for that domain.
- The tenant portal is available at:
  ```
  https://<tenant-domain>/portal
  ```

---

## 5) Client Domain Setup (Mandatory)

Clients must follow these steps to connect their domain.

### Step 1 — Choose a Domain
- Recommended: a subdomain (e.g., `app.client.com`)
- Avoid using the root domain.

### Step 2 — DNS Configuration
Clients configure DNS at their domain provider.

**Option A — CNAME (Recommended)**
- Host: `app`
- Target: `<platform-domain>`

**Option B — A Record**
- Host: `app`
- Value: `<platform-server-ip>`

### Step 3 — Wait for DNS Propagation
- Typical delay: 5 minutes to 24 hours.
- Clients can verify with DNS lookup tools.

### Step 4 — Confirm Activation
- Once DNS resolves and SSL is issued, the client opens:
  ```
  https://app.client.com/portal
  ```

---

## 6) SSL Behavior (Automatic)

SSL certificates are issued automatically only for domains that exist in the database.

**Behavior**
- If domain exists → certificate is issued
- If domain does not exist → certificate is denied

This protects against unauthorized SSL issuance.

---

## 7) Verification Checklist (Production)

Use this checklist to verify a tenant domain is working:

1. Domain exists in the `Domain` table
2. DNS points to the platform
3. SSL certificate is active (lock icon)
4. Portal renders correct tenant branding
5. Navigation works (no broken links)

---

## 8) Common Issues and Fixes

**Issue:** Domain resolves but shows default branding  
**Cause:** Domain not registered in DB  
**Fix:** Add tenant domain in admin panel

**Issue:** SSL not issued  
**Cause:** DNS not propagated or domain not registered  
**Fix:** Wait for DNS; confirm domain exists in DB

**Issue:** 404 / Not Found  
**Cause:** Incorrect domain or route  
**Fix:** Use `/portal` route and correct domain

---

## 9) Security Notes

- Only the superadmin can add tenants.
- Domain uniqueness is enforced.
- SSL issuance is restricted to registered domains.

---

## 10) Summary

The platform supports production‑ready white‑label domains with:
- Custom domains per tenant
- Automatic SSL
- Per‑tenant branding
- Consistent navigation across domains

This satisfies all requirements listed in the project scope.

---

**Document version:** 1.0  
**Last updated:** 2026‑01‑19

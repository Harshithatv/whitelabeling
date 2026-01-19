# Client Custom Domain Setup Guide

This document explains how clients can connect their own domains to the platform and what to expect during setup. It is written for non‑technical and technical teams.

---

## 1) Overview

When you connect your custom domain (for example, `app.yourcompany.com`) to our platform:

- Your users see your **logo**, **name**, and **branding**.
- The URL shows **your domain** (not ours).
- SSL (HTTPS) is configured **automatically**.

---

## 2) Choose Your Domain

Pick the subdomain you want to use:

Examples:
- `app.yourcompany.com`
- `portal.yourcompany.com`
- `login.yourcompany.com`

We recommend a **subdomain** rather than the root domain.

---

## 3) Add DNS Records

You must point your domain to our platform.  

### Option A — CNAME (Recommended)

Add a **CNAME** record in your DNS provider:

| Record Type | Host/Name | Value/Target |
|-------------|-----------|--------------|
| CNAME       | `app`     | `platform.yourdomain.com` |

Example: `app.yourcompany.com` → `platform.yourdomain.com`

---

### Option B — A Record
If you prefer using a server IP:

| Record Type | Host/Name | Value/Target |
|-------------|-----------|--------------|
| A           | `app`     | `YOUR_SERVER_IP` |

Example: `app.yourcompany.com` → `123.45.67.89`

---

## 4) Wait for DNS Propagation

DNS changes can take **5 minutes to 24 hours**.

You can verify using:

```bash
nslookup app.yourcompany.com
```

or

```bash
dig app.yourcompany.com
```

---

## 5) Notify Us
After DNS is configured, send us the domain name so we can link it to your tenant:

```
app.yourcompany.com
```

We will add it to your tenant configuration and activate branding.

---

## 6) SSL (HTTPS) is Automatic

We automatically issue and renew SSL certificates for your domain.

- No action required on your side.
- HTTPS will be active after DNS is validated.

---

## 7) Verify Your Portal
Once active, open:

```
https://app.yourcompany.com
```

You should see:
- Your logo
- Your brand name
- Your colors
- Your support email

---

## 8) Common Issues & Fixes

**1) Domain does not resolve**
- DNS record is missing or incorrect
- Wait for propagation
- Verify with `nslookup` or `dig`

**2) SSL warning**
- Wait 10–30 minutes (certificate issuance delay)
- Ensure DNS points to us

**3) Branding looks wrong**
- Ensure you gave us the correct domain
- Confirm branding details were submitted

---

## 9) Required Branding Info (Send to Us)

Please provide:
- Company name
- App/portal name
- Primary color (hex)
- Support email
- Logo file (PNG/JPG)

---

## 10) Support
For any questions, contact:

- Email: `support@yourcompany.com`
- Phone: `+XX-XXXX-XXXX`

---

## Appendix: Example DNS Records

| Domain | Type | Name | Value |
|--------|------|------|-------|
| app.client.com | CNAME | app | platform.yourdomain.com |
| app.client.com | A | app | 123.45.67.89 |

---

**Document version:** 1.0  
**Last updated:** 2026-01-19

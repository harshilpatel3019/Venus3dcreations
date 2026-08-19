# Venus 3D Creations

Sculptural, 3D-printed lamps and home objects. E-commerce site built with React, FastAPI, and MongoDB. Payments via Razorpay. Order emails via Gmail SMTP. Shipping via Shiprocket.

Live site: https://venus3dcreations.com

---

## Stack

- **Frontend**: React 19 (Create React App), TailwindCSS, shadcn/ui, React Router
- **Backend**: FastAPI (Python 3.11+), Motor (async MongoDB), Razorpay SDK, JWT auth (bcrypt)
- **Database**: MongoDB
- **Payments**: Razorpay (India, INR)
- **Shipping**: Shiprocket
- **Emails**: Gmail SMTP (App Password)
- **Product images**: Local filesystem (`backend/static/products/`) served via FastAPI static

---

## Repo Layout

```
backend/                   # FastAPI backend
├─ server.py               # main app + all API routes
├─ models.py               # Pydantic models
├─ auth.py                 # JWT + bcrypt helpers
├─ seed.py                 # idempotent product seeding + migration
├─ email_service.py        # Gmail SMTP order emails
├─ shiprocket.py           # Shiprocket shipping integration
├─ static/products/        # product photos (served at /api/static/products/*)
├─ requirements.txt
└─ .env.example            # copy to .env and fill in
frontend/                  # React frontend
├─ src/
│  ├─ pages/               # route pages (incl. admin/ and policies/)
│  ├─ components/          # shared components
│  ├─ context/             # Cart + Auth React contexts
│  ├─ api.js               # axios client + helpers
│  ├─ analytics.js         # GA4
│  └─ mock.js              # static content (categories, testimonials)
├─ package.json
└─ .env.example            # copy to .env and fill in
render.yaml                # Render blueprint for the backend
```

---

## Local Development Setup

### 1. Prerequisites

- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # fill in MONGO_URL, JWT_SECRET, Razorpay keys, etc.
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

On first startup the seed script creates 9 lamp products and an admin user
(`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the environment).

### 3. Frontend

```bash
cd frontend
yarn install
cp .env.example .env    # REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

App opens at http://localhost:3000.

---

## Production Deployment (free tiers)

The app splits across three services:

| Part | Service | Free tier |
|---|---|---|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | M0, 512 MB |
| Backend | [Render](https://render.com) | Web service (sleeps when idle) |
| Frontend | [Vercel](https://vercel.com) / Netlify, or any static host (incl. cPanel shared hosting) | — |

### 1. MongoDB Atlas

1. Create a free M0 cluster (AWS Mumbai `ap-south-1` is closest to customers in India).
2. Database Access → add a user with a password.
3. Network Access → allow `0.0.0.0/0` (Render's outbound IPs vary).
4. Connect → Drivers → copy the connection string; replace `<password>`. This is `MONGO_URL`.

### 2. Render (backend)

This repo contains a `render.yaml` blueprint. In Render: **New → Blueprint**, connect
this GitHub repo, and it creates the `venus-api` **Python** service with the right build
and start commands. Fill in the secret env vars it prompts for (`MONGO_URL`,
`ADMIN_PASSWORD`, Razorpay keys, Gmail app password, Shiprocket credentials).

> Do **not** create this as a plain Web Service — Render then auto-detects the repo as
> Node.js and builds the frontend instead of the backend. Use New → Blueprint.

On first boot the seed script populates the fresh database automatically.
Verify: `https://<your-service>.onrender.com/api/products` returns 9 products.

Free Render services sleep after ~15 min idle; the first request after that takes
~30–60 s. Admin-panel image uploads land on ephemeral disk and are lost on redeploy
(the 9 seeded products' photos live in the repo and are safe).

### 3. Frontend

Set `REACT_APP_BACKEND_URL` to the Render URL (no trailing slash), then either:

**Vercel/Netlify** — import the repo, **Root Directory = `frontend`**, framework
auto-detects as CRA, add the env var, deploy. `frontend/vercel.json` already handles
the SPA rewrite so deep links like `/product/wavy-lamp` work.

**cPanel shared hosting (e.g. Namecheap)** — build locally and upload:

```bash
cd frontend
REACT_APP_BACKEND_URL=https://<your-service>.onrender.com yarn build
```

Upload the **contents** of `frontend/build/` into `public_html/`, and make sure
`public_html/.htaccess` contains the SPA rewrite (`frontend/htaccess-spa.conf` in this
repo is a ready-made copy):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Then enable SSL in cPanel (SSL/TLS Status → Run AutoSSL).

### 4. DNS

Point the domain at whichever frontend host you chose:

| Host | Record | Host | Value |
|---|---|---|---|
| Vercel | A | `@` | `76.76.21.21` |
| Vercel | CNAME | `www` | `cname.vercel-dns.com.` |
| cPanel | A | `@` | your hosting server's shared IP (cPanel sidebar) |

Delete the old Emergent records (the `@` A records pointing at Emergent, and the
`emergent` CNAME) only once the new site serves correctly.

### 5. Go-live checklist

- [ ] `ADMIN_PASSWORD` set before first boot (never ship the seeded default)
- [ ] `JWT_SECRET` set to a long random value (render.yaml auto-generates one)
- [ ] Swap Razorpay test keys (`rzp_test_…`) for live keys
- [ ] `CORS_ORIGINS` matches your real domain(s)
- [ ] Logo saved at `frontend/public/logo.webp` and `LOGO_URL` in `mock.js` set to `/logo.webp`
- [ ] Test a real order end-to-end

---

## Admin

- Login: `/login`, then navigate to `/admin` (only role=admin can access)
- Credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` at first seed
- Admin can: manage products (CRUD + image upload), view/update order status, see revenue stats

---

## Payments (Razorpay)

Checkout flow:
1. Client sends cart + address to `POST /api/orders`
2. Backend recomputes totals from DB (never trusts client prices), creates a Razorpay order, returns `razorpay_order_id`
3. Frontend opens Razorpay checkout modal with that order id
4. On success, frontend calls `POST /api/orders/verify` with the signature
5. Backend verifies signature with `HMAC-SHA256(razorpay_order_id|razorpay_payment_id, key_secret)` and marks order paid
6. Order confirmation emails go out (customer + admin)

**Never call `verify` client-side.** Always verify signature on the backend.

---

## Emails

Order confirmation + admin notification via Gmail SMTP (port 465, SSL). Requires:
1. 2-Step Verification on the Gmail account
2. An App Password (16 chars) generated at https://myaccount.google.com/apppasswords

If `GMAIL_APP_PASSWORD` is blank, emails are silently skipped (orders still work).

---

## License

Proprietary. © Venus 3D Creations.

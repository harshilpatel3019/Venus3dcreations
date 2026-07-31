# Venus 3D Creations

E-commerce site for 3D-printed lamps and decor. React frontend, FastAPI backend,
MongoDB, Razorpay payments (INR), JWT auth, admin panel at `/admin`.

```
frontend/   React (CRA + craco), Tailwind, shadcn/ui
backend/    FastAPI, Motor (async MongoDB), Razorpay, Gmail SMTP
```

## Run locally

Backend (Python 3.11+, MongoDB running locally or an Atlas URL):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # fill in values
uvicorn server:app --reload --port 8001
```

Frontend (Node 18+):

```bash
cd frontend
yarn install
cp .env.example .env    # REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

On first startup the backend seeds 9 products and an admin user
(`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the environment).

## Deploying on free hosting

The app splits across three free services:

| Part | Service | Free tier |
|---|---|---|
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | M0, 512 MB |
| Backend | [Render](https://render.com) | Web service (sleeps when idle) |
| Frontend | [Vercel](https://vercel.com) | Hobby |

### 1. MongoDB Atlas

1. Create a free M0 cluster.
2. Database Access → add a user with a password.
3. Network Access → allow `0.0.0.0/0` (Render's outbound IPs vary).
4. Copy the connection string — this is `MONGO_URL`.

### 2. Render (backend)

This repo contains a `render.yaml` blueprint. In Render: **New → Blueprint**,
connect this GitHub repo, and it will create the `venus-api` service. Fill in
the secret env vars it asks for (`MONGO_URL`, `ADMIN_PASSWORD`,
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `GMAIL_APP_PASSWORD`).

On first boot the seed script populates the fresh database automatically.
Verify: `https://<your-service>.onrender.com/api/products` returns 9 products.

Note: free Render services sleep after ~15 min idle; the first request after
that takes ~30–60 s. Admin-panel image uploads land on ephemeral disk and are
lost on redeploy (the 9 seeded products' photos live in the repo and are safe).

### 3. Vercel (frontend)

1. **Before this step**: save the site logo into the repo. Download it from
   the URL in `frontend/src/mock.js` (open it in a browser while the Emergent
   site is still up), save as `frontend/public/logo.webp`, and change
   `LOGO_URL` in `frontend/src/mock.js` to `"/logo.webp"`. Commit and push.
2. In Vercel: **Add New → Project**, import this repo,
   set **Root Directory = `frontend`** (framework auto-detects as CRA).
3. Env var: `REACT_APP_BACKEND_URL` = your Render URL (no trailing slash).
4. Deploy, then add your domain under **Settings → Domains**
   (`venus3dcreations.com` and `www.venus3dcreations.com`).

`frontend/vercel.json` already handles the SPA rewrite so deep links like
`/product/wavy-lamp` work.

### 4. DNS (at your registrar)

Replace the Emergent-era records:

| Action | Type | Host | Value |
|---|---|---|---|
| Replace both `@` A records with | A | `@` | `76.76.21.21` (Vercel) |
| Change | CNAME | `www` | `cname.vercel-dns.com.` |
| Delete | CNAME | `emergent` | (points to Emergent's preview) |

Vercel's Domains page shows the same values and verifies them live. DNS
changes take minutes to a few hours. Only cancel Emergent after the domain
serves the new site and the logo file is committed (step 3.1).

### 5. Go-live checklist

- [ ] Change the admin password (or set `ADMIN_PASSWORD` before first boot)
- [ ] `JWT_SECRET` set to a long random value (render.yaml auto-generates one)
- [ ] Swap Razorpay test keys (`rzp_test_…`) for live keys
- [ ] `CORS_ORIGINS` matches your real domain(s)
- [ ] Logo committed at `frontend/public/logo.webp`
- [ ] Test a real order end-to-end

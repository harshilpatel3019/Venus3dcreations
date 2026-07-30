# Venus 3D Creations

Sculptural, 3D-printed lamps and home objects. E-commerce site built with React, FastAPI, and MongoDB. Payments via Razorpay. Order emails via Gmail SMTP.

Live site: https://venus3dcreations.com

---

## Stack

- **Frontend**: React 19 (Create React App), TailwindCSS, shadcn/ui, React Router
- **Backend**: FastAPI (Python 3.11+), Motor (async MongoDB), Razorpay SDK, JWT auth (bcrypt)
- **Database**: MongoDB
- **Payments**: Razorpay (India, INR)
- **Emails**: Gmail SMTP (App Password)
- **Product images**: Local filesystem (`backend/static/products/`) served via FastAPI static

---

## Repo Layout

```
app/
├─ backend/                   # FastAPI backend
│  ├─ server.py               # main app + all API routes
│  ├─ models.py               # Pydantic models
│  ├─ auth.py                 # JWT + bcrypt helpers
│  ├─ seed.py                 # idempotent product seeding + migration
│  ├─ email_service.py        # Gmail SMTP order emails
│  ├─ static/products/        # product photos (served at /api/static/products/*)
│  ├─ requirements.txt
│  └─ .env.example            # copy to .env and fill in
└─ frontend/                  # React frontend
   ├─ src/
   │  ├─ pages/                # route pages
   │  ├─ components/           # shared components
   │  ├─ context/              # Cart + Auth React contexts
   │  ├─ api.js                # axios client + helpers
   │  └─ mock.js               # static content (categories, testimonials)
   ├─ package.json
   └─ .env.example             # copy to .env and fill in
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
cp .env.example .env
# Edit .env: fill in MONGO_URL, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
# GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL, FRONTEND_URL

pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

On first startup, the seed script automatically creates 9 lamp products and an admin user (`venus3dcreations@gmail.com` / `venus@admin2025`). Change the admin password from the admin UI once you're up.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: set REACT_APP_BACKEND_URL to your backend URL (e.g. http://localhost:8001)
# and REACT_APP_RAZORPAY_KEY_ID to match your backend's RAZORPAY_KEY_ID

yarn install
yarn start
```

App opens at http://localhost:3000.

---

## Production Deployment

Works on any host that supports Node + Python + MongoDB. Common options:

- **VPS** (DigitalOcean, Hetzner, AWS EC2): install Node, Python, MongoDB, run backend under `systemd` or `pm2`, build frontend with `yarn build`, serve static build with nginx.
- **Managed platforms**: Deploy backend to Railway / Render / Fly.io, frontend to Vercel / Netlify, DB to MongoDB Atlas.

### Nginx reverse-proxy example

```nginx
server {
  server_name yourdomain.com;

  # Frontend static
  root /var/www/venus/frontend/build;
  index index.html;
  location / {
    try_files $uri /index.html;
  }

  # Backend API (all /api/* routes)
  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    client_max_body_size 20M;
  }
}
```

### Environment variables checklist for production

- `MONGO_URL` → production MongoDB URI (MongoDB Atlas recommended)
- `JWT_SECRET` → a fresh, unique random string (do NOT reuse from dev)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` → **live** keys (`rzp_live_*`)
- `FRONTEND_URL` → `https://venus3dcreations.com`
- `REACT_APP_BACKEND_URL` → `https://venus3dcreations.com` (same domain, /api/ is proxied)
- `REACT_APP_RAZORPAY_KEY_ID` → same live key id

---

## Admin

- Login: `/login`, then navigate to `/admin` (only role=admin can access)
- Default seeded credentials: `venus3dcreations@gmail.com` / `venus@admin2025`
- **Change the default password from the admin UI** on first login
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

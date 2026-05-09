<div align="center">

# Urban Mitra

**One reliable person, not five apps.**

A subscription-based home-services platform where one trusted, background-verified helper handles cleaning, cooking, laundry, pet walks and grocery runs — under one monthly plan, managed inside one calm app.

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?style=flat-square)](https://urban-mitra.onrender.com/api/health)
[![Database](https://img.shields.io/badge/Database-Aiven_MySQL-orange?style=flat-square)](https://aiven.io)
[![Stack](https://img.shields.io/badge/Stack-React_·_Express_·_MySQL-c8533a?style=flat-square)]()

</div>

---

## The product, in 30 seconds

Urban households — especially working couples and elderly parents — juggle multiple unreliable apps for daily chores. Urban Mitra collapses all of that into **one verified helper, one subscription, one app**.

- **Customers** pick a plan, book time slots, track tasks, pay online.
- **Helpers** get a structured roster of homes, build a verified reputation, manage their schedule.
- **Admins** verify helpers, assign bookings, resolve issues — all from a single dashboard.

---

## Architecture at a glance

```
   ┌──────────────┐   HTTPS    ┌──────────────┐    TLS     ┌──────────────┐
   │   VERCEL     │──────────▶│    RENDER    │──────────▶│ AIVEN MySQL  │
   │ React + Vite │            │  Node + Exp. │            │   8.0 · 1 GB │
   │  edge CDN    │            │ stateless API│            │ ssl required │
   └──────────────┘            └──────────────┘            └──────────────┘
                                       ▲
                                       │ /api/health every 14 min
                                ┌──────┴───────┐
                                │ cron-job.org │ (defeats Render cold start)
                                └──────────────┘
```

**Layered (clean architecture):**

```
   Routes  →  Controller  →  Service  →  Validator
                                ▼
                          mysql2 pool (db.js)
                                ▼
                            Aiven MySQL
```

For the deep version (per-flow data flows, error code map, env var matrix) see the architecture document in `docs/` *(or paste the longer doc your team keeps separately)*.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | React 19 + Vite + react-router-dom + axios | Fast dev loop, no framework lock-in, easy to explain in an interview |
| **Styling** | Plain CSS with CSS variables (no Tailwind, no UI lib) | Editorial print aesthetic — Fraunces (display) + Instrument Sans (body) + Noto Serif Tamil |
| **Backend** | Node 18+ · Express 4 · mysql2 · jsonwebtoken · bcryptjs | Battle-tested, no surprises |
| **Database** | MySQL 8.0 (Aiven free tier) | Real MySQL, no compatibility quirks |
| **Auth** | JWT (Bearer token, 7-day expiry) | Stateless, fits free-tier serverless model |
| **Deploy** | Vercel (frontend) · Render (API) · Aiven (DB) | Free tier all the way |

---

## Repo layout

```
urban_mitra/
├── backend/
│   ├── src/
│   │   ├── app.js                  # express wiring · CORS · /api/health
│   │   ├── server.js               # entrypoint
│   │   ├── config/db.js            # mysql2 pool with SSL support
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # authenticateToken · authorizeRoles
│   │   │   └── jsonBodyParser.js   # tolerant JSON parser
│   │   └── modules/                # 6 modules · same shape each:
│   │       ├── auth/               #   Routes → Controller → Service → Validator
│   │       ├── user/
│   │       ├── helper/
│   │       ├── plan/
│   │       ├── booking/
│   │       └── admin/
│   ├── database/
│   │   ├── schema.sql              # 4 tables · ENUMs · FKs
│   │   └── seed.sql                # admin + 3 plans · idempotent
│   ├── .env.example
│   └── package.json
│
├── front_end/
│   ├── src/
│   │   ├── main.jsx                # Router + AuthProvider bootstrap
│   │   ├── App.jsx                 # route table + role-gated routes
│   │   ├── api/client.js           # axios + JWT interceptor
│   │   ├── auth/AuthContext.jsx    # localStorage-synced token + user
│   │   ├── routes/PrivateRoute.jsx # role gate
│   │   ├── components/             # Navbar · Footer
│   │   ├── pages/                  # Home · Plans · Login · 2 signups ·
│   │   │                           # BookService · 3 dashboards
│   │   └── styles/                 # tokens.css · global.css
│   ├── vercel.json                 # SPA rewrite to index.html
│   └── package.json
│
└── README.md
```

---

## Run locally

### Prerequisites
- Node 18+ · npm
- A MySQL 8.0 instance (Aiven free tier works) — credentials handy

### Backend
```bash
cd backend
cp .env.example .env       # then fill in DB_* and JWT_SECRET
npm install
mysql -h <host> -u <user> -p <db> < database/schema.sql
mysql -h <host> -u <user> -p <db> < database/seed.sql
npm run dev                # http://localhost:5000
```

`.env` template:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=work_zone
DB_SSL=false               # true for Aiven / hosted MySQL
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

### Frontend
```bash
cd front_end
cp .env.example .env       # set VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev                # http://localhost:5173
```

---

## Demo credentials

```
Email     admin@workzone.com
Password  Admin@123
```

Loaded automatically by `backend/database/seed.sql` (bcrypt hash baked in). Customer and helper accounts are created via signup forms.

---

## API surface

All responses follow `{ success: true|false, message?, data?|... }`. JWT goes in `Authorization: Bearer <token>`.

| Method · Path | Auth | Roles |
|---|---|---|
| `GET /api/health` | public | — |
| `POST /api/users/signup` | public | — |
| `POST /api/helpers/signup` | public | — |
| `POST /api/auth/login` | public | — |
| `GET /api/plans` | public | — |
| `POST /api/plans` | required | admin |
| `POST /api/bookings` | required | user |
| `GET /api/bookings/my` | required | user, helper, admin |
| `PATCH /api/bookings/:id/status` | required | admin |
| `GET /api/admin/overview` | required | admin |
| `GET /api/admin/helpers?status=` | required | admin |
| `PATCH /api/admin/helpers/:id/status` | required | admin |

---

## Key design decisions

- **Shared login endpoint** — one `POST /api/auth/login` for all three roles; the JWT carries the role and the frontend redirects accordingly.
- **Helper signup is transactional** — `users` and `helper_profiles` insert inside `pool.getConnection() + beginTransaction()` so neither row exists without the other.
- **Pending → active flow** — every helper signs up with `status='pending'`. Login is blocked until an admin approves them via `PATCH /api/admin/helpers/:id/status`.
- **Coded service errors** — services throw `Error` with a `code` (`DUPLICATE_EMAIL`, `ACCOUNT_PENDING`, `PLAN_NOT_FOUND`, …). Controllers map codes → HTTP status. No HTML stack traces, no silent `catch{}`.
- **Permissive CORS for free deploys** — auto-allows `localhost:*` and `*.vercel.app` so preview URLs "just work" without env-var changes.
- **Editorial design over generic SaaS** — Fraunces serif, terracotta accent, paper-cream background, subtle grain. The headline strikes through "five apps" with a hand-drawn line.

## Built by

<div align="center">

**Sri-Harini** *(Frontend & full-stack integration)*

Backend scaffolded as part of the Work Zone project · Hosted on free-tier infrastructure for portfolio demonstration · This is **not** a real commercial service.

</div>

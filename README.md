# SmartSchool Frontend

React (Vite) webapp for SmartSchool: register, log in, view role-gated
pages. Talks only to the [API Gateway](../MarketFlow/services/gateway) (Week
3) — never to `auth-service` or `academic-service` directly, since neither
has a port published to the host anymore.

## Run it locally (without Docker)

```
npm install
cp .env.example .env   # points at the Gateway, defaults to http://localhost:8081/api/v1
npm run dev
```

Make sure the backend stack is running first (`docker compose up --build`
from the `MarketFlow` repo — brings up MySQL, auth-service,
academic-service and the Gateway together).

## Run both containers (backend + frontend)

Each repo has its own `docker-compose.yml`, so each starts with one command.
Run them in two terminals, in this order:

**1. Backend** — from the `MarketFlow` repo root:

```
docker compose up --build
```

Starts MySQL + all backend services; only the Gateway is published, on
`http://localhost:8081`.

**2. Frontend** — from this repo's root:

```
docker compose up --build
```

Starts the webapp on `http://localhost:5173`.

Open `http://localhost:5173` in your browser. The frontend container and the
backend containers don't need to talk to each other or share a Docker
network — the *browser* calls the Gateway directly at
`http://localhost:8081`, which works because both containers publish their
ports to your machine's `localhost`. If you change where the Gateway is
published, update `VITE_API_URL` in this repo's `docker-compose.yml` to
match.

To stop either one, `Ctrl+C` in its terminal, or `docker compose down` from
that repo's root.

## What's here

- `src/api/client.js` — fetch wrapper for the Gateway (`register`, `login`,
  `fetchReports`, `fetchCourses`) — base URL is `VITE_API_URL`
  (`/api/v1/...` paths, e.g. `/api/v1/auth/login`)
- `src/context/AuthContext.jsx` — holds the JWT + user, persists to
  `localStorage`, exposes `login`/`register`/`logout` (paired with
  `useAuth.js` for the hook, split out for React Fast Refresh)
- `src/pages/LoginPage.jsx`, `RegisterPage.jsx` — auth forms (role select:
  Student / Teacher / Admin)
- `src/pages/DashboardPage.jsx` — protected page with demo panels: "Load
  reports" (`/api/v1/reports`, routed to `auth-service`) and "Load courses"
  (`/api/v1/courses`, routed to `academic-service`) — same Gateway, same
  JWT, two different backends, each response's `service` field proves which
  one handled it. The reports panel also doubles as the Week 1
  RBAC/live-rule-change demo (Admin/Teacher see data, Student gets `403`
  once the backend rule is tightened)
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if not
  authenticated

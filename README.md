# SmartStock Frontend

React (Vite) webapp for SmartStock. Week 1 scope: register, log in, and view
a role-gated page — talks to the [auth service](../MarketFlow/services/auth-service).

## Run it locally (without Docker)

```
npm install
cp .env.example .env   # points at the auth service, defaults to http://localhost:3000
npm run dev
```

Make sure the auth service is running first (`docker compose up --build` from
the `MarketFlow` repo, or `npm start` inside `services/auth-service`).

## Run both containers (backend + frontend)

Each repo has its own `docker-compose.yml`, so each starts with one command.
Run them in two terminals, in this order:

**1. Backend** — from the `MarketFlow` repo root:

```
docker compose up --build
```

Starts the auth service on `http://localhost:3000`.

**2. Frontend** — from this repo's root:

```
docker compose up --build
```

Starts the webapp on `http://localhost:5173`.

Open `http://localhost:5173` in your browser. The two containers don't need
to talk to each other or share a Docker network — the browser calls the
auth service directly at `http://localhost:3000`, which works because both
containers publish their ports to your machine's `localhost`. If you change
where the backend is published, update `VITE_API_URL` in this repo's
`docker-compose.yml` to match.

To stop either one, `Ctrl+C` in its terminal, or `docker compose down` from
that repo's root.

## What's here

- `src/api/client.js` — fetch wrapper for the auth service (`register`,
  `login`, `fetchReports`)
- `src/context/AuthContext.jsx` — holds the JWT + user, persists to
  `localStorage`, exposes `login`/`register`/`logout` (paired with
  `useAuth.js` for the hook, split out for React Fast Refresh)
- `src/pages/LoginPage.jsx`, `RegisterPage.jsx` — auth forms
- `src/pages/DashboardPage.jsx` — protected page; the "Load reports" button
  calls the role-gated `/api/reports` endpoint so you can demonstrate RBAC
  (and the live examiner rule-change) visually — an Admin sees data, a
  Cashier sees a 403 once the backend rule is tightened
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if not
  authenticated

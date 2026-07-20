# SmartStock Frontend

React (Vite) webapp for SmartStock. Week 1 scope: register, log in, and view
a role-gated page — talks to the [auth service](../MarketFlow/services/auth-service).

## Run it

```
npm install
cp .env.example .env   # points at the auth service, defaults to http://localhost:3000
npm run dev
```

Make sure the auth service is running first (`docker compose up --build` from
the `MarketFlow` repo, or `npm start` inside `services/auth-service`).

## What's here

- `src/api/client.js` — fetch wrapper for the auth service (`register`,
  `login`, `fetchReports`)
- `src/context/AuthContext.jsx` — holds the JWT + user, persists to
  `localStorage`, exposes `login`/`register`/`logout`
- `src/pages/LoginPage.jsx`, `RegisterPage.jsx` — auth forms
- `src/pages/DashboardPage.jsx` — protected page; the "Load reports" button
  calls the role-gated `/api/reports` endpoint so you can demonstrate RBAC
  (and the live examiner rule-change) visually — an Admin sees data, a
  Cashier sees a 403 once the backend rule is tightened
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if not
  authenticated

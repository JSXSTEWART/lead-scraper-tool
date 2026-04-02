# nuxt-ai-web-builder demo

## Invented user prompt

Build a Nuxt 4 internal app called Launch Control for product operations. Team leads need GitHub login, a protected dashboard, and CRUD for launch blockers with owner, severity, status, due date, and notes. Use NuxtHub DB with sqlite, Nuxt UI for the interface, and target Cloudflare/NuxtHub deployment. Keep dependencies lean.

## Skill-style build brief

- Delivery mode: new app
- Primary user: product operations lead
- Core routes: `/`, `/dashboard`, `/blockers`
- API endpoints:
  - `GET /api/blockers`
  - `POST /api/blockers`
  - `PATCH /api/blockers/:id`
  - `DELETE /api/blockers/:id`
  - `GET /api/blockers/stats`
- Storage choice: NuxtHub sqlite database
- Auth choice: GitHub OAuth through `nuxt-auth-utils`
- Deployment assumption: Cloudflare/NuxtHub

## Why this starter

This request maps directly to the authenticated CRUD pattern in `assets/examples/atidone`, because it needs protected pages, user-owned records, and database-backed mutations.

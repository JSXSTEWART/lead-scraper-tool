# Launch Control

Launch Control is a Nuxt 4 internal product-operations app for tracking launch blockers. It uses GitHub login, protected routes, and a NuxtHub sqlite database to let each signed-in user manage their own blockers with status, severity, due dates, and notes.

## Features

- GitHub OAuth using `nuxt-auth-utils`
- Protected dashboard and blocker management views
- CRUD for launch blockers with owner, severity, status, due date, and notes
- NuxtHub sqlite database with Drizzle schema and migrations
- Nuxt UI-based internal tool interface

## Environment

Create a `.env` file with:

```bash
NUXT_OAUTH_GITHUB_CLIENT_ID="your-github-oauth-app-id"
NUXT_OAUTH_GITHUB_CLIENT_SECRET="your-github-oauth-app-secret"
NUXT_SESSION_PASSWORD="generate-at-least-32-random-characters"
```

For local GitHub OAuth, create an OAuth app with:
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/api/auth/github`

## Install and run

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy

A Cloudflare/NuxtHub deployment is the intended default:

```bash
npx nuxthub deploy
```

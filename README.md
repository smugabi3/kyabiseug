# KyabiseUG

Uganda's Voice, The World's Story — a full-stack news site covering local Ugandan news, international affairs, sports, health, tech, gospel, and entertainment. Built with Next.js, Prisma/PostgreSQL, and a role-based newsroom CMS.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) + **Tailwind CSS v4**
- **Prisma 7** with PostgreSQL (via the `@prisma/adapter-pg` driver adapter)
- Custom cookie/JWT session auth (`jose`, `bcryptjs`) — no third-party auth provider
- **Mailchimp** for newsletter delivery (optional — degrades gracefully if unconfigured)

## Getting started

You need a PostgreSQL database. For local development you can run one in Docker
(`docker run --name kyabiseug-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`),
point `DATABASE_URL` at any hosted Postgres instance, or — if you don't have Docker —
run `npm run db:local` in its own terminal to spin up a self-contained local Postgres
(no install required; data persists in `.local-pg-data/`).

```bash
npm install              # also runs `prisma generate` via postinstall
npx prisma migrate deploy   # applies migrations to the database
npm run db:seed          # seeds categories + sample articles
npm run admin:create     # creates the super admin account (see below)
npm run dev
```

Visit `http://localhost:3000`. The newsroom dashboard lives at `/admin`.

## Deploying to Vercel

`vercel.json` pins the framework, build and install commands, so Vercel uses the
Next.js builder regardless of what the dashboard preset says. One setting it *cannot*
override is **Root Directory** (Settings → Build and Deployment) — that must be empty
(the repo root), since `package.json` lives there.

**Steps:**

1. Provision Postgres (Storage → Create Database). Vercel injects `DATABASE_URL`
   into the project automatically. **This is required** — every page reads from the
   database, so without it the site returns server errors.
2. Under Settings → Environment Variables, add `SESSION_SECRET` — generate it with
   `openssl rand -base64 32`. Also **required**: the app refuses to sign sessions
   without it, since the development fallback is public in this repo. Optionally add
   the two `MAILCHIMP_*` variables.
3. Run the migrations and seed against the production database once, from your machine:
   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   DATABASE_URL="<production-url>" npm run db:seed
   DATABASE_URL="<production-url>" npm run admin:create
   ```
4. Redeploy after changing any of the above — settings changes alone don't rebuild.

### Troubleshooting 404s

| Symptom | Cause |
|---|---|
| Every route 404s with `x-vercel-error: NOT_FOUND` in the response headers, even `/admin/login` and files in `public/`, while builds report success | Vercel published an empty directory. A stale **Output Directory** override in the dashboard (typically left behind by the "Other" framework preset) pointed it away from the Next.js output. `vercel.json` now sets `"outputDirectory": null` to reset it — don't re-enable that override in the dashboard. |
| Site redirects to a Vercel login page | Deployment Protection is on. Turn it off for Production. |
| `/admin/login` works but every other page 500s | `DATABASE_URL` is missing or unreachable. That login page is the only one that doesn't query the database, so this pattern points squarely at the database rather than the app. |
| Only `/article/<slug>` 404s | That article genuinely doesn't exist, or the database hasn't been seeded. |

Category pages are deliberately resilient: the seven sections are structural constants,
so `/category/sports` renders an empty section rather than 404ing when the database has
no rows yet. Only an unrecognised slug 404s.

`prisma generate` runs automatically on every install, and no page queries the database
at build time, so deploys don't depend on the database being reachable during the build.

## Environment variables

Copy the values below into `.env.local` (gitignored, never committed):

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/kyabiseug?schema=public"

# One-time super admin bootstrap — used only by `npm run admin:create`.
# Clear ADMIN_PASSWORD again after the account is created; re-add it only to reset the password.
ADMIN_NAME="Your Name"
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="a-strong-password"

# Mailchimp (optional) — newsletter signups sync here in addition to the local
# Subscribers table. Leave blank to disable; the signup form still works either way.
MAILCHIMP_API_KEY=""
MAILCHIMP_AUDIENCE_ID=""

# Session signing secret — set a long random value before deploying to production.
SESSION_SECRET=""
```

## Roles

| Role | Can do |
|---|---|
| **Super Admin** | Everything below, plus: cannot be edited, demoted, or deleted by any other admin. Set once via `npm run admin:create`. |
| **Admin** | Manage all articles, manage other users (create/edit/delete editors, authors, subscribers), view newsletter subscribers. |
| **Editor** | Create, edit, publish, and delete any article. No user management. |
| **Author** | Create articles; edit/publish/delete only their own bylined work. |
| **Subscriber** | No newsroom access — reserved for future reader-account features. |

Authorization is enforced server-side on every request (not just hidden in the UI), and re-checks the user's role fresh from the database each time rather than trusting a cached session token.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and serve
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier (with Tailwind class sorting)
- `npm run db:local` — run a self-contained local Postgres instance (no Docker needed)
- `npm run db:seed` — seed categories and sample articles (safe to re-run)
- `npm run db:studio` — open Prisma Studio
- `npm run admin:create` — create/update the super admin account from env vars

# Tirat — Practice. Find bugs. Improve.

Hands-on software QA practice platform: **Practice Lab → Level → Practice Website → Attempt → Bug Report → Results**.
Next.js 15 (App Router, Server Actions) · TypeScript · Tailwind v4 · Prisma + SQLite · Zod · Vitest.
Visual design mirrors the supplied Framer template (Switzer font, pill nav, 32px cards, blue/lime accents); all copy comes from the product docs.

## Run it

```bash
npm install
cp .env.example .env      # set DATABASE_URL (Postgres) and SESSION_SECRET (32+ chars)
npm run setup             # prisma generate + db push + seed
npm run dev               # http://localhost:3000
npm test                  # 20 scoring/validation tests
npm run build && npm start
```

Seeded accounts (password `TiratQA#2026`, dev/pilot only — change or delete before launch):

| Email | Role |
|---|---|
| learner@tirat.test | Learner (has Level 01 access) |
| reviewer@tirat.test | Reviewer |
| content@tirat.test | Content creator |
| admin@tirat.test | Admin/operator |
| owner@tirat.test | Owner (only role that can change roles) |

## What's built

- **Public site:** Home, About, Learn (+ article template), Practice Lab, Contact, Privacy, Terms, 404/error states.
- **Accounts:** sign-up, log-in (rate limited, remember-me), forgot/reset password, 3-step skippable onboarding, learner dashboard.
- **Practice Lab:** levels → websites with Not Started / In Progress / Completed / Locked status; attempts with retry limits; structured bug report form (draft saved locally, optional screenshot validated by magic bytes); results page with score breakdown, missed topics by learning area, "ask for review".
- **Scoring:** private bug registry per website *version*; keyword-group matching → auto-match, human review, or unsupported; duplicates; quality + severity rubric; published −1 penalty for unmatched reports; 70% pass mark. Verdicts are hidden until an attempt is finished. Reviewer overrides require a reason and are audit-logged.
- **Access & payment:** entitlements per level/website. Pilot uses **manual confirmation**: learner submits a payment reference → admin confirms (grants access) / rejects / refunds (revokes). Access is never granted from client state.
- **Admin (`/admin`):** overview + funnel analytics, submission review queue, Practice Lab content (levels, websites, registry editor, new registry versions, publish gate requiring a valid registry), articles, payments, users/roles, contact inbox. Role-based capabilities.
- **Three practice websites** (`/sandbox/*`, planted bugs, noindex): Login & Account Access (free demo), Registration Form, Product Listing (200 ETB each — hypothesis pricing from the docs).

## Honest gaps / before launch

- **Email:** no provider yet; reset links are printed to the server log (`src/lib/mailer.ts` is the single integration point). No email verification.
- **Payments:** no local provider integration (docs: pending provider onboarding); manual fallback only.
- **Practice-site isolation:** sandbox apps are same-origin, client-side. In production serve them from a separate origin/sandboxed host; client-side bug logic is inspectable by nature (the *answer key* lives only in the database).
- **Database:** Postgres. **Evidence screenshots** are stored in `./storage` locally and are disabled on Vercel until object storage (e.g. Vercel Blob) is added.

## Deploy on Vercel
1. Create a Postgres database (Neon / Supabase / Vercel Postgres) and copy its connection string.
2. In Vercel → Settings → Environment Variables set `DATABASE_URL`, `SESSION_SECRET` (32+ random chars) and `SITE_URL` (your domain).
3. Once, from your machine with the same `DATABASE_URL` in `.env`: `npm run setup` (creates tables and seeds content + demo accounts).
4. Redeploy. Every push to `main` then deploys automatically.
- Legal pages are drafts with "to be confirmed" sections. Quizzes, certificates, variant rotation and in-app notifications are out of this MVP.
- Session JWTs are stateless (logout clears the cookie but can't revoke a stolen token).

## Sign in with Google / Telegram (optional)

The buttons appear on the login and sign-up pages only when the matching variables are set (see `.env.example`).

- **Google** – create an OAuth client (Web application) in Google Cloud Console and add `<SITE_URL>/api/auth/google/callback` as an authorised redirect URI. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- **Telegram** – create a bot with @BotFather, run `/setdomain` with your HTTPS domain (the widget does not work on `localhost`), then set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_BOT_USERNAME`. Telegram shares no email, so those accounts get a placeholder address.

An existing account with the same verified Google email is linked automatically; otherwise a new learner account is created.

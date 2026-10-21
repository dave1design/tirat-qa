# Tirat QA — Practice. Find bugs. Improve.

Hands-on software QA practice platform: **Practice Lab → Level → Practice Website → Attempt → Bug Report → Results**.
Next.js 15 (App Router, Server Actions) · TypeScript · Tailwind v4 · Prisma + SQLite · Zod · Vitest.
Visual design mirrors the supplied Framer template (Switzer font, pill nav, 32px cards, blue/lime accents); all copy comes from the product docs.

## Run it

```bash
npm install
cp .env.example .env      # set SESSION_SECRET (32+ chars)
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
- **SQLite** is for the pilot; switch the Prisma provider to Postgres for production. Evidence files are stored in `./storage` (use object storage when deployed).
- Legal pages are drafts with "to be confirmed" sections. Quizzes, certificates, variant rotation and in-app notifications are out of this MVP.
- Session JWTs are stateless (logout clears the cookie but can't revoke a stolen token).

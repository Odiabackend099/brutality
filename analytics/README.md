# CallWaiting AI – Analytics & Event Tracking (v1.2-analytics)

This guide establishes the analytics baseline for CallWaiting AI after monitoring (v1.1). It covers product funnel measurement, Supabase event logging, and data-retention policies so growth experiments remain compliant and observable.

---

## 🎯 Objectives
- Measure visit → lead → payment conversion without degrading privacy.
- Centralize event data for troubleshooting and growth dashboards.
- Define retention windows and access controls for analytics payloads.

---

## 1️⃣ Tooling Stack Overview

| Layer | Purpose | Recommended Option | Notes |
|-------|---------|--------------------|-------|
| Web analytics | Landing-site funnel + referrers | **Plausible** (self-hosted or Plausible Cloud) | Lightweight, GDPR-friendly, no cookies. |
| Product analytics | App/session events (optional) | PostHog Cloud (EU region) | Only enable once authenticated product UI ships. |
| Operational events | Backend + webhook trails | Supabase `analytics_events` table | Stored via service_role for structured auditing. |

---

## 2️⃣ Plausible Integration (Landing Page)

1. **Create Site** in Plausible with domain `callwaitingai.dev`.
2. **Set ENV:** add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=callwaitingai.dev` (or staging domain) to deployment environment.
3. **Script Loader:** `analytics/plausible-loader.tsx` (see file) injects script dynamically to keep bundle clean.
4. **Event Hooks:** Add CTA click handlers in `app/components` if you need granular tracking (e.g., `trackPlausible('ClickStartTrial')`).
5. **Goal Setup:** In Plausible UI, configure custom goals for button clicks or outbound links.
6. **Backup Metric:** If Plausible unreachable, Supabase events still log counts via `analytics_events`.

> **Privacy:** Plausible avoids cookies; include mention in privacy policy. Disable script in preview deployments by omitting env var.

---

## 3️⃣ Supabase Event Logging

Run `analytics/supabase_event_log.sql` against production and staging. It creates:

- `public.analytics_events` table storing event type, actor metadata, and payload hash.
- Helper function `log_analytics_event` (SQL) for consistent inserts.
- RLS policy restricting direct reads to service role or analytics role (`analytics_reader`).

**Usage Patterns**
- n8n workflows call Supabase REST with service key to insert `LeadCaptured`, `PaymentVerified`, etc.
- Supabase cron or SQL tasks aggregate stats into materialized views (future step).
- Pair with `restore/validation_checks.sql` to confirm events included in PITR drills.

---

## 4️⃣ Optional PostHog Deployment

Only needed once an authenticated dashboard ships.

1. Self-hosted PostHog (Docker) or PostHog Cloud EU.
2. Add `NEXT_PUBLIC_POSTHOG_KEY` and `POSTHOG_HOST` env vars.
3. Use `analytics/posthog-loader.ts` placeholder for Next.js custom app: lazy-init only after user consent.
4. Route backend events to PostHog via n8n or serverless functions to correlate user sessions with automations.

---

## 5️⃣ Data Retention & Governance

| Dataset | Retention | Storage | Access |
|---------|-----------|---------|--------|
| Plausible visit data | Default 12 months | Plausible Cloud | `odiadev` + growth team |
| Supabase `analytics_events` | 24 months rolling (vacuum monthly) | Supabase Postgres | service role, analytics_reader |
| Email/SMS campaign metrics | 12 months | SES/SendGrid dashboard | Marketing lead |

**Policies**
- Quarterly export of Plausible summary to S3 (`analytics/exports/YYYY-MM-DD.json`).
- Supabase scheduled job purges `analytics_events` older than 24 months.
- Incident response: analytics data must be considered when running deletion requests (link with privacy policy).

---

## 6️⃣ Validation Checklist

1. `npm run lint` (or build) passes after analytics hooks.
2. `curl https://callwaitingai.dev` loads without blocking scripts in console.
3. Plausible real-time dashboard registers test visit within 30 s.
4. Supabase `analytics_events` shows inserted `LeadFormSubmitted`.
5. `restore/validation_checks.sql` extended to include `analytics_events` row counts (optional).

---

*Last updated: v1.2-analytics baseline*

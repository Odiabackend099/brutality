# CallWaiting AI – Supabase PITR Restore Drill (v1.1-monitoring)

This playbook validates that Point-in-Time Recovery (PITR) for Supabase can restore production data into a clean environment within 15 minutes.

---

## 🎯 Objective
Demonstrate a repeatable, auditable restore process so production incidents (data loss, operator error, ransomware) can be resolved rapidly.

**Success Criteria**
1. Restore target is within the past 24 hours.
2. Drill completes in ≤ 15 minutes of hands-on time.
3. Restored project passes data validation script and application smoke tests.
4. Incident log captures the exercise with timestamps, notes, and lessons learned.

---

## 1️⃣ Prerequisites

| Item | Details |
|------|---------|
| Supabase Access | Owner-level access to production project and ability to create scratch project. |
| Secrets | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` stored in 1Password vault. |
| Local Tools | `supabase` CLI ≥ 1.154, `psql` client, `diff` or `jq` for comparisons. |
| Storage | S3-compatible bucket for exported artifacts (optional but recommended). |
| Doc Prep | Incident log template at `monitoring/incidents/YYYY-MM-DD.md` ready. |

---

## 2️⃣ Restore Drill Workflow

1. **Snapshot Timestamp**
   - Decide restore timestamp `T` (e.g., 30 minutes before drill start).
   - Record `T` in incident log.

2. **Provision Scratch Project**
   - Create new Supabase project in a secondary region (e.g., `aws-us-west-2`).
   - Note project ref: `supabase-project-ref-scratch`.

3. **Launch PITR**
   - In production project → **Backups** → **Point in time recovery**.
   - Choose timestamp `T`, target project: `supabase-project-ref-scratch`.
   - Start restore; timer begins now.

4. **Update Service Keys**
   - Grab scratch project's anon + service role keys.
   - Export as `.env` file in `restore/.env.scratch` (never commit).

5. **Run Validation Script**
   - Execute `psql -f restore/validation_checks.sql` against both databases.
   - Compare results (counts, checksums, latest timestamps).
   - Record pass/fail in incident log.

6. **Application Smoke Test**
   - Point local `.env` to scratch project.
   - Run bootstrap script or minimal API smoke test (e.g., POST test webhook).
   - Confirm expected 200 responses and Supabase writes succeed.

7. **Cleanup**
   - Destroy scratch project once validation completes.
   - Remove temp `.env.scratch`.
   - Upload drill transcript + logs to archival bucket.

8. **Review**
   - Document duration, blockers, fixes.
   - Update `restore/README.md` with lessons if needed.

Target timeline: ≤ 15 min active time, ≤ 30 min total including validation.

---

## 3️⃣ Command Reference

### Export Env for Production
```bash
supabase secrets list --project-ref <prod-ref>
```

### Run Validation Script
```bash
psql "$PROD_DATABASE_URL" -f restore/validation_checks.sql > restore/prod_validation.out
psql "$SCRATCH_DATABASE_URL" -f restore/validation_checks.sql > restore/scratch_validation.out
diff -u restore/prod_validation.out restore/scratch_validation.out
```

### Smoke Test (example)
```bash
curl -X POST https://n8n-scratch.example.com/webhook/lead-test \
  -H 'Content-Type: application/json' \
  -d '{"email":"restore-check@example.com","number":"+15555550123"}'
```

---

## 4️⃣ Data Validation Coverage

`restore/validation_checks.sql` verifies:

- Table row counts and `MAX(updated_at)` timestamps for critical tables.
- Checksums (`md5`) over primary identifiers to detect divergence.
- Confirmation that RLS policies exist and are enabled.
- Extension inventory (e.g., `pgcrypto`, `uuid-ossp`) matches production.

Extend the script when new tables are added or schema evolves.

---

## 5️⃣ Automation Hooks

- **Daily Drill Reminder**: optional n8n workflow `n8n_workflows/pitr_daily_ping.json` pings Healthchecks.io to prove backups stay healthy.
- **Git Tag**: upon successful drill, tag repo `v1.1-pitr-<YYYYMMDD>` to mark audit trail.
- **Checklist**: store results in `restore/history/YYYY-MM-DD.md` (create per drill).

---

## ✅ Exit Criteria

A PITR drill is approved when the following are documented:

1. Restore completed < 15 minutes and timestamp `T` captured.
2. Validation outputs match (`diff` returns no differences).
3. Smoke test hits expected endpoints successfully.
4. Incident log entry completed with responders and follow-up items.
5. Scratch project deleted and keys revoked within 1 hour.

---

*Last updated: v1.1-monitoring, Step 2 baseline*


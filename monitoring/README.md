# CallWaiting AI – Monitoring & Alerting (v1.1-monitoring)

This document defines the external monitoring, healthcheck, and logging setup for the CallWaiting AI infrastructure.

---

## 🎯 Objective
Maintain 24/7 visibility into system uptime, latency, and job reliability — **without modifying production containers**.  
The monitoring layer should detect and alert on any outage, high latency, or workflow failure within 60 seconds.

---

## 1️⃣ Healthcheck Endpoints

| Service | Endpoint | Purpose | Expected Response |
|----------|-----------|----------|-------------------|
| n8n Core | `https://n8n.odia.dev/webhook/health` | Confirms n8n container and DB connection are alive | `{"status":"ok","timestamp":"<ISO>"}` |
| Website | `https://callwaitingai.dev` | Confirms landing page uptime | 200 OK |
| Supabase | internal check | n8n pings via service_role to test DB write/read | 200 OK in workflow log |

### 🧩 Implementation Notes
- `health` webhook runs **independently** from payment/lead flows.
- Must return a **200 OK** response in under **3 seconds**.
- Should verify:
  - Supabase connectivity (simple SELECT or INSERT test).
  - Redis ping (optional if running queue mode).

---

## 2️⃣ External Monitoring Providers

| Tool | Function | Check Interval | Alert Target |
|------|-----------|----------------|---------------|
| **UptimeRobot** | HTTPS check on `/webhook/health` | 1 min | callwaitingai@gmail.com |
| **Healthchecks.io** | Receives periodic ping from n8n scheduled workflow | 5 min | callwaitingai@gmail.com |
| **BetterStack Logs (optional)** | Centralized log ingestion | continuous | Web dashboard |

---

## 3️⃣ Alert Escalation Policy

1. **First failure** → email to `callwaitingai@gmail.com`
2. **Two consecutive failures** → Telegram/Slack notification
3. **Five consecutive failures** → SMS or phone escalation (optional)

---

## 4️⃣ Local Log Rotation

Add cron on host (example):

```bash
0 * * * * docker logs n8n --since 1h > /var/log/n8n/n8n-$(date +\%Y\%m\%d\%H).log
```

Upload to S3-compatible bucket weekly for long-term retention.

---

## 5️⃣ Test Procedure

1. **Healthcheck:**
   `curl -i https://n8n.odia.dev/webhook/health` → expect 200 + JSON `{status:"ok"}`
2. **Simulated Outage:**
   `docker stop n8n` → verify alert within 60–90 seconds.
3. **Recovery:**
   `docker start n8n` → confirm recovery notice and green dashboard.

---

## 6️⃣ Maintenance Checklist

| Frequency | Task                                                |
| --------- | --------------------------------------------------- |
| Daily     | Review UptimeRobot dashboard for anomalies          |
| Weekly    | Verify logs uploaded; check average latency         |
| Monthly   | Run test alert; verify all contacts still reachable |
| Quarterly | Rotate API tokens for monitoring providers          |

---

## 7️⃣ Incident Response Notes

* Every incident must be logged in `monitoring/incidents/YYYY-MM-DD.md`.
* Include root cause, time to recovery, and corrective action.
* Define SLA: restore within 30 minutes of alert for paid users.

---

## ✅ Validation

A system passes monitoring validation if:

1. `/webhook/health` returns 200 OK in < 3s.
2. Alerts trigger within 60 s of downtime.
3. Recovery notification fires automatically.
4. Logs show consistent hourly rotation.
5. All tokens/keys rotated quarterly.

---

*Last updated: v1.1-monitoring baseline*


# CallWaiting AI Backend Deployment Guide

## 🧩 Production Reality Stress Test (v1.0 Operator Checklist)

**Before pushing or tagging a release, every operator/Maintainer MUST verify:**

- [ ] **Webhook Path (Flutterwave Dashboard):**  
      Set exactly as `https://n8n.odia.dev/webhook/flutterwave` (no trailing slash, no upper-case).
- [ ] **n8n Webhook Node:**  
      "Response Mode" = "On Received" (immediate 200), "Response Data" = "No Response Data", "Binary Data" ON.
- [ ] **Signature Handling:**  
      Workflow's verification node `.trim()`s both `verif-hash` and secret.
- [ ] **Supabase idempotency:**  
      Run:  
      `select indexname from pg_indexes where tablename='payments_callwaiting';`  
      Expect unique on `flutterwave_id`.
- [ ] **Cloudflare/Nginx Timeout:**  
      Proxy timeout is **≥ 10 seconds**; Flutterwave webhooks retry after 5s if no response.
- [ ] **SMTP Quota:**  
      Gmail app pw = ~2,000 msgs/day. For scale/production, migrate to SendGrid/AWS SES.
- [ ] **Bootstrap Script:**  
      Run:  
      `bash -x bootstrap_callwaiting.sh`  
      Both cURL tests (good/bad secret) yield 200/401+ as expected.
- [ ] **Commit Hygiene/Safety:**  
      Run:  
      `git check-ignore -v .env` and `git check-ignore -v server-setup.sh`  
      Both must show "ignored by .gitignore".

**Tag a release ONLY when every box is checked.**

## 🚨 CRITICAL SECURITY NOTICE

**The Supabase service_role key was exposed in the original plan. You MUST rotate it immediately before deployment.**

## 🔒 Security Hardening Applied

This deployment includes production-level security measures:

- **HMAC-SHA256 Webhook Verification**: Proper cryptographic signature validation
- **Timestamp Freshness Checks**: Prevents replay attacks
- **Dangerous Node Blocking**: n8n configured to block risky operations
- **Server Hardening**: Firewall, fail2ban, automatic updates
- **Monitoring & Alerting**: Security monitoring and incident response

## 📋 Prerequisites

- VPS or server with Docker & Docker Compose installed
- Domain `n8n.odia.dev` pointing to your server (via DNS)
- SSL certificate (Let's Encrypt recommended) or Cloudflare SSL
- All required credentials ready (see env.example)

## 🚀 Quick Deployment

### 1. Server Security Setup (Recommended)

```bash
# Run server hardening script (Ubuntu/Debian)
./server-setup.sh

# This will configure:
# - Firewall (UFW)
# - Fail2ban intrusion detection
# - Automatic security updates
# - File integrity monitoring
# - Security monitoring scripts
```

### 2. Setup Environment

**Option A: Automated Bootstrap (Recommended)**
```bash
# Run the automated bootstrap script
./bootstrap_callwaiting.sh

# This will:
# - Create .env with all required variables
# - Set up docker-compose.yml
# - Start n8n + Redis stack
# - Run basic webhook validation tests
```

**Option B: Manual Setup**
```bash
# Clone and navigate to the backend directory
cd callwaiting-backend

# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Deploy with Docker

```bash
# Start the stack
docker-compose up -d

# Check logs
docker-compose logs -f n8n-main
```

### 4. Configure SSL (if not using Cloudflare)

```bash
# Install certbot and get SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d n8n.odia.dev
```

### 5. Setup Supabase Database

1. Go to Supabase Dashboard → SQL Editor
2. Run the contents of `db/supabase_schema_hardened.sql`
3. Enable PITR backups in Settings → Database (Pro plan)

### 6. Import n8n Workflows

1. Access n8n at `https://n8n.odia.dev` (use Basic Auth from .env)
2. Import `n8n_workflows/payment_workflow_hardened.json`
3. Import `n8n_workflows/leads_workflow_cors.json`
4. Configure credentials:
   - Supabase (service role)
   - Flutterwave Bearer Token
   - Gmail SMTP

### 7. Configure Flutterwave

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Set webhook URL: `https://n8n.odia.dev/webhook/flutterwave`
3. Enable events: `charge.completed`, `transfer.completed`
4. Set secret hash and copy to `FLW_VERIF_HASH` in .env

### 8. Setup Cloudflare WAF (Optional but Recommended)

Create these rules in Cloudflare Dashboard:

**Rule 1: Block non-POST on payment webhook**
```
(http.request.uri.path contains "/webhook/flutterwave" and http.request.method ne "POST")
Action: Block
```

**Rule 2: Allow OPTIONS + POST for lead webhook**
```
(http.request.uri.path contains "/webhook/leads_callwaiting" and not http.request.method in {"POST" "OPTIONS"})
Action: Block
```

**Rule 3: Rate limiting**
```
Path: /webhook/*
Rate: 60 requests per minute per IP
Action: Block for 10 minutes
```

### 9. Email Deliverability

Set up SPF/DKIM/DMARC DNS records for your domain:

```dns
# SPF Record
TXT @ "v=spf1 include:_spf.google.com ~all"

# DMARC Record
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:callwaitingai@gmail.com"

# Enable DKIM in Google Workspace Admin Console
```

## 🧪 Testing Protocol

### Comprehensive Test Suite
```bash
# Run all tests to validate deployment
./test/run-all-tests.sh
```

This will:
- Test webhook HMAC-SHA256 verification logic
- Validate all configuration files
- Check Docker Compose syntax
- Verify security hardening
- Generate test vectors and curl commands
- Provide detailed test results

### Webhook Verification Tests
```bash
cd callwaiting-backend/test
npm install
npm run test:all
```

This will:
- Generate test webhooks with valid HMAC-SHA256 signatures
- Test all verification scenarios (valid, invalid, old, missing)
- Run official Flutterwave test vectors
- Provide curl commands for manual testing
- Validate the security implementation

### Official Flutterwave Tests
```bash
cd callwaiting-backend/test
node flutterwave-official-test.js
```

This will:
- Test with official Flutterwave specifications
- Show exact signatures and payloads
- Generate curl commands for manual testing
- Validate HMAC-SHA256 implementation

### End-to-End Webhook Tests
```bash
cd callwaiting-backend/test
npm install
npm run test:webhook
```

This will:
- Actually post to your n8n webhook endpoint
- Test all verification scenarios live
- Show HTTP responses and status codes
- Validate end-to-end webhook processing
- Test idempotency with duplicate webhooks

### Payment Flow Test
1. Make a $1 test payment via Flutterwave link
2. Verify webhook fires within 30 seconds
3. Check Supabase for payment record with `verified=true`
4. Confirm customer receives email with Calendly link
5. Confirm founder receives alert email
6. Test duplicate webhook (should not create duplicate record)

### Lead Form Test
1. Submit lead form from browser
2. Verify CORS preflight passes
3. Check Supabase for lead record
4. Confirm founder receives lead alert
5. Test form validation and error handling

### Security Test
1. Send webhook with wrong `verif-hash` → should be rejected
2. Try non-POST requests to webhooks → should be blocked
3. Test rate limiting → should block after 60 requests/minute
4. Verify emails land in inbox (not spam)
5. Test replay attacks with old timestamps → should be rejected

## 📊 Monitoring & Maintenance

### Logs
```bash
# View n8n logs
docker-compose logs -f n8n-main

# View all services
docker-compose logs -f
```

### Backups
- Enable PITR backups in Supabase (Pro plan)
- Regular database exports: `pg_dump` from postgres container
- n8n workflow exports: Download from n8n interface

### Updates
```bash
# Update n8n
docker-compose pull n8n-main n8n-worker
docker-compose up -d

# Update all services
docker-compose pull
docker-compose up -d
```

## 🔧 Bootstrap Script Documentation

### Expected Bootstrap Output
```bash
[test] Valid secret header -> expect HTTP 200
200

[test] Wrong secret header -> expect 401/403
401
```

### Troubleshooting Bootstrap
- **If you get `200` for both tests:** Webhook endpoint is not properly configured
- **If you get connection errors:** Check n8n is running and accessible  
- **If you get `500` errors:** Check n8n logs for execution errors
- **If you get `404` errors:** Verify webhook path is exactly `/webhook/flutterwave`

## 🔧 Troubleshooting

### Common Issues

**Webhook Timeouts**
- Check n8n logs for execution errors
- Verify "Respond to Webhook" node is early in flow
- Ensure queue mode is working (Redis connected)

**CORS Errors**
- Verify Cloudflare allows OPTIONS for lead webhook
- Check n8n webhook CORS headers in workflow

**Email in Spam**
- Set up SPF/DKIM/DMARC for domain
- Use domain email sender, not Gmail
- Test with external email addresses

**Duplicate Payments**
- Verify unique constraint on `flutterwave_id` in Supabase
- Check idempotency in Supabase upsert operation

**Failed Signatures**
- Verify `FLW_VERIF_HASH` matches Flutterwave dashboard
- Check webhook payload structure in n8n logs

**Database Connection Issues**
- Check postgres container is running: `docker-compose ps`
- Verify credentials in .env file
- Check Supabase service key is rotated and correct

## 🚨 Security Checklist

- [ ] Rotated the exposed Supabase service_role key
- [ ] All secrets stored in .env (never in code)
- [ ] n8n Basic Auth enabled and strong password set
- [ ] Gmail app password generated (not regular password)
- [ ] Flutterwave webhook secret hash configured
- [ ] Cloudflare WAF rules active (if using Cloudflare)
- [ ] SSL certificate installed and working
- [ ] Domain email configured with SPF/DKIM/DMARC
- [ ] Queue mode enabled with Redis
- [ ] PITR backups enabled in Supabase
- [ ] **Production Reality Stress Test completed (all boxes checked above)**

## 🔒 Security Documentation

For detailed security information:
- **SECURITY_HARDENING.md**: Complete security hardening guide
- **server-setup.sh**: Automated server security configuration
- **Webhook Security**: HMAC-SHA256 verification with timestamp checks
- **n8n Security**: Dangerous node blocking and external execution
- **Server Hardening**: Firewall, fail2ban, monitoring, and incident response

## 📞 Support

If issues persist:
1. Check n8n execution logs for errors
2. Verify all environment variables are set correctly
3. Test Flutterwave webhook manually with curl
4. Check Supabase RLS policies and service key
5. Review security documentation in SECURITY_HARDENING.md
6. Contact: callwaitingai@gmail.com

## 🎯 Success Metrics

- Payment webhooks process within 30 seconds
- Lead forms submit without CORS errors
- Emails land in primary inbox (not spam)
- Zero duplicate payment records
- 100% webhook signature verification
- All security checklist items completed

## 🏷️ Tagging a Gold Baseline Release

After a full, green pass of the Production Reality Stress Test checklist:

```bash
git tag -a v1.0 -m "CallWaiting AI hardened production release"
git push origin v1.0
```

**This creates your production-ready, investor-grade baseline.**
From here, only feature work changes — infra stays frozen and reliable.

## 🟢 Operational Principles (Cemented in Docs)

- **Deterministic deploy:** "No manual steps." All infra/config/first-run delivered via script or documented n8n import.
- **Full observability:** Logs, Supabase row per event, Gmail alert per failure, traceable via request-id if needed.
- **Secret rotation:** Explicit quarterly rotation steps for all keys, log rotation events in the repo (in a sec log or README section).

**Every deployment is deterministic.**
No manual clicks — `bootstrap_callwaiting.sh` + `deploy.sh` yield the same result every time.

**Every failure is observable.**
Request-ID logs + Supabase rows + Gmail alerts mean no silent drop.

**Every secret has a rotation path.**
Flutterwave → Supabase → Gmail: rotate quarterly; store rotation dates in README.

---

**Remember:** This system handles real payments and customer data. Always test thoroughly in a staging environment before going live.

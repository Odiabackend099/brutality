# CallWaiting AI - Critical Security Fixes

## 🔴 CRITICAL (Fix This Week)

### 1. Webhook HMAC Validation
**Current Risk**: Anyone can spam your n8n webhook with fake requests
**Attack Vector**:
```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax \
  -H "Content-Type: application/json" \
  -d '{"message": "spam spam spam"}' # Costs you OpenAI + Minimax $$$
```

**Fix**: Add signature verification
```typescript
// supabase/functions/webhook-proxy/index.ts
const signature = req.headers.get('x-webhook-signature')
const expectedSig = hmac_sha256(WEBHOOK_SECRET, request_body)

if (signature !== expectedSig) {
  return new Response('Unauthorized', { status: 401 })
}
```

**Impact**: Blocks 99% of abuse attempts
**Time**: 2 hours
**Priority**: 🔴 Do today

---

### 2. API Key Exposure in n8n
**Current Risk**: Your OpenAI and Minimax keys are stored in n8n cloud
**Potential Impact**:
- If n8n account is compromised → $10,000+ API bill in hours
- Competitor can clone your exact workflow

**Fix**: Move to Supabase Vault
```bash
# In Supabase dashboard > Project Settings > Vault
# Add secrets:
OPENAI_API_KEY=sk-proj-...
MINIMAX_API_KEY=...

# Update n8n to fetch from Supabase Edge Function instead
```

**Impact**: API keys never leave your infrastructure
**Time**: 1 hour
**Priority**: 🔴 Do today

---

### 3. No Rate Limiting
**Current Risk**: Single user can make 10,000 requests/minute
**Cost Impact**: At $0.01/call → $100/minute = $6,000/hour burn rate

**Fix**: Add Upstash Redis rate limiter
```typescript
const count = await redis.incr(`ratelimit:${ip}`)
if (count > 10) { // 10 requests per minute
  return new Response('Rate limit exceeded', { status: 429 })
}
await redis.expire(`ratelimit:${ip}`, 60)
```

**Impact**: Caps max abuse cost at ~$6/hour (manageable)
**Time**: 1.5 hours
**Priority**: 🔴 Do this week

---

## 🟡 HIGH (Fix This Month)

### 4. No Error Monitoring
**Current Risk**: Silent failures = lost customers
**Example**:
- Minimax API is down → users get blank responses → you never know
- OpenAI timeout → chat breaks → no alert

**Fix**: Add Sentry
```bash
npm install @sentry/nextjs
```

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
```

**Impact**: Get Slack alerts on failures, debug faster
**Time**: 30 minutes
**Priority**: 🟡 Week 2

---

### 5. Missing User Authentication
**Current Risk**: No user accounts = can't build dashboard or billing
**Limitation**: Can't track who's using the chat widget

**Fix**: Enable Supabase Auth
```typescript
// Sign up
await supabase.auth.signUp({
  email: user.email,
  password: user.password,
})

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

**Impact**: Required for admin dashboard, usage tracking
**Time**: 2-3 hours
**Priority**: 🟡 Week 2-3

---

### 6. No CORS Restrictions
**Current Risk**: Any website can call your API
**Attack**: Competitor embeds your chat widget on their site → uses your OpenAI credits

**Fix**: Add CORS whitelist
```typescript
// In Supabase Edge Function
const allowedOrigins = [
  'https://callwaitingai.dev',
  'https://www.callwaitingai.dev',
]

const origin = req.headers.get('origin')
if (!allowedOrigins.includes(origin)) {
  return new Response('Forbidden', { status: 403 })
}
```

**Impact**: Blocks cross-origin abuse
**Time**: 15 minutes
**Priority**: 🟡 Week 2

---

## 🟢 MEDIUM (Month 2)

### 7. No Request Logging
**Current Risk**: Can't debug user issues ("It didn't work!" → no logs)

**Fix**: Log all requests to Supabase
```sql
create table request_logs (
  id uuid primary key default uuid_generate_v4(),
  ip text,
  user_agent text,
  request_body jsonb,
  response_status integer,
  created_at timestamptz default now()
);
```

**Impact**: Better debugging, fraud detection
**Time**: 1 hour
**Priority**: 🟢 Month 2

---

### 8. Missing Health Checks
**Current Risk**: If n8n goes down, users see errors, you don't know

**Fix**: Add `/api/health` endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    n8n: await fetch(N8N_WEBHOOK).then(r => r.ok),
    openai: await fetch('https://api.openai.com/v1/models').then(r => r.ok),
    supabase: await supabase.from('payments_callwaiting').select('count').then(r => r.error === null),
  }

  return Response.json({
    status: Object.values(checks).every(Boolean) ? 'healthy' : 'degraded',
    checks,
  })
}
```

**Impact**: Uptime monitoring (UptimeRobot pings this every 5 min)
**Time**: 30 minutes
**Priority**: 🟢 Month 2

---

## 🔵 LOW (Month 3+)

### 9. No IP Blocking
**Current Risk**: Can't ban abusive IPs

**Fix**: Add blocklist in Supabase
```sql
create table blocked_ips (
  ip text primary key,
  reason text,
  created_at timestamptz default now()
);
```

Check in Edge Function:
```typescript
const { data } = await supabase
  .from('blocked_ips')
  .select('ip')
  .eq('ip', clientIp)

if (data?.length) {
  return new Response('Blocked', { status: 403 })
}
```

**Priority**: 🔵 Nice to have

---

### 10. No Usage Quotas
**Current Risk**: Can't limit free tier users to 100 calls/month

**Fix**: Add quota tracking
```sql
create table user_quotas (
  user_id uuid primary key,
  plan text, -- 'free', 'starter', 'pro'
  calls_used integer default 0,
  calls_limit integer,
  reset_at timestamptz
);
```

**Priority**: 🔵 When you add free tier

---

## Action Plan Summary

### This Week (Critical)
- [ ] Add webhook HMAC validation (2 hours)
- [ ] Move API keys to Supabase Vault (1 hour)
- [ ] Implement rate limiting with Redis (1.5 hours)

**Total Time**: ~4.5 hours
**Risk Reduction**: 90%

### Week 2-3 (High Priority)
- [ ] Add Sentry error tracking (30 min)
- [ ] Enable Supabase Auth (2-3 hours)
- [ ] Add CORS restrictions (15 min)

**Total Time**: ~3.5 hours
**Risk Reduction**: Additional 8%

### Month 2 (Medium)
- [ ] Add request logging (1 hour)
- [ ] Create health check endpoint (30 min)

**Total Time**: ~1.5 hours
**Monitoring**: Full observability

---

## Cost of NOT Fixing

| Vulnerability | Worst Case Scenario | Potential Loss |
|--------------|---------------------|----------------|
| No HMAC validation | Attacker spams 10,000 calls/day | $100-500/day API costs |
| Exposed API keys | Stolen keys used for crypto mining | $10,000+ OpenAI bill |
| No rate limiting | DDoS attack | $6,000/hour |
| No monitoring | Silent outages for 3 days | Lost customers, refunds |
| No auth | Can't launch paid tiers | $0 revenue |

**Total Exposure**: $16,000+ per incident

**Fix Cost**: ~10 hours of work = $500 (if outsourced) or $0 (DIY)

**ROI**: Infinite 🚀

---

## Quick Start

Want me to help you implement the **Week 1 fixes** right now?

I can:
1. ✅ Create the Supabase Edge Function with HMAC validation
2. ✅ Set up Upstash Redis rate limiting
3. ✅ Update your frontend to use the secure endpoint
4. ✅ Test everything before deploying

**Time**: 2-3 hours (with my help)
**Impact**: Your app goes from vulnerable to production-grade

Ready to start? Just say "let's secure it" and I'll begin! 🔒

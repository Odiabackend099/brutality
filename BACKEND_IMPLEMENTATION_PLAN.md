# CallWaiting AI - Pragmatic Backend Implementation Plan

## **Context & Constraints**

Based on clarifications:
1. **n8n Cloud** (not self-hosted) - Keep current setup
2. **Audio is ephemeral** - No long-term storage needed
3. **Single-tenant** (no agency/reseller model)
4. **~100 calls/day scale** - Low traffic, optimize for simplicity
5. **No email verification yet** - Add as Phase 2

**Current Stack:**
- Frontend: Next.js (Vercel)
- Automation: n8n Cloud
- Database: Supabase (PostgreSQL)
- AI: OpenAI GPT-4o-mini
- TTS: Minimax API
- Payments: Flutterwave

---

## **Architecture Assessment**

### ✅ What's Working
- **n8n Cloud workflow**: Webhook → AI → TTS pipeline is solid
- **Supabase schema**: Basic payments + leads tables exist
- **Next.js frontend**: Clean, responsive, fast
- **Ephemeral audio**: No storage overhead (smart for scale)

### ⚠️ Critical Gaps (Immediate Fixes)

| Issue | Impact | Priority | Fix Timeline |
|-------|--------|----------|--------------|
| **No webhook HMAC validation** | Anyone can spam endpoints | 🔴 Critical | Week 1 |
| **API keys in n8n exposed** | Credential leak risk | 🔴 Critical | Week 1 |
| **No rate limiting** | DDoS vulnerability | 🟡 High | Week 2 |
| **Missing auth (OAuth)** | Poor UX, security risk | 🟡 High | Week 2-3 |
| **No error tracking** | Silent failures | 🟡 High | Week 2 |
| **No usage metrics** | Can't bill accurately | 🟢 Medium | Week 3-4 |

---

## **Recommended Backend Architecture (Pragmatic)**

### **Phase 1: Security Hardening (Week 1-2)**

```
┌─────────────┐
│  Frontend   │ (Next.js on Vercel)
│  + Chat UI  │
└──────┬──────┘
       │
       │ HTTPS + JWT
       ▼
┌─────────────────────────────────────┐
│  Supabase Edge Functions (Proxy)   │
│  - Webhook HMAC validation          │
│  - Rate limiting (IP + user)        │
│  - Request sanitization             │
└──────┬──────────────────────────────┘
       │
       │ Validated request
       ▼
┌──────────────────┐      ┌─────────────┐
│  n8n Cloud       │──────│ OpenAI API  │
│  Workflows       │      │ Minimax TTS │
└──────┬───────────┘      └─────────────┘
       │
       │ Store results
       ▼
┌──────────────────┐
│  Supabase DB     │
│  - Payments      │
│  - Leads         │
│  - Call Logs     │
└──────────────────┘
```

### **Key Changes:**
1. **Add Supabase Edge Function** as middleware between frontend and n8n
2. **Move secrets** from n8n to Supabase Vault
3. **Add webhook verification** using HMAC-SHA256
4. **Implement basic rate limiting** (10 req/min per IP)

---

## **Implementation Roadmap**

### **Week 1: Critical Security**

#### 1.1 Webhook HMAC Validation
**File**: `supabase/functions/webhook-proxy/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')!
const N8N_WEBHOOK = Deno.env.get('N8N_WEBHOOK_URL')!

serve(async (req) => {
  // Verify HMAC signature
  const signature = req.headers.get('x-webhook-signature')
  const body = await req.text()

  const expectedSig = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(WEBHOOK_SECRET + body)
  )

  if (signature !== btoa(String.fromCharCode(...new Uint8Array(expectedSig)))) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Forward to n8n
  const response = await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })

  return response
})
```

**Security Benefit**: Blocks unauthorized requests to n8n webhook

#### 1.2 Move API Keys to Supabase Vault
- OpenAI API key → Supabase Vault
- Minimax API key → Supabase Vault
- n8n webhook URL → Environment variable (not hardcoded)

#### 1.3 Update Frontend to Use Proxy
**File**: `hooks/useChat.ts`

```typescript
// OLD (direct to n8n)
const primaryUrl = 'https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax'

// NEW (via Supabase Edge Function)
const primaryUrl = 'https://[YOUR-PROJECT].supabase.co/functions/v1/webhook-proxy'
```

---

### **Week 2: Auth & Monitoring**

#### 2.1 Add Supabase Auth (Email + Google OAuth)

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Sign up
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password',
})

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
})
```

**Why**: Better UX than email-only, prepares for dashboard later

#### 2.2 Add Sentry for Error Tracking

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // Low overhead for 100 calls/day
  environment: process.env.NODE_ENV,
})
```

**Why**: Catch n8n failures, TTS timeouts, API errors silently

#### 2.3 Basic Rate Limiting (Upstash Redis)

```typescript
// supabase/functions/webhook-proxy/index.ts
import { Redis } from 'https://esm.sh/@upstash/redis'

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_URL')!,
  token: Deno.env.get('UPSTASH_REDIS_TOKEN')!,
})

const ip = req.headers.get('x-forwarded-for') || 'unknown'
const key = `ratelimit:${ip}`
const count = await redis.incr(key)

if (count === 1) {
  await redis.expire(key, 60) // 1 minute window
}

if (count > 10) {
  return new Response('Rate limit exceeded', { status: 429 })
}
```

**Why**: Prevents abuse at 100 calls/day scale (10 req/min per IP is generous)

---

### **Week 3-4: Usage Tracking & Billing**

#### 3.1 Add Call Logs Table

```sql
-- Migration: supabase/migrations/002_call_logs.sql
create table public.call_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  session_id text,
  message_type text, -- 'text' or 'voice'
  ai_response text,
  duration_ms integer, -- Time to generate response
  tokens_used integer, -- OpenAI tokens
  tts_chars integer, -- Minimax character count
  created_at timestamptz default now()
);

create index idx_call_logs_user on public.call_logs(user_id);
create index idx_call_logs_created on public.call_logs(created_at desc);
```

#### 3.2 Log Every Call in n8n Workflow

Add a node after "Format Response":

```json
{
  "name": "Log to Supabase",
  "type": "n8n-nodes-base.supabase",
  "parameters": {
    "operation": "insert",
    "table": "call_logs",
    "data": {
      "session_id": "={{ $('Webhook Trigger').item.json.headers['x-session-id'] }}",
      "ai_response": "={{ $('Extract AI Response').item.json.aiResponseText }}",
      "tokens_used": "={{ $('AI Agent').item.json.usage.total_tokens }}",
      "tts_chars": "={{ $('Extract AI Response').item.json.aiResponseText.length }}"
    }
  }
}
```

**Why**: Track usage for billing (e.g., $0.01 per AI call, $0.001 per TTS char)

#### 3.3 Simple Admin Dashboard

**File**: `app/admin/page.tsx`

```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ calls: 0, revenue: 0 })

  useEffect(() => {
    async function fetchStats() {
      const { data: logs } = await supabase
        .from('call_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())

      const { data: payments } = await supabase
        .from('payments_callwaiting')
        .select('amount')
        .eq('verified', true)

      setStats({
        calls: logs?.length || 0,
        revenue: payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Total Calls (30d)</p>
          <p className="text-3xl font-bold">{stats.calls}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold">${stats.revenue}</p>
        </div>
      </div>
    </div>
  )
}
```

**Why**: Simple visibility into usage and revenue

---

## **Security Checklist**

### Immediate (Week 1)
- [ ] Add HMAC validation to all webhooks
- [ ] Move API keys from n8n to Supabase Vault
- [ ] Enable HTTPS-only on all endpoints
- [ ] Add CORS restrictions (only your domain)

### Short-term (Week 2-3)
- [ ] Implement rate limiting (10 req/min per IP)
- [ ] Add Sentry error tracking
- [ ] Enable Supabase Auth (email + Google)
- [ ] Add JWT validation on protected routes

### Medium-term (Month 2)
- [ ] Add request logging to Supabase
- [ ] Implement usage-based billing tracker
- [ ] Add health check endpoint (`/api/health`)
- [ ] Set up uptime monitoring (UptimeRobot or Pingdom)

---

## **Data Flow: Secured**

### Before (Vulnerable)
```
User → n8n (public webhook) → OpenAI → Minimax → Response
```

### After (Hardened)
```
User
  → Next.js (HTTPS)
    → Supabase Edge Function (HMAC + rate limit)
      → n8n Cloud (validated request)
        → OpenAI (API key from vault)
        → Minimax (API key from vault)
        → Log to Supabase
      ← Response (no audio storage)
    ← Response to user
```

---

## **Cost Estimate (100 calls/day)**

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **Supabase** | <500MB DB, Edge Functions | $0 (free tier) |
| **Upstash Redis** | Rate limiting | $0 (free tier) |
| **n8n Cloud** | Starter plan | $20 |
| **OpenAI API** | 100 calls × 500 tokens | ~$1.50 |
| **Minimax TTS** | 100 × 100 chars | ~$2 |
| **Sentry** | Error tracking | $0 (free tier) |
| **Vercel** | Next.js hosting | $0 (hobby tier) |
| **Total** | | **~$23.50/month** |

At $300-500 setup fees, **break-even after 1 customer/month**.

---

## **Not Needed at 100 calls/day**

❌ Microservices (overkill)
❌ Kubernetes (way overkill)
❌ Multi-tenant RLS (single business)
❌ Long-term audio storage (ephemeral is fine)
❌ SOC2 compliance (premature)
❌ Background job queues (n8n handles async)
❌ CDN for audio (no storage = no CDN)

---

## **When to Scale Up (>1,000 calls/day)**

Then consider:
- Move from n8n Cloud → self-hosted (cost savings)
- Add Redis queue for AI/TTS (avoid timeouts)
- Multi-region deployment (latency)
- Add Prometheus metrics (observability)
- Implement proper multi-tenancy if adding agencies

---

## **Next Steps**

### Option A: DIY Implementation
1. Create Supabase project: https://supabase.com/dashboard
2. Set up Edge Functions (webhook proxy)
3. Configure Upstash Redis for rate limiting
4. Update frontend to use new endpoint
5. Test with Postman before deploying

### Option B: Guided Setup (Recommended)
I can help you:
1. Scaffold the Supabase Edge Function
2. Update the n8n workflow to log calls
3. Add Sentry error tracking
4. Implement basic auth
5. Create admin dashboard

**Estimated Time**: 2-3 days (with guidance)

---

## **Final Recommendation**

For **100 calls/day**, focus on:
1. ✅ Security (HMAC, secrets management)
2. ✅ Monitoring (Sentry, logs)
3. ✅ Basic auth (Supabase)
4. ✅ Simple dashboard

**Don't over-engineer**. Your current n8n setup is perfect for this scale. Just add the security layer and monitoring, and you're production-ready.

---

**Questions?**
1. Do you want me to scaffold the Supabase Edge Function now?
2. Should I add the call logging to your n8n workflow?
3. Need help setting up Sentry integration?

Let me know which part you want to tackle first!

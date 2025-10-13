<!-- 35eabb0d-4da1-4f11-8d0c-9eb4b905ef38 c6274837-c5cf-4e9f-98a7-6bc92785cfef -->
# CallWaiting AI – Payment & Lead Automation Plan

## Context

- **Supabase**: `https://bcufohulqrceytkrqpgd.supabase.co`
- **n8n**: `https://n8n.odia.dev`
- **Email**: `callwaitingai@gmail.com`
- **Payment Links**: 
    - Starter ($300): `https://flutterwave.com/pay/tcasx4xsfmdj`
    - Pro ($500): `https://flutterwave.com/pay/vcpp9rpmnvdm`

## Phase 1: Supabase Database Setup

### 1.1 Create Tables with Idempotency Protection (HARDENED)

**Critical Fix:** Single authoritative unique key (`flutterwave_id`) for idempotency. `transaction_ref` may be null for Payment Links.

Run SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Payments table with SINGLE unique constraint for idempotency
create table if not exists public.payments_callwaiting (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  email text,
  amount numeric,
  currency text,  -- NEVER default this; read from Flutterwave
  plan text check (plan in ('starter', 'pro')),
  transaction_ref text,  -- NOT unique (Payment Links may not provide custom ref)
  flutterwave_id text not null unique,  -- AUTHORITATIVE idempotency key
  payment_link_id text,  -- NEW: store link ID for plan detection
  status text,
  verified boolean default false,
  payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table
create table if not exists public.leads_callwaiting (
  id uuid primary key default uuid_generate_v4(),
  name text,
  business text,
  contact text,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.payments_callwaiting enable row level security;
alter table public.leads_callwaiting enable row level security;

-- Service role policies (n8n uses service_role key)
-- NOTE: service_role BYPASSES RLS by design - keep key server-side only
create policy "payments_service_all"
  on public.payments_callwaiting
  for all
  to service_role
  using (true)
  with check (true);

create policy "leads_service_all"
  on public.leads_callwaiting
  for all
  to service_role
  using (true)
  with check (true);

-- Indexes for performance
create index idx_payments_email on public.payments_callwaiting(email);
create index idx_payments_status on public.payments_callwaiting(status);
create index idx_payments_txref on public.payments_callwaiting(transaction_ref) where transaction_ref is not null;
create index idx_payments_link on public.payments_callwaiting(payment_link_id) where payment_link_id is not null;
create index idx_payments_created on public.payments_callwaiting(created_at desc);
create index idx_leads_created on public.leads_callwaiting(created_at desc);

-- Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $
begin
  new.updated_at = now();
  return new;
end;
$ language plpgsql;

create trigger update_payments_updated_at
  before update on public.payments_callwaiting
  for each row
  execute function update_updated_at_column();
```

### 1.2 Enable PITR Backups

In Supabase Dashboard → Settings → Database → enable Point-in-Time Recovery (requires Pro plan).

---

## Phase 2: n8n Workflow – Payment Processing

### 2.1 Environment Variables (n8n)

Set in n8n instance:

```bash
SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20
FLW_VERIF_HASH=<from Flutterwave dashboard>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=callwaitingai@gmail.com
SMTP_PASS=<Gmail App Password>
ALERT_EMAIL=callwaitingai@gmail.com
CALENDLY_LINK=https://calendly.com/odiadev-ai/callwaiting-demo
```

### 2.2 Workflow: Flutterwave → Supabase → Email

Create workflow with these nodes:

**Node 1: Webhook (Flutterwave)**

- Path: `/webhook/flutterwave`
- Method: POST
- Response: `{"received": true}` with 200 status

**Node 2: Verify Signature (Function)**

```javascript
// Flutterwave v3 uses direct hash comparison (NOT HMAC)
const headers = $input.first().json.headers;
const receivedHash = headers['verif-hash'] || headers['Verif-Hash'];
const expectedHash = $env.FLW_VERIF_HASH;

if (!receivedHash || receivedHash !== expectedHash) {
  return [{
    json: { 
      valid: false, 
      reason: 'Invalid signature',
      received: receivedHash,
      headers: headers
    }
  }];
}

return [{ json: { valid: true, body: $input.first().json.body } }];
```

**Node 3: IF Valid (Conditional)**

- Condition: `{{$json.valid}}` equals `true`
- True path → continue
- False path → Alert Bad Signature node

**Node 4: Map Payment Data (Function)**

```javascript
const data = $json.body?.data || {};
const customer = data.customer || {};

// Infer plan from amount
let plan = null;
if (data.amount === 300) plan = 'starter';
if (data.amount === 500) plan = 'pro';

return [{
  json: {
    full_name: customer.name || null,
    email: customer.email || null,
    amount: data.amount || null,
    currency: data.currency || 'USD',
    plan: plan,
    transaction_ref: data.tx_ref || `flw-${data.id}`,
    flutterwave_id: String(data.id),
    status: data.status || 'unknown',
    verified: true,
    payload: $json.body
  }
}];
```

**Node 5: Supabase Insert (Postgres)**

- Operation: `INSERT`
- Table: `payments_callwaiting`
- Conflict handling: `ON CONFLICT (transaction_ref) DO NOTHING` (idempotency)
- Map all fields from previous node

**Node 6: Email Customer (Send Email)**

```
From: CallWaiting AI <callwaitingai@gmail.com>
To: {{$json.email}}
Subject: Payment Received – Book Your CallWaiting AI Setup

Hi {{$json.full_name || 'there'}},

Thank you for your payment of ${{$json.amount}} for the {{$json.plan || 'CallWaiting AI'}} plan!

Next step: Book your 15-minute setup call here:
{{$env.CALENDLY_LINK}}

Your reference: {{$json.transaction_ref}}

— CallWaiting AI Team
```

**Node 7: Alert Founder (Send Email)**

```
From: CallWaiting AI <callwaitingai@gmail.com>
To: {{$env.ALERT_EMAIL}}
Subject: 💰 New Payment: {{$json.plan}} – ${{$json.amount}}

Customer: {{$json.full_name}}
Email: {{$json.email}}
Plan: {{$json.plan}}
Amount: {{$json.amount}} {{$json.currency}}
Status: {{$json.status}}
Ref: {{$json.transaction_ref}}
```

**Node 8: Alert Bad Signature (Send Email)**

```
From: CallWaiting AI <callwaitingai@gmail.com>
To: {{$env.ALERT_EMAIL}}
Subject: ⚠️ Flutterwave Webhook FAILED Signature

Reason: {{$json.reason}}
Received Hash: {{$json.received}}
Headers: {{JSON.stringify($json.headers)}}
```

### 2.3 Configure Gmail App Password

1. Enable 2-Step Verification on `callwaitingai@gmail.com`
2. Go to Google Account → Security → App Passwords
3. Create new app password for "Mail" / "n8n"
4. Use this password in `SMTP_PASS` env var

---

## Phase 3: n8n Workflow – Lead Capture

### 3.1 Workflow: Lead Form → Supabase → Alert

Create second workflow:

**Node 1: Webhook (Lead Form)**

- Path: `/webhook/leads_callwaiting`
- Method: POST
- Response: `{"success": true}`

**Node 2: Supabase Insert**

- Table: `leads_callwaiting`
- Map: `name`, `business`, `contact`, `description` from webhook body

**Node 3: Alert Founder**

```
Subject: 🎯 New Lead: {{$json.name}}

Name: {{$json.name}}
Business: {{$json.business}}
Contact: {{$json.contact}}
Description: {{$json.description}}
```

---

## Phase 4: Frontend Integration

### 4.1 Update Payment Buttons

In `callwaiting-landing.tsx`:

**Line 217-219 (Starter button):**

```tsx
<a 
  href="https://flutterwave.com/pay/tcasx4xsfmdj"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full px-6 py-4 bg-slate-700 rounded-full font-bold hover:bg-slate-600 transition-all duration-300 text-center block"
>
  Pay Now – $300
</a>
<p className="text-xs text-slate-400 text-center mt-3">
  After payment, check your email to book your setup call
</p>
```

**Line 244-246 (Pro button):**

```tsx
<a 
  href="https://flutterwave.com/pay/vcpp9rpmnvdm"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-center block"
>
  Pay Now – $500
</a>
<p className="text-xs text-slate-400 text-center mt-3">
  After payment, check your email to book your setup call
</p>
```

### 4.2 Wire Lead Form to n8n

**Line 14-25 (handleSubmit function):**

```tsx
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('https://n8n.odia.dev/webhook/leads_callwaiting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      setSubmitStatus('success');
      setFormData({ name: '', business: '', contact: '', description: '' });
    } else {
      setSubmitStatus('error');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Line 380-384 (add error state):**

```tsx
{submitStatus === 'success' && (
  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center text-green-300">
    Thank you! We'll be in touch within 24 hours.
  </div>
)}
{submitStatus === 'error' && (
  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center text-red-300">
    Something went wrong. Please try again or email us directly.
  </div>
)}
```

---

## Phase 5: Security & Reliability

### 5.1 Flutterwave Webhook Configuration

In Flutterwave Dashboard:

1. Go to Settings → Webhooks
2. Set URL: `https://n8n.odia.dev/webhook/flutterwave`
3. Enable: `charge.completed`, `transfer.completed`
4. Set Secret Hash (copy to n8n `FLW_VERIF_HASH`)
5. Enable retries (3 attempts)

### 5.2 Cloudflare WAF Rules

In Cloudflare Dashboard for `odia.dev`:

1. Create WAF Custom Rule:

      - Name: "n8n Webhook Protection"
      - Expression: `(http.request.uri.path contains "/webhook/" and http.request.method ne "POST")`
      - Action: Block

2. Create Rate Limiting Rule:

      - Path: `/webhook/*`
      - Rate: 60 requests per minute per IP
      - Action: Block for 10 minutes

### 5.3 n8n Queue Mode (Optional but Recommended)

If using Docker Compose, update to:

```yaml
services:
  n8n:
    environment:
   - EXECUTIONS_MODE=queue
   - QUEUE_BULL_REDIS_HOST=redis
   - QUEUE_BULL_REDIS_PORT=6379
  
  redis:
    image: redis:7-alpine
    
  n8n-worker:
    image: n8nio/n8n
    command: worker
    environment:
   - EXECUTIONS_MODE=queue
   - QUEUE_BULL_REDIS_HOST=redis
```

### 5.4 Email Deliverability (SPF/DKIM/DMARC)

In DNS for `callwaitingai.dev` or your domain:

```
TXT @ "v=spf1 include:_spf.google.com ~all"
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:callwaitingai@gmail.com"
```

Enable DKIM in Google Workspace Admin Console.

---

## Phase 6: Testing & Validation

### 6.1 Test Checklist

- [ ] Flutterwave Test Mode payment → webhook fires → Supabase row created → emails sent
- [ ] Send webhook with wrong `verif-hash` → rejected, alert sent
- [ ] Send same webhook twice → only one DB row (idempotency works)
- [ ] Lead form submission → Supabase row + alert email
- [ ] Customer email lands in Inbox (not spam)
- [ ] Cloudflare blocks non-POST requests to `/webhook/`

### 6.2 Reconciliation Job (Future)

Create scheduled n8n workflow (runs daily):

1. Query Flutterwave API for last 24h transactions
2. Compare with Supabase `payments_callwaiting`
3. Alert if any missing records

---

## Key Files Modified

- `/Users/odiadev/callwaitingai.dev 2025/callwaiting-landing.tsx` (payment buttons, form handler)

## External Configurations

- Supabase: SQL schema + RLS + PITR
- n8n: 2 workflows (payments, leads) + env vars
- Flutterwave: webhook URL + secret hash
- Gmail: app password
- Cloudflare: WAF rules + rate limiting
- DNS: SPF/DKIM/DMARC records

## Success Criteria

1. Live payment of $1 → customer receives email with Calendly link within 60 seconds
2. Founder receives payment alert
3. Duplicate webhooks don't create duplicate DB rows
4. Invalid signatures are rejected and alerted
5. Lead form submissions save to Supabase and trigger alerts
6. All emails land in primary inbox (not spam)

### To-dos

- [ ] Create Supabase tables (payments_callwaiting, leads_callwaiting) with RLS policies and unique constraints
- [ ] Build n8n payment workflow: webhook → verify signature → map data → upsert Supabase → send emails
- [ ] Build n8n lead capture workflow: webhook → insert Supabase → alert founder
- [ ] Generate Gmail app password for SMTP in n8n
- [ ] Update landing page payment buttons to link to Flutterwave with trust messaging
- [ ] Wire lead form to n8n webhook with error handling
- [ ] Configure Flutterwave webhook URL and secret hash in dashboard
- [ ] Set up Cloudflare WAF rules and rate limiting for n8n webhooks
- [ ] Test end-to-end: payment → webhook → DB → emails, verify idempotency and signature validation
- [ ] Test lead form submission → Supabase → alert email
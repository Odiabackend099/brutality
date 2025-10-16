# CallWaiting AI - MDP Backend Documentation

Complete backend implementation for the CallWaiting AI platform with Flutterwave payments, MiniMax TTS, and OpenAI integration.

---

## 🎯 Overview

This MDP (Minimum Delightful Product) enables users to:

- **Sign up** and create custom AI voice agents
- **Configure** agents with custom prompts and voice presets
- **Test** agents via webhook endpoints
- **Track** usage minutes with quota enforcement
- **Upgrade** plans via Flutterwave payment links
- **Scale** from 60 free minutes to 50,000 enterprise minutes

---

## 📦 Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth, Postgres, RLS)
- **Flutterwave** (Payment links, webhooks)
- **MiniMax** (Text-to-Speech)
- **OpenAI** (GPT-4o-mini for AI responses)

---

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install flutterwave-node-v3 openai @supabase/ssr
```

### 2. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your keys:

```bash
# Supabase (from Supabase dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Flutterwave (from Flutterwave dashboard)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxx
FLUTTERWAVE_WEBHOOK_SECRET_HASH=your-hash
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx

# MiniMax TTS
MINIMAX_API_KEY=your-key
MINIMAX_GROUP_ID=your-group-id

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Apply Database Schema

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Copy-paste contents from sql/schema.sql
```

Or if you have Supabase CLI:

```bash
supabase db push
```

This creates:
- `profiles` - User profiles with quota tracking
- `agents` - AI agents with prompts and API keys
- `usage_logs` - Usage tracking (TTS, inference)
- `subscriptions` - Flutterwave payment records

All tables have **Row Level Security (RLS)** enabled.

### 4. Start Development Server

```bash
npm run dev
```

---

## 🧪 Testing

### Test Payment Flow

1. **Setup webhook forwarding** (for local testing):

```bash
# Install ngrok (or similar)
brew install ngrok

# Forward port 3000
ngrok http 3000

# Update Flutterwave webhook URL in dashboard:
# https://your-subdomain.ngrok.io/api/flutterwave-webhook
```

2. **Create a payment link**:

```bash
# Sign in first to get session cookie
# Then:
curl -X POST http://localhost:3000/api/create-payment-link \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_SESSION_TOKEN" \
  -d '{"plan": "basic"}'
```

3. **Complete payment** via returned link

4. **Verify** webhook received and quota updated in Supabase

### Test Agent Webhook

1. **Create an agent**:

```bash
curl -X POST http://localhost:3000/api/create-agent \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "My AI Receptionist",
    "systemPrompt": "You are a friendly AI assistant.",
    "voiceId": "professional_f"
  }'
```

Response includes `apiKey` and `webhookUrl`.

2. **Test the webhook**:

```bash
curl -X POST http://localhost:3000/api/agent/AGENT_ID/webhook \
  -H "Content-Type: application/json" \
  -H "X-AGENT-KEY: agt_xxxxxxxxxx" \
  -d '{"message": "What are your business hours?"}'
```

3. **Check response**:

```json
{
  "replyText": "We're open Monday to Friday, 9 AM to 5 PM.",
  "audioUrl": "https://cdn.minimax.com/audio/xxx.mp3",
  "duration": 4.2
}
```

### Test Usage Tracking

```bash
curl http://localhost:3000/api/usage-report \
  -H "Cookie: sb-access-token=YOUR_SESSION_TOKEN"
```

Response:
```json
{
  "minutesUsed": 5,
  "minutesQuota": 60,
  "remaining": 55,
  "plan": "trial"
}
```

---

## 📡 API Endpoints

### POST `/api/create-agent`

**Auth:** Required (Supabase session)

**Body:**
```json
{
  "name": "My Agent",
  "systemPrompt": "You are...",
  "voiceId": "professional_f"
}
```

**Response (201):**
```json
{
  "agentId": "uuid",
  "apiKey": "agt_xxx",
  "webhookUrl": "https://app.com/api/agent/uuid/webhook",
  "name": "My Agent",
  "voiceId": "professional_f"
}
```

---

### POST `/api/generate-voice`

**Auth:** Required

**Body:**
```json
{
  "text": "Hello world",
  "voiceId": "professional_f"
}
```

**Response (200):**
```json
{
  "audioUrl": "https://cdn.example.com/audio.mp3",
  "duration": 2.5
}
```

**Errors:**
- `402` - Quota exceeded

---

### GET `/api/usage-report`

**Auth:** Required

**Response (200):**
```json
{
  "minutesUsed": 45,
  "minutesQuota": 60,
  "remaining": 15,
  "plan": "trial"
}
```

---

### POST `/api/create-payment-link`

**Auth:** Required

**Body:**
```json
{
  "plan": "basic"
}
```

**Response (200):**
```json
{
  "paymentLink": "https://checkout.flutterwave.com/xxxxx",
  "txRef": "cw_xxxxx"
}
```

---

### POST `/api/agent/:id/webhook`

**Auth:** `X-AGENT-KEY` header (per-agent API key)

**Body:**
```json
{
  "message": "User question here"
}
```

**Response (200):**
```json
{
  "replyText": "AI response",
  "audioUrl": "https://cdn.example.com/reply.mp3",
  "duration": 4.2
}
```

**Errors:**
- `401` - Invalid API key
- `402` - Quota exceeded
- `403` - Agent inactive

---

### POST `/api/flutterwave-webhook`

**Auth:** Webhook signature verification

Handles Flutterwave payment events:
- `charge.completed` - Activates subscription and updates quota

---

## 📊 Database Schema

### `profiles`
- `id` (uuid, FK to auth.users)
- `email`, `full_name`
- `minutes_quota`, `minutes_used`
- `plan` ('trial', 'basic', 'pro', 'enterprise')

### `agents`
- `id` (uuid)
- `user_id` (FK to auth.users)
- `name`, `system_prompt`, `voice_id`
- `api_key` (unique per agent)
- `webhook_url`
- `is_active`

### `usage_logs`
- `id` (uuid)
- `user_id`, `agent_id`
- `kind` ('tts' or 'inference')
- `seconds`, `cost_cents`
- `meta` (jsonb)

### `subscriptions`
- `id` (uuid)
- `user_id`
- `flutterwave_tx_ref`, `flutterwave_transaction_id`
- `plan`, `status`, `amount`, `currency`
- `current_period_start`, `current_period_end`

---

## 💰 Pricing Plans

| Plan       | Minutes | Price (NGN) | Price (USD) |
|------------|---------|-------------|-------------|
| Trial      | 60      | ₦0          | $0          |
| Basic      | 500     | ₦2,900      | ~$2.90      |
| Pro        | 5,000   | ₦7,900      | ~$7.90      |
| Enterprise | 50,000  | ₦19,900     | ~$19.90     |

Adjust in `.env.local` via:
- `BASIC_PLAN_AMOUNT`
- `PRO_PLAN_AMOUNT`
- `ENTERPRISE_PLAN_AMOUNT`

---

## 🔐 Security

✅ **Implemented:**
- RLS on all tables (users can only access their own data)
- Per-agent API keys for public webhooks
- Flutterwave webhook signature verification
- Quota enforcement before expensive operations
- Service role key never exposed to client

⚠️ **TODO (Production):**
- Rate limiting on public endpoints
- API key rotation
- PII masking in logs
- CORS restrictions
- WAF rules (Cloudflare)

---

## 🧪 Seed Demo Data

```bash
# 1. Sign up a user at http://localhost:3000/signup
# 2. Get user ID from Supabase dashboard
# 3. Set in .env.local:
DEMO_USER_ID=your-uuid-here

# 4. Run seed
npx tsx scripts/seed.ts
```

---

## 🛠 Troubleshooting

### "Module not found: '@supabase/ssr'"

```bash
npm install @supabase/ssr
```

### "Failed to create payment link"

Check:
1. Flutterwave keys are correct (test vs live)
2. `NEXT_PUBLIC_APP_URL` is set
3. Webhook hash matches Flutterwave dashboard

### "Quota exceeded"

Check `profiles.minutes_used` vs `minutes_quota` in Supabase.

Reset manually:
```sql
UPDATE profiles SET minutes_used = 0 WHERE id = 'user-id';
```

### Webhook not received

1. Use ngrok to expose localhost
2. Set webhook URL in Flutterwave dashboard
3. Check webhook logs in Flutterwave dashboard
4. Verify `FLUTTERWAVE_WEBHOOK_SECRET_HASH`

---

## 📚 Next Steps

### v1.1 - Twilio/Vapi Integration
- Provision real phone numbers
- Handle inbound/outbound calls
- Call recording

### v1.2 - Multi-Channel
- WhatsApp integration
- TikTok Shop integration
- Web chat widget

### v1.3 - Analytics Dashboard
- Call duration graphs
- Cost per call
- Customer satisfaction

### v1.4 - Team Features
- Multi-user workspaces
- Agent templates
- Shared usage pools

---

## 💡 Tips

- **Development:** Use Flutterwave **test keys** to avoid real charges
- **Production:** Set `NODE_ENV=production` and use **live keys**
- **Monitoring:** Check Supabase logs for RLS violations
- **Cost:** MiniMax TTS ~$0.001/char, OpenAI GPT-4o-mini ~$0.0001/token

---

## 🤝 Support

For issues or questions:
- Check Supabase logs (Dashboard → Logs)
- Check Next.js console output
- Review Flutterwave webhook logs
- Verify environment variables

---

**Built with ❤️ for CallWaiting AI MDP**


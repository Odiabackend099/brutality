# MDP Backend Scaffold — CallWaiting AI (Flutterwave Edition)

You are CLADE/Cursor. Scaffold an MDP backend for "CallWaiting AI — AI Agent Platform for Custom Voice & Prompts" using Next.js (App Router) + Supabase + **Flutterwave** + MiniMax TTS. Optimize for fastest path to paid usage with a minimal, reliable implementation.

---

## 🎯 GOALS

- Users can sign up/sign in and create an "Agent" with: name, system prompt, voice preset.
- System issues a unique webhook/test URL for that Agent.
- Simple voice pipeline: text reply → MiniMax TTS → MP3 back to client.
- **Free trial: 60 minutes per workspace/user. Flutterwave subscription upgrades unlock higher limits.**
- Track usage minutes and enforce limits. Secure with per-agent API key + RLS.

---

## 🛠 STACK

- **Next.js 14 App Router** (TypeScript), Route Handlers under `app/api/*`
- **Supabase** (Auth, Postgres, RLS). Use `supabase-js` for client, `@supabase/ssr` for server cookie-aware calls.
- **Flutterwave** (subscriptions, webhooks, payment links)
- **MiniMax TTS** for audio
- Optional: Supabase Edge Function or API route for the public-facing agent webhook

---

## 📦 DELIVERABLES

### 1) Project Structure (existing app retained; add backend):

```
app/api/
  ├── create-agent/route.ts          # POST - create new agent
  ├── generate-voice/route.ts        # POST - TTS generation
  ├── usage-report/route.ts          # GET - user quota/usage
  ├── flutterwave-webhook/route.ts   # POST - payment webhooks
  ├── create-payment-link/route.ts   # POST - initiate upgrade
  └── agent/[id]/webhook/route.ts    # POST - public test endpoint

lib/
  ├── supabase-server.ts             # server client (SSR)
  ├── supabase-client.ts             # browser client
  ├── flutterwave.ts                 # Flutterwave SDK wrapper
  ├── minimax.ts                     # MiniMax TTS helper
  └── usage.ts                       # usage enforcement

sql/
  └── schema.sql                     # tables + RLS policies

scripts/
  └── seed.ts                        # seed demo data

docs/
  ├── OpenAPI.md                     # endpoint contracts
  └── README_BACKEND.md              # runbook

.env.example                         # all required vars
```

---

## 🗄️ 2) Database Schema (`sql/schema.sql`)

```sql
-- Core tables
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  minutes_quota integer NOT NULL DEFAULT 60,
  minutes_used integer NOT NULL DEFAULT 0,
  plan text NOT NULL DEFAULT 'trial',  -- 'trial' | 'basic' | 'pro' | 'enterprise'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  system_prompt text NOT NULL,
  voice_id text NOT NULL,           -- minimax voice preset slug
  api_key text NOT NULL UNIQUE,     -- per-agent secret for public calls
  webhook_secret text NOT NULL,
  webhook_url text,                 -- generated public URL
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('tts', 'inference')),
  seconds integer NOT NULL DEFAULT 0,
  cost_cents integer NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flutterwave_customer_id text,
  flutterwave_transaction_id text,
  flutterwave_tx_ref text,
  plan text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'inactive',  -- 'active' | 'inactive' | 'pending' | 'cancelled'
  amount integer NOT NULL DEFAULT 0,        -- in kobo/cents
  currency text NOT NULL DEFAULT 'NGN',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_api_key ON agents(api_key);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_agent_id ON usage_logs(agent_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_flutterwave_tx_ref ON subscriptions(flutterwave_tx_ref);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY p_profiles_select ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY p_profiles_update ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY p_agents_select ON agents 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY p_agents_insert ON agents 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY p_agents_update ON agents 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY p_agents_delete ON agents 
  FOR DELETE USING (auth.uid() = user_id);

-- Usage logs policies
CREATE POLICY p_usage_select ON usage_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY p_usage_insert ON usage_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY p_subs_select ON subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY p_subs_update ON subscriptions 
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔐 3) Environment Variables (`.env.example`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # server-only

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxxxxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxxxxxxxxx
FLUTTERWAVE_WEBHOOK_SECRET_HASH=your-webhook-hash
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxx

# MiniMax TTS
MINIMAX_API_KEY=your-minimax-api-key
MINIMAX_GROUP_ID=your-minimax-group-id

# OpenAI (for AI inference)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Pricing (in Naira for Nigeria, adjust per market)
BASIC_PLAN_AMOUNT=2900      # ₦29/month
PRO_PLAN_AMOUNT=7900        # ₦79/month
ENTERPRISE_PLAN_AMOUNT=19900 # ₦199/month
```

---

## 🔧 4) Server Clients

### `lib/supabase-server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting in Server Components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal in Server Components
          }
        },
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          } catch (error) {
            // Handle multiple cookie setting
          }
        }
      }
    }
  )
}

export function createServiceSupabase() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
```

### `lib/supabase-client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 💳 5) Flutterwave Integration (`lib/flutterwave.ts`)

```typescript
import Flutterwave from 'flutterwave-node-v3'

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
)

export interface PaymentLinkData {
  tx_ref: string
  amount: number
  currency: string
  redirect_url: string
  customer: {
    email: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo?: string
  }
  meta?: Record<string, any>
}

export async function createPaymentLink(data: PaymentLinkData) {
  try {
    const payload = {
      tx_ref: data.tx_ref,
      amount: data.amount,
      currency: data.currency || 'NGN',
      redirect_url: data.redirect_url,
      customer: data.customer,
      customizations: data.customizations,
      meta: data.meta
    }

    const response = await flw.PaymentLink.create(payload)
    return response
  } catch (error) {
    console.error('Flutterwave payment link error:', error)
    throw new Error('Failed to create payment link')
  }
}

export async function verifyTransaction(transactionId: string) {
  try {
    const response = await flw.Transaction.verify({ id: transactionId })
    return response
  } catch (error) {
    console.error('Flutterwave verification error:', error)
    throw new Error('Failed to verify transaction')
  }
}

export function verifyWebhookSignature(hash: string) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!
  return hash === secretHash
}

// Plan pricing in kobo/cents (Nigerian Naira)
export const PLANS = {
  trial: {
    name: 'Trial',
    minutes: 60,
    amount: 0,
    currency: 'NGN'
  },
  basic: {
    name: 'Basic',
    minutes: 500,
    amount: parseInt(process.env.BASIC_PLAN_AMOUNT || '2900'),
    currency: 'NGN'
  },
  pro: {
    name: 'Pro',
    minutes: 5000,
    amount: parseInt(process.env.PRO_PLAN_AMOUNT || '7900'),
    currency: 'NGN'
  },
  enterprise: {
    name: 'Enterprise',
    minutes: 50000,
    amount: parseInt(process.env.ENTERPRISE_PLAN_AMOUNT || '19900'),
    currency: 'NGN'
  }
} as const

export type PlanType = keyof typeof PLANS
```

---

## 🎤 6) MiniMax TTS Helper (`lib/minimax.ts`)

```typescript
export const VOICE_PRESETS = {
  professional_f: 'female-professional-en',
  professional_m: 'male-professional-en',
  soft_f: 'female-soft-en',
  warm_m: 'male-warm-en'
} as const

export type VoiceId = keyof typeof VOICE_PRESETS

interface TTSResponse {
  audioUrl?: string
  audioBuffer?: Buffer
  duration?: number
  error?: string
}

export async function generateTTS(text: string, voiceId: VoiceId): Promise<TTSResponse> {
  const apiKey = process.env.MINIMAX_API_KEY
  const groupId = process.env.MINIMAX_GROUP_ID

  if (!apiKey || !groupId) {
    throw new Error('MiniMax API key or Group ID not configured')
  }

  try {
    const response = await fetch('https://api.minimax.chat/v1/t2a_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'speech-01',
        text,
        voice_id: VOICE_PRESETS[voiceId],
        audio_setting: {
          sample_rate: 24000,
          bitrate: 128000,
          format: 'mp3'
        },
        group_id: groupId
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('MiniMax TTS error:', error)
      throw new Error(`MiniMax API error: ${response.status}`)
    }

    const data = await response.json()
    
    // MiniMax returns audio as base64 or URL
    if (data.audio_file) {
      return {
        audioUrl: data.audio_file,
        duration: data.duration
      }
    } else if (data.audio) {
      // Base64 audio
      const audioBuffer = Buffer.from(data.audio, 'base64')
      return {
        audioBuffer,
        duration: data.duration
      }
    }

    throw new Error('No audio data in MiniMax response')
  } catch (error) {
    console.error('TTS generation failed:', error)
    return {
      error: error instanceof Error ? error.message : 'TTS generation failed'
    }
  }
}

export function estimateDuration(text: string): number {
  // Rough estimate: ~150 words per minute
  const words = text.split(/\s+/).length
  return Math.ceil((words / 150) * 60)
}
```

---

## 📊 7) Usage Enforcement (`lib/usage.ts`)

```typescript
import { createServiceSupabase } from './supabase-server'

export interface Usage {
  minutesUsed: number
  minutesQuota: number
  plan: string
  remaining: number
}

export async function getUsage(userId: string): Promise<Usage> {
  const supabase = createServiceSupabase()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('minutes_used, minutes_quota, plan')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    throw new Error('Failed to fetch usage data')
  }

  return {
    minutesUsed: profile.minutes_used,
    minutesQuota: profile.minutes_quota,
    plan: profile.plan,
    remaining: profile.minutes_quota - profile.minutes_used
  }
}

export async function assertWithinQuota(userId: string, secondsNeeded: number) {
  const usage = await getUsage(userId)
  const minutesNeeded = Math.ceil(secondsNeeded / 60)
  
  if (usage.remaining < minutesNeeded) {
    throw new Error('Quota exceeded. Please upgrade your plan.')
  }
  
  return true
}

export async function addUsage(
  userId: string,
  agentId: string,
  usage: {
    seconds: number
    kind: 'tts' | 'inference'
    costCents?: number
    meta?: Record<string, any>
  }
) {
  const supabase = createServiceSupabase()
  const minutes = Math.ceil(usage.seconds / 60)

  // Insert usage log
  const { error: logError } = await supabase
    .from('usage_logs')
    .insert({
      user_id: userId,
      agent_id: agentId,
      kind: usage.kind,
      seconds: usage.seconds,
      cost_cents: usage.costCents || 0,
      meta: usage.meta || {}
    })

  if (logError) {
    console.error('Failed to log usage:', logError)
  }

  // Update profile minutes
  const { error: updateError } = await supabase.rpc('increment_minutes_used', {
    user_id: userId,
    minutes_to_add: minutes
  })

  if (updateError) {
    // Fallback: manual update
    const { data: profile } = await supabase
      .from('profiles')
      .select('minutes_used')
      .eq('id', userId)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ 
          minutes_used: profile.minutes_used + minutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }
  }
}

// Helper SQL function (add to schema.sql)
/*
CREATE OR REPLACE FUNCTION increment_minutes_used(user_id uuid, minutes_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET minutes_used = minutes_used + minutes_to_add,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
*/
```

---

## 🌐 8) API Endpoints (OpenAPI.md)

### POST `/api/create-agent`

**Auth:** Required (Supabase session)

**Request:**
```json
{
  "name": "My AI Receptionist",
  "systemPrompt": "You are Lily, a friendly AI receptionist for my TikTok shop.",
  "voiceId": "professional_f"
}
```

**Response (201):**
```json
{
  "agentId": "uuid",
  "apiKey": "agt_xxxxxxxxxxxxx",
  "webhookUrl": "https://yourapp.com/api/agent/uuid/webhook",
  "name": "My AI Receptionist",
  "voiceId": "professional_f"
}
```

**Errors:** 401, 422, 500

---

### POST `/api/generate-voice`

**Auth:** Required

**Request:**
```json
{
  "text": "Hello, welcome to our store!",
  "voiceId": "professional_f"
}
```

**Response (200):**
```json
{
  "audioUrl": "https://cdn.example.com/audio/xxx.mp3",
  "duration": 3.5
}
```

**Errors:** 401, 402 (quota exceeded), 422, 500

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

### POST `/api/agent/:id/webhook`

**Auth:** Header `X-AGENT-KEY` (per-agent API key)

**Request:**
```json
{
  "message": "What are your business hours?"
}
```

**Response (200):**
```json
{
  "replyText": "We're open Monday to Friday, 9 AM to 5 PM.",
  "audioUrl": "https://cdn.example.com/audio/reply-xxx.mp3",
  "duration": 4.2
}
```

**Errors:** 401 (invalid API key), 402 (quota exceeded), 500

---

### POST `/api/create-payment-link`

**Auth:** Required

**Request:**
```json
{
  "plan": "basic"
}
```

**Response (200):**
```json
{
  "paymentLink": "https://checkout.flutterwave.com/xxxxx",
  "txRef": "txn_xxxxxxxxxxxxx"
}
```

---

### POST `/api/flutterwave-webhook`

**Auth:** Webhook signature verification

**Request:** Flutterwave webhook payload

**Response (200):**
```json
{
  "status": "success"
}
```

---

## 🧪 9) Seed Script (`scripts/seed.ts`)

```typescript
import { createServiceSupabase } from '../lib/supabase-server'
import { randomBytes } from 'crypto'

async function seed() {
  const supabase = createServiceSupabase()

  // Create demo user (assumes user already exists in auth)
  const demoUserId = 'your-demo-user-uuid'

  // Create profile
  await supabase.from('profiles').upsert({
    id: demoUserId,
    email: 'demo@callwaitingai.dev',
    full_name: 'Demo User',
    minutes_quota: 60,
    minutes_used: 10,
    plan: 'trial'
  })

  // Create demo agent
  const apiKey = `agt_${randomBytes(16).toString('hex')}`
  const webhookSecret = randomBytes(32).toString('hex')

  const { data: agent } = await supabase.from('agents').insert({
    user_id: demoUserId,
    name: 'Demo AI Receptionist',
    system_prompt: 'You are a helpful AI receptionist for a small business.',
    voice_id: 'professional_f',
    api_key: apiKey,
    webhook_secret: webhookSecret,
    webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/${agent?.id}/webhook`
  }).select().single()

  console.log('✅ Seed complete')
  console.log('Agent ID:', agent?.id)
  console.log('API Key:', apiKey)
}

seed().catch(console.error)
```

---

## 📝 10) Runbook (`README_BACKEND.md`)

### Setup

1. **Install dependencies:**
   ```bash
   npm install @supabase/ssr @supabase/supabase-js flutterwave-node-v3 openai
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Fill in Supabase, Flutterwave, MiniMax, and OpenAI keys

3. **Apply database schema:**
   ```bash
   # Via Supabase CLI
   supabase db push

   # Or via SQL editor in Supabase dashboard
   # Copy-paste sql/schema.sql
   ```

4. **Seed demo data:**
   ```bash
   npx tsx scripts/seed.ts
   ```

### Development

```bash
npm run dev
```

### Testing Payment Flow

1. **Setup Flutterwave webhook forwarding:**
   ```bash
   # Use ngrok or similar
   ngrok http 3000

   # Set webhook URL in Flutterwave dashboard:
   # https://your-ngrok-url.ngrok.io/api/flutterwave-webhook
   ```

2. **Create payment link:**
   ```bash
   curl -X POST http://localhost:3000/api/create-payment-link \
     -H "Content-Type: application/json" \
     -H "Cookie: sb-access-token=xxx" \
     -d '{"plan": "basic"}'
   ```

3. **Complete payment** via returned link

4. **Verify webhook** received and quota updated

### Testing Agent Webhook

```bash
curl -X POST http://localhost:3000/api/agent/YOUR_AGENT_ID/webhook \
  -H "Content-Type: application/json" \
  -H "X-AGENT-KEY: agt_xxxxxxxxxxxxx" \
  -d '{"message": "Hello, what are your hours?"}'
```

---

## ✅ ACCEPTANCE CRITERIA

- ✅ User can sign up, create agent with prompt + voice
- ✅ Agent webhook returns AI reply + TTS audio
- ✅ Usage tracking updates minutes_used in real-time
- ✅ 60-min trial enforced (402 error when exceeded)
- ✅ Flutterwave payment link upgrades plan and increases quota
- ✅ Webhook signature verified for security
- ✅ All tables use RLS; endpoints return 401/403/402 appropriately
- ✅ curl/Postman examples work end-to-end

---

## 🚫 CONSTRAINTS / NON-GOALS

- ❌ No phone number provisioning (use webhook URL as "test link")
- ❌ No voice recording upload (MDP scope)
- ❌ No complex analytics dashboard (just basic usage report)
- ❌ No multi-channel integration yet (WhatsApp/TikTok deferred)
- ❌ No recurring subscriptions (one-time payment per plan tier for MDP)

---

## 🔐 SECURITY CHECKLIST

- ✅ RLS enabled on all tables
- ✅ Service role key never exposed to client
- ✅ Per-agent API keys for public webhooks
- ✅ Flutterwave webhook signature verification
- ✅ Quota enforcement before expensive operations
- ✅ PII masked in logs
- ✅ CORS restricted to app domain
- ✅ Rate limiting on public endpoints (TODO: add middleware)

---

**Ready to scaffold? Let's build the MDP! 🚀**


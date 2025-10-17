# 🔧 Vercel Environment Variables Setup

## Quick Copy-Paste for Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

---

## ✅ Required Variables (Copy All Below)

```env
# ODIADEV AI TTS
ODIADEV_TTS_API_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJPRElBIGJhY2tlbmQiLCJVc2VyTmFtZSI6Ik9ESUEgYmFja2VuZCIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTMzNTEwOTg4MDAzMjgzNzUxIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkzMzUxMDk4Nzk5NDg5NTE0MyIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im9kaWFiYWNrZW5kQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTEwLTE2IDA0OjE2OjE4IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.S0kZ7gf6QVL0kXC2z0bil95E0DTzvDRHY9zi_qehWa0ojG4ESeEVxcNkXWacKC5XjWud-X4Qt9K0tfNZdfbBi_LyPwZJEEnug6E_dsKNykaQecSNTyJHKmmHYR_vMJNujLGH2Lv6UsfNHGUVB4AotCx1O2tcNZU_jT0jM3KdhHjds6m2oQ20GlxhtATTf0_SNzh_pX0l-TXEnWj-EVsMmmNmzP9-HP99W6mXqonQv-u3iLMm95gEOhtnVFB_nk-YZ7se_Om9z3wOKVLNotwm_GQJDx2wV9hD0zciJppm2vK8WSJ-St0Hdt412jzcx_aO2j6wRgrM1vbwG6BU5x2LEQ

ODIADEV_TTS_GROUP_ID=1933510987994895143

ODIADEV_TTS_VOICE_ID=moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82

# Twilio Voice
TWILIO_ACCOUNT_SID=AC71e23abea62aa4157d209ead494e4ed8

TWILIO_AUTH_TOKEN=166c106a86a890dbffe2d7d22b125098

TWILIO_PHONE_NUMBER=+12184003410

TWILIO_WHATSAPP_NUMBER=+14155238886

# Demo Phone (Public)
NEXT_PUBLIC_DEMO_PHONE=+12184003410

# OpenAI (Already set)
OPENAI_API_KEY=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

# Groq (Faster alternative)
GROQ_API_KEY=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

# Supabase (Already set)
NEXT_PUBLIC_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTA2NTUsImV4cCI6MjA3NTA4NjY1NX0.rc9-fFpLsTyESK-222zYVKGVx-R5mwb9Xi005p_bwoI

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdWZvaHVscXJjZXl0a3JxcGdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMDY1NSwiZXhwIjoyMDc1MDg2NjU1fQ.MnAx995nIesaRNrat85o4qUv3kdEoZoRHrHpyPnTx20

# Flutterwave (Already set)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-616563ce06d35a7703808a6d585c1446-X

FLUTTERWAVE_SECRET_KEY=FLWSECK-2b09a8c982fcb3cb9e53d6c971ff6253-199df9f902fvt-X

FLUTTERWAVE_ENCRYPTION_KEY=2b09a8c982fc4a979da3d873

FLUTTERWAVE_WEBHOOK_SECRET_HASH=cwai_prod_webhook_2025_secure_random_32chars

# App Config (Already set)
NEXT_PUBLIC_APP_URL=https://callwaitingai.dev

NEXT_PUBLIC_WEBHOOK_SECRET=cwai_prod_webhook_2025_secure_random_32chars

NEXT_PUBLIC_BRAND_NAME=CallWaiting AI

# Pricing (Already set)
STARTER_PLAN_AMOUNT=2000

PRO_PLAN_AMOUNT=8000

ENTERPRISE_PLAN_AMOUNT=18000

STARTER_PLAN_MINUTES=120

PRO_PLAN_MINUTES=600

ENTERPRISE_PLAN_MINUTES=2000

NEXT_PUBLIC_FLUTTERWAVE_STARTER=https://flutterwave.com/pay/vp8my5xd8dkn

NEXT_PUBLIC_FLUTTERWAVE_PRO=https://flutterwave.com/pay/gickbfzxhjyt

NEXT_PUBLIC_FLUTTERWAVE_ENTERPRISE=https://flutterwave.com/pay/fw9btqrzmeq8
```

---

## 📝 Instructions

### Step 1: Add Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your CallWaitingAI project
3. Go to **Settings → Environment Variables**
4. For EACH variable above:
   - Click **Add Variable**
   - Paste variable name (e.g., `ODIADEV_TTS_API_KEY`)
   - Paste value
   - Select **Production, Preview, Development**
   - Click **Save**

### Step 2: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment

---

## 🔧 Twilio Webhook Configuration

### Configure Phone Number

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click your phone number: **+12184003410**
3. Scroll to **Voice Configuration**
4. Set:
   - **Configure with:** Webhooks, TwiML Bins, Functions, Studio, or Proxy
   - **A call comes in:** Webhook
   - **URL:** `https://callwaitingai.dev/api/call/inbound`
   - **HTTP Method:** POST
5. Click **Save**

---

## ✅ Verification Steps

### 1. Check Deployment
```bash
curl https://callwaitingai.dev/api/health
# Should return: {"status":"ok"}
```

### 2. Test Webhook
```bash
curl -X POST https://callwaitingai.dev/api/call/inbound \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CAtest123&From=+1234567890&To=+12184003410&CallStatus=ringing"
# Should return TwiML XML
```

### 3. Test Demo Number
Call: **+1 (218) 400-3410**
- Should ring
- AI should answer with greeting
- (WebSocket streaming not yet implemented, so call will pause)

### 4. Check Supabase
Go to Supabase Dashboard → Table Editor:
- Check if `call_transcripts` table exists
- If not, run: `sql/lead_capture_schema.sql`

---

## 🚀 You're Live!

Once variables are added and Twilio is configured:
- ✅ ODIADEV TTS working
- ✅ Twilio webhooks active
- ✅ Lead capture ready
- ✅ Homepage showing demo number
- ✅ All legal pages live

**Call +1 (218) 400-3410 to test!**

# CallWaiting AI - n8n Workflows Complete Setup Guide

> **Your n8n Instance**: https://callwaitingai.app.n8n.cloud/

This guide will help you deploy all 4 core workflows to your n8n instance and get CallWaiting AI fully operational.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [n8n Environment Variables](#n8n-environment-variables)
4. [Workflow Import & Configuration](#workflow-import--configuration)
5. [External Service Configuration](#external-service-configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- ✅ **n8n Cloud**: https://callwaitingai.app.n8n.cloud/
- ✅ **Supabase**: Your existing instance at `bcufohulqrceytkrqpgd.supabase.co`
- ✅ **Flutterwave**: Payment gateway account
- ✅ **Gmail**: For SMTP (callwaitingai@gmail.com)
- ✅ **OpenAI**: For AI responses (GPT-4)
- ✅ **Twilio** (optional): For WhatsApp integration

### What You'll Build
- 📨 Lead capture from landing page → Supabase → Email notifications
- 💰 Payment verification → Flutterwave → Customer onboarding trigger
- 📋 Automated customer onboarding questionnaire
- 💬 WhatsApp AI chatbot (24/7 customer support)

---

## 2. Supabase Setup

### Step 1: Run the Schema SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/bcufohulqrceytkrqpgd
2. Navigate to **SQL Editor**
3. Create a new query and paste the contents of `supabase_schema_complete.sql`
4. Click **Run** to execute

This creates 6 tables:
- `leads` - Landing page form submissions
- `payments` - Flutterwave payment records
- `customer_onboarding` - Setup questionnaire responses
- `customers` - Active AI users
- `conversations` - AI chat logs
- `analytics_events` - System events

### Step 2: Get Your Service Role Key

1. In Supabase Dashboard → **Settings** → **API**
2. Copy your **service_role** key (NOT the anon key)
3. **IMPORTANT**: Keep this secret and never commit to git

---

## 3. n8n Environment Variables

### Set These in n8n Cloud

1. Go to https://callwaitingai.app.n8n.cloud/
2. Click **Settings** (gear icon) → **Environments**
3. Add the following variables:

```bash
# ===== SUPABASE =====
SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
SUPABASE_SERVICE_KEY=<YOUR_SERVICE_ROLE_KEY_FROM_STEP_2>

# ===== FLUTTERWAVE =====
FLW_SECRET_KEY=<your_flutterwave_secret_key>
FLW_VERIF_HASH=<your_webhook_verification_hash>

# Get these from Flutterwave Dashboard:
# - Secret Key: Settings → API Keys → Secret Key
# - Verif Hash: Settings → Webhooks → Hash

# ===== EMAIL (GMAIL SMTP) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=callwaitingai@gmail.com
SMTP_PASS=<gmail_app_password>

# Generate Gmail App Password:
# 1. Go to https://myaccount.google.com/apppasswords
# 2. Create app password for "Mail"
# 3. Copy the 16-character password

ALERT_EMAIL=callwaitingai@gmail.com

# ===== CALENDLY =====
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/callwaitingai/30min

# ===== OPENAI (for AI responses) =====
OPENAI_API_KEY=<your_openai_api_key>

# Get from: https://platform.openai.com/api-keys

# ===== TWILIO (for WhatsApp) =====
TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Get from: https://console.twilio.com/
```

---

## 4. Workflow Import & Configuration

### Import All 4 Workflows

1. Go to https://callwaitingai.app.n8n.cloud/workflows
2. Click **Import from File** for each workflow:

#### Workflow 1: Lead Capture
- **File**: `01_lead_capture_complete.json`
- **Purpose**: Captures leads from landing page, sends welcome email
- **Webhook URL**: `https://callwaitingai.app.n8n.cloud/webhook/leads/capture`

#### Workflow 2: Payment Verification
- **File**: `02_payment_verification.json`
- **Purpose**: Verifies Flutterwave payments, triggers onboarding
- **Webhook URL**: `https://callwaitingai.app.n8n.cloud/webhook/payments/flutterwave`

#### Workflow 3: Customer Onboarding
- **File**: `03_customer_onboarding.json`
- **Purpose**: Sends setup questionnaire, collects AI config
- **Triggers**: Every 6 hours (checks for new paid customers)

#### Workflow 4: WhatsApp AI Handler
- **File**: `04_whatsapp_ai_handler.json`
- **Purpose**: 24/7 AI chatbot for WhatsApp messages
- **Webhook URL**: `https://callwaitingai.app.n8n.cloud/webhook/whatsapp/incoming`

### Configure Credentials in n8n

After importing, configure these credentials:

#### 1. Supabase Credential
- **Type**: Supabase
- **Name**: `Supabase (CallWaiting)`
- **Host**: `{{$env.SUPABASE_URL}}`
- **Service Role Key**: `{{$env.SUPABASE_SERVICE_KEY}}`

#### 2. Gmail SMTP Credential
- **Type**: SMTP
- **Name**: `Gmail SMTP (CallWaiting)`
- **Host**: `{{$env.SMTP_HOST}}`
- **Port**: `{{$env.SMTP_PORT}}`
- **User**: `{{$env.SMTP_USER}}`
- **Password**: `{{$env.SMTP_PASS}}`
- **Secure**: Yes (TLS)

#### 3. OpenAI Credential
- **Type**: OpenAI
- **Name**: `OpenAI (CallWaiting)`
- **API Key**: `{{$env.OPENAI_API_KEY}}`

#### 4. Twilio Basic Auth
- **Type**: HTTP Basic Auth
- **Name**: `Twilio Basic Auth`
- **User**: `{{$env.TWILIO_ACCOUNT_SID}}`
- **Password**: `{{$env.TWILIO_AUTH_TOKEN}}`

---

## 5. External Service Configuration

### A. Flutterwave Webhook Setup

1. Go to Flutterwave Dashboard: https://dashboard.flutterwave.com/
2. Navigate to **Settings** → **Webhooks**
3. Set webhook URL: `https://callwaitingai.app.n8n.cloud/webhook/payments/flutterwave`
4. Copy the **Hash** and add to n8n env vars as `FLW_VERIF_HASH`
5. Test webhook with a test payment

### B. Twilio WhatsApp Setup (Optional)

1. Go to Twilio Console: https://console.twilio.com/
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Follow sandbox setup (or production WhatsApp Business API)
4. Set webhook URL: `https://callwaitingai.app.n8n.cloud/webhook/whatsapp/incoming`
5. Test by sending a message to your Twilio WhatsApp number

### C. Landing Page Form Integration

Update your landing page form to POST to:
```
https://callwaitingai.app.n8n.cloud/webhook/leads/capture
```

Example form code:
```html
<form id="leadForm" action="https://callwaitingai.app.n8n.cloud/webhook/leads/capture" method="POST">
  <input type="text" name="name" required placeholder="Your Name">
  <input type="email" name="email" required placeholder="Email">
  <input type="tel" name="phone" placeholder="Phone">
  <input type="text" name="business" placeholder="Business Name">
  <textarea name="message" placeholder="Tell us about your business"></textarea>
  <input type="hidden" name="source" value="landing_page">
  <button type="submit">Get Started</button>
</form>
```

---

## 6. Testing & Verification

### Test Workflow 1: Lead Capture

```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/leads/capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "business": "Test Business",
    "message": "Just testing",
    "source": "landing_page"
  }'
```

**Expected Results**:
1. ✅ 200 response with success message
2. ✅ New row in Supabase `leads` table
3. ✅ Welcome email sent to test@example.com
4. ✅ Alert email sent to callwaitingai@gmail.com

### Test Workflow 2: Payment Verification

**Note**: Use Flutterwave test mode to avoid real charges.

1. Make test payment via Flutterwave payment link
2. Check n8n workflow execution logs
3. Verify:
   - ✅ Payment row in Supabase `payments` table
   - ✅ Lead status updated to "paid"
   - ✅ Confirmation email sent to customer
   - ✅ Team notification email received

### Test Workflow 3: Customer Onboarding

1. Manually trigger the workflow or wait for schedule (every 6 hours)
2. Check for paid customers without onboarding
3. Verify:
   - ✅ Onboarding email sent
   - ✅ Lead `onboarding_sent` = true

### Test Workflow 4: WhatsApp AI

**Using Twilio Sandbox**:
1. Send a WhatsApp message to your Twilio number
2. Check n8n execution logs
3. Verify:
   - ✅ AI response received
   - ✅ Conversation logged in Supabase `conversations` table
   - ✅ Customer record created/updated

---

## 7. Troubleshooting

### Issue: Workflow fails with "Invalid credentials"

**Solution**: Check that credentials reference env vars correctly:
```
{{$env.SUPABASE_SERVICE_KEY}}  ✅ Correct
$env.SUPABASE_SERVICE_KEY      ❌ Wrong (missing curly braces)
```

### Issue: Flutterwave webhook signature invalid

**Solution**:
1. Verify `FLW_VERIF_HASH` matches Flutterwave dashboard
2. Check webhook logs in Flutterwave for exact hash sent
3. Ensure webhook URL is exactly: `https://callwaitingai.app.n8n.cloud/webhook/payments/flutterwave`

### Issue: Emails not sending

**Solution**:
1. Verify Gmail app password (not regular password)
2. Enable "Less secure app access" if using personal Gmail
3. Check SMTP logs in n8n execution history

### Issue: WhatsApp not responding

**Solution**:
1. Verify Twilio webhook URL is correct
2. Check OpenAI API quota/limits
3. Review n8n execution logs for errors

### Issue: Supabase connection errors

**Solution**:
1. Verify service_role key (not anon key)
2. Check RLS policies allow service_role access
3. Confirm table names match schema exactly

---

## 🎯 Next Steps After Setup

1. **Monitor Workflows**: Set up n8n error notifications
2. **Analytics**: Check Supabase for lead/payment funnels
3. **Scale**: Add more AI channels (TikTok DM, Instagram)
4. **Optimize**: Fine-tune AI prompts based on conversation logs

---

## 📞 Support

- **Email**: callwaitingai@gmail.com
- **n8n Docs**: https://docs.n8n.io/
- **Supabase Docs**: https://supabase.com/docs

---

**Last Updated**: January 14, 2025
**Author**: ODIADEV AI LTD

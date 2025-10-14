# CallWaiting AI - n8n Workflows

> **n8n Instance**: https://callwaitingai.app.n8n.cloud/

Complete automation workflows for CallWaiting AI, handling lead capture, payments, onboarding, and AI customer support.

## 📦 What's Included

### Workflows (Import these to n8n)

1. **`01_lead_capture_complete.json`**
   - Captures leads from landing page form
   - Validates & sanitizes input
   - Checks for duplicates (7-day window)
   - Sends welcome email to customer
   - Notifies team via email
   - Stores in Supabase `leads` table

2. **`02_payment_verification.json`**
   - Receives Flutterwave webhook
   - Verifies webhook signature (security)
   - Double-checks payment with Flutterwave API
   - Stores payment in Supabase `payments` table
   - Updates lead status to "paid"
   - Sends confirmation email to customer
   - Notifies team of new payment

3. **`03_customer_onboarding.json`**
   - Scheduled trigger (every 6 hours)
   - Finds paid customers without onboarding
   - Sends setup questionnaire email
   - Receives questionnaire responses via webhook
   - Stores answers in Supabase `customer_onboarding` table
   - Updates lead status to "setup_in_progress"
   - Notifies team to begin setup

4. **`04_whatsapp_ai_handler.json`**
   - Receives WhatsApp messages (Twilio webhook)
   - Checks for existing customer or creates new
   - Sends message to OpenAI GPT-4 for AI response
   - Replies via Twilio WhatsApp API
   - Logs conversation in Supabase `conversations` table
   - Updates customer message count

### Database

- **`supabase_schema_complete.sql`**
  - Complete Supabase database schema
  - 6 tables: leads, payments, customer_onboarding, customers, conversations, analytics_events
  - Row-level security (RLS) policies
  - Indexes for performance
  - Helper functions

### Documentation

- **`N8N_SETUP_GUIDE.md`** - Complete setup instructions
- **`.env.template`** - Environment variables template
- **`README.md`** - This file

## 🚀 Quick Start

### 1. Database Setup (5 minutes)

```bash
# 1. Go to Supabase SQL Editor
# 2. Copy contents of supabase_schema_complete.sql
# 3. Run the SQL query
```

### 2. Configure n8n Environment (10 minutes)

```bash
# 1. Copy .env.template to .env
cp .env.template .env

# 2. Fill in all values (see N8N_SETUP_GUIDE.md for details)

# 3. Add to n8n Cloud:
# - Go to https://callwaitingai.app.n8n.cloud/
# - Settings → Environments
# - Add each variable from .env
```

### 3. Import Workflows (5 minutes)

```bash
# In n8n:
# 1. Workflows → Import from File
# 2. Upload each .json file (01, 02, 03, 04)
# 3. Configure credentials (see guide)
# 4. Activate each workflow
```

### 4. Configure External Services (15 minutes)

**Flutterwave Webhook**
- Dashboard → Settings → Webhooks
- URL: `https://callwaitingai.app.n8n.cloud/webhook/payments/flutterwave`
- Copy hash to `FLW_VERIF_HASH`

**Landing Page Form**
- Update form action: `https://callwaitingai.app.n8n.cloud/webhook/leads/capture`

**Twilio WhatsApp (Optional)**
- Console → Messaging → WhatsApp
- Webhook: `https://callwaitingai.app.n8n.cloud/webhook/whatsapp/incoming`

## 🧪 Testing

### Test Lead Capture

```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/leads/capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "business": "Test Business",
    "message": "Testing lead capture"
  }'
```

**Expected**: Welcome email + team notification + Supabase row

### Test Payment Webhook

Use Flutterwave test mode to trigger a payment webhook.

**Expected**: Payment logged + lead status updated + emails sent

### Test WhatsApp AI

Send a message to your Twilio WhatsApp number.

**Expected**: AI response + conversation logged

## 📊 Workflow URLs

Once imported, these webhook URLs will be live:

```
# Lead Capture
https://callwaitingai.app.n8n.cloud/webhook/leads/capture

# Payment Verification
https://callwaitingai.app.n8n.cloud/webhook/payments/flutterwave

# Onboarding Response
https://callwaitingai.app.n8n.cloud/webhook/onboarding/response

# WhatsApp Incoming
https://callwaitingai.app.n8n.cloud/webhook/whatsapp/incoming
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use service_role key** - Not the anon key for Supabase
3. **Verify webhook signatures** - Workflows include signature checks
4. **Rotate keys quarterly** - Especially Supabase & Flutterwave
5. **Monitor execution logs** - Set up n8n error notifications

## 📈 Monitoring

### Key Metrics to Track

- **Lead Conversion**: `leads` table → `status = 'paid'`
- **Payment Success**: `payments` table → `status = 'successful'`
- **Onboarding Completion**: `customer_onboarding` table
- **AI Response Time**: `conversations` table timestamps

### SQL Queries for Analytics

```sql
-- Lead to Paid Conversion Rate
SELECT
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_customers,
  COUNT(*) AS total_leads,
  ROUND(COUNT(*) FILTER (WHERE status = 'paid')::NUMERIC / COUNT(*) * 100, 2) AS conversion_rate
FROM leads;

-- Revenue by Plan
SELECT
  plan,
  COUNT(*) AS customers,
  SUM(amount) AS total_revenue
FROM payments
WHERE status = 'successful'
GROUP BY plan;

-- Daily Message Volume
SELECT
  DATE(timestamp) AS date,
  COUNT(*) AS messages,
  COUNT(DISTINCT customer_phone) AS unique_customers
FROM conversations
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## 🛠️ Customization

### Modify AI Personality

Edit `04_whatsapp_ai_handler.json` → "Send to AI (OpenAI GPT-4)" node:

```json
{
  "role": "system",
  "content": "Your custom AI prompt here..."
}
```

### Add More Channels

Duplicate `04_whatsapp_ai_handler.json` and modify for:
- TikTok DM (using TikTok Business API)
- Instagram DM (using Instagram Graph API)
- Telegram
- SMS (via Twilio)

### Custom Email Templates

Edit email content in each workflow's `Send Email` nodes.

## 📞 Support

- **Setup Help**: See `N8N_SETUP_GUIDE.md`
- **Issues**: callwaitingai@gmail.com
- **n8n Docs**: https://docs.n8n.io/

---

**Built for**: CallWaiting AI - 24/7 AI Receptionist for TikTok & Shopify Sellers
**Last Updated**: January 14, 2025
**Author**: ODIADEV AI LTD

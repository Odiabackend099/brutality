# Vercel Environment Variables for CallWaitingAI

## 🔐 Required Environment Variables

Copy these environment variables to your Vercel project settings under **Settings > Environment Variables**.

---

## 📊 **Database & Authentication**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

## 🤖 **AI Services**

```bash
# Groq LLM API
GROQ_API_KEY=gsk_your-groq-api-key-here

# Deepgram Speech-to-Text
DEEPGRAM_API_KEY=your-deepgram-api-key-here

# ODIADEV TTS (if using)
ODIADEV_API_KEY=your-odiadev-api-key-here
```

---

## 📞 **Telephony & Communications**

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Business API (optional)
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

---

## 💳 **Payment Processing**

```bash
# Flutterwave Configuration (Primary Payment Processor)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_your-public-key
FLUTTERWAVE_SECRET_KEY=FLWSECK_your-secret-key
FLUTTERWAVE_ENCRYPTION_KEY=your-encryption-key
FLUTTERWAVE_WEBHOOK_HASH=your-webhook-hash

# Alternative Payment Processors (Optional)
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

---

## 📧 **Email Services**

```bash
# Resend Email Service
RESEND_API_KEY=re_your-resend-api-key

# SendGrid (alternative)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Brevo (alternative)
BREVO_API_KEY=xkeys-your-brevo-api-key
```

---

## 🔒 **Security & reCAPTCHA**

```bash
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp
RECAPTCHA_SECRET_KEY=6LdXOu8rAAAAAH5inDMTaEgDzVeWMMdSZip2Xu8Y

# Rate Limiting
RATE_LIMIT_SECRET=your-rate-limit-secret-key
```

---

## 📈 **Analytics & Tracking**

```bash
# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Mixpanel (optional)
MIXPANEL_TOKEN=your-mixpanel-token

# Plausible Analytics (alternative)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

---

## 🔗 **Third-Party Integrations**

```bash
# N8N Webhook URL (for automation)
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/tool-submission

# CRM Integration (if using)
HUBSPOT_API_KEY=your-hubspot-api-key
SALESFORCE_CLIENT_ID=your-salesforce-client-id
SALESFORCE_CLIENT_SECRET=your-salesforce-client-secret
```

---

## 🌍 **Application Configuration**

```bash
# Environment
NODE_ENV=production

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true
NEXT_PUBLIC_ENABLE_FREE_TOOLS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 📱 **Social Media & Marketing**

```bash
# Facebook Pixel (optional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-pixel-id

# LinkedIn Insight Tag (optional)
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=your-linkedin-partner-id

# Twitter Pixel (optional)
NEXT_PUBLIC_TWITTER_PIXEL_ID=your-twitter-pixel-id
```

---

## 🔧 **Development & Testing**

```bash
# Test Mode (set to false in production)
TEST_MODE=false

# Debug Mode
DEBUG=false

# Sentry Error Tracking (optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

---

## 📋 **How to Add to Vercel:**

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Navigate to Settings > Environment Variables**
4. **Click "Add New"**
5. **Copy each variable name and value from above**
6. **Set environment scope:**
   - `Production` - for live site
   - `Preview` - for preview deployments
   - `Development` - for local development

---

## ⚠️ **Important Security Notes:**

- **Never commit these values to Git**
- **Use different keys for development/staging/production**
- **Rotate keys regularly**
- **Use environment-specific URLs and domains**
- **Enable Vercel's built-in security features**

---

## 🚀 **Quick Setup Commands:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Deploy with environment variables
vercel --prod
```

---

## 📞 **Support:**

If you need help with any of these environment variables, check:
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables Guide](https://nextjs.org/docs/basic-features/environment-variables)

---

**🎯 Remember:** Replace all placeholder values with your actual API keys and secrets before deploying!

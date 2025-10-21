# Vercel Environment Variables Setup Guide

## Complete Environment Variables for CallWaitingAI

This guide provides all the environment variables needed to deploy CallWaitingAI to Vercel.

---

## 🔐 Required Environment Variables

### 1. Supabase Configuration (Database & Auth)

```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (Public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (Secret - Server Side Only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy URL and keys

---

### 2. Deepgram (Speech-to-Text)

```bash
# Deepgram API Key
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

**How to get:**
1. Go to https://console.deepgram.com
2. Sign up or login
3. Go to API Keys section
4. Create a new API key
5. Copy the key

**Free Tier:** $200 in credits

---

### 3. Groq (LLM / AI Brain)

```bash
# Groq API Key
GROQ_API_KEY=gsk_your_groq_api_key_here
```

**How to get:**
1. Go to https://console.groq.com
2. Sign up or login
3. Go to API Keys
4. Create new API key
5. Copy the key

**Free Tier:** Available

---

### 4. MiniMax / ODIADEV (Text-to-Speech)

```bash
# ODIADEV TTS Service URL
ODIADEV_TTS_BASE_URL=https://minimax-tts-odiadev.onrender.com

# MiniMax API Key
ODIADEV_TTS_API_KEY=your_minimax_api_key_here
MINIMAX_API_KEY=your_minimax_api_key_here

# MiniMax Group ID
ODIADEV_TTS_GROUP_ID=your_minimax_group_id_here
MINIMAX_GROUP_ID=your_minimax_group_id_here

# MiniMax Model (Optional - defaults to speech-02-hd)
MINIMAX_MODEL=speech-02-hd
```

**How to get:**
1. Go to https://www.minimaxi.com or https://platform.minimaxi.com
2. Sign up for an account
3. Go to API section
4. Copy API Key and Group ID

---

### 5. Voice & TTS Defaults (Optional)

```bash
# Default voice (odia, marcus, marcy, joslyn)
DEFAULT_VOICE=odia

# Default voice parameters
DEFAULT_SPEED=1.0
DEFAULT_PITCH=0
DEFAULT_EMOTION=neutral
```

---

### 6. Application Settings

```bash
# Application URL (Production)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app

# Site URL for redirects
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

### 7. Stripe (Payments) - Optional

```bash
# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Stripe Secret Key
STRIPE_SECRET_KEY=sk_live_your_secret_key

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs
STRIPE_PRICE_ID_STARTER=price_your_starter_price_id
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
STRIPE_PRICE_ID_ENTERPRISE=price_your_enterprise_price_id
```

**How to get:**
1. Go to https://dashboard.stripe.com
2. Get publishable key from Developers → API keys
3. Get secret key from same location
4. Set up webhook endpoint: https://your-domain.vercel.app/api/webhooks/stripe
5. Get webhook secret after creating webhook

---

### 8. Email (Optional - Resend or similar)

```bash
# Resend API Key (for sending emails)
RESEND_API_KEY=re_your_resend_api_key

# Email from address
EMAIL_FROM=noreply@your-domain.com
```

---

### 9. Analytics & Monitoring (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Posthog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry Error Tracking
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
```

---

### 10. Security & CORS

```bash
# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars

# Allowed origins for CORS
ALLOWED_ORIGINS=https://your-domain.vercel.app,https://www.your-domain.com
```

---

## 📋 Complete `.env.local` Template

Save this as `.env.local` for local development:

```bash
# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================================================
# VOICE AI SERVICES
# =============================================================================

# Deepgram (Speech-to-Text)
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Groq (LLM)
GROQ_API_KEY=gsk_your_groq_api_key_here

# MiniMax / ODIADEV (Text-to-Speech)
ODIADEV_TTS_BASE_URL=https://minimax-tts-odiadev.onrender.com
ODIADEV_TTS_API_KEY=your_minimax_api_key_here
MINIMAX_API_KEY=your_minimax_api_key_here
ODIADEV_TTS_GROUP_ID=your_minimax_group_id_here
MINIMAX_GROUP_ID=your_minimax_group_id_here
MINIMAX_MODEL=speech-02-hd

# Voice Defaults
DEFAULT_VOICE=odia
DEFAULT_SPEED=1.0
DEFAULT_PITCH=0
DEFAULT_EMOTION=neutral

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# =============================================================================
# STRIPE PAYMENTS (Optional)
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# =============================================================================
# EMAIL (Optional)
# =============================================================================
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@callwaitingai.com

# =============================================================================
# ANALYTICS (Optional)
# =============================================================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# =============================================================================
# SECURITY
# =============================================================================
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 🚀 Vercel Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Add voice conversation features"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Import"

3. **Add Environment Variables:**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Environment Variables"
   - Add each variable one by one:
     - **Variable Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Your actual value
     - **Environment**: Select "Production", "Preview", and "Development"
   - Click "Save" for each

4. **Deploy:**
   - Click "Deployments" → "Redeploy"
   - Or push a new commit to trigger auto-deploy

---

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Add Environment Variables:**
   ```bash
   # Production
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY production
   # ... add all variables

   # Preview
   vercel env add NEXT_PUBLIC_SUPABASE_URL preview
   # ... add all variables

   # Development
   vercel env add NEXT_PUBLIC_SUPABASE_URL development
   # ... add all variables
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

---

### Method 3: Using `vercel.json` (Advanced)

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

Then add secrets via CLI:
```bash
vercel secrets add supabase-url "https://your-project.supabase.co"
vercel secrets add supabase-anon-key "your-anon-key"
```

---

## ✅ Environment Variables Checklist

### Minimum Required (Voice Conversation):
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_DEEPGRAM_API_KEY`
- [ ] `GROQ_API_KEY`
- [ ] `ODIADEV_TTS_API_KEY` or `MINIMAX_API_KEY`
- [ ] `ODIADEV_TTS_GROUP_ID` or `MINIMAX_GROUP_ID`

### Recommended:
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `DEFAULT_VOICE`

### Optional (for full features):
- [ ] Stripe keys (for payments)
- [ ] Email service keys (for notifications)
- [ ] Analytics keys (for tracking)

---

## 🔍 Verify Environment Variables

After deployment, verify your environment variables are set:

1. **In Vercel Dashboard:**
   - Settings → Environment Variables
   - Check all variables are listed

2. **Test in Browser Console:**
   ```javascript
   // Should NOT be undefined for public vars
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
   ```

3. **Check Build Logs:**
   - Deployments → Latest deployment → Build logs
   - Look for any missing environment variable warnings

---

## 🛠️ Troubleshooting

### Issue: "Environment variable not found"

**Solution:**
1. Verify variable name matches exactly (case-sensitive)
2. Check it's added to correct environment (Production/Preview/Development)
3. Redeploy after adding new variables
4. Public variables must start with `NEXT_PUBLIC_`

### Issue: "Supabase connection failed"

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon key, not service role
3. Verify Supabase project is active
4. Check Supabase dashboard → Project Settings → API

### Issue: "Voice conversation not working"

**Solution:**
1. Check browser console for API key errors
2. Verify all three API keys are set:
   - Deepgram (STT)
   - Groq (LLM)
   - MiniMax (TTS)
3. Test each service individually in dashboard

### Issue: "Build failed"

**Solution:**
1. Check for TypeScript errors locally: `npm run build`
2. Verify all dependencies in `package.json`
3. Check Vercel build logs for specific error
4. Ensure Node version matches (use `.nvmrc` or set in Vercel)

---

## 📝 Security Best Practices

1. **Never commit `.env.local` to Git:**
   ```bash
   # Verify .env.local is in .gitignore
   cat .gitignore | grep .env.local
   ```

2. **Use different keys for development and production:**
   - Development: Use test API keys
   - Production: Use live API keys

3. **Rotate keys periodically:**
   - Change API keys every 3-6 months
   - Update in Vercel immediately

4. **Limit API key permissions:**
   - Only grant necessary scopes
   - Use read-only keys where possible

5. **Monitor usage:**
   - Check API usage dashboards
   - Set up billing alerts
   - Monitor for unusual activity

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Deepgram Console**: https://console.deepgram.com
- **Groq Console**: https://console.groq.com
- **MiniMax Platform**: https://platform.minimaxi.com
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 📧 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all API keys are valid
4. Review this guide for missing steps
5. Check the `VOICE_CONVERSATION_IMPLEMENTATION.md` for detailed troubleshooting

---

**Last Updated**: 2025-10-21
**Status**: ✅ Production Ready
**Deployment Platform**: Vercel

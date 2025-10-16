# Vercel Environment Variables Configuration

## ✅ Required Environment Variables for Deployment

Add these environment variables in your Vercel project settings before deploying:

### 🔐 Authentication (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

**⚠️ CRITICAL - Service Role Key Security:**
- The `SUPABASE_SERVICE_ROLE_KEY` is **SERVER-SIDE ONLY**
- This key **bypasses all Row Level Security (RLS)** policies
- **NEVER** expose this key to the client or commit it to Git
- **Get it from:** Supabase Dashboard → Settings → API → service_role key (copy the secret)
- **Required for:** Admin operations in API routes (creating agents, managing subscriptions, usage tracking)

### 💳 Payment Processing (Flutterwave)
```
FLUTTERWAVE_PUBLIC_KEY=<your-flutterwave-public-key>
FLUTTERWAVE_SECRET_KEY=<your-flutterwave-secret-key>
FLUTTERWAVE_WEBHOOK_SECRET_HASH=<your-webhook-secret-hash>
```

### 🤖 AI Services (OpenAI)
```
OPENAI_API_KEY=<your-openai-api-key>
```

### 🗣️ Text-to-Speech (MiniMax)
```
MINIMAX_API_KEY=<your-minimax-api-key>
MINIMAX_GROUP_ID=<your-minimax-group-id>
```

### 🌐 Application Configuration
```
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_WEBHOOK_PROXY_URL=https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/webhook-proxy
NEXT_PUBLIC_WEBHOOK_SECRET=<your-webhook-secret>
NEXT_PUBLIC_BRAND_NAME=CallWaiting AI
```

### 📅 Scheduling (Optional)
```
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/callwaitingai/30min
```

### 🔒 Security (Optional - hCaptcha)
```
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=<your-hcaptcha-site-key>
HCAPTCHA_SECRET_KEY=<your-hcaptcha-secret-key>
```

### 💰 Plan Pricing (Optional - Defaults in code)
```
BASIC_PLAN_AMOUNT=2900
PRO_PLAN_AMOUNT=7900
ENTERPRISE_PLAN_AMOUNT=19900
```

---

## 📋 How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the following scopes:
   - ✅ **Production** (required)
   - ✅ **Preview** (recommended)
   - ✅ **Development** (optional)

4. Click **Save** after adding all variables
5. Trigger a new deployment for changes to take effect

---

## 🔧 Build Fixes Applied

### 1. **Lazy SDK Initialization** (Build-time vs Runtime)
   - **Files Modified:**
     - [lib/flutterwave.ts](lib/flutterwave.ts) - Flutterwave SDK
     - [app/api/agent/[id]/webhook/route.ts](app/api/agent/[id]/webhook/route.ts) - OpenAI SDK

   - **Why:** Next.js collects page data during build phase. Top-level SDK instantiation throws when env vars are missing at build time.

   - **Fix:** Moved SDK initialization inside functions (lazy loading). SDKs are only instantiated when API routes are actually called at runtime.

### 2. **Dynamic Route Configuration**
   - **File Modified:** [app/api/usage-report/route.ts](app/api/usage-report/route.ts)

   - **Why:** API route uses cookies for authentication, which requires server-side rendering.

   - **Fix:** Added `export const dynamic = 'force-dynamic'` to prevent static generation.

### 3. **Suspense Boundaries for Client Components**
   - **Files Modified:**
     - [app/login/page.tsx](app/login/page.tsx)
     - [app/success/page.tsx](app/success/page.tsx)

   - **Why:** `useSearchParams()` hook requires Suspense boundary for Next.js 14+ App Router.

   - **Fix:** Wrapped components using `useSearchParams()` in `<Suspense>` with loading fallbacks.

---

## ✅ Build Status

```
✓ Build completed successfully
✓ All 22 pages generated
✓ No critical errors
✓ Ready for Vercel deployment
```

### Build Output Summary:
- **Static Pages:** 18 pages pre-rendered
- **Dynamic Routes:** 4 API routes + 1 middleware
- **Total Bundle Size:** ~87.3 kB (shared JS)
- **Largest Page:** 151 kB (dashboard)

---

## 🚀 Deployment Checklist

Before deploying to Vercel:

- [ ] All required environment variables added in Vercel dashboard
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Flutterwave webhook configured to point to production URL
- [ ] Supabase RLS policies enabled and tested
- [ ] Database tables created (see [sql/dashboard-tables.sql](sql/dashboard-tables.sql))
- [ ] Test payment flow in production with small amount
- [ ] Monitor Vercel build logs for any warnings

---

## 🐛 Troubleshooting

### Build fails with "Public Key required"
- **Cause:** `FLUTTERWAVE_PUBLIC_KEY` missing in Vercel environment variables
- **Fix:** Add the variable and redeploy

### Build fails with "Missing credentials" (OpenAI)
- **Cause:** `OPENAI_API_KEY` missing in Vercel environment variables
- **Fix:** Add the variable and redeploy

### Pages show loading spinner indefinitely
- **Cause:** `NEXT_PUBLIC_*` variables not set correctly (must be public)
- **Fix:** Ensure all client-side vars start with `NEXT_PUBLIC_`

### Payment webhook not triggering
- **Cause:** Flutterwave webhook URL not configured or `FLUTTERWAVE_WEBHOOK_SECRET_HASH` mismatch
- **Fix:** Update webhook URL in Flutterwave dashboard and verify secret hash

---

## 📞 Support

If you encounter issues during deployment:
- Check Vercel build logs for specific error messages
- Verify all environment variables are correctly set
- Test API endpoints individually after deployment
- Contact: support@callwaitingai.dev

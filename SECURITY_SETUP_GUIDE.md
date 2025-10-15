# Security Setup Guide - CallWaiting AI

## 🎯 What We Just Built

You now have a **secure webhook proxy** that:
- ✅ **HMAC validates** all requests (blocks spam/abuse)
- ✅ **Rate limits** to 10 requests/minute per IP
- ✅ **Protects your API keys** (they stay in Supabase, not exposed)
- ✅ **Adds CORS** protection

## 📋 Setup Checklist (30 minutes)

### Step 1: Create Supabase Project (5 min)

1. Go to https://supabase.com/dashboard
2. Click **"New project"**
3. Fill in:
   - **Name**: CallWaiting AI
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. **Save these values** (you'll need them):
   - Project URL: `https://xxxxx.supabase.co`
   - Anon public key: `eyJhbG...`
   - Service role key: `eyJhbG...` (keep secret!)

---

### Step 2: Deploy Edge Function (10 min)

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy webhook-proxy

# Set environment variables (see Step 3 below)
```

#### Option B: Manual Deployment (via Dashboard)

1. Go to your Supabase project
2. Navigate to **Edge Functions** in sidebar
3. Click **"Create a new function"**
4. Name: `webhook-proxy`
5. Copy the code from `supabase/functions/webhook-proxy/index.ts`
6. Paste into the editor
7. Click **"Deploy"**

---

### Step 3: Set Environment Variables (5 min)

In **Supabase Dashboard** → **Settings** → **Edge Functions** → **Secrets**:

Add these secrets:

```bash
# 1. Generate a random webhook secret (use a password generator)
WEBHOOK_SECRET=your-super-secret-random-string-here

# 2. Your n8n webhook URL
N8N_WEBHOOK_URL=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax

# 3. Upstash Redis (optional but recommended for rate limiting)
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=your-upstash-token
```

#### How to Generate WEBHOOK_SECRET:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use an online generator:
# https://generate-secret.vercel.app/32
```

---

### Step 4: Set Up Upstash Redis (Optional - 5 min)

**Free tier: 10,000 commands/day** (perfect for 100 calls/day)

1. Go to https://upstash.com
2. Sign up (free account)
3. Click **"Create Database"**
4. Choose:
   - **Type**: Regional
   - **Region**: Same as your Supabase region
   - **TLS**: Enabled
5. Click **"Create"**
6. Copy **REST URL** and **REST Token**
7. Add to Supabase secrets (Step 3 above)

**Note**: If you skip this, rate limiting will be disabled (not recommended for production)

---

### Step 5: Update Frontend Environment Variables (5 min)

Edit `.env.local`:

```bash
# Old (direct to n8n - INSECURE)
# NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax

# New (via secure proxy)
NEXT_PUBLIC_WEBHOOK_PROXY_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhook-proxy
NEXT_PUBLIC_WEBHOOK_SECRET=your-super-secret-random-string-here

# Keep these
NEXT_PUBLIC_BRAND_NAME=CallWaiting AI
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/callwaitingai/30min
```

**⚠️ Important**: Use the **SAME** `WEBHOOK_SECRET` as Step 3!

---

### Step 6: Test Locally (5 min)

```bash
# Build the app
npm run build

# Start dev server
npm run dev

# Visit http://localhost:3000
# Open chat widget and send a test message
# Check browser console for logs
```

**What to look for:**
- ✅ Console shows: "Sending to secure webhook proxy"
- ✅ Response comes back from Ada
- ✅ No errors in console

---

### Step 7: Deploy to Vercel (5 min)

1. Go to https://vercel.com/dashboard
2. Find your **CallWaiting AI** project
3. Go to **Settings** → **Environment Variables**
4. Add the new variables:
   - `NEXT_PUBLIC_WEBHOOK_PROXY_URL`
   - `NEXT_PUBLIC_WEBHOOK_SECRET`
5. Click **"Save"**
6. Go to **Deployments** → **Redeploy** (latest)

---

## 🧪 Testing & Verification

### Test 1: Valid Request (Should Work)

```bash
# Generate signature
BODY='{"type":"text","message":"Hello Ada"}'
SECRET="your-webhook-secret"

# On Mac/Linux:
SIG=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)

# Make request
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/webhook-proxy \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SIG" \
  -d "$BODY"

# Expected: JSON response from Ada
```

### Test 2: Invalid Signature (Should Fail)

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/webhook-proxy \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: INVALID_SIG" \
  -d '{"type":"text","message":"Hello"}'

# Expected: {"error":"Invalid signature"} with 401 status
```

### Test 3: Rate Limiting (Should Block After 10)

```bash
# Send 11 requests rapidly
for i in {1..11}; do
  echo "Request $i"
  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/webhook-proxy \
    -H "Content-Type: application/json" \
    -H "x-webhook-signature: $SIG" \
    -d "$BODY"
  sleep 1
done

# Expected: First 10 succeed, 11th returns 429 "Rate limit exceeded"
```

---

## 📊 Monitoring & Logs

### View Logs in Supabase

1. Go to **Edge Functions** → **webhook-proxy**
2. Click **"Logs"** tab
3. You'll see:
   - Successful requests
   - Invalid signatures (attempted attacks)
   - Rate limit violations
   - Errors

### Set Up Alerts (Optional)

1. Go to **Project Settings** → **Integrations**
2. Add **Slack** or **Discord** webhook
3. Get notified when:
   - Function errors spike
   - Rate limits triggered frequently
   - Invalid signature attempts

---

## 🔐 Security Best Practices

### DO ✅
- Keep `WEBHOOK_SECRET` secret (never commit to git)
- Rotate secrets every 90 days
- Use HTTPS only
- Monitor logs weekly
- Keep Supabase service_role key server-side only

### DON'T ❌
- Share secrets in Slack/email
- Use weak secrets (min 32 characters)
- Expose n8n webhook URL publicly
- Disable rate limiting in production
- Commit `.env.local` to git

---

## 🆘 Troubleshooting

### Issue: "Invalid signature" error

**Cause**: Mismatch between frontend and backend secrets

**Fix**:
1. Check `.env.local` has correct `NEXT_PUBLIC_WEBHOOK_SECRET`
2. Check Supabase secrets have same `WEBHOOK_SECRET`
3. Restart dev server: `npm run dev`
4. Redeploy Vercel with new env vars

### Issue: "Rate limit exceeded" for real users

**Cause**: IP shared by multiple users (corporate network, VPN)

**Fix**: Increase limit in `index.ts`:
```typescript
const limit = 20 // Change from 10 to 20
```

Then redeploy:
```bash
supabase functions deploy webhook-proxy
```

### Issue: Function times out

**Cause**: n8n workflow is slow (>30s)

**Fix 1**: Optimize n8n (remove delays, speed up AI)

**Fix 2**: Increase timeout in `index.ts`:
```typescript
const timeout = setTimeout(() => controller.abort(), 60000) // 60s instead of 30s
```

### Issue: CORS error in browser

**Cause**: Domain not whitelisted

**Fix**: Update CORS in `index.ts`:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://callwaitingai.dev', // Change from *
  // ...
}
```

---

## 📈 What's Next?

Now that security is in place, you can:

1. **Week 2**: Add Sentry error tracking
2. **Week 2**: Enable Supabase Auth (email + Google)
3. **Week 3**: Add call logging for usage tracking
4. **Week 4**: Build admin dashboard

See [BACKEND_IMPLEMENTATION_PLAN.md](BACKEND_IMPLEMENTATION_PLAN.md) for full roadmap.

---

## 🎉 Success Criteria

You're done when:
- ✅ Chat widget works via secure proxy
- ✅ Invalid signatures are rejected (test with curl)
- ✅ Rate limiting blocks after 10 req/min
- ✅ No errors in Supabase logs
- ✅ Deployed to Vercel with new env vars

---

## 💰 Cost Breakdown

| Service | Plan | Cost/Month |
|---------|------|------------|
| **Supabase** | Free tier | $0 |
| **Upstash Redis** | Free tier (10K req/day) | $0 |
| **Vercel** | Hobby | $0 |
| **Total** | | **$0** |

**When to upgrade:**
- Supabase: >500MB database or >2GB bandwidth → $25/mo
- Upstash: >10,000 requests/day → $10/mo
- Vercel: Commercial use → $20/mo

At 100 calls/day, you'll stay on free tiers for months.

---

## 📞 Need Help?

If you get stuck:
1. Check Supabase Edge Function logs
2. Verify environment variables match
3. Test with curl (see Testing section)
4. Ask me for help! I can debug with you.

**Ready to deploy? Just follow Step 1 → Step 7 above!** 🚀

# 🚀 Production Deployment Guide

## ✅ **PREREQUISITES CHECKLIST**

Before deploying, ensure you have obtained:

- [ ] Supabase service role key (from Supabase Dashboard → Settings → API)
- [ ] OpenAI API key with billing enabled
- [ ] MiniMax TTS API key and Group ID
- [ ] Flutterwave live API keys (Public, Secret, Encryption)
- [ ] Flutterwave webhook secret hash

---

## 📋 **VERCEL ENVIRONMENT VARIABLES**

Add the following **18 variables** to Vercel Dashboard → Settings → Environment Variables:

### **Authentication (Supabase)**
```
NEXT_PUBLIC_SUPABASE_URL=https://bcufohulqrceytkrqpgd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

### **AI Services**
```
OPENAI_API_KEY=<your-openai-api-key>
MINIMAX_API_KEY=<your-minimax-api-key>
MINIMAX_GROUP_ID=<your-minimax-group-id>
```

### **Payment Processing (Flutterwave)**
```
FLUTTERWAVE_PUBLIC_KEY=<your-flutterwave-public-key>
FLUTTERWAVE_SECRET_KEY=<your-flutterwave-secret-key>
FLUTTERWAVE_ENCRYPTION_KEY=<your-flutterwave-encryption-key>
FLUTTERWAVE_WEBHOOK_SECRET_HASH=<from-flutterwave-dashboard>
```

### **Application Configuration**
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_WEBHOOK_SECRET=<generate-random-32-char-string>
NEXT_PUBLIC_BRAND_NAME=CallWaiting AI
NEXT_PUBLIC_WEBHOOK_PROXY_URL=https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/webhook-proxy
```

### **Pricing (Optional - has defaults)**
```
BASIC_PLAN_AMOUNT=2900
PRO_PLAN_AMOUNT=7900
ENTERPRISE_PLAN_AMOUNT=19900
```

---

## 🔒 **SECURITY NOTES**

**CRITICAL - Never commit these to Git:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Bypasses all RLS policies
- ❌ `OPENAI_API_KEY` - Charges your OpenAI account
- ❌ `FLUTTERWAVE_SECRET_KEY` - Processes real payments
- ❌ `MINIMAX_API_KEY` - Charges your MiniMax account

**These files contain actual credentials and should NOT be committed:**
- `.env.local` (local development only)
- Any files with actual API keys

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Add Environment Variables to Vercel (15 min)**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Navigate to: Settings → Environment Variables
4. Add each variable listed above
5. For each variable, select environments:
   - ✅ Production
   - ✅ Preview
   - ⚠️ Development (optional)

### **Step 2: Deploy Code (5 min)**

```bash
# Make sure you're in the project directory
cd "/Users/odiadev/callwaitingai.dev 2025"

# Add changes
git add .

# Commit (without API keys in commit message or files)
git commit -m "fix: production-ready deployment with auth fixes

- Environment variable validation
- Session sync with polling
- Request ID logging
- Enhanced OAuth error handling
- Complete deployment documentation

See AUTH_FIXES_DEPLOYMENT.md for details"

# Push to trigger Vercel deployment
git push origin main
```

### **Step 3: Update Production URL (5 min)**

After first deployment completes:

1. Copy your Vercel deployment URL
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Redeploy from Vercel dashboard

### **Step 4: Configure Flutterwave Webhook (10 min)**

1. Go to: https://dashboard.flutterwave.com/settings/webhooks
2. Add webhook URL: `https://your-app.vercel.app/api/flutterwave-webhook`
3. Copy the generated "Secret Hash"
4. Add as `FLUTTERWAVE_WEBHOOK_SECRET_HASH` in Vercel
5. Redeploy

---

## ✅ **POST-DEPLOYMENT TESTING**

### **Test 1: Authentication**
- [ ] Signup at `/signup` creates user
- [ ] Email verification link works
- [ ] Login at `/login` redirects to dashboard
- [ ] Google OAuth works
- [ ] Session persists after page refresh

### **Test 2: Dashboard Features**
- [ ] Dashboard loads after login
- [ ] Usage stats display correctly
- [ ] Can create AI agent
- [ ] Can generate payment link

### **Test 3: Payments**
- [ ] Payment link redirects to Flutterwave
- [ ] Test transaction processes
- [ ] Webhook receives callback
- [ ] Subscription updates in dashboard

---

## 📊 **SUCCESS METRICS**

After deployment:
- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ Authentication flow works end-to-end
- ✅ TestSprite success rate >95%
- ✅ Zero 500 errors in Vercel Function Logs

---

## 🐛 **TROUBLESHOOTING**

### **"Missing environment variable" error**
- Verify all 18 variables are added in Vercel
- Check variables are set for "Production" environment
- Redeploy after adding variables

### **"Invalid Supabase credentials"**
- Ensure using service_role key (not anon key)
- Verify key is from correct Supabase project

### **Session sync timeout**
- Check Vercel Function Logs for request IDs
- Verify `/api/auth/session` endpoint returns 200 OK

---

## 📞 **SUPPORT**

If deployment fails:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are correct
3. Review Vercel Function Logs for runtime errors
4. Check [AUTH_FIXES_DEPLOYMENT.md](AUTH_FIXES_DEPLOYMENT.md) for detailed troubleshooting

---

**Status:** Ready for deployment
**Estimated Time:** 1 hour total
**Risk Level:** Low (all credentials configured in Vercel, not in code)

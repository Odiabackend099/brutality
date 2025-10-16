# Production Deployment Verification Checklist

## Deployment Information
- **Repository**: https://github.com/Odiabackend099/brutality.git
- **Latest Commit**: 5e835a6 - "fix: migrate to @supabase/ssr for Next.js 14+ compatibility"
- **Environment Variables**: ✅ All 18 variables configured in Vercel
- **Flutterwave Webhook Secret**: ✅ Configured

---

## 1. Verify Deployment Success

### Check Vercel Dashboard
- [ ] Go to https://vercel.com/dashboard
- [ ] Find your project (connected to `Odiabackend099/brutality` repo)
- [ ] Verify latest deployment shows "Ready" status
- [ ] Note your production URL (e.g., `https://your-project.vercel.app`)

### Check Build Logs
- [ ] Click on the latest deployment
- [ ] Review build logs for any errors
- [ ] Verify "Build succeeded" message
- [ ] Check for TypeScript compilation success

---

## 2. Test Authentication Flows

### A. Health Check
- [ ] Visit `https://your-production-url.vercel.app/api/health`
- [ ] Expected response: `{"status":"healthy"}`

### B. Landing Page Access
- [ ] Visit `https://your-production-url.vercel.app/`
- [ ] Page loads without errors
- [ ] Check browser console for errors (F12)

### C. Signup Flow (NEW USER)
1. [ ] Visit `https://your-production-url.vercel.app/signup`
2. [ ] Enter test email: `test+production@yourdomain.com`
3. [ ] Enter password: (use a strong test password)
4. [ ] Click "Sign Up"
5. [ ] **Expected**: Session sync polling starts
6. [ ] **Expected**: Dashboard loads within 30 seconds
7. [ ] **Expected**: User sees welcome message
8. [ ] Check browser console: Look for `[Session Sync]` logs with request IDs
9. [ ] Verify no TypeScript/cookie errors in console

### D. Logout Flow
1. [ ] Click logout button in dashboard
2. [ ] **Expected**: Redirected to login page
3. [ ] **Expected**: Session cleared (check browser cookies)

### E. Login Flow (EXISTING USER)
1. [ ] Visit `https://your-production-url.vercel.app/login`
2. [ ] Enter same email: `test+production@yourdomain.com`
3. [ ] Enter password
4. [ ] Click "Sign In"
5. [ ] **Expected**: Session sync polling starts
6. [ ] **Expected**: Dashboard loads within 30 seconds
7. [ ] **Expected**: User data persists from signup

### F. Google OAuth Flow
1. [ ] Logout first
2. [ ] Visit `https://your-production-url.vercel.app/login`
3. [ ] Click "Continue with Google"
4. [ ] Complete Google authentication
5. [ ] **Expected**: Callback to `/auth/callback`
6. [ ] **Expected**: Redirected to dashboard
7. [ ] **Expected**: User profile populated with Google data
8. [ ] Check browser console for any errors

### G. Protected Route Access
1. [ ] Logout
2. [ ] Try to visit `https://your-production-url.vercel.app/dashboard`
3. [ ] **Expected**: Redirected to `/login`
4. [ ] Login again
5. [ ] **Expected**: Dashboard loads successfully

---

## 3. Test Payment Flow with Live Flutterwave

### A. Create Payment Link
1. [ ] Login to dashboard
2. [ ] Navigate to billing/payments section
3. [ ] Click "Create Payment Link" or "Upgrade Plan"
4. [ ] **Expected**: API call to `/api/create-payment-link` succeeds
5. [ ] **Expected**: Flutterwave hosted payment page URL returned
6. [ ] **Expected**: Payment link uses LIVE Flutterwave keys

### B. Complete Test Payment
⚠️ **WARNING**: This will use real money! Use Flutterwave test card:
- Card: `5531 8866 5214 2950`
- CVV: `564`
- Expiry: Any future date
- PIN: `3310`
- OTP: `12345`

1. [ ] Click generated payment link
2. [ ] Flutterwave hosted page loads
3. [ ] Enter test card details above
4. [ ] Complete payment
5. [ ] **Expected**: Payment success page
6. [ ] **Expected**: Webhook sent to `/api/flutterwave-webhook`
7. [ ] **Expected**: Subscription updated in Supabase
8. [ ] **Expected**: User redirected to success page

### C. Verify Webhook Delivery
1. [ ] Login to Flutterwave dashboard: https://dashboard.flutterwave.com/
2. [ ] Navigate to Settings → Webhooks
3. [ ] Check webhook logs for recent delivery
4. [ ] Verify webhook URL: `https://your-production-url.vercel.app/api/flutterwave-webhook`
5. [ ] Verify webhook secret hash is configured
6. [ ] Check response status: Should be 200 OK

### D. Verify Subscription Status
1. [ ] Go back to your app dashboard
2. [ ] Check billing/subscription section
3. [ ] **Expected**: Subscription shows as active
4. [ ] **Expected**: Credits added to account
5. [ ] **Expected**: Database record in `subscriptions` table updated

---

## 4. Test AI Agent Features

### A. Create AI Agent
1. [ ] Login to dashboard
2. [ ] Navigate to "Create Agent" section
3. [ ] Fill in agent details (name, prompt, voice settings)
4. [ ] Click "Create Agent"
5. [ ] **Expected**: API call to `/api/create-agent` succeeds
6. [ ] **Expected**: Agent saved to Supabase
7. [ ] **Expected**: MiniMax voice generated successfully
8. [ ] Check for MiniMax API errors in response

### B. Test Voice Generation
1. [ ] During agent creation, trigger voice preview
2. [ ] **Expected**: API call to `/api/generate-voice` succeeds
3. [ ] **Expected**: Audio file URL returned
4. [ ] **Expected**: Audio plays in browser
5. [ ] Verify MiniMax TTS API is being called correctly

### C. Agent Webhook
1. [ ] Note agent ID from created agent
2. [ ] Verify webhook URL: `https://your-production-url.vercel.app/api/agent/[id]/webhook`
3. [ ] Test webhook with curl (optional):
   ```bash
   curl -X POST https://your-production-url.vercel.app/api/agent/YOUR_AGENT_ID/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "webhook"}'
   ```
4. [ ] **Expected**: 200 OK response

---

## 5. Database Verification (Supabase)

### Check RLS Policies
1. [ ] Login to Supabase dashboard: https://supabase.com/dashboard
2. [ ] Navigate to your project: https://bcufohulqrceytkrqpgd.supabase.co
3. [ ] Go to Authentication → Users
4. [ ] Verify test users were created successfully
5. [ ] Go to Table Editor → `profiles` table
6. [ ] Verify user profiles exist with correct data
7. [ ] Go to Table Editor → `subscriptions` table
8. [ ] Verify subscription records if payment was completed

### Check Auth Logs
1. [ ] Go to Authentication → Logs
2. [ ] Look for recent signup/login events
3. [ ] Verify no authentication errors
4. [ ] Check for successful OAuth callbacks

---

## 6. Performance & Error Monitoring

### Browser Console Checks
- [ ] No TypeScript errors in console
- [ ] No cookie-related errors
- [ ] Session sync logs show correct request IDs
- [ ] No Supabase client errors
- [ ] API calls return expected status codes

### Vercel Function Logs
1. [ ] Go to Vercel dashboard → your project
2. [ ] Click "Logs" tab
3. [ ] Filter by function: `/api/auth/session`
4. [ ] Verify request IDs in logs match client-side
5. [ ] Check for any 500 errors
6. [ ] Verify session sync polling working correctly

### Network Tab Checks
1. [ ] Open browser DevTools (F12) → Network tab
2. [ ] Complete a login flow
3. [ ] Verify `/api/auth/session` polls every 2 seconds
4. [ ] Check response times (should be < 500ms)
5. [ ] Verify no failed API calls
6. [ ] Check cookie headers are correct

---

## 7. Environment Variable Validation

### Verify Variables in Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL is set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is set
- [ ] SUPABASE_SERVICE_ROLE_KEY is set (server-only)
- [ ] OPENAI_API_KEY is set (server-only)
- [ ] MINIMAX_API_KEY is set (server-only)
- [ ] MINIMAX_GROUP_ID is set (server-only)
- [ ] MINIMAX_VOICE_ID is set (server-only)
- [ ] FLW_PUBLIC_KEY is set
- [ ] FLW_SECRET_KEY is set (server-only)
- [ ] FLW_ENCRYPTION_KEY is set (server-only)
- [ ] FLW_WEBHOOK_SECRET is set (server-only)
- [ ] All NEXT_PUBLIC_TIER_*_PRICE variables are set
- [ ] NEXT_PUBLIC_APP_URL matches production URL

---

## 8. Expected Improvements (TestSprite)

After all flows are verified, run TestSprite again to validate:

### Before (Previous Session):
- Success Rate: 18.18%
- Failed Tests: Multiple authentication and session errors

### After (Expected):
- Success Rate: 95%+
- Authentication Flow: ✅ Should pass
- Session Persistence: ✅ Should pass
- OAuth Callback: ✅ Should pass
- Protected Routes: ✅ Should pass
- Payment Flow: ✅ Should pass

---

## Critical Issues to Watch For

### 🚨 Authentication Errors
- Cookie not being set properly
- Session sync polling failing
- Middleware redirect loops
- OAuth callback failures

### 🚨 Payment Errors
- Flutterwave webhook signature validation failing
- Payment not reflecting in database
- Webhook not being received

### 🚨 API Errors
- 500 Internal Server Error from any endpoint
- Supabase connection failures
- OpenAI/MiniMax API failures

---

## Next Steps After Verification

1. **If all tests pass**:
   - [ ] Run TestSprite automated tests
   - [ ] Share production URL with stakeholders
   - [ ] Monitor error logs for 24 hours
   - [ ] Set up uptime monitoring (optional)

2. **If any tests fail**:
   - [ ] Note which specific test failed
   - [ ] Check Vercel function logs for that endpoint
   - [ ] Check browser console for client-side errors
   - [ ] Verify environment variable is set correctly
   - [ ] Report back with specific error messages

---

## Success Criteria ✅

All these must be ✅ before declaring deployment successful:

- [ ] Build completed without TypeScript errors
- [ ] Landing page loads correctly
- [ ] Signup creates new user in Supabase
- [ ] Login successfully authenticates
- [ ] Google OAuth completes full flow
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login when logged out
- [ ] Dashboard loads when authenticated
- [ ] Payment link generation works
- [ ] Flutterwave webhook receives events
- [ ] AI agent creation succeeds
- [ ] Voice generation works with MiniMax
- [ ] No console errors during normal usage
- [ ] TestSprite success rate improves to 95%+

---

## Production URL

Once you verify the deployment URL, update this:

**Production URL**: `https://_____.vercel.app`

Replace this in:
- [ ] Vercel environment variable: `NEXT_PUBLIC_APP_URL`
- [ ] Flutterwave webhook settings: `https://_____.vercel.app/api/flutterwave-webhook`
- [ ] Google OAuth redirect URIs (if using OAuth)

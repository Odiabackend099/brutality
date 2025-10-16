# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Environment Variables (Vercel Dashboard)
Go to: **Project Settings → Environment Variables**

**Required Variables:**
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Flutterwave (Required for payments)
FLUTTERWAVE_PUBLIC_KEY=your_public_key
FLUTTERWAVE_SECRET_KEY=your_secret_key
FLUTTERWAVE_WEBHOOK_SECRET_HASH=your_webhook_hash

# AI Services (Required for functionality)
OPENAI_API_KEY=your_openai_key
MINIMAX_API_KEY=your_minimax_key
MINIMAX_GROUP_ID=your_group_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. Database Setup (Supabase Dashboard)
1. **Run SQL Scripts:**
   - Execute `sql/schema.sql` (creates core tables)
   - Execute `sql/dashboard-tables.sql` (creates dashboard tables)

2. **Enable RLS Policies:**
   - All tables should have Row Level Security enabled
   - Policies are included in the SQL scripts

3. **Create Indexes:**
   - Indexes are included in the SQL scripts for performance

### 3. Flutterwave Configuration
1. **Update Webhook URL:**
   - Go to Flutterwave Dashboard → Settings → Webhooks
   - Set webhook URL to: `https://your-domain.vercel.app/api/flutterwave-webhook`
   - Copy the webhook secret hash to `FLUTTERWAVE_WEBHOOK_SECRET_HASH`

2. **Test Mode:**
   - Start with test mode for initial testing
   - Switch to live mode when ready for production

## ✅ Deployment Steps

### 1. Deploy to Vercel
```bash
# Push to main branch (auto-deploys)
git add .
git commit -m "feat: production-ready MDP with all optimizations"
git push origin main
```

### 2. Verify Deployment
1. **Check Build Status:**
   - Go to Vercel Dashboard → Deployments
   - Ensure build completed successfully

2. **Test Health Check:**
   - Visit: `https://your-domain.vercel.app/api/health`
   - Should return status 200 with configuration details

3. **Test Core Functionality:**
   - Sign up: `https://your-domain.vercel.app/signup`
   - Login: `https://your-domain.vercel.app/login`
   - Dashboard: `https://your-domain.vercel.app/dashboard`

## ✅ Post-Deployment Testing

### 1. Authentication Flow
- [ ] User can sign up with email
- [ ] Email verification works (check Supabase Auth)
- [ ] User can login successfully
- [ ] Dashboard loads with user data
- [ ] Logout works correctly

### 2. Payment Flow
- [ ] Billing page loads: `/billing`
- [ ] Payment link generation works
- [ ] Test payment with small amount (₦50)
- [ ] Webhook receives payment confirmation
- [ ] User quota updates after payment

### 3. AI Agent Functionality
- [ ] Create agent: Dashboard → "Create Agent"
- [ ] Agent webhook responds: `/api/agent/[id]/webhook`
- [ ] Voice generation works: `/api/generate-voice`
- [ ] Usage tracking works correctly

### 4. Error Handling
- [ ] Missing API keys show proper error messages
- [ ] Invalid requests return appropriate status codes
- [ ] Network errors are handled gracefully

## ✅ Monitoring & Maintenance

### 1. Vercel Monitoring
- **Function Logs:** Check for errors in Vercel Dashboard
- **Performance:** Monitor function execution times
- **Usage:** Track bandwidth and function invocations

### 2. Supabase Monitoring
- **Database:** Check query performance in Supabase Dashboard
- **Auth:** Monitor user signups and logins
- **Storage:** Check file uploads and usage

### 3. External Services
- **Flutterwave:** Monitor transaction success rates
- **OpenAI:** Track API usage and costs
- **MiniMax:** Monitor TTS generation success

## 🚨 Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Missing env vars | Add all required variables in Vercel |
| 500 errors | API key issues | Check environment variable names |
| Payment fails | Webhook URL wrong | Update Flutterwave webhook URL |
| Auth fails | Supabase config | Verify Supabase URL and keys |
| AI not working | OpenAI key missing | Add OPENAI_API_KEY to Vercel |

### Debug Commands
```bash
# Check environment variables
curl https://your-domain.vercel.app/api/health

# Test specific endpoints
curl -X POST https://your-domain.vercel.app/api/create-agent \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","system_prompt":"Test prompt","voice_id":"female_1"}'
```

## 🎯 Success Metrics

### Week 1 Goals
- [ ] 10+ successful user signups
- [ ] 5+ agents created
- [ ] 3+ successful payments
- [ ] 0 critical errors in logs

### Month 1 Goals
- [ ] 100+ active users
- [ ] 50+ agents created
- [ ] 90%+ payment success rate
- [ ] <2s average response time

## 📞 Support Contacts

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Supabase Support:** [supabase.com/support](https://supabase.com/support)
- **Flutterwave Support:** [flutterwave.com/support](https://flutterwave.com/support)

---

## 🎉 You're Ready to Launch!

Once all checklist items are complete, your CallWaiting AI MDP is production-ready. Start with a small group of beta users and gradually scale up based on usage and feedback.

**Next Phase:** Real-time phone calls with Twilio/Vapi integration!

# Deployment Checklist: Pricing Update 2025-10-16

## Pre-Deployment Verification

### Local Testing
- [x] ✅ Build passes (`npm run build`)
- [x] ✅ No TypeScript errors
- [x] ✅ No ESLint warnings
- [x] ✅ All pricing components render correctly
- [x] ✅ Mobile responsiveness verified

### Code Review
- [x] ✅ New `PricingSection.tsx` component created
- [x] ✅ Homepage pricing section updated
- [x] ✅ Upgrade page redesigned
- [x] ✅ Billing page tiers updated
- [x] ✅ Environment variables documented
- [x] ✅ API routes validated
- [x] ✅ Flutterwave integration unchanged
- [x] ✅ No breaking changes detected

---

## Deployment Steps

### 1. Update Vercel Environment Variables

Navigate to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add/Update the following for **Production**, **Preview**, and **Development**:

```env
# Pricing Tiers (in USD cents)
STARTER_PLAN_AMOUNT=2000
PRO_PLAN_AMOUNT=8000
ENTERPRISE_PLAN_AMOUNT=18000

# Flutterwave Payment Links
NEXT_PUBLIC_FLUTTERWAVE_STARTER=https://flutterwave.com/pay/vp8my5xd8dkn
NEXT_PUBLIC_FLUTTERWAVE_PRO=https://flutterwave.com/pay/gickbfzxhjyt
NEXT_PUBLIC_FLUTTERWAVE_ENTERPRISE=https://flutterwave.com/pay/fw9btqrzmeq8

# Minutes per plan
STARTER_PLAN_MINUTES=120
PRO_PLAN_MINUTES=600
ENTERPRISE_PLAN_MINUTES=2000
```

**⚠️ Important:** Remove old variables if they exist:
- ❌ `BASIC_PLAN_AMOUNT`
- ❌ Any old Flutterwave links

### 2. Git Commit & Push

```bash
cd /Users/odiadev/callwaitingai.dev\ 2025

# Stage changes
git add .

# Create commit
git commit -m "feat: implement per-minute pricing model

- Add new PricingSection component with 4-tier layout
- Update pricing: Starter ($20/120min), Pro ($80/600min), Enterprise ($180/2000min)
- Replace setup fees with transparent per-minute pricing
- Update all pricing references across homepage, upgrade, and billing pages
- Update environment variables and Flutterwave integration
- Update metadata and SEO descriptions
- Mobile-responsive design with conversion optimization

Breaking changes:
- Removed old Basic plan (NGN pricing)
- Changed currency from NGN to USD
- New Flutterwave payment links"

# Push to main/production branch
git push origin main
```

### 3. Verify Vercel Deployment

1. **Wait for deployment to complete** (~2-3 minutes)
2. **Check deployment logs** in Vercel Dashboard
3. **Verify build succeeded** (green checkmark)

### 4. Post-Deployment Testing

#### Homepage (https://callwaitingai.dev)
- [ ] Hero section shows "$20 for 120 voice minutes"
- [ ] Pricing section displays 4 tiers (Starter, Pro, Enterprise, Custom)
- [ ] "Most Popular" badge on Pro plan
- [ ] All payment links work (open in new tab to Flutterwave)
- [ ] FAQ section mentions per-minute pricing
- [ ] Mobile responsive (test on iPhone/Android)

#### Upgrade Page (https://callwaitingai.dev/dashboard/upgrade)
- [ ] 3 pricing tiers displayed correctly
- [ ] Payment links redirect to Flutterwave
- [ ] Value props show (Rollover, 24/7, $0 Setup)
- [ ] FAQ section loads
- [ ] Ada phone number clickable: +1 (415) 687-6510
- [ ] Mobile responsive

#### Billing Page (https://callwaitingai.dev/billing)
- [ ] Tiers show USD pricing ($20, $80, $180)
- [ ] Current plan indicator works
- [ ] Upgrade buttons functional
- [ ] Usage bar displays correctly

#### API Testing
Test payment link generation:
```bash
# Login to dashboard first, then:
curl -X POST https://callwaitingai.dev/api/create-payment-link \
  -H "Content-Type: application/json" \
  -d '{"plan": "starter"}' \
  --cookie "your-session-cookie"

# Should return:
# {"paymentLink": "https://flutterwave.com/...", "txRef": "cw_..."}
```

### 5. Flutterwave Verification

Check Flutterwave Dashboard:
- [ ] Webhook endpoint configured: `/api/flutterwave-webhook`
- [ ] Secret hash matches `FLUTTERWAVE_WEBHOOK_SECRET_HASH`
- [ ] Payment links active and accessible
- [ ] Test payment with test card (if available)

### 6. Analytics & Monitoring

Enable tracking for:
- [ ] Pricing page views (`/dashboard/upgrade`)
- [ ] CTA clicks ("Get Starter", "Get Pro", etc.)
- [ ] Flutterwave redirects
- [ ] Payment completions

**Plausible/Google Analytics Events:**
```javascript
// Track pricing tier selection
trackEvent('Pricing Tier Selected', {
  plan: 'starter|pro|enterprise',
  source: 'homepage|dashboard'
})

// Track payment initiation
trackEvent('Payment Initiated', {
  plan: 'starter|pro|enterprise',
  amount: 20|80|180
})
```

### 7. Database Verification

Check Supabase `subscriptions` table:
```sql
-- Verify new plans are being recorded
SELECT plan, COUNT(*) as count, AVG(amount) as avg_amount
FROM subscriptions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY plan;

-- Check for any failed payments
SELECT *
FROM subscriptions
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '24 hours';
```

---

## Rollback Plan

If critical issues arise:

### Quick Rollback (Vercel)
1. Go to Vercel Dashboard → Deployments
2. Find previous deployment (before this change)
3. Click "..." menu → "Promote to Production"
4. Confirm rollback

### Manual Rollback (Git)
```bash
# Find commit hash before pricing update
git log --oneline | head -5

# Revert to previous commit
git revert <commit-hash>

# Or hard reset (⚠️ dangerous)
git reset --hard <commit-hash>
git push --force origin main
```

### Restore Old Environment Variables
```env
BASIC_PLAN_AMOUNT=2900
PRO_PLAN_AMOUNT=7900
ENTERPRISE_PLAN_AMOUNT=19900
```

---

## Success Criteria

### Immediate (Within 24 hours)
- [ ] Zero deployment errors
- [ ] All pages load successfully
- [ ] No 500/404 errors on pricing pages
- [ ] At least 1 test payment completed successfully
- [ ] Homepage bounce rate < 60%
- [ ] Mobile traffic accounts for 40-60% of visits

### Short-term (Within 7 days)
- [ ] Conversion rate from free trial → paid ≥ 5%
- [ ] Average revenue per user (ARPU) ≥ $50
- [ ] Customer support tickets about pricing < 5/day
- [ ] Page load time < 2 seconds (Lighthouse)

### Medium-term (Within 30 days)
- [ ] Monthly recurring revenue (MRR) increases 15%+
- [ ] Starter plan adoption ≥ 30% of new users
- [ ] Pro plan remains most popular (50%+ of revenue)
- [ ] Enterprise inquiries increase 10%+
- [ ] Churn rate decreases or stays flat

---

## Communication Plan

### Internal Team
- [ ] Notify sales team of new pricing
- [ ] Update internal documentation
- [ ] Train support team on new tiers

### Customers
- [ ] Email existing users about new pricing (if applicable)
- [ ] Update help docs/knowledge base
- [ ] Post announcement on social media

### Partners
- [ ] Notify any affiliates/resellers
- [ ] Update partnership materials

---

## Support Preparation

### Common Questions & Answers

**Q: What happened to the $300 setup fee?**
A: We've moved to transparent per-minute pricing. Start at just $20 for 120 minutes - no setup fees!

**Q: Do my minutes expire?**
A: No! Unused minutes roll over monthly. They never expire as long as you maintain an active subscription.

**Q: Can I change plans?**
A: Yes! Upgrade or downgrade anytime. Unused minutes transfer to your new plan.

**Q: What if I run out of minutes?**
A: You'll receive alerts at 80% and 90% usage. You can upgrade anytime or purchase add-on minute bundles.

**Q: Is there a refund policy?**
A: Yes! 30-day money-back guarantee. If you're not satisfied, we'll refund your plan fee in full.

---

## Monitoring Dashboards

### Key Metrics to Watch

**Vercel Analytics:**
- Page views: `/`, `/dashboard/upgrade`, `/billing`
- Conversion rate: homepage → sign-up
- Bounce rate by page

**Flutterwave Dashboard:**
- Successful payments by plan
- Failed payments (investigate reasons)
- Average transaction value

**Supabase:**
- New user signups
- Plan distribution (starter:pro:enterprise ratio)
- Usage patterns (minutes consumed)

---

## Contact Information

**If Issues Arise:**
- 🔧 **Developer:** Check Vercel logs + Supabase logs
- 💳 **Payment Issues:** Contact Flutterwave support
- 🐛 **Bugs:** Create issue in GitHub repo
- 📧 **Customer Support:** callwaitingai@gmail.com
- 📞 **Emergency:** Call Ada at +1 (415) 687-6510

---

## Sign-Off

- [ ] ✅ Code reviewed and approved
- [ ] ✅ Build passing locally
- [ ] ✅ Environment variables prepared
- [ ] ✅ Rollback plan documented
- [ ] ✅ Support team notified
- [ ] ✅ Analytics configured

**Deployed By:** _____________
**Date:** 2025-10-16
**Time:** _____________
**Vercel Deployment URL:** _____________

---

**Status:** 🟢 Ready for Production Deployment

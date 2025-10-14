# CallWaiting AI - Production Setup Guide

## 🚨 CRITICAL SECURITY FIXES APPLIED

This implementation fixes the original plan's critical security and reliability issues:

1. **API Verification**: Every payment verified via Flutterwave API before processing
2. **Service Key Rotation**: Exposed key must be rotated immediately
3. **CORS Support**: Lead form works with browser CORS preflight
4. **Idempotency**: Single unique constraint prevents duplicate payments
5. **Early Response**: Webhook responds immediately to prevent timeouts
6. **Domain Email**: Uses domain sender for better deliverability

## 📋 Setup Checklist

### Phase 1: Security (DO FIRST)
- [ ] **ROTATE** the exposed Supabase service_role key in Supabase Dashboard
- [ ] Run `supabase_schema_hardened.sql` in Supabase SQL Editor
- [ ] Enable PITR backups in Supabase (Pro plan required)

### Phase 2: n8n Configuration
- [ ] Import `n8n_payment_workflow_hardened.json` into n8n
- [ ] Import `n8n_leads_workflow_cors.json` into n8n
- [ ] Set environment variables from `n8n_environment_variables.md`
- [ ] Configure credentials (Supabase, Flutterwave, Gmail SMTP)
- [ ] Enable queue mode with Redis (optional but recommended)

### Phase 3: Flutterwave Setup
- [ ] Set webhook URL: `https://n8n.odia.dev/webhook/flutterwave`
- [ ] Enable events: `charge.completed`, `transfer.completed`
- [ ] Set secret hash and copy to `FLW_VERIF_HASH` env var
- [ ] Enable retries (3 attempts)

### Phase 4: Cloudflare WAF
- [ ] Implement rules from `cloudflare_waf_rules.md`
- [ ] Test CORS preflight for lead form
- [ ] Verify rate limiting works
- [ ] Test webhook protection rules

### Phase 5: Email Deliverability
- [ ] Set up domain email: `no-reply@callwaitingai.dev`
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Test email delivery to inbox (not spam)
- [ ] Update n8n workflows to use domain email

### Phase 6: Frontend Updates
- [ ] Deploy updated `app/page.tsx` with payment links
- [ ] Test payment button clicks (should open Flutterwave)
- [ ] Test lead form submission with CORS
- [ ] Verify error handling works

## 🧪 Testing Protocol

### Payment Flow Test
1. Make a $1 test payment via Flutterwave link
2. Verify webhook fires within 30 seconds
3. Check Supabase for payment record
4. Confirm customer receives email with Calendly link
5. Confirm founder receives alert email
6. Test duplicate webhook (should not create duplicate record)

### Lead Form Test
1. Submit lead form from browser
2. Verify CORS preflight passes
3. Check Supabase for lead record
4. Confirm founder receives lead alert
5. Test form validation and error handling

### Security Test
1. Send webhook with wrong `verif-hash` → should be rejected
2. Try non-POST requests to webhooks → should be blocked
3. Test rate limiting → should block after 60 requests/minute
4. Verify emails land in inbox (not spam)

## 🚀 Production Deployment

### Before Going Live
- [ ] All tests pass
- [ ] Service key rotated
- [ ] Domain email configured
- [ ] WAF rules active
- [ ] Queue mode enabled
- [ ] PITR backups enabled

### Monitoring
- [ ] Set up webhook failure alerts
- [ ] Monitor email deliverability
- [ ] Track payment success rates
- [ ] Watch for failed webhook signatures

## 🔧 Troubleshooting

### Common Issues

**Webhook Timeouts**
- Ensure "Respond to Webhook" node is early in flow
- Use queue mode for reliability

**CORS Errors**
- Verify Cloudflare allows OPTIONS for lead webhook
- Check n8n webhook CORS headers

**Email in Spam**
- Set up SPF/DKIM/DMARC for domain
- Use domain email sender, not Gmail

**Duplicate Payments**
- Verify unique constraint on `flutterwave_id`
- Check idempotency in Supabase upsert

**Failed Signatures**
- Verify `FLW_VERIF_HASH` matches Flutterwave dashboard
- Check webhook payload structure

## 📞 Support

If issues persist:
1. Check n8n execution logs
2. Verify Supabase RLS policies
3. Test Flutterwave webhook manually
4. Contact: callwaitingai@gmail.com

## 🎯 Success Metrics

- Payment webhooks process within 30 seconds
- Lead forms submit without CORS errors
- Emails land in primary inbox
- Zero duplicate payment records
- 100% webhook signature verification

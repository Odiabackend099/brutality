# Cloudflare WAF Rules for CallWaiting AI

## Critical Fix: CORS-Enabled Webhook Protection

### Rule 1: Block Non-POST on Payment Webhook (Strict)

**Name:** `n8n Payment Webhook Protection`
**Expression:**
```
(http.request.uri.path contains "/webhook/flutterwave" and http.request.method ne "POST")
```
**Action:** Block
**Description:** Flutterwave webhook should only accept POST requests. Blocks GET, PUT, DELETE, etc.

### Rule 2: Allow OPTIONS + POST for Lead Webhook (CORS-Enabled)

**Name:** `n8n Lead Webhook CORS`
**Expression:**
```
(http.request.uri.path contains "/webhook/leads_callwaiting" and not http.request.method in {"POST" "OPTIONS"})
```
**Action:** Block
**Description:** Allow POST and OPTIONS (for CORS preflight). Block everything else.

### Rule 3: Rate Limiting (Per IP)

**Name:** `n8n Webhook Rate Limiting`
**Path:** `/webhook/*`
**Rate:** 60 requests per minute per IP
**Action:** Block for 10 minutes
**Description:** Prevent abuse of webhook endpoints

## Implementation Steps

1. Go to Cloudflare Dashboard → Security → WAF → Custom Rules
2. Create each rule above
3. Test with browser form submission (should pass OPTIONS preflight)
4. Test with direct webhook calls (should respect rate limits)

## Testing Checklist

- [ ] Browser lead form submission works (CORS preflight passes)
- [ ] Flutterwave webhook POST works
- [ ] Non-POST requests to `/webhook/flutterwave` are blocked
- [ ] Non-POST/OPTIONS requests to `/webhook/leads_callwaiting` are blocked
- [ ] Rate limiting kicks in after 60 requests/minute
- [ ] All legitimate requests pass through

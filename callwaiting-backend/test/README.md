# CallWaiting AI - Webhook Testing Suite

This directory contains comprehensive test vectors and validation scripts for testing the Flutterwave webhook verification logic.

## 🧪 Test Files

### `webhook-test-vectors.js`
Generates valid test webhooks with proper HMAC-SHA256 signatures for local testing.

**Features:**
- Valid webhook with correct signature
- Invalid signature webhook (should be rejected)
- Old timestamp webhook (replay attack simulation)
- Missing signature webhook (should be rejected)
- Pro plan webhook ($500)
- Failed payment webhook

### `test-webhook-verification.js`
Test suite that validates the HMAC-SHA256 signature verification logic.

**Tests:**
- ✅ Valid webhook acceptance
- ❌ Invalid signature rejection
- ⏰ Old timestamp rejection
- 🚫 Missing signature rejection
- 💼 Pro plan webhook acceptance
- 💸 Failed payment webhook acceptance

### `flutterwave-official-test.js`
**Official Flutterwave test vectors** based on their documentation and specifications.

**Official Test Cases:**
- ✅ Valid Payment Notification (Alice, $300)
- ❌ Wrong Secret (Signature Mismatch)
- ⏰ Old Timestamp (Replay Attack Protection)
- 🚫 Missing Signature Header
- 💼 Pro Plan Payment (Bob, $500)
- 💸 Failed Payment (Valid webhook, failed payment)

### `webhook-test.js`
**End-to-End Webhook Testing** - Actually posts to your n8n webhook endpoint.

**Live Test Cases:**
- ✅ Valid webhook (should be accepted)
- ❌ Invalid signature (should be rejected)
- 🚫 Missing signature header (should be rejected)
- ⏰ Old timestamp/replay attack (should be rejected)
- 💼 Pro plan payment (should be accepted)
- 💸 Failed payment (valid webhook, failed payment)
- 🔄 Duplicate webhook (idempotency test)
- ❌ Wrong secret (should be rejected)

## 🚀 Usage

### Generate Test Vectors

```bash
cd callwaiting-backend/test
node webhook-test-vectors.js
```

This will output:
- Sample webhook payloads with headers
- Valid HMAC signatures for testing
- Curl commands for manual testing

### Run Verification Tests

```bash
cd callwaiting-backend/test
node test-webhook-verification.js
```

This will:
- Test all verification scenarios
- Show pass/fail results
- Generate curl commands for manual testing
- Provide test summary

### Run Official Flutterwave Tests

```bash
cd callwaiting-backend/test
node flutterwave-official-test.js
```

This will:
- Test with official Flutterwave specifications
- Show exact signatures and payloads
- Generate curl commands for manual testing
- Validate HMAC-SHA256 implementation

### Run End-to-End Webhook Tests

```bash
cd callwaiting-backend/test
npm install
npm run test:webhook
```

Or with custom settings:
```bash
FLW_SECRET_HASH=your_actual_secret WEBHOOK_URL=https://n8n.odia.dev/webhook/flutterwave node webhook-test.js
```

This will:
- Actually post to your n8n webhook endpoint
- Test all verification scenarios live
- Show HTTP responses and status codes
- Validate end-to-end webhook processing
- Test idempotency with duplicate webhooks

### Manual Testing with curl

```bash
# Test valid webhook
curl -X POST https://n8n.odia.dev/webhook/flutterwave \
  -H "Content-Type: application/json" \
  -H "verif-hash: <generated_signature>" \
  -d '<webhook_payload>'

# Test invalid signature
curl -X POST https://n8n.odia.dev/webhook/flutterwave \
  -H "Content-Type: application/json" \
  -H "verif-hash: invalid_signature" \
  -d '<webhook_payload>'
```

## 🔐 HMAC-SHA256 Signature Generation

The test vectors use the same HMAC-SHA256 algorithm as Flutterwave:

```javascript
const crypto = require('crypto');

function generateSignature(payload, secret) {
  const rawBody = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
}
```

## 📋 Test Scenarios

### 1. Valid Webhook ✅
- Correct HMAC-SHA256 signature
- Fresh timestamp
- Should be accepted and processed

### 2. Invalid Signature ❌
- Wrong signature in `verif-hash` header
- Should be rejected with "signature-mismatch" error

### 3. Old Timestamp ⏰
- Valid signature but timestamp > 60 seconds old
- Should be rejected with "webhook-too-old" error

### 4. Missing Signature 🚫
- No `verif-hash` header
- Should be rejected with "missing-signature" error

### 5. Pro Plan Webhook 💼
- $500 payment for Pro plan
- Valid signature and fresh timestamp
- Should be accepted and processed

### 6. Failed Payment 💸
- Payment with `status: "failed"`
- Valid signature but payment not successful
- Should be accepted but payment processing should fail

## 🎯 Expected Results

| Test Case | Expected Result | Reason |
|-----------|----------------|---------|
| Valid webhook | ✅ Accept | Correct signature, fresh timestamp |
| Invalid signature | ❌ Reject | Signature mismatch |
| Old timestamp | ❌ Reject | Replay attack protection |
| Missing signature | ❌ Reject | No authentication |
| Pro plan | ✅ Accept | Valid payment for Pro plan |
| Failed payment | ✅ Accept | Valid webhook, but payment failed |

## 🔧 Integration with n8n

These test vectors can be used to:

1. **Test n8n workflows** before going live
2. **Verify HMAC implementation** matches Flutterwave
3. **Test error handling** for various failure scenarios
4. **Validate idempotency** with duplicate webhooks
5. **Test rate limiting** and security measures

## 📊 Monitoring

After deployment, monitor for:

- Webhook signature failures (should be minimal)
- Old webhook rejections (indicates replay attacks)
- Processing errors (check n8n logs)
- Duplicate webhook handling (idempotency)

## 🚨 Security Notes

- **Never use test secrets in production**
- **Rotate webhook secrets regularly**
- **Monitor for signature failures**
- **Set up alerts for security events**
- **Test with real Flutterwave webhooks in staging**

## 📞 Support

For testing issues:
1. Check n8n execution logs
2. Verify webhook endpoint is accessible
3. Test with curl commands provided
4. Review HMAC implementation
5. Contact: callwaitingai@gmail.com

---

**These test vectors ensure your webhook verification is bulletproof before handling real payments!** 🛡️

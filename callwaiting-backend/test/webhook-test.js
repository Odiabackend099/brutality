#!/usr/bin/env node

/**
 * CallWaiting AI - End-to-End Webhook Testing
 * 
 * This script generates valid & invalid test webhooks (HMAC-SHA256) 
 * and posts them to your n8n endpoint to check verification logic.
 */

const crypto = require('crypto');
const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://n8n.odia.dev/webhook/flutterwave';
const SECRET = process.env.FLW_SECRET_HASH || 'supersecret123';

function makeWebhookPayload(overrides = {}) {
  // Use a base valid payload; override fields as needed
  const payload = {
    data: {
      amount: 300,
      currency: 'USD',
      customer: {
        name: 'Alice',
        email: 'alice@example.com'
      },
      id: 'chg_TEST123',
      tx_ref: 'starter-test-1',
      status: 'successful'
    },
    id: 'wbk_TEST001',
    timestamp: Date.now(),
    type: 'charge.completed'
  };
  return Object.assign(payload, overrides);
}

function signPayload(raw, secret) {
  return crypto.createHmac('sha256', secret)
    .update(raw)
    .digest('base64');
}

async function sendTest(payload, signatureHeaderName = 'verif-hash', signature) {
  try {
    const resp = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        [signatureHeaderName]: signature
      },
      validateStatus: () => true,
      timeout: 10000
    });
    console.log('Request:', JSON.stringify(payload, null, 2));
    console.log('Signature:', signature);
    console.log('Status:', resp.status, 'Body:', resp.data);
    console.log('---');
  } catch (err) {
    console.error('Error sending test webhook:', err.message);
    console.log('---');
  }
}

async function runTests() {
  console.log('🧪 CallWaiting AI - End-to-End Webhook Testing');
  console.log('==============================================');
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Secret: ${SECRET.substring(0, 8)}...`);
  console.log('');

  // 1. Valid webhook
  {
    const payload = makeWebhookPayload();
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET);
    console.log('--- VALID WEBHOOK ---');
    console.log('Expected: ACCEPT (HTTP 200, process payment)');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 2. Invalid signature
  {
    const payload = makeWebhookPayload();
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET) + 'tamper';  // break signature
    console.log('--- INVALID SIGNATURE ---');
    console.log('Expected: REJECT (signature mismatch)');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 3. Missing signature header
  {
    const payload = makeWebhookPayload();
    const raw = JSON.stringify(payload);
    console.log('--- MISSING SIGNATURE HEADER ---');
    console.log('Expected: REJECT (no authentication)');
    await sendTest(payload, 'verif-hash', '');
  }

  // 4. Replay (old timestamp)
  {
    const payload = makeWebhookPayload({ timestamp: Date.now() - (5 * 60 * 1000) }); // 5 min old
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET);
    console.log('--- OLD TIMESTAMP (REPLAY ATTACK) ---');
    console.log('Expected: REJECT (replay protection)');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 5. "Pro plan" scenario with different amount & tx_ref
  {
    const payload = makeWebhookPayload({
      data: {
        amount: 500,
        currency: 'USD',
        customer: { name: 'Bob', email: 'bob@example.com' },
        id: 'chg_TEST456',
        tx_ref: 'pro-test-1',
        status: 'successful'
      },
      id: 'wbk_TEST002',
      timestamp: Date.now(),
      type: 'charge.completed'
    });
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET);
    console.log('--- PRO PLAN VALID ---');
    console.log('Expected: ACCEPT (HTTP 200, process $500 payment)');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 6. Failed payment status (valid signature but status != successful)
  {
    const payload = makeWebhookPayload({
      data: { status: 'failed' }
    });
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET);
    console.log('--- FAILED PAYMENT ---');
    console.log('Expected: ACCEPT (valid webhook, but payment failed)');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 7. Duplicate webhook (idempotency test)
  {
    const payload = makeWebhookPayload();
    const raw = JSON.stringify(payload);
    const sig = signPayload(raw, SECRET);
    console.log('--- DUPLICATE WEBHOOK (IDEMPOTENCY) ---');
    console.log('Expected: ACCEPT first, ignore second (idempotent)');
    await sendTest(payload, 'verif-hash', sig);
    console.log('Sending same webhook again...');
    await sendTest(payload, 'verif-hash', sig);
  }

  // 8. Wrong secret (different secret key)
  {
    const payload = makeWebhookPayload();
    const raw = JSON.stringify(payload);
    const wrongSecret = 'wrongsecret456';
    const sig = signPayload(raw, wrongSecret);
    console.log('--- WRONG SECRET ---');
    console.log('Expected: REJECT (signature mismatch)');
    await sendTest(payload, 'verif-hash', sig);
  }

  console.log('🎯 Test Summary:');
  console.log('================');
  console.log('✅ Valid webhook: Should be accepted and processed');
  console.log('❌ Invalid signature: Should be rejected');
  console.log('🚫 Missing signature: Should be rejected');
  console.log('⏰ Old timestamp: Should be rejected (replay protection)');
  console.log('✅ Pro plan: Should be accepted ($500 payment)');
  console.log('✅ Failed payment: Should be accepted (valid webhook)');
  console.log('🔄 Duplicate: Should be idempotent (no duplicate processing)');
  console.log('❌ Wrong secret: Should be rejected');
  console.log('');
  console.log('📊 Check your n8n execution logs for detailed results');
  console.log('📊 Check Supabase for database entries');
  console.log('📊 Check email alerts for notifications');
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
  });
}

module.exports = {
  makeWebhookPayload,
  signPayload,
  sendTest,
  runTests
};

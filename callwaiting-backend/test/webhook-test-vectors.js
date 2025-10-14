#!/usr/bin/env node

/**
 * CallWaiting AI - Flutterwave Webhook Test Vectors
 * 
 * This script generates valid test webhooks for local testing of the
 * HMAC-SHA256 signature verification logic in n8n workflows.
 */

const crypto = require('crypto');

// Test configuration - Using official Flutterwave spec
const SECRET_HASH = 'supersecret123';

// Official Flutterwave test payload (compact JSON, no whitespace)
const TEST_PAYLOAD = {
  "data": {
    "amount": 300,
    "currency": "USD",
    "customer": {
      "name": "Alice",
      "email": "alice@example.com"
    },
    "id": "chg_ABC123",
    "tx_ref": "starter-ref-1",
    "status": "successful"
  },
  "id": "wbk_001",
  "timestamp": 1699999999000,
  "type": "charge.completed"
};

// Pro plan test payload
const PRO_PAYLOAD = {
  "data": {
    "amount": 500,
    "currency": "USD",
    "customer": {
      "name": "Bob",
      "email": "bob@example.com"
    },
    "id": "chg_DEF456",
    "tx_ref": "pro-ref-2",
    "status": "successful"
  },
  "id": "wbk_002",
  "timestamp": 1699999999000,
  "type": "charge.completed"
};

/**
 * Generate HMAC-SHA256 signature for webhook verification
 * Uses compact JSON (no whitespace) as per Flutterwave spec
 */
function generateSignature(payload, secret) {
  // Use compact JSON.stringify (no spaces) as per Flutterwave docs
  const rawBody = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
}

/**
 * Generate signature with wrong secret (for negative testing)
 */
function generateWrongSignature(payload, wrongSecret) {
  const rawBody = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', wrongSecret)
    .update(rawBody)
    .digest('base64');
}

/**
 * Generate test webhook with valid signature
 */
function generateValidWebhook() {
  const signature = generateSignature(TEST_PAYLOAD, SECRET_HASH);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: TEST_PAYLOAD
  };
}

/**
 * Generate test webhook with invalid signature (wrong secret)
 */
function generateInvalidWebhook() {
  const wrongSecret = 'wrongsecret456';
  const wrongSignature = generateWrongSignature(TEST_PAYLOAD, wrongSecret);
  
  return {
    headers: {
      'verif-hash': wrongSignature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: TEST_PAYLOAD
  };
}

/**
 * Generate test webhook with old timestamp (replay attack)
 */
function generateOldWebhook() {
  const oldPayload = {
    ...TEST_PAYLOAD,
    timestamp: Date.now() - (10 * 60 * 1000)  // 10 minutes ago
  };
  
  const signature = generateSignature(oldPayload, SECRET_HASH);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: oldPayload
  };
}

/**
 * Generate test webhook with missing signature
 */
function generateMissingSignatureWebhook() {
  return {
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: TEST_PAYLOAD
  };
}

/**
 * Generate Pro plan webhook ($500)
 */
function generateProPlanWebhook() {
  const signature = generateSignature(PRO_PAYLOAD, SECRET_HASH);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: PRO_PAYLOAD
  };
}

/**
 * Generate failed payment webhook
 */
function generateFailedWebhook() {
  const failedPayload = {
    "data": {
      "amount": 300,
      "currency": "USD",
      "customer": {
        "name": "Alice",
        "email": "alice@example.com"
      },
      "id": "chg_ABC123",
      "tx_ref": "starter-ref-1",
      "status": "failed"
    },
    "id": "wbk_001",
    "timestamp": 1699999999000,
    "type": "charge.completed"
  };
  
  const signature = generateSignature(failedPayload, SECRET_HASH);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: failedPayload
  };
}

// Export test cases
const testCases = {
  valid: generateValidWebhook(),
  invalidSignature: generateInvalidWebhook(),
  oldTimestamp: generateOldWebhook(),
  missingSignature: generateMissingSignatureWebhook(),
  proPlan: generateProPlanWebhook(),
  failedPayment: generateFailedWebhook()
};

// CLI usage
if (require.main === module) {
  console.log('🔍 CallWaiting AI - Flutterwave Webhook Test Vectors\n');
  
  console.log('📋 Test Cases Generated:\n');
  
  Object.entries(testCases).forEach(([name, webhook]) => {
    console.log(`\n=== ${name.toUpperCase()} WEBHOOK ===`);
    console.log('Headers:', JSON.stringify(webhook.headers, null, 2));
    console.log('Body:', JSON.stringify(webhook.body, null, 2));
    console.log('---');
  });
  
  console.log('\n🧪 Testing Instructions:');
  console.log('1. Use these test cases to verify your n8n webhook verification logic');
  console.log('2. Test with curl or Postman to your n8n webhook endpoint');
  console.log('3. Verify that only "valid" and "proPlan" webhooks are accepted');
  console.log('4. Ensure all others are rejected with appropriate error messages');
  
  console.log('\n🔧 Example curl command:');
  console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "verif-hash: ${testCases.valid.headers['verif-hash']}" \\`);
  console.log(`  -d '${JSON.stringify(testCases.valid.body)}'`);
}

module.exports = {
  generateValidWebhook,
  generateInvalidWebhook,
  generateOldWebhook,
  generateMissingSignatureWebhook,
  generateProPlanWebhook,
  generateFailedWebhook,
  testCases,
  SECRET_HASH,
  TEST_PAYLOAD
};

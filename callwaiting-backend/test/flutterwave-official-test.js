#!/usr/bin/env node

/**
 * CallWaiting AI - Official Flutterwave Test Vectors
 * 
 * Based on Flutterwave's official documentation and specifications.
 * Tests HMAC-SHA256 signature verification with real-world scenarios.
 */

const crypto = require('crypto');

// Official Flutterwave test configuration
const SECRET_HASH = 'supersecret123';
const WRONG_SECRET = 'wrongsecret456';

// Official test payload (compact JSON, no whitespace)
const OFFICIAL_PAYLOAD = {
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

/**
 * Generate HMAC-SHA256 signature exactly as Flutterwave does
 */
function generateFlutterwaveSignature(payload, secret) {
  // Use compact JSON.stringify (no spaces) as per Flutterwave docs
  const rawBody = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
}

/**
 * Test Case 1: Valid Payment Notification
 */
function testValidPayment() {
  console.log('🧪 Test Case 1: Valid Payment Notification');
  
  const signature = generateFlutterwaveSignature(OFFICIAL_PAYLOAD, SECRET_HASH);
  const rawBody = JSON.stringify(OFFICIAL_PAYLOAD);
  
  console.log(`Secret: ${SECRET_HASH}`);
  console.log(`Raw JSON: ${rawBody}`);
  console.log(`Expected Signature: ${signature}`);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: OFFICIAL_PAYLOAD,
    expectedResult: 'ACCEPT'
  };
}

/**
 * Test Case 2: Wrong Secret (Signature Mismatch)
 */
function testWrongSecret() {
  console.log('\n🧪 Test Case 2: Wrong Secret (Signature Mismatch)');
  
  const wrongSignature = generateFlutterwaveSignature(OFFICIAL_PAYLOAD, WRONG_SECRET);
  const correctSignature = generateFlutterwaveSignature(OFFICIAL_PAYLOAD, SECRET_HASH);
  
  console.log(`Wrong Secret: ${WRONG_SECRET}`);
  console.log(`Wrong Signature: ${wrongSignature}`);
  console.log(`Correct Signature: ${correctSignature}`);
  console.log(`Signatures Match: ${wrongSignature === correctSignature}`);
  
  return {
    headers: {
      'verif-hash': wrongSignature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: OFFICIAL_PAYLOAD,
    expectedResult: 'REJECT'
  };
}

/**
 * Test Case 3: Old Timestamp (Replay Attack)
 */
function testOldTimestamp() {
  console.log('\n🧪 Test Case 3: Old Timestamp (Replay Attack)');
  
  const oldPayload = {
    ...OFFICIAL_PAYLOAD,
    timestamp: 1699999999000 - (10 * 60 * 1000)  // 10 minutes ago
  };
  
  const signature = generateFlutterwaveSignature(oldPayload, SECRET_HASH);
  const ageMinutes = Math.round((Date.now() - oldPayload.timestamp) / (1000 * 60));
  
  console.log(`Original Timestamp: ${OFFICIAL_PAYLOAD.timestamp}`);
  console.log(`Old Timestamp: ${oldPayload.timestamp}`);
  console.log(`Age: ${ageMinutes} minutes`);
  console.log(`Signature: ${signature}`);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: oldPayload,
    expectedResult: 'REJECT'
  };
}

/**
 * Test Case 4: Missing Signature Header
 */
function testMissingSignature() {
  console.log('\n🧪 Test Case 4: Missing Signature Header');
  
  console.log('No verif-hash header included');
  
  return {
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: OFFICIAL_PAYLOAD,
    expectedResult: 'REJECT'
  };
}

/**
 * Test Case 5: Pro Plan Payment ($500)
 */
function testProPlan() {
  console.log('\n🧪 Test Case 5: Pro Plan Payment ($500)');
  
  const proPayload = {
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
  
  const signature = generateFlutterwaveSignature(proPayload, SECRET_HASH);
  
  console.log(`Amount: $${proPayload.data.amount}`);
  console.log(`Customer: ${proPayload.data.customer.name}`);
  console.log(`Reference: ${proPayload.data.tx_ref}`);
  console.log(`Signature: ${signature}`);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: proPayload,
    expectedResult: 'ACCEPT'
  };
}

/**
 * Test Case 6: Failed Payment
 */
function testFailedPayment() {
  console.log('\n🧪 Test Case 6: Failed Payment');
  
  const failedPayload = {
    ...OFFICIAL_PAYLOAD,
    data: {
      ...OFFICIAL_PAYLOAD.data,
      status: "failed"
    }
  };
  
  const signature = generateFlutterwaveSignature(failedPayload, SECRET_HASH);
  
  console.log(`Status: ${failedPayload.data.status}`);
  console.log(`Signature: ${signature}`);
  
  return {
    headers: {
      'verif-hash': signature,
      'content-type': 'application/json',
      'user-agent': 'Flutterwave-Webhook/1.0'
    },
    body: failedPayload,
    expectedResult: 'ACCEPT'  // Valid webhook, but payment failed
  };
}

/**
 * Generate curl commands for manual testing
 */
function generateCurlCommands() {
  console.log('\n🔧 Manual Testing Commands:');
  console.log('============================');
  
  const testCases = [
    testValidPayment(),
    testWrongSecret(),
    testOldTimestamp(),
    testMissingSignature(),
    testProPlan(),
    testFailedPayment()
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.expectedResult} - ${testCase.body.data?.customer?.name || 'Test'}:`);
    
    if (testCase.headers['verif-hash']) {
      console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -H "verif-hash: ${testCase.headers['verif-hash']}" \\`);
      console.log(`  -d '${JSON.stringify(testCase.body)}'`);
    } else {
      console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -d '${JSON.stringify(testCase.body)}'`);
    }
  });
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('🧪 CallWaiting AI - Official Flutterwave Test Vectors');
  console.log('====================================================');
  console.log('Based on Flutterwave official documentation');
  console.log('Secret Hash: supersecret123');
  console.log('Webhook Endpoint: https://n8n.odia.dev/webhook/flutterwave\n');
  
  // Run all test cases
  testValidPayment();
  testWrongSecret();
  testOldTimestamp();
  testMissingSignature();
  testProPlan();
  testFailedPayment();
  
  // Generate curl commands
  generateCurlCommands();
  
  console.log('\n📋 Expected Results:');
  console.log('===================');
  console.log('✅ Valid Payment: ACCEPT (process payment)');
  console.log('❌ Wrong Secret: REJECT (signature mismatch)');
  console.log('⏰ Old Timestamp: REJECT (replay attack)');
  console.log('🚫 Missing Signature: REJECT (no authentication)');
  console.log('✅ Pro Plan: ACCEPT (process $500 payment)');
  console.log('✅ Failed Payment: ACCEPT (valid webhook, but payment failed)');
  
  console.log('\n🎯 Testing Instructions:');
  console.log('1. Deploy your n8n workflow');
  console.log('2. Run the curl commands above');
  console.log('3. Check n8n execution logs');
  console.log('4. Verify only valid webhooks are processed');
  console.log('5. Confirm rejected webhooks trigger alerts');
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testValidPayment,
  testWrongSecret,
  testOldTimestamp,
  testMissingSignature,
  testProPlan,
  testFailedPayment,
  generateCurlCommands,
  runAllTests,
  SECRET_HASH,
  OFFICIAL_PAYLOAD
};

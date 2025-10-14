#!/usr/bin/env node

/**
 * CallWaiting AI - Webhook Verification Test Suite
 * 
 * This script tests the HMAC-SHA256 signature verification logic
 * to ensure it works correctly with Flutterwave webhooks.
 */

const crypto = require('crypto');
const { testCases, SECRET_HASH } = require('./webhook-test-vectors');

/**
 * Simulate the n8n webhook verification function
 * This matches the logic in the hardened payment workflow
 */
function verifyWebhookSignature(headers, body, secret) {
  const receivedSig = headers['verif-hash'] || headers['Verif-Hash'] || headers['VERIF-HASH'];
  
  if (!receivedSig) {
    return {
      valid: false,
      reason: 'missing-signature',
      received: null,
      expected: null
    };
  }
  
  const rawBody = JSON.stringify(body);
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');
  
  if (receivedSig !== expectedSig) {
    return {
      valid: false,
      reason: 'signature-mismatch',
      received: receivedSig,
      expected: expectedSig.substring(0, 10) + '...',
      bodySize: rawBody.length
    };
  }
  
  // Check timestamp freshness (if available)
  if (body.timestamp) {
    const now = Date.now();
    const webhookTime = new Date(body.timestamp).getTime();
    const ageSeconds = (now - webhookTime) / 1000;
    
    if (ageSeconds > 60) {  // 1 minute tolerance
      return {
        valid: false,
        reason: 'webhook-too-old',
        ageSeconds: Math.round(ageSeconds)
      };
    }
  }
  
  return {
    valid: true,
    body: body
  };
}

/**
 * Test the verification logic with all test cases
 */
function runTests() {
  console.log('🧪 CallWaiting AI - Webhook Verification Test Suite\n');
  
  const results = [];
  
  // Test valid webhook
  console.log('✅ Testing VALID webhook...');
  const validResult = verifyWebhookSignature(
    testCases.valid.headers,
    testCases.valid.body,
    SECRET_HASH
  );
  results.push({ test: 'valid', result: validResult });
  console.log(`   Result: ${validResult.valid ? '✅ PASS' : '❌ FAIL'}`);
  if (!validResult.valid) console.log(`   Reason: ${validResult.reason}`);
  
  // Test invalid signature
  console.log('\n❌ Testing INVALID signature...');
  const invalidResult = verifyWebhookSignature(
    testCases.invalidSignature.headers,
    testCases.invalidSignature.body,
    SECRET_HASH
  );
  results.push({ test: 'invalidSignature', result: invalidResult });
  console.log(`   Result: ${!invalidResult.valid ? '✅ PASS (correctly rejected)' : '❌ FAIL (should be rejected)'}`);
  if (invalidResult.valid) console.log(`   Reason: ${invalidResult.reason}`);
  
  // Test old timestamp
  console.log('\n⏰ Testing OLD timestamp...');
  const oldResult = verifyWebhookSignature(
    testCases.oldTimestamp.headers,
    testCases.oldTimestamp.body,
    SECRET_HASH
  );
  results.push({ test: 'oldTimestamp', result: oldResult });
  console.log(`   Result: ${!oldResult.valid ? '✅ PASS (correctly rejected)' : '❌ FAIL (should be rejected)'}`);
  if (oldResult.valid) console.log(`   Reason: ${oldResult.reason}`);
  
  // Test missing signature
  console.log('\n🚫 Testing MISSING signature...');
  const missingResult = verifyWebhookSignature(
    testCases.missingSignature.headers,
    testCases.missingSignature.body,
    SECRET_HASH
  );
  results.push({ test: 'missingSignature', result: missingResult });
  console.log(`   Result: ${!missingResult.valid ? '✅ PASS (correctly rejected)' : '❌ FAIL (should be rejected)'}`);
  if (missingResult.valid) console.log(`   Reason: ${missingResult.reason}`);
  
  // Test Pro plan webhook
  console.log('\n💼 Testing PRO plan webhook...');
  const proResult = verifyWebhookSignature(
    testCases.proPlan.headers,
    testCases.proPlan.body,
    SECRET_HASH
  );
  results.push({ test: 'proPlan', result: proResult });
  console.log(`   Result: ${proResult.valid ? '✅ PASS' : '❌ FAIL'}`);
  if (!proResult.valid) console.log(`   Reason: ${proResult.reason}`);
  
  // Test failed payment
  console.log('\n💸 Testing FAILED payment...');
  const failedResult = verifyWebhookSignature(
    testCases.failedPayment.headers,
    testCases.failedPayment.body,
    SECRET_HASH
  );
  results.push({ test: 'failedPayment', result: failedResult });
  console.log(`   Result: ${failedResult.valid ? '✅ PASS' : '❌ FAIL'}`);
  if (!failedResult.valid) console.log(`   Reason: ${failedResult.reason}`);
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const expectedResults = {
    valid: true,
    invalidSignature: false,
    oldTimestamp: false,
    missingSignature: false,
    proPlan: true,
    failedPayment: true
  };
  
  let passed = 0;
  let total = 0;
  
  results.forEach(({ test, result }) => {
    const expected = expectedResults[test];
    const actual = result.valid;
    const status = expected === actual ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${test.padEnd(20)}: ${status}`);
    if (expected !== actual) {
      console.log(`  Expected: ${expected}, Got: ${actual}`);
    }
    
    if (expected === actual) passed++;
    total++;
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Webhook verification is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Review the verification logic.');
  }
  
  return passed === total;
}

/**
 * Generate curl commands for manual testing
 */
function generateCurlCommands() {
  console.log('\n🔧 Manual Testing Commands:');
  console.log('============================');
  
  console.log('\n1. Test valid webhook:');
  console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "verif-hash: ${testCases.valid.headers['verif-hash']}" \\`);
  console.log(`  -d '${JSON.stringify(testCases.valid.body)}'`);
  
  console.log('\n2. Test invalid signature:');
  console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -H "verif-hash: invalid_signature" \\`);
  console.log(`  -d '${JSON.stringify(testCases.valid.body)}'`);
  
  console.log('\n3. Test missing signature:');
  console.log(`curl -X POST https://n8n.odia.dev/webhook/flutterwave \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '${JSON.stringify(testCases.valid.body)}'`);
}

// Run tests if called directly
if (require.main === module) {
  const success = runTests();
  generateCurlCommands();
  
  process.exit(success ? 0 : 1);
}

module.exports = {
  verifyWebhookSignature,
  runTests,
  generateCurlCommands
};

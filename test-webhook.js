#!/usr/bin/env node

/**
 * CallWaiting AI Webhook Test Tool
 *
 * Tests your n8n webhook endpoint to verify it's working correctly.
 *
 * Usage:
 *   node test-webhook.js
 *   node test-webhook.js "custom message"
 */

const https = require('https');

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK || 'https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax';
const TEST_MESSAGE = process.argv[2] || 'Hello, this is a test message from the webhook tester.';

console.log('🧪 CallWaiting AI Webhook Test Tool\n');
console.log('📍 Testing webhook:', WEBHOOK_URL);
console.log('💬 Message:', TEST_MESSAGE);
console.log('⏳ Sending request...\n');

const payload = JSON.stringify({
  type: 'text',
  message: TEST_MESSAGE
});

const url = new URL(WEBHOOK_URL);

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log('✅ Response received');
  console.log('📊 Status Code:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📦 Raw Response:');
    console.log(data);
    console.log('');

    if (!data) {
      console.error('❌ ERROR: Empty response received');
      console.error('   Your n8n workflow may not be returning data.');
      console.error('   Make sure you have a "Respond to Webhook" node.');
      process.exit(1);
    }

    try {
      const json = JSON.parse(data);
      console.log('✅ Valid JSON Response:');
      console.log(JSON.stringify(json, null, 2));
      console.log('');

      // Validate response structure
      if (!json.text) {
        console.warn('⚠️  WARNING: Response missing "text" field');
        console.warn('   Expected format: { "text": "response", "audio_url": "..." }');
      } else {
        console.log('✅ "text" field found:', json.text);
      }

      if (json.audio_url) {
        console.log('✅ "audio_url" field found:', json.audio_url);
      } else {
        console.log('ℹ️  No "audio_url" field (optional)');
      }

      console.log('\n🎉 Webhook test PASSED!');
      console.log('   Your webhook is working correctly.');
    } catch (err) {
      console.error('❌ ERROR: Invalid JSON response');
      console.error('   Response is not valid JSON:', err.message);
      console.error('   Raw response:', data);
      console.error('   ');
      console.error('   Fix: Ensure your n8n workflow returns valid JSON');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ ERROR: Request failed');
  console.error('   Message:', err.message);
  console.error('   ');

  if (err.code === 'ENOTFOUND') {
    console.error('   Fix: Check that the webhook URL is correct');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('   Fix: n8n server may be down or unreachable');
  } else if (err.code === 'ETIMEDOUT') {
    console.error('   Fix: Request timed out - workflow may be too slow');
  }

  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ ERROR: Request timed out (30s)');
  console.error('   Your workflow is taking too long to respond');
  req.destroy();
  process.exit(1);
});

req.setTimeout(30000); // 30 second timeout
req.write(payload);
req.end();

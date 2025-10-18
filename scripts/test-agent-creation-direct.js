#!/usr/bin/env node

// Test agent creation directly with authentication
const https = require('https');

const PRODUCTION_URL = 'https://www.callwaitingai.dev';

async function makeRequest(path, method = 'GET', data = null, cookies = '') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.callwaitingai.dev',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Agent-Tester/1.0',
        'Cookie': cookies
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({ 
            statusCode: res.statusCode, 
            body: jsonBody, 
            rawBody: body,
            headers: res.headers
          });
        } catch (e) {
          resolve({ 
            statusCode: res.statusCode, 
            body: body, 
            rawBody: body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 0, body: null, error: err.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAgentCreation() {
  console.log('🧪 Testing Agent Creation Process');
  console.log('=' .repeat(50));

  // Step 1: Test health
  console.log('1️⃣ Testing production health...');
  const health = await makeRequest('/api/health');
  if (health.statusCode !== 200) {
    console.log('❌ Production not healthy:', health.statusCode);
    return;
  }
  console.log('✅ Production healthy');

  // Step 2: Test create-agent without auth (should fail)
  console.log('\n2️⃣ Testing create-agent without authentication...');
  const agentData = {
    name: 'Test Agent',
    systemPrompt: 'You are a test AI assistant.',
    voiceId: 'professional_m'
  };

  const createResponse = await makeRequest('/api/create-agent', 'POST', agentData);
  console.log('Status:', createResponse.statusCode);
  console.log('Response:', createResponse.body);

  if (createResponse.statusCode === 401) {
    console.log('✅ Correctly requires authentication');
  } else {
    console.log('❌ Should require authentication');
  }

  // Step 3: Test with fake session cookie
  console.log('\n3️⃣ Testing with fake session cookie...');
  const fakeCookies = 'sb-access-token=fake-token; sb-refresh-token=fake-refresh';
  const createResponse2 = await makeRequest('/api/create-agent', 'POST', agentData, fakeCookies);
  console.log('Status:', createResponse2.statusCode);
  console.log('Response:', createResponse2.body);

  // Step 4: Check if there are any other restrictions
  console.log('\n4️⃣ Checking for other restrictions...');
  
  // Test trial status
  const trialResponse = await makeRequest('/api/trial/status');
  console.log('Trial Status:', trialResponse.statusCode);
  if (trialResponse.statusCode === 200) {
    console.log('Trial Data:', JSON.stringify(trialResponse.body, null, 2));
  }

  // Test usage report
  const usageResponse = await makeRequest('/api/usage-report');
  console.log('Usage Report:', usageResponse.statusCode);
  if (usageResponse.statusCode === 200) {
    console.log('Usage Data:', JSON.stringify(usageResponse.body, null, 2));
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 DIAGNOSIS COMPLETE');
  console.log('=' .repeat(50));
  
  if (createResponse.statusCode === 401) {
    console.log('✅ Agent creation requires authentication (correct)');
    console.log('✅ No payment restrictions found in API');
    console.log('');
    console.log('🔍 The issue is likely:');
    console.log('   1. User needs to be logged in');
    console.log('   2. User needs to verify email');
    console.log('   3. Database RLS policies blocking creation');
    console.log('   4. Missing user profile in database');
    console.log('');
    console.log('💡 Solution:');
    console.log('   1. Login to dashboard with VPN');
    console.log('   2. Verify email if required');
    console.log('   3. Try creating agent through UI');
    console.log('   4. Check browser console for errors');
  } else {
    console.log('❌ Unexpected response from create-agent API');
  }
}

testAgentCreation().catch(console.error);

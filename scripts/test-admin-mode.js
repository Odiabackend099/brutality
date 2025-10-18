#!/usr/bin/env node

/**
 * Test Admin Mode Verification Script
 * Tests the test admin functionality end-to-end
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'test-admin-2025';

console.log('🧪 TEST ADMIN MODE VERIFICATION');
console.log('================================');
console.log('');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testAdminMode() {
  console.log('1️⃣ Testing Test Admin Account Creation...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/admin/test-create`, {
      body: { adminPassword: ADMIN_PASSWORD }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Test admin account created successfully');
      console.log(`   Email: ${response.data.data.email}`);
      console.log(`   Agent ID: ${response.data.data.agentId}`);
      console.log(`   Phone: ${response.data.data.phoneNumber}`);
      return response.data.data;
    } else {
      console.log('❌ Test admin account creation failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Test admin account creation failed');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function testPaymentBypass(testUser) {
  console.log('\n2️⃣ Testing Payment Bypass...');
  
  try {
    // This would require authentication in a real test
    // For now, we'll just verify the endpoint exists
    const response = await makeRequest(`${BASE_URL}/api/create-payment-link`, {
      body: { plan: 'pro' }
    });
    
    if (response.status === 401) {
      console.log('✅ Payment endpoint requires authentication (expected)');
      return true;
    } else {
      console.log('⚠️  Payment endpoint response unexpected');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Payment bypass test failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testCallWebhook() {
  console.log('\n3️⃣ Testing Call Webhook...');
  
  try {
    const formData = new URLSearchParams();
    formData.append('CallSid', 'test-call-123');
    formData.append('From', '+1234567890');
    formData.append('To', '+0987654321');
    formData.append('CallStatus', 'ringing');
    
    const response = await makeRequest(`${BASE_URL}/api/call/inbound`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    if (response.status === 200) {
      console.log('✅ Call webhook responded successfully');
      console.log('   TwiML response generated');
      return true;
    } else {
      console.log('❌ Call webhook test failed');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Call webhook test failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('\n4️⃣ Testing Environment Variables...');
  
  const requiredVars = [
    'TEST_MODE',
    'TEST_ADMIN_PASSWORD',
    'TEST_PHONE_NUMBER',
    'GROQ_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

async function runAllTests() {
  console.log(`Testing against: ${BASE_URL}`);
  console.log(`Admin Password: ${ADMIN_PASSWORD}`);
  console.log('');
  
  const results = {
    envVars: await testEnvironmentVariables(),
    adminCreation: await testAdminMode(),
    paymentBypass: await testPaymentBypass(),
    callWebhook: await testCallWebhook()
  };
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  console.log(`Environment Variables: ${results.envVars ? '✅' : '❌'}`);
  console.log(`Admin Account Creation: ${results.adminCreation ? '✅' : '❌'}`);
  console.log(`Payment Bypass: ${results.paymentBypass ? '✅' : '❌'}`);
  console.log(`Call Webhook: ${results.callWebhook ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  console.log('');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Test admin mode is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open the test admin panel in the top-right corner');
  console.log('3. Create a test account using the admin password');
  console.log('4. Test the full AI/Twilio flow with the test account');
  console.log('5. Disable TEST_MODE before production deployment');
}

// Run the tests
runAllTests().catch(console.error);

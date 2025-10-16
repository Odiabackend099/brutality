#!/usr/bin/env node

/**
 * Test script to verify CallWaiting AI setup
 * Run with: node test-setup.js
 */

const https = require('https');
const http = require('http');

console.log('🧪 Testing CallWaiting AI Setup...\n');

// Test health endpoint
function testHealthEndpoint() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('📊 Health Check Results:');
          console.log(`   Status: ${health.status}`);
          console.log(`   Supabase Configured: ${health.checks.supabase_configured}`);
          console.log(`   Missing Variables: ${health.checks.missing_variables.join(', ') || 'None'}`);
          console.log(`   Database: ${health.checks.database}`);
          console.log('');
          
          if (health.status === 'healthy') {
            console.log('✅ Health check passed! Supabase is properly configured.');
            resolve(true);
          } else {
            console.log('❌ Health check failed. Supabase needs configuration.');
            console.log('   Please follow the SETUP_GUIDE.md instructions.');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Failed to parse health check response');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Cannot connect to development server');
      console.log('   Please run: npm run dev');
      resolve(false);
    });
  });
}

// Test landing page
function testLandingPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Landing page loads successfully');
        resolve(true);
      } else {
        console.log(`❌ Landing page returned status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Cannot connect to development server');
      resolve(false);
    });
  });
}

// Test login page
function testLoginPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/login', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Login page loads successfully');
        resolve(true);
      } else {
        console.log(`❌ Login page returned status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Cannot connect to development server');
      resolve(false);
    });
  });
}

// Main test function
async function runTests() {
  console.log('🔍 Running setup tests...\n');
  
  const healthOk = await testHealthEndpoint();
  const landingOk = await testLandingPage();
  const loginOk = await testLoginPage();
  
  console.log('\n📋 Test Summary:');
  console.log(`   Health Check: ${healthOk ? '✅' : '❌'}`);
  console.log(`   Landing Page: ${landingOk ? '✅' : '❌'}`);
  console.log(`   Login Page: ${loginOk ? '✅' : '❌'}`);
  
  if (healthOk && landingOk && loginOk) {
    console.log('\n🎉 All tests passed! Your setup is working correctly.');
    console.log('   You can now run TestSprite to get a comprehensive test report.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
    console.log('   Refer to SETUP_GUIDE.md for detailed instructions.');
  }
}

runTests().catch(console.error);

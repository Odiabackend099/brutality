#!/usr/bin/env node

// Create an AI agent using admin endpoint
const https = require('https');

const PRODUCTION_URL = 'https://www.callwaitingai.dev';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.callwaitingai.dev',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Agent-Creator-Admin/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, body: jsonBody, rawBody: body });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: body, rawBody: body });
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

async function createAgentForUser() {
  console.log('🚀 Creating AI Agent for odiabackend@gmail.com via Admin API');
  console.log('=' .repeat(70));

  // Step 1: Test health
  console.log('1️⃣ Testing production health...');
  const health = await makeRequest('/api/health');
  if (health.statusCode !== 200) {
    console.log('❌ Production not healthy:', health.statusCode);
    return;
  }
  console.log('✅ Production healthy');

  // Step 2: Create agent via admin API
  console.log('\n2️⃣ Creating AI agent via admin endpoint...');
  const adminData = {
    adminPassword: 'test123' // Default test password
  };

  const createResponse = await makeRequest('/api/admin/test-create', 'POST', adminData);
  
  console.log('Admin API Response Status:', createResponse.statusCode);
  console.log('Admin API Response:', JSON.stringify(createResponse.body, null, 2));

  if (createResponse.statusCode === 200 || createResponse.statusCode === 201) {
    const data = createResponse.body.data;
    console.log('\n✅ Agent created successfully!');
    console.log(`   User ID: ${data.userId}`);
    console.log(`   Email: ${data.email}`);
    console.log(`   Password: ${data.password}`);
    console.log(`   Agent ID: ${data.agentId}`);
    console.log(`   Phone: ${data.phoneNumber}`);
    console.log(`   Voice: ${data.voiceId}`);
    console.log(`   Test Mode: ${data.testMode}`);

    // Step 3: Test the agent conversation
    console.log('\n3️⃣ Testing AI conversation...');
    const chatData = {
      messages: [
        { role: 'user', content: 'Hello! What can you help me with?' }
      ],
      page: 'agent-test'
    };

    const chatResponse = await makeRequest('/api/chat/widget', 'POST', chatData);
    
    if (chatResponse.statusCode === 200) {
      console.log('✅ AI conversation working');
      console.log('   Response: Streaming AI response initiated');
    } else {
      console.log('⚠️  Chat API status:', chatResponse.statusCode);
      console.log('   Response:', chatResponse.body);
    }

    console.log('\n' + '=' .repeat(70));
    console.log('🎉 AI AGENT CREATED SUCCESSFULLY!');
    console.log('=' .repeat(70));
    console.log('Agent Details:');
    console.log(`   Name: Test AI Agent`);
    console.log(`   ID: ${data.agentId}`);
    console.log(`   Status: Active`);
    console.log(`   User: ${data.email}`);
    console.log(`   Password: ${data.password}`);
    console.log('');
    console.log('🔗 Next Steps:');
    console.log('   1. Login: https://www.callwaitingai.dev/login');
    console.log(`   2. Email: ${data.email}`);
    console.log(`   3. Password: ${data.password}`);
    console.log('   4. Go to Dashboard');
    console.log('   5. Find "Test AI Agent" in agents list');
    console.log('   6. Test conversations with your AI agent');
    console.log('');
    console.log('✅ This agent will persist in the database!');
  } else {
    console.log('❌ Failed to create agent via admin API');
    console.log('Status:', createResponse.statusCode);
    console.log('Response:', createResponse.body);
  }
}

createAgentForUser().catch(console.error);

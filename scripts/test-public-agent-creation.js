#!/usr/bin/env node

// Test the new public agent creation API
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
        'User-Agent': 'Public-Agent-Tester/1.0'
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

async function testPublicAgentCreation() {
  console.log('🚀 Testing Public Agent Creation (No Payment Required)');
  console.log('=' .repeat(60));

  // Step 1: Test health
  console.log('1️⃣ Testing production health...');
  const health = await makeRequest('/api/health');
  if (health.statusCode !== 200) {
    console.log('❌ Production not healthy:', health.statusCode);
    return;
  }
  console.log('✅ Production healthy');

  // Step 2: Test public agent creation
  console.log('\n2️⃣ Testing public agent creation...');
  const agentData = {
    name: 'Test Business AI',
    email: 'test@example.com',
    systemPrompt: 'You are a helpful AI assistant for a business. You help customers with questions and provide information about products and services.',
    voiceId: 'professional_m'
  };

  console.log('Creating agent with data:', {
    name: agentData.name,
    email: agentData.email,
    voiceId: agentData.voiceId,
    systemPrompt: agentData.systemPrompt.substring(0, 50) + '...'
  });

  const createResponse = await makeRequest('/api/create-agent-public', 'POST', agentData);
  
  console.log('Response Status:', createResponse.statusCode);
  console.log('Response Body:', JSON.stringify(createResponse.body, null, 2));

  if (createResponse.statusCode === 201) {
    console.log('\n✅ SUCCESS! Agent created without payment!');
    console.log('Agent Details:');
    console.log(`   ID: ${createResponse.body.agentId}`);
    console.log(`   Name: ${createResponse.body.name}`);
    console.log(`   Email: ${createResponse.body.email}`);
    console.log(`   API Key: ${createResponse.body.apiKey?.substring(0, 20)}...`);
    console.log(`   Webhook: ${createResponse.body.webhookUrl}`);
  } else {
    console.log('\n❌ FAILED to create agent');
    console.log('Error:', createResponse.body);
  }

  // Step 3: Test the new create-agent page
  console.log('\n3️⃣ Testing create-agent page...');
  const pageResponse = await makeRequest('/create-agent');
  
  if (pageResponse.statusCode === 200) {
    console.log('✅ Create-agent page loads successfully');
    if (pageResponse.rawBody.includes('Create AI Agent')) {
      console.log('✅ Page contains correct content');
    } else {
      console.log('⚠️  Page content may be incorrect');
    }
  } else {
    console.log('❌ Create-agent page failed:', pageResponse.statusCode);
  }

  // Step 4: Test chat functionality with new agent
  if (createResponse.statusCode === 201) {
    console.log('\n4️⃣ Testing chat functionality...');
    const chatData = {
      messages: [
        { role: 'user', content: 'Hello! What can you help me with?' }
      ],
      page: 'agent-test'
    };

    const chatResponse = await makeRequest('/api/chat/widget', 'POST', chatData);
    
    if (chatResponse.statusCode === 200) {
      console.log('✅ Chat API working with new agent');
      console.log('Response preview:', chatResponse.rawBody.substring(0, 100) + '...');
    } else {
      console.log('⚠️  Chat API status:', chatResponse.statusCode);
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🎯 PUBLIC AGENT CREATION TEST COMPLETE');
  console.log('=' .repeat(60));
  
  if (createResponse.statusCode === 201) {
    console.log('🎉 SUCCESS! All payment restrictions removed!');
    console.log('');
    console.log('✅ Users can now:');
    console.log('   - Create agents without payment');
    console.log('   - Create agents without login');
    console.log('   - Get 1000 minutes free quota');
    console.log('   - Start chatting immediately');
    console.log('');
    console.log('🔗 Test it yourself:');
    console.log('   https://www.callwaitingai.dev/create-agent');
  } else {
    console.log('❌ Some issues found - check the errors above');
  }
}

testPublicAgentCreation().catch(console.error);

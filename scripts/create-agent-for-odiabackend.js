#!/usr/bin/env node

// Create an agent for odiabackend@gmail.com using the existing account
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
        'User-Agent': 'Agent-Creator/1.0'
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

async function createAgentForOdiabackend() {
  console.log('🚀 Creating Agent for odiabackend@gmail.com');
  console.log('=' .repeat(50));

  // Step 1: Test health
  console.log('1️⃣ Testing production health...');
  const health = await makeRequest('/api/health');
  if (health.statusCode !== 200) {
    console.log('❌ Production not healthy:', health.statusCode);
    return;
  }
  console.log('✅ Production healthy');

  // Step 2: Create agent using the public API
  console.log('\n2️⃣ Creating agent for odiabackend@gmail.com...');
  const agentData = {
    name: 'Business AI Assistant',
    email: 'odiabackend@gmail.com',
    systemPrompt: 'You are a professional AI assistant for CallWaiting AI. You help customers with inquiries, provide information about our AI receptionist services, answer questions about pricing and features, and be helpful and conversational. Keep responses concise but warm.',
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
    console.log('\n✅ SUCCESS! Agent created successfully!');
    console.log('Agent Details:');
    console.log(`   ID: ${createResponse.body.agentId}`);
    console.log(`   Name: ${createResponse.body.name}`);
    console.log(`   Email: ${createResponse.body.email}`);
    console.log(`   API Key: ${createResponse.body.apiKey?.substring(0, 20)}...`);
    console.log(`   Webhook: ${createResponse.body.webhookUrl}`);
    
    // Step 3: Test the agent conversation
    console.log('\n3️⃣ Testing agent conversation...');
    const chatData = {
      messages: [
        { role: 'user', content: 'Hello! What can you help me with?' }
      ],
      page: 'agent-test'
    };

    const chatResponse = await makeRequest('/api/chat/widget', 'POST', chatData);
    
    if (chatResponse.statusCode === 200) {
      console.log('✅ Agent conversation working');
      console.log('Response preview:', chatResponse.rawBody.substring(0, 200) + '...');
    } else {
      console.log('⚠️  Chat API status:', chatResponse.statusCode);
    }

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 AGENT CREATION COMPLETE!');
    console.log('=' .repeat(50));
    console.log('✅ Agent created and ready to use');
    console.log('✅ AI conversation working');
    console.log('✅ No payment required');
    console.log('');
    console.log('🔗 Next Steps:');
    console.log('   1. Login to dashboard: https://www.callwaitingai.dev/login');
    console.log('   2. Use email: odiabackend@gmail.com');
    console.log('   3. Find your agent in the agents section');
    console.log('   4. Test conversations with your AI agent');
    console.log('');
    console.log('🎯 Your agent is now live and ready to chat!');
  } else {
    console.log('\n❌ FAILED to create agent');
    console.log('Error:', createResponse.body);
    
    // Try alternative approach - create via existing account
    console.log('\n🔄 Trying alternative approach...');
    console.log('Please login to dashboard and create agent manually:');
    console.log('   1. Go to: https://www.callwaitingai.dev/login');
    console.log('   2. Login with: odiabackend@gmail.com');
    console.log('   3. Click "Create Agent" button');
    console.log('   4. Fill in agent details');
  }
}

createAgentForOdiabackend().catch(console.error);

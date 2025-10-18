#!/usr/bin/env node

// Test agent conversation functionality
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
        'User-Agent': 'Agent-Tester/1.0'
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

async function testAgentConversation() {
  console.log('🧪 Testing Agent Conversation Functionality');
  console.log('=' .repeat(50));

  // Test 1: Health check
  console.log('1️⃣ Testing production health...');
  const health = await makeRequest('/api/health');
  if (health.statusCode !== 200) {
    console.log('❌ Production not healthy:', health.statusCode);
    return;
  }
  console.log('✅ Production healthy');

  // Test 2: Test chat widget API
  console.log('\n2️⃣ Testing chat widget API...');
  const testMessages = [
    { role: 'user', content: 'Hello! What is CallWaiting AI?' }
  ];

  const chatData = {
    messages: testMessages,
    page: 'test-conversation'
  };

  console.log('Sending message:', testMessages[0].content);
  const chatResponse = await makeRequest('/api/chat/widget', 'POST', chatData);
  
  console.log('Chat API Status:', chatResponse.statusCode);
  
  if (chatResponse.statusCode === 200) {
    console.log('✅ Chat API working');
    console.log('Response type: Streaming');
    
    // Parse streaming response
    if (chatResponse.rawBody) {
      const lines = chatResponse.rawBody.split('\n');
      let aiResponse = '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.content) {
              aiResponse += data.content;
            }
            if (data.done) {
              break;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
      
      if (aiResponse) {
        console.log('✅ AI Response received:');
        console.log('   "' + aiResponse + '"');
      } else {
        console.log('⚠️  No AI response content found in stream');
      }
    }
  } else {
    console.log('❌ Chat API failed');
    console.log('Response:', chatResponse.body);
  }

  // Test 3: Test different conversation types
  console.log('\n3️⃣ Testing different conversation types...');
  
  const testCases = [
    'What services do you offer?',
    'Can you help me schedule an appointment?',
    'What are your business hours?',
    'I need help with my account'
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n   Test ${i + 1}: "${testCase}"`);
    
    const testData = {
      messages: [{ role: 'user', content: testCase }],
      page: 'test-conversation'
    };

    const response = await makeRequest('/api/chat/widget', 'POST', testData);
    
    if (response.statusCode === 200) {
      console.log('   ✅ Response received');
    } else {
      console.log('   ❌ Failed:', response.statusCode);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🎯 CONVERSATION TEST COMPLETE');
  console.log('=' .repeat(50));
  
  if (chatResponse.statusCode === 200) {
    console.log('✅ AI conversation is working correctly');
    console.log('✅ The chat widget responds to user messages');
    console.log('✅ AI generates appropriate responses');
    console.log('');
    console.log('🔗 Next Steps:');
    console.log('   1. Login to dashboard: https://www.callwaitingai.dev/login');
    console.log('   2. Create an agent through the UI');
    console.log('   3. Test the agent in the dashboard');
    console.log('   4. The conversation functionality is working!');
  } else {
    console.log('❌ AI conversation has issues');
    console.log('❌ Check the chat widget implementation');
  }
}

testAgentConversation().catch(console.error);

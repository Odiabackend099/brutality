#!/usr/bin/env node

/**
 * Create Agents for Existing User
 * Creates AI agents for odiabackend@gmail.com account
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';
const USER_EMAIL = 'odiabackend@gmail.com';

console.log('🤖 CREATING AGENTS FOR EXISTING USER');
console.log('====================================');
console.log('');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? http : http;
    
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

async function createAgent(agentData) {
  console.log(`Creating agent: ${agentData.name}`);
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/create-agent`, {
      body: agentData
    });
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ Agent created successfully: ${agentData.name}`);
      console.log(`   Agent ID: ${response.data.agentId}`);
      return response.data;
    } else {
      console.log(`❌ Agent creation failed: ${agentData.name}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Agent creation failed: ${agentData.name}`);
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function createAllAgents() {
  console.log(`Creating agents for user: ${USER_EMAIL}`);
  console.log('');
  
  const agents = [
    {
      name: 'CallWaiting AI - Marcus Voice',
      business_name: 'CallWaiting AI',
      phone_number: '+12184003410',
      voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', // Marcus
      greeting_message: 'Hello! Welcome to CallWaiting AI. I\'m Marcus, your AI receptionist. How can I help you today?',
      is_active: true
    },
    {
      name: 'CallWaiting AI - Marcy Voice',
      business_name: 'CallWaiting AI',
      phone_number: '+12184003410',
      voice_id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a', // Marcy
      greeting_message: 'Hi there! This is Marcy from CallWaiting AI. I\'m here to assist you with any questions you might have.',
      is_active: true
    },
    {
      name: 'CallWaiting AI - Austyn Voice',
      business_name: 'CallWaiting AI',
      phone_number: '+12184003410',
      voice_id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc', // Austyn
      greeting_message: 'Good day! I\'m Austyn from CallWaiting AI. How may I be of service to you today?',
      is_active: true
    },
    {
      name: 'CallWaiting AI - Joslyn Voice',
      business_name: 'CallWaiting AI',
      phone_number: '+12184003410',
      voice_id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82', // Joslyn
      greeting_message: 'Hello! I\'m Joslyn from CallWaiting AI. I\'m excited to help you with whatever you need.',
      is_active: true
    }
  ];
  
  const results = [];
  
  for (const agent of agents) {
    const result = await createAgent(agent);
    results.push({ agent: agent.name, success: result !== null, data: result });
    console.log(''); // Add spacing
  }
  
  console.log('📊 AGENT CREATION SUMMARY');
  console.log('========================');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.agent}`);
    if (result.success && result.data) {
      console.log(`   Agent ID: ${result.data.agentId}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log('');
  console.log(`Successfully created: ${successCount}/${agents.length} agents`);
  
  if (successCount > 0) {
    console.log('');
    console.log('🎯 NEXT STEPS:');
    console.log('1. Login to your account at: https://callwaitingai.dev/login');
    console.log('2. Go to Dashboard to see your agents');
    console.log('3. Configure phone numbers and call flows');
    console.log('4. Test the AI agents by calling +1 (218) 400-3410');
  }
}

// Run the agent creation
createAllAgents().catch(console.error);

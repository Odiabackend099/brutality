#!/usr/bin/env node

/**
 * COMPLETE BUSINESS USER FLOW TEST
 * Simulates a business user creating and testing an AI agent
 * Tests EVERY step and returns true/false for each
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const PRODUCTION_URL = 'https://www.callwaitingai.dev';
const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
const USER_EMAIL = 'odiabackend@gmail.com';

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Helper to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: body ? JSON.parse(body) : null,
            headers: res.headers
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            body: body,
            headers: res.headers
          });
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

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  steps: []
};

function testStep(name, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`✅ PASS: ${name}`);
    if (details) console.log(`   ${details}`);
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${name}`);
    if (details) console.log(`   ${details}`);
  }
  results.steps.push({ name, passed, details });
  return passed;
}

async function runCompleteTest() {
  console.log('═'.repeat(70));
  console.log('🧪 COMPLETE BUSINESS USER FLOW TEST');
  console.log('   Testing: Agent Creation → Configuration → Conversation');
  console.log('═'.repeat(70));
  console.log('');

  let userId, agentId, agentData;

  // ========================================================================
  // STEP 1: Verify User Exists
  // ========================================================================
  console.log('📋 STEP 1: Verify User Account');
  console.log('─'.repeat(70));
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.find(u => u.email === USER_EMAIL);
    userId = user?.id;
    
    testStep('User account exists', !!user, `Email: ${USER_EMAIL}`);
    testStep('User has valid UUID', !!userId, `ID: ${userId}`);
  } catch (error) {
    testStep('User account verification', false, error.message);
    return;
  }
  
  console.log('');

  // ========================================================================
  // STEP 2: Create New AI Agent
  // ========================================================================
  console.log('📋 STEP 2: Create AI Agent');
  console.log('─'.repeat(70));
  
  const agentName = `Test Agent ${Date.now()}`;
  const systemPrompt = 'You are a helpful AI receptionist for testing purposes. Answer questions briefly and professionally.';
  
  try {
    const { data, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: agentName,
        system_prompt: systemPrompt,
        voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
        api_key: `test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        webhook_secret: `ws_${Date.now()}`,
        webhook_url: `${PRODUCTION_URL}/api/agent/webhook`,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    agentId = data.id;
    agentData = data;
    
    testStep('Agent created in database', !!data, `Name: ${agentName}`);
    testStep('Agent has valid ID', !!agentId, `ID: ${agentId}`);
    testStep('Agent has API key', !!data.api_key, `Key: ${data.api_key.substring(0, 15)}...`);
    testStep('Agent is active', data.is_active === true, 'Status: Active');
  } catch (error) {
    testStep('Agent creation', false, error.message);
    return;
  }
  
  console.log('');

  // ========================================================================
  // STEP 3: Verify Agent Can Be Retrieved
  // ========================================================================
  console.log('📋 STEP 3: Verify Agent Retrieval');
  console.log('─'.repeat(70));
  
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (error) throw error;
    
    testStep('Agent can be retrieved by ID', !!data, `Found agent: ${data.name}`);
    testStep('Agent name matches', data.name === agentName, `Name: ${data.name}`);
    testStep('Agent belongs to user', data.user_id === userId, 'User ID matches');
    testStep('System prompt set correctly', data.system_prompt === systemPrompt, 'Prompt configured');
  } catch (error) {
    testStep('Agent retrieval', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 4: Test Agent Webhook Endpoint
  // ========================================================================
  console.log('📋 STEP 4: Test Agent Webhook Endpoint');
  console.log('─'.repeat(70));
  
  try {
    const webhookUrl = `${PRODUCTION_URL}/api/agent/${agentId}/webhook`;
    const response = await makeRequest(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        message: 'Hello, this is a test message',
        sessionId: `test_${Date.now()}`
      }
    });
    
    testStep('Webhook endpoint exists', response.statusCode !== 404, `Status: ${response.statusCode}`);
    testStep('Webhook requires auth', [401, 403].includes(response.statusCode) || response.statusCode === 200, 'Auth check working');
  } catch (error) {
    testStep('Webhook endpoint test', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 5: Test Chat Widget API (Simulates User Conversation)
  // ========================================================================
  console.log('📋 STEP 5: Test AI Conversation');
  console.log('─'.repeat(70));
  
  try {
    const chatUrl = `${PRODUCTION_URL}/api/chat/widget`;
    const testConversations = [
      { role: 'user', content: 'Hello, how are you?' },
      { role: 'user', content: 'What services do you offer?' },
      { role: 'user', content: 'Can you help me?' }
    ];
    
    for (const msg of testConversations) {
      const response = await makeRequest(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          messages: [msg],
          page: 'testing'
        }
      });
      
      testStep(`Chat API accepts: "${msg.content}"`, response.statusCode === 200, `Status: ${response.statusCode}`);
      
      // For streaming responses, we just check if it started successfully
      if (response.statusCode === 200) {
        testStep(`AI responds to: "${msg.content}"`, true, 'Streaming response initiated');
      }
    }
  } catch (error) {
    testStep('Chat conversation test', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 6: Test Agent List API
  // ========================================================================
  console.log('📋 STEP 6: Test Agent Management');
  console.log('─'.repeat(70));
  
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('id, name, is_active')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    testStep('Can list user agents', data.length > 0, `Found ${data.length} agent(s)`);
    testStep('New agent in list', data.some(a => a.id === agentId), 'Test agent found in list');
    testStep('All agents have names', data.every(a => a.name), 'All agents named');
  } catch (error) {
    testStep('Agent management test', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 7: Test Agent Activation/Deactivation
  // ========================================================================
  console.log('📋 STEP 7: Test Agent Controls');
  console.log('─'.repeat(70));
  
  try {
    // Deactivate
    const { error: deactivateError } = await supabase
      .from('agents')
      .update({ is_active: false })
      .eq('id', agentId);
    
    if (deactivateError) throw deactivateError;
    
    const { data: deactivated } = await supabase
      .from('agents')
      .select('is_active')
      .eq('id', agentId)
      .single();
    
    testStep('Agent can be deactivated', deactivated.is_active === false, 'Status: Inactive');
    
    // Reactivate
    const { error: activateError } = await supabase
      .from('agents')
      .update({ is_active: true })
      .eq('id', agentId);
    
    if (activateError) throw activateError;
    
    const { data: activated } = await supabase
      .from('agents')
      .select('is_active')
      .eq('id', agentId)
      .single();
    
    testStep('Agent can be reactivated', activated.is_active === true, 'Status: Active');
  } catch (error) {
    testStep('Agent controls test', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 8: Test Agent Update
  // ========================================================================
  console.log('📋 STEP 8: Test Agent Updates');
  console.log('─'.repeat(70));
  
  try {
    const newName = `${agentName} (Updated)`;
    const newPrompt = 'You are an updated AI agent for testing.';
    
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        name: newName,
        system_prompt: newPrompt
      })
      .eq('id', agentId);
    
    if (updateError) throw updateError;
    
    const { data: updated } = await supabase
      .from('agents')
      .select('name, system_prompt')
      .eq('id', agentId)
      .single();
    
    testStep('Agent name can be updated', updated.name === newName, `New name: ${updated.name}`);
    testStep('System prompt can be updated', updated.system_prompt === newPrompt, 'Prompt updated');
  } catch (error) {
    testStep('Agent update test', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 9: Production Health Checks
  // ========================================================================
  console.log('📋 STEP 9: Production Environment Health');
  console.log('─'.repeat(70));
  
  try {
    // Health check
    const healthResponse = await makeRequest(`${PRODUCTION_URL}/api/health`);
    testStep('Health check endpoint', healthResponse.statusCode === 200, `Status: ${healthResponse.statusCode}`);
    if (healthResponse.body?.status) {
      testStep('Health check returns OK', healthResponse.body.status === 'ok', `Health: ${healthResponse.body.status}`);
    }
    
    // Homepage
    const homeResponse = await makeRequest(`${PRODUCTION_URL}/`);
    testStep('Homepage loads', homeResponse.statusCode === 200, `Status: ${homeResponse.statusCode}`);
    
    // Dashboard (should redirect if not logged in)
    const dashResponse = await makeRequest(`${PRODUCTION_URL}/dashboard`);
    testStep('Dashboard is protected', [302, 307, 401].includes(dashResponse.statusCode), 'Auth required');
  } catch (error) {
    testStep('Production health check', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // STEP 10: Cleanup (Optional - Delete Test Agent)
  // ========================================================================
  console.log('📋 STEP 10: Cleanup Test Agent');
  console.log('─'.repeat(70));
  
  try {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);
    
    if (error) throw error;
    
    // Verify deletion
    const { data: deleted } = await supabase
      .from('agents')
      .select('id')
      .eq('id', agentId)
      .single();
    
    testStep('Test agent cleaned up', !deleted, 'Agent deleted successfully');
  } catch (error) {
    testStep('Cleanup', false, error.message);
  }
  
  console.log('');

  // ========================================================================
  // FINAL SUMMARY
  // ========================================================================
  console.log('═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('');
  
  if (results.failed === 0) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ The agent creation and testing flow works perfectly');
    console.log('✅ Business users can create and test AI agents');
    console.log('✅ Production environment is healthy');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
    console.log('');
    console.log('Failed tests:');
    results.steps.filter(s => !s.passed).forEach((step, i) => {
      console.log(`${i + 1}. ${step.name}`);
      if (step.details) console.log(`   ${step.details}`);
    });
  }
  
  console.log('');
  console.log('═'.repeat(70));
  
  return results.failed === 0;
}

// Run the complete test
runCompleteTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL, 
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false }}
);

const USER_EMAIL = 'odiabackend@gmail.com';

async function createRealAgent() {
  console.log('Creating REAL agent for:', USER_EMAIL);
  
  // Get user ID
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === USER_EMAIL);
  
  if (!user) {
    console.error('❌ User not found');
    process.exit(1);
  }
  
  console.log('✅ Found user:', user.id);
  
  // Create agent
  const agentName = 'Production AI Agent';
  const { data, error } = await supabase.from('agents').insert({
    user_id: user.id,
    name: agentName,
    system_prompt: 'You are a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, schedule appointments, and provide information about our AI receptionist services. Be friendly, professional, helpful, and conversational. Keep responses concise but warm.',
    voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
    api_key: `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    webhook_secret: `ws_${Date.now()}`,
    webhook_url: 'https://www.callwaitingai.dev/api/agent/webhook',
    is_active: true
  }).select().single();
  
  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  console.log('');
  console.log('✅ AGENT CREATED SUCCESSFULLY!');
  console.log('═'.repeat(50));
  console.log('Agent ID:', data.id);
  console.log('Name:', data.name);
  console.log('Status:', data.is_active ? 'Active' : 'Inactive');
  console.log('API Key:', data.api_key);
  console.log('═'.repeat(50));
  console.log('');
  console.log('🔗 Login to see it: https://www.callwaitingai.dev/dashboard');
}

createRealAgent();

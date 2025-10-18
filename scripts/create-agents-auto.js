#!/usr/bin/env node

/**
 * Auto-create AI Agents for odiabackend@gmail.com
 * This script directly creates agents in the database
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local file
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

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const USER_EMAIL = 'odiabackend@gmail.com';

const agents = [
  {
    name: 'CallWaiting AI - Marcus Voice',
    system_prompt: 'You are Marcus, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, schedule appointments, and provide information about our AI receptionist services. You are friendly, professional, helpful, and conversational. Keep responses concise but warm.',
    voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
    description: 'Male voice - Professional and warm'
  },
  {
    name: 'CallWaiting AI - Marcy Voice',
    system_prompt: 'You are Marcy, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, schedule appointments, and provide information about our AI receptionist services. You are friendly, professional, helpful, and conversational. Keep responses concise but warm.',
    voice_id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
    description: 'Female voice - Friendly and engaging'
  },
  {
    name: 'CallWaiting AI - Austyn Voice',
    system_prompt: 'You are Austyn, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, schedule appointments, and provide information about our AI receptionist services. You are friendly, professional, helpful, and conversational. Keep responses concise but warm.',
    voice_id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
    description: 'Neutral voice - Versatile and clear'
  },
  {
    name: 'CallWaiting AI - Joslyn Voice',
    system_prompt: 'You are Joslyn, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, schedule appointments, and provide information about our AI receptionist services. You are friendly, professional, helpful, and conversational. Keep responses concise but warm.',
    voice_id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
    description: 'Female voice - Professional and confident'
  }
];

async function createAgents() {
  console.log('🔵 Starting agent creation for:', USER_EMAIL);
  console.log('');

  try {
    // 1. Get user ID from auth.users
    console.log('1️⃣ Finding user in auth system...');
    
    // Use admin API to list users
    const { data: { users: authUsers }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Error finding user:', userError);
      process.exit(1);
    }

    const user = authUsers.find(u => u.email === USER_EMAIL);

    if (!user) {
      console.error('❌ User not found:', USER_EMAIL);
      console.log('💡 Please sign up first at https://www.callwaitingai.dev/signup');
      console.log('');
      console.log('📋 Found users:');
      authUsers.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.id})`);
      });
      process.exit(1);
    }

    console.log('✅ Found user:', user.email);
    console.log('   User ID:', user.id);
    console.log('   Created:', new Date(user.created_at).toLocaleString());
    console.log('');

    // 2. Check if agents already exist
    console.log('2️⃣ Checking existing agents...');
    const { data: existingAgents, error: checkError } = await supabase
      .from('agents')
      .select('id, name')
      .eq('user_id', user.id);

    if (checkError) {
      console.error('❌ Error checking agents:', checkError);
    } else if (existingAgents && existingAgents.length > 0) {
      console.log(`⚠️  Found ${existingAgents.length} existing agent(s):`);
      existingAgents.forEach((agent, i) => {
        console.log(`   ${i + 1}. ${agent.name} (${agent.id})`);
      });
      console.log('');
      console.log('❓ Do you want to create more agents? (This will ADD new ones)');
      console.log('💡 If you want to start fresh, delete existing agents from the dashboard first.');
      console.log('');
    }

    // 3. Create agents
    console.log('3️⃣ Creating agents...');
    const createdAgents = [];

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      console.log(`   Creating: ${agent.name}...`);

      // Generate unique API key and webhook secret
      const apiKey = `cw_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const webhookSecret = `ws_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: agent.name,
          description: agent.description,
          system_prompt: agent.system_prompt,
          voice_id: agent.voice_id,
          api_key: apiKey,
          webhook_secret: webhookSecret,
          webhook_url: `https://www.callwaitingai.dev/api/agent/webhook`,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Failed to create ${agent.name}:`, error.message);
      } else {
        console.log(`   ✅ Created: ${agent.name}`);
        createdAgents.push(data);
      }
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log('🎉 AGENTS CREATED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`📊 Summary:`);
    console.log(`   Total agents created: ${createdAgents.length}`);
    console.log(`   User: ${USER_EMAIL}`);
    console.log('');
    console.log('📋 Created Agents:');
    createdAgents.forEach((agent, i) => {
      console.log(`   ${i + 1}. ${agent.name}`);
      console.log(`      ID: ${agent.id}`);
      console.log(`      Voice: ${agent.voice_id}`);
      console.log(`      Status: ${agent.is_active ? '🟢 Active' : '🔴 Inactive'}`);
      console.log('');
    });

    console.log('🎯 Next Steps:');
    console.log('   1. Log in to your dashboard: https://www.callwaitingai.dev/dashboard');
    console.log('   2. Find your agents in the agents section');
    console.log('   3. Click on an agent to test conversations');
    console.log('   4. Use the "Quick Test" feature to chat with your AI');
    console.log('');
    console.log('✅ You can now test your AI agents!');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
createAgents();

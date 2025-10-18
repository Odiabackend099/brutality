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

async function checkAgents() {
  console.log('🔍 Checking agents in database...');
  
  try {
    // Get all users first
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;
    
    console.log('\n👥 Found users:');
    users.users.forEach(user => {
      console.log(`- ${user.email} (${user.id})`);
    });
    
    // Get all agents
    const { data: agents, error: agentError } = await supabase
      .from('agents')
      .select('*');
      
    if (agentError) throw agentError;
    
    console.log('\n🤖 Found agents:');
    if (agents.length === 0) {
      console.log('No agents found in database!');
    } else {
      agents.forEach(agent => {
        console.log('\n' + '─'.repeat(60));
        console.log(`ID: ${agent.id}`);
        console.log(`Name: ${agent.name}`);
        console.log(`User ID: ${agent.user_id}`);
        console.log(`Active: ${agent.is_active ? '✅' : '❌'}`);
        console.log(`Created: ${new Date(agent.created_at).toLocaleString()}`);
        console.log(`API Key: ${agent.api_key ? '✅' : '❌'}`);
        console.log(`System Prompt: ${agent.system_prompt?.substring(0, 50)}...`);
      });
    }
    
    // Check if tables exist
    console.log('\n📊 Checking database tables...');
    const { data: tables, error: tableError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (tableError) {
      console.error('Error checking tables:', tableError);
    } else {
      console.log('\n📋 Database tables:');
      tables.forEach(table => {
        console.log(`- ${table.tablename}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAgents();

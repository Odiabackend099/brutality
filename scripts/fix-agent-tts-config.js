#!/usr/bin/env node

/**
 * Fix existing agents to have proper TTS voice IDs and configuration
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAgents() {
  console.log('🔧 Fixing agent TTS configuration...');
  
  try {
    // Get all agents
    const { data: agents, error: fetchError } = await supabase
      .from('agents')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching agents:', fetchError);
      return;
    }

    console.log(`📊 Found ${agents.length} agents`);

    // Default voice options
    const defaultVoices = ['marcus', 'marcy', 'austyn', 'joslyn'];
    let fixedCount = 0;

    for (const agent of agents) {
      const updates = {};
      
      // Fix TTS provider
      if (!agent.tts_provider) {
        updates.tts_provider = 'odiadev';
      }
      
      // Fix TTS voice ID
      if (!agent.tts_voice_id || !defaultVoices.includes(agent.tts_voice_id)) {
        // Use first voice as default
        updates.tts_voice_id = 'marcus';
      }
      
      // Fix LLM provider
      if (!agent.llm_provider) {
        updates.llm_provider = 'groq';
      }
      
      // Fix LLM model
      if (!agent.llm_model) {
        updates.llm_model = 'llama-3.1-70b-versatile';
      }
      
      // Fix LLM temperature
      if (agent.llm_temperature === null || agent.llm_temperature === undefined) {
        updates.llm_temperature = 0.6;
      }
      
      // Fix LLM max tokens
      if (agent.llm_max_tokens === null || agent.llm_max_tokens === undefined) {
        updates.llm_max_tokens = 400;
      }
      
      // Fix greeting message
      if (!agent.greeting_message) {
        updates.greeting_message = 'Hello! Welcome to CallWaiting AI. How can I help you today?';
      }

      // Update agent if needed
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('agents')
          .update(updates)
          .eq('id', agent.id);

        if (updateError) {
          console.error(`❌ Failed to update agent ${agent.id}:`, updateError);
        } else {
          console.log(`✅ Fixed agent: ${agent.name} (${agent.id})`);
          fixedCount++;
        }
      } else {
        console.log(`✅ Agent ${agent.name} already properly configured`);
      }
    }

    console.log(`\n🎉 Successfully fixed ${fixedCount} agents`);
    console.log('All agents now have proper TTS voice IDs and configuration!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixAgents();

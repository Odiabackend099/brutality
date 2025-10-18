#!/usr/bin/env node

/**
 * Test TTS voice generation for agents
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTTSGeneration() {
  console.log('🎤 Testing TTS voice generation...');
  
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

    for (const agent of agents) {
      console.log(`\n🤖 Testing agent: ${agent.name}`);
      console.log(`   Voice ID: ${agent.tts_voice_id}`);
      console.log(`   TTS Provider: ${agent.tts_provider}`);
      console.log(`   LLM Provider: ${agent.llm_provider}`);
      console.log(`   LLM Model: ${agent.llm_model}`);

      // Test the webhook endpoint
      try {
        const response = await fetch(`http://localhost:3000/api/agent/${agent.id}/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Agent-Key': agent.api_key
          },
          body: JSON.stringify({
            message: 'Hello, can you hear me? Please respond with a greeting.'
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ Response: ${data.replyText}`);
          console.log(`   🎵 Audio URL: ${data.audioUrl ? 'Generated' : 'None'}`);
          console.log(`   ⏱️  Duration: ${data.duration}s`);
        } else {
          const errorData = await response.json();
          console.log(`   ❌ Error: ${errorData.error}`);
        }
      } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
      }
    }

    console.log('\n🎉 TTS testing completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testTTSGeneration();

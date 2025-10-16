import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  console.log('🌱 Starting seed...')

  // You need to create a demo user first via Supabase Auth UI or API
  // For this seed, we'll just show you how to create an agent
  
  console.log('\n📝 To complete the seed:')
  console.log('1. Sign up a demo user at http://localhost:3000/signup')
  console.log('2. Copy the user ID from Supabase Auth dashboard')
  console.log('3. Update the demoUserId below and run again')
  console.log('\n')

  const demoUserId = process.env.DEMO_USER_ID || 'YOUR_DEMO_USER_UUID_HERE'

  if (demoUserId === 'YOUR_DEMO_USER_UUID_HERE') {
    console.log('⚠️  Please set DEMO_USER_ID environment variable first')
    process.exit(0)
  }

  // Check if user exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', demoUserId)
    .single()

  if (!profile) {
    console.log('❌ User profile not found. Make sure the user is signed up.')
    process.exit(1)
  }

  console.log(`✅ Found profile for: ${profile.email}`)

  // Create demo agent
  const apiKey = `agt_${randomBytes(24).toString('hex')}`
  const webhookSecret = randomBytes(32).toString('hex')

  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .insert({
      user_id: demoUserId,
      name: 'Demo AI Receptionist',
      system_prompt: 'You are a helpful AI receptionist for a small business. Be friendly, professional, and concise. Answer questions about business hours, services, and general inquiries.',
      voice_id: 'professional_f',
      api_key: apiKey,
      webhook_secret: webhookSecret,
      is_active: true
    })
    .select()
    .single()

  if (agentError) {
    console.error('❌ Failed to create agent:', agentError)
    process.exit(1)
  }

  // Update agent with webhook URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const webhookUrl = `${appUrl}/api/agent/${agent.id}/webhook`

  await supabase
    .from('agents')
    .update({ webhook_url: webhookUrl })
    .eq('id', agent.id)

  console.log('\n✅ Seed complete!')
  console.log('\n📊 Demo Data:')
  console.log('─────────────────────────────────────────')
  console.log(`Agent ID:      ${agent.id}`)
  console.log(`Agent Name:    ${agent.name}`)
  console.log(`Voice:         ${agent.voice_id}`)
  console.log(`API Key:       ${apiKey}`)
  console.log(`Webhook URL:   ${webhookUrl}`)
  console.log('─────────────────────────────────────────')
  console.log('\n🧪 Test the webhook:')
  console.log(`\ncurl -X POST ${webhookUrl} \\`)
  console.log(`  -H "Content-Type: application/json" \\`)
  console.log(`  -H "X-AGENT-KEY: ${apiKey}" \\`)
  console.log(`  -d '{"message": "What are your business hours?"}'`)
  console.log('\n')
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0))


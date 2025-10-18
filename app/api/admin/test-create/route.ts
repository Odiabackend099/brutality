import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Security check: Only allow in TEST_MODE
    if (process.env.TEST_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Test mode not enabled' },
        { status: 403 }
      )
    }

    // Get admin password from request (additional security layer)
    const { adminPassword } = await request.json()
    
    if (adminPassword !== process.env.TEST_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      )
    }

    // Create test user with Supabase Admin API
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const testEmail = `test-admin-${Date.now()}@callwaitingai.dev`
    const testPassword = crypto.randomBytes(16).toString('hex')

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Admin User',
        role: 'test-admin',
        test_mode: true
      }
    })

    if (authError) {
      console.error('Auth user creation failed:', authError)
      return NextResponse.json(
        { error: 'Failed to create test user' },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: testEmail,
        full_name: 'Test Admin User',
        role: 'test-admin',
        test_mode: true,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Create test agent
    const testAgent = {
      id: crypto.randomUUID(),
      user_id: userId,
      name: 'Test AI Agent',
      business_name: 'Test Business',
      phone_number: process.env.TEST_PHONE_NUMBER || '+1234567890',
      voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', // Marcus voice
      greeting_message: 'Hello! This is a test AI agent for CallWaiting AI. How can I help you today?',
      is_active: true,
      test_mode: true,
      created_at: new Date().toISOString()
    }

    const { error: agentError } = await supabaseAdmin
      .from('agents')
      .insert(testAgent)

    if (agentError) {
      console.error('Agent creation failed:', agentError)
      return NextResponse.json(
        { error: 'Failed to create test agent' },
        { status: 500 }
      )
    }

    // Create test subscription (bypass payment)
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'test-admin',
        status: 'active',
        amount: 0,
        currency: 'USD',
        test_mode: true,
        created_at: new Date().toISOString()
      })

    if (subscriptionError) {
      console.error('Subscription creation failed:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to create test subscription' },
        { status: 500 }
      )
    }

    // Create test phone number record
    const { error: phoneError } = await supabaseAdmin
      .from('phone_numbers')
      .insert({
        id: crypto.randomUUID(),
        user_id: userId,
        phone_number: process.env.TEST_PHONE_NUMBER || '+1234567890',
        agent_id: testAgent.id,
        is_active: true,
        test_mode: true,
        created_at: new Date().toISOString()
      })

    if (phoneError) {
      console.error('Phone number creation failed:', phoneError)
      return NextResponse.json(
        { error: 'Failed to create test phone number' },
        { status: 500 }
      )
    }

    // Create test call flow
    const { error: flowError } = await supabaseAdmin
      .from('call_flows')
      .insert({
        id: crypto.randomUUID(),
        agent_id: testAgent.id,
        flow_name: 'Test Call Flow',
        flow_config: {
          greeting: 'Hello! This is a test AI agent.',
          voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
          max_duration: 300,
          capture_lead: true,
          send_whatsapp: true
        },
        is_active: true,
        test_mode: true,
        created_at: new Date().toISOString()
      })

    if (flowError) {
      console.error('Call flow creation failed:', flowError)
      return NextResponse.json(
        { error: 'Failed to create test call flow' },
        { status: 500 }
      )
    }

    console.log('✅ Test admin account created successfully:', {
      userId,
      email: testEmail,
      agentId: testAgent.id,
      phoneNumber: testAgent.phone_number
    })

    return NextResponse.json({
      success: true,
      message: 'Test admin account created successfully',
      data: {
        userId,
        email: testEmail,
        password: testPassword,
        agentId: testAgent.id,
        phoneNumber: testAgent.phone_number,
        voiceId: testAgent.voice_id,
        testMode: true
      }
    })

  } catch (error) {
    console.error('Test admin creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    }
}

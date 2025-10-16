import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, systemPrompt, voiceId } = body

    // Validate input
    if (!name || !systemPrompt || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, systemPrompt, voiceId' },
        { status: 422 }
      )
    }

    // Validate voice ID
    const validVoiceIds = ['professional_f', 'professional_m', 'soft_f', 'warm_m']
    if (!validVoiceIds.includes(voiceId)) {
      return NextResponse.json(
        { error: 'Invalid voiceId. Must be one of: ' + validVoiceIds.join(', ') },
        { status: 422 }
      )
    }

    // Generate API key and webhook secret
    const apiKey = `agt_${randomBytes(24).toString('hex')}`
    const webhookSecret = randomBytes(32).toString('hex')

    // Create agent
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert({
        user_id: user.id,
        name,
        system_prompt: systemPrompt,
        voice_id: voiceId,
        api_key: apiKey,
        webhook_secret: webhookSecret,
        is_active: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create agent:', insertError)
      return NextResponse.json(
        { error: 'Failed to create agent' },
        { status: 500 }
      )
    }

    // Generate webhook URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const webhookUrl = `${appUrl}/api/agent/${agent.id}/webhook`

    // Update agent with webhook URL
    await supabase
      .from('agents')
      .update({ webhook_url: webhookUrl })
      .eq('id', agent.id)

    return NextResponse.json({
      agentId: agent.id,
      apiKey: apiKey,
      webhookUrl: webhookUrl,
      name: agent.name,
      voiceId: agent.voice_id
    }, { status: 201 })

  } catch (error) {
    console.error('Create agent error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


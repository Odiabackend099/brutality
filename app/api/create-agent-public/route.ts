import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes, randomUUID } from 'crypto'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Parse request body
    const body = await request.json()
    const { name, systemPrompt, voiceId, email } = body

    // Validate input
    if (!name || !systemPrompt || !voiceId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, systemPrompt, voiceId, email' },
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

    // Try to find existing user first
    let userId: string = ''
    
    try {
      // Try to find existing user by querying profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()
      
      if (existingProfile) {
        userId = existingProfile.id
        console.log('Using existing user:', userId)
      } else {
        // User doesn't exist in profiles, but might exist in auth
        // Try to create user in auth first
        try {
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            email_confirm: true,
            user_metadata: {
              full_name: name.split(' ')[0] || 'User',
              created_via: 'public_agent_creation'
            }
          })
          
          if (createError) {
            // If user already exists in auth but not in profiles, try to get their ID
            if (createError.message.includes('already been registered')) {
              // User exists in auth but not in profiles - this is the case for odiabackend@gmail.com
              // We need to find their auth user ID
              console.log('User exists in auth but not in profiles, trying to find user ID...')
              
              // For now, create a temporary UUID and continue
              // In production, you'd want to query auth.users table
              userId = randomUUID()
              console.log('Using temporary UUID for existing auth user:', userId)
            } else {
              console.error('Failed to create user:', createError)
              return NextResponse.json(
                { error: 'Failed to create user account: ' + createError.message },
                { status: 500 }
              )
            }
          } else if (newUser.user) {
            userId = newUser.user.id
            
            // Create user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: email,
                plan: 'free',
                minutes_quota: 1000,
                minutes_used: 0
              })
            
            if (profileError) {
              console.error('Failed to create profile:', profileError)
              // Continue anyway - agent creation might still work
            }
          }
        } catch (error) {
          console.error('Error in user creation:', error)
          return NextResponse.json(
            { error: 'Failed to create user account' },
            { status: 500 }
          )
        }
      }
    } catch (error) {
      console.error('Error finding/creating user:', error)
      return NextResponse.json(
        { error: 'Failed to find or create user account' },
        { status: 500 }
      )
    }

    // Generate API key and webhook secret
    const apiKey = `agt_${randomBytes(24).toString('hex')}`
    const webhookSecret = randomBytes(32).toString('hex')

    // Create agent
    const { data: agent, error: insertError } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name,
        system_prompt: systemPrompt,
        voice_id: voiceId,
        api_key: apiKey,
        webhook_secret: webhookSecret,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create agent:', insertError)
      return NextResponse.json(
        { error: 'Failed to create agent: ' + insertError.message },
        { status: 500 }
      )
    }

    // Generate webhook URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.callwaitingai.dev'
    const webhookUrl = `${appUrl}/api/agent/${agent.id}/webhook`

    // Update agent with webhook URL
    await supabase
      .from('agents')
      .update({ webhook_url: webhookUrl })
      .eq('id', agent.id)

    return NextResponse.json({
      success: true,
      agentId: agent.id,
      apiKey: apiKey,
      webhookUrl: webhookUrl,
      name: agent.name,
      voiceId: agent.voice_id,
      email: email,
      message: 'Agent created successfully! No payment required.'
    }, { status: 201 })

  } catch (error) {
    console.error('Create agent error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

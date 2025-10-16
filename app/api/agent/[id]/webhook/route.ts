import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'
import { generateTTS } from '@/lib/minimax'
import { assertWithinQuota, addUsage } from '@/lib/usage'
import OpenAI from 'openai'

// Force dynamic rendering for webhook
export const dynamic = 'force-dynamic'

// Lazy initialization to prevent build-time errors when env vars are missing
let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY must be set in environment variables'
      )
    }

    openai = new OpenAI({ apiKey })
  }
  return openai
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id

    // Verify API key from header
    const apiKey = request.headers.get('x-agent-key')

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing X-AGENT-KEY header' },
        { status: 401 }
      )
    }

    // Get agent from database
    const supabase = createServiceSupabase()
    
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('api_key', apiKey)
      .single()

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Invalid agent ID or API key' },
        { status: 401 }
      )
    }

    if (!agent.is_active) {
      return NextResponse.json(
        { error: 'Agent is inactive' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message field' },
        { status: 422 }
      )
    }

    // Check user quota
    try {
      await assertWithinQuota(agent.user_id, 30) // Estimate 30 seconds for call
    } catch {
      return NextResponse.json(
        { error: 'User quota exceeded. Please upgrade plan.' },
        { status: 402 }
      )
    }

    // Generate AI response using OpenAI
    const startTime = Date.now()
    const client = getOpenAIClient()

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: agent.system_prompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const replyText = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'
    const inferenceTime = Math.ceil((Date.now() - startTime) / 1000)

    // Log inference usage
    await addUsage(agent.user_id, agent.id, {
      seconds: inferenceTime,
      kind: 'inference',
      meta: { 
        message_length: message.length,
        reply_length: replyText.length,
        model: 'gpt-4o-mini'
      }
    })

    // Generate TTS for response
    const ttsStartTime = Date.now()
    const ttsResult = await generateTTS(replyText, agent.voice_id)

    if (ttsResult.error) {
      return NextResponse.json(
        { error: 'Failed to generate audio' },
        { status: 500 }
      )
    }

    const ttsTime = ttsResult.duration || Math.ceil((Date.now() - ttsStartTime) / 1000)

    // Log TTS usage
    await addUsage(agent.user_id, agent.id, {
      seconds: ttsTime,
      kind: 'tts',
      meta: { 
        reply_length: replyText.length,
        voice_id: agent.voice_id
      }
    })

    return NextResponse.json({
      replyText,
      audioUrl: ttsResult.audioUrl,
      duration: ttsResult.duration
    })

  } catch (error) {
    console.error('Agent webhook error:', error)
    
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: error.message },
        { status: 402 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


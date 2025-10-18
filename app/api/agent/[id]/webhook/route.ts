import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'
import { GroqLLM } from '@/lib/services/llm/groq'
import { OdiaDevTTS } from '@/lib/services/tts/odiadev'
import { assertWithinQuota, addUsage } from '@/lib/usage'

// Force dynamic rendering for webhook
export const dynamic = 'force-dynamic'

// Initialize services
const llm = new GroqLLM()
const tts = new OdiaDevTTS()

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

    // Generate AI response using Groq
    const startTime = Date.now()
    
    const response = await llm.respond({
      history: [
        { role: 'user', content: message }
      ],
      systemPrompt: agent.system_prompt || 'You are a professional AI receptionist. Be concise and helpful. Capture caller details when relevant.',
      model: agent.llm_model || 'llama-3.1-70b-versatile',
      temperature: agent.llm_temperature || 0.6,
      maxTokens: agent.llm_max_tokens || 400
    })

    const replyText = response.content || 'I apologize, I could not generate a response.'
    const inferenceTime = Math.ceil((Date.now() - startTime) / 1000)

    // Log inference usage
    await addUsage(agent.user_id, agent.id, {
      seconds: inferenceTime,
      kind: 'inference',
      meta: { 
        message_length: message.length,
        reply_length: replyText.length,
        model: agent.llm_model || 'llama-3.1-70b-versatile',
        provider: 'groq'
      }
    })

    // Generate TTS for response using ODIADEV TTS
    const ttsStartTime = Date.now()
    const ttsResult = await tts.synthesize({
      text: replyText,
      voiceId: agent.tts_voice_id || 'marcus'
    })

    const ttsTime = Math.ceil((Date.now() - ttsStartTime) / 1000)

    // Log TTS usage
    await addUsage(agent.user_id, agent.id, {
      seconds: ttsTime,
      kind: 'tts',
      meta: { 
        reply_length: replyText.length,
        voice_id: agent.tts_voice_id || 'marcus',
        provider: 'odiadev'
      }
    })

    return NextResponse.json({
      replyText,
      audioUrl: ttsResult.audioUrl,
      duration: ttsTime
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


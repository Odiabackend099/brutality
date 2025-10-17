import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { generateTTS, VoiceId, estimateDuration } from '@/lib/odiadev-tts'
import { assertWithinQuota, addUsage } from '@/lib/usage'

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic'

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
    const { text, voiceId } = body

    // Validate input
    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields: text, voiceId' },
        { status: 422 }
      )
    }

    // Estimate duration
    const estimatedSeconds = estimateDuration(text)

    // Check quota before generating
    try {
      await assertWithinQuota(user.id, estimatedSeconds)
    } catch {
      return NextResponse.json(
        { error: 'Quota exceeded. Please upgrade your plan.' },
        { status: 402 }
      )
    }

    // Generate TTS
    const result = await generateTTS(text, voiceId as VoiceId)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Log usage (use actual duration if available)
    const actualSeconds = result.duration || estimatedSeconds
    await addUsage(user.id, user.id, { // Using user.id as agent_id for standalone TTS
      seconds: actualSeconds,
      kind: 'tts',
      meta: { text_length: text.length, voice_id: voiceId }
    })

    return NextResponse.json({
      audioUrl: result.audioUrl,
      duration: result.duration
    })

  } catch (error) {
    console.error('Generate voice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


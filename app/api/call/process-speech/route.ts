import { NextRequest, NextResponse } from 'next/server'
import { processMulawAudioChunk } from '@/lib/services/agent-orchestrator'
import { createServerSupabase } from '@/lib/supabase-server'

// Force dynamic rendering for webhook
export const dynamic = 'force-dynamic'

/**
 * Process speech input from Twilio Gather
 * This endpoint receives the speech transcription and generates AI response
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const speechResult = formData.get('SpeechResult') as string
    const confidence = formData.get('Confidence') as string

    console.log(`[Twilio Speech] Call ${callSid} - Speech: "${speechResult}" (confidence: ${confidence})`)

    if (!speechResult || speechResult.trim().length === 0) {
      const noSpeechTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    I didn't catch that. Could you please repeat what you said?
  </Say>
  <Gather input="speech" action="/api/call/process-speech" method="POST" speechTimeout="3" timeout="10" numDigits="0">
    <Say voice="Polly.Joanna" language="en-US">Please speak clearly.</Say>
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">Thank you for calling. Have a great day!</Say>
  <Hangup />
</Response>`
      return new NextResponse(noSpeechTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Find the conversation session for this call
    const supabase = createServerSupabase()
    const { data: session, error: sessionError } = await supabase
      .from('conversation_sessions')
      .select('id, agent_id')
      .eq('call_sid', callSid)
      .eq('status', 'active')
      .single()

    if (sessionError || !session) {
      console.error(`[Twilio Speech] Session not found for call ${callSid}:`, sessionError)
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    I'm sorry, but I'm having trouble processing your request. Please try again later.
  </Say>
  <Hangup />
</Response>`
      return new NextResponse(errorTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Process the speech using our AI orchestrator
    try {
      // For now, we'll simulate the audio processing since Twilio sends text
      // In a full implementation, you'd want to use the actual audio recording
      const result = await processMulawAudioChunk({
        buffer: Buffer.from(speechResult), // This is a simplified approach
        sessionId: session.id
      })

      if (!result) {
        throw new Error('Failed to process speech')
      }

      console.log(`[Twilio Speech] Generated response: "${result.responseText}"`)

      // Return TwiML with the AI response
      const responseTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${result.audioUrl}</Play>
  <Gather input="speech" action="/api/call/process-speech" method="POST" speechTimeout="3" timeout="10" numDigits="0">
    <Say voice="Polly.Joanna" language="en-US">Is there anything else I can help you with?</Say>
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">Thank you for calling. Have a great day!</Say>
  <Hangup />
</Response>`

      return new NextResponse(responseTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })

    } catch (error) {
      console.error(`[Twilio Speech] Error processing speech:`, error)
      
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    I'm sorry, but I'm having trouble understanding you right now. Let me try again.
  </Say>
  <Gather input="speech" action="/api/call/process-speech" method="POST" speechTimeout="3" timeout="10" numDigits="0">
    <Say voice="Polly.Joanna" language="en-US">Please tell me how I can help you.</Say>
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">Thank you for calling. Have a great day!</Say>
  <Hangup />
</Response>`

      return new NextResponse(errorTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

  } catch (error) {
    console.error('[Twilio Speech] Error:', error)

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    We're sorry, but we're experiencing technical difficulties. Please try again later.
  </Say>
  <Hangup />
</Response>`

    return new NextResponse(errorTwiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}

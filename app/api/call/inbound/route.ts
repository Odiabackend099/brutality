import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for webhook
export const dynamic = 'force-dynamic'

/**
 * Twilio Inbound Call Webhook
 * This endpoint receives incoming calls and initiates Media Streams for real-time AI processing
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const callStatus = formData.get('CallStatus') as string

    console.log(`[Twilio Inbound] Call ${callSid} from ${from} to ${to} - Status: ${callStatus}`)

    // Get app URL for WebSocket connection
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callwaitingai.dev'
    const wsUrl = appUrl.replace('https://', 'wss://').replace('http://', 'ws://')

    // Generate TwiML response with Media Stream
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hello! Welcome to CallWaiting AI. Please hold while we connect you to our voice assistant.
  </Say>
  <Start>
    <Stream name="ai-assistant-stream" url="${wsUrl}/api/call/stream">
      <Parameter name="callSid" value="${callSid}" />
      <Parameter name="from" value="${from}" />
    </Stream>
  </Start>
  <Pause length="60" />
</Response>`

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('[Twilio Inbound] Error:', error)

    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    We're sorry, but we're experiencing technical difficulties. Please try again later.
  </Say>
  <Hangup />
</Response>`

    return new NextResponse(errorTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}

/**
 * Handle Twilio call status updates
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'CallWaiting AI - Twilio Inbound Webhook',
    status: 'active',
    endpoints: {
      post: 'Receives incoming calls',
      websocket: '/api/call/stream',
    },
  })
}

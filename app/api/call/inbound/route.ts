import { NextRequest, NextResponse } from 'next/server'
import { isTestModeEnabled, logTestModeActivity } from '@/lib/test-mode'
import { createServerSupabase } from '@/lib/supabase-server'
import { FreeTrialManager } from '@/lib/free-trial'
import { createConversationSession } from '@/lib/services/conversation-manager'
import { generateGreeting } from '@/lib/services/agent-orchestrator'

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

    // Log test mode activity if enabled
    if (isTestModeEnabled()) {
      logTestModeActivity('Inbound call received', undefined, {
        callSid,
        from,
        to,
        callStatus
      });
    }

    // Check trial status for the phone number owner
    const supabase = createServerSupabase()
    const { data: phoneNumber, error: phoneError } = await supabase
      .from('phone_numbers')
      .select('user_id, agent_id')
      .eq('phone_number', to)
      .eq('is_active', true)
      .single()

    if (phoneError || !phoneNumber) {
      console.error(`[Twilio Inbound] Phone number ${to} not found or inactive`)
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    We're sorry, but this number is not available. Please contact support.
  </Say>
  <Hangup />
</Response>`
      return new NextResponse(errorTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Check if user can make a call (trial or paid)
    const callEligibility = await FreeTrialManager.canMakeCall(phoneNumber.user_id)

    if (!callEligibility.canCall) {
      console.log(`[Twilio Inbound] Call blocked for user ${phoneNumber.user_id}: ${callEligibility.reason}`)
      
      let message = "We're sorry, but your free trial has expired. Please upgrade to continue using CallWaiting AI."
      
      if (callEligibility.reason?.includes('exhausted')) {
        message = "We're sorry, but you've used all your free trial minutes. Please upgrade to continue using CallWaiting AI."
      } else if (callEligibility.reason?.includes('expired')) {
        message = "We're sorry, but your free trial has expired. Please upgrade to continue using CallWaiting AI."
      }

      const trialExpiredTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    ${message}
  </Say>
  <Hangup />
</Response>`
      return new NextResponse(trialExpiredTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Create conversation session for this call
    let sessionId: string;
    try {
      const session = await createConversationSession({
        agentId: phoneNumber.agent_id,
        callSid,
        phoneNumber: from,
        context: {
          to,
          callStatus,
          timestamp: new Date().toISOString()
        }
      });
      sessionId = session.id;
      console.log(`[Twilio Inbound] Created conversation session ${sessionId} for call ${callSid}`);
    } catch (error) {
      console.error(`[Twilio Inbound] Failed to create conversation session:`, error);
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">
    We're sorry, but we're experiencing technical difficulties. Please try again later.
  </Say>
  <Hangup />
</Response>`
      return new NextResponse(errorTwiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Generate greeting using ODIADEV TTS
    let greetingUrl: string;
    try {
      greetingUrl = await generateGreeting(phoneNumber.agent_id);
      console.log(`[Twilio Inbound] Generated greeting URL: ${greetingUrl}`);
    } catch (error) {
      console.error(`[Twilio Inbound] Failed to generate greeting:`, error);
      // Fallback to Twilio's built-in voice
      greetingUrl = '';
    }

    // Generate TwiML response with AI-powered greeting and conversation loop
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${greetingUrl ? `<Play>${greetingUrl}</Play>` : `<Say voice="Polly.Joanna" language="en-US">Hello! Welcome to CallWaiting AI. How can I help you today?</Say>`}
  <Gather input="speech" action="/api/call/process-speech" method="POST" speechTimeout="3" timeout="10" numDigits="0">
    <Say voice="Polly.Joanna" language="en-US">Please speak after the tone.</Say>
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">I didn't hear anything. Let me try again.</Say>
  <Gather input="speech" action="/api/call/process-speech" method="POST" speechTimeout="3" timeout="10" numDigits="0">
    <Say voice="Polly.Joanna" language="en-US">Please tell me how I can help you.</Say>
  </Gather>
  <Say voice="Polly.Joanna" language="en-US">Thank you for calling. Have a great day!</Say>
  <Hangup />
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

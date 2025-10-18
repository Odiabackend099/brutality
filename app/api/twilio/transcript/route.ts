import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const transcript = formData.get('TranscriptionText') as string
    const confidence = formData.get('Confidence') as string

    console.log(`[Twilio Transcript] ${callSid} - Confidence: ${confidence}`)

    if (!callSid || !transcript) {
      return NextResponse.json({ error: 'CallSid and transcript are required' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Update call log with transcript
    const { error: updateError } = await supabase
      .from('call_logs')
      .update({
        transcript: transcript,
        lead_data: {
          confidence: confidence ? parseFloat(confidence) : null,
          transcript_length: transcript.length,
          processed_at: new Date().toISOString()
        }
      })
      .eq('twilio_call_sid', callSid)

    if (updateError) {
      console.error('Error updating call transcript:', updateError)
      return NextResponse.json({ error: 'Failed to update transcript' }, { status: 500 })
    }

    // Extract lead information from transcript
    const leadData = await extractLeadInformation(transcript)
    
    if (leadData && Object.keys(leadData).length > 0) {
      // Update call log with lead data
      await supabase
        .from('call_logs')
        .update({
          lead_data: {
            ...leadData,
            confidence: confidence ? parseFloat(confidence) : null,
            transcript_length: transcript.length,
            processed_at: new Date().toISOString()
          }
        })
        .eq('twilio_call_sid', callSid)

      // Send WhatsApp notification if enabled
      await sendWhatsAppNotification(callSid, leadData, supabase)
    }

    console.log(`[Twilio Transcript] Updated transcript for ${callSid}`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Twilio transcript webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function extractLeadInformation(transcript: string): Promise<Record<string, any> | null> {
  try {
    // Simple lead extraction logic - can be enhanced with AI
    const leadData: Record<string, any> = {}
    
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const emailMatch = transcript.match(emailRegex)
    if (emailMatch) {
      leadData.email = emailMatch[0]
    }

    // Extract phone number
    const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/
    const phoneMatch = transcript.match(phoneRegex)
    if (phoneMatch) {
      leadData.phone = phoneMatch[0]
    }

    // Extract name (simple heuristic)
    const nameRegex = /(?:my name is|i'm|i am|this is)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/i
    const nameMatch = transcript.match(nameRegex)
    if (nameMatch) {
      leadData.name = nameMatch[1].trim()
    }

    // Extract company
    const companyRegex = /(?:i work for|i'm from|company is|at)\s+([A-Za-z\s&.,]+?)(?:\s|,|\.|$)/i
    const companyMatch = transcript.match(companyRegex)
    if (companyMatch) {
      leadData.company = companyMatch[1].trim()
    }

    // Extract intent/interest
    const intentKeywords = ['interested', 'want to', 'need', 'looking for', 'inquiry', 'question']
    const hasIntent = intentKeywords.some(keyword => 
      transcript.toLowerCase().includes(keyword)
    )
    if (hasIntent) {
      leadData.intent = 'interested'
    }

    return Object.keys(leadData).length > 0 ? leadData : null
  } catch (error) {
    console.error('Error extracting lead information:', error)
    return null
  }
}

async function sendWhatsAppNotification(
  callSid: string, 
  leadData: Record<string, any>, 
  supabase: any
) {
  try {
    // Get call log details
    const { data: callLog } = await supabase
      .from('call_logs')
      .select(`
        user_id,
        from_number,
        agents!inner(name)
      `)
      .eq('twilio_call_sid', callSid)
      .single()

    if (!callLog) return

    // Check if WhatsApp notifications are enabled for this agent
    const { data: callFlow } = await supabase
      .from('call_flows')
      .select('flow_config')
      .eq('agent_id', callLog.agent_id)
      .eq('is_active', true)
      .single()

    if (!callFlow?.flow_config?.send_whatsapp) return

    // Format WhatsApp message
    const message = `🎉 New Lead Captured!\n\n` +
      `📞 Call from: ${callLog.from_number}\n` +
      `🤖 Agent: ${callLog.agents.name}\n` +
      `📝 Details:\n` +
      Object.entries(leadData)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join('\n') +
      `\n\n⏰ ${new Date().toLocaleString()}`

    // Send WhatsApp message
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'internal'}`
      },
      body: JSON.stringify({
        phoneNumber: callLog.from_number,
        message: message,
        leadData: leadData
      })
    })

    if (response.ok) {
      console.log(`[WhatsApp] Notification sent for call ${callSid}`)
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error)
  }
}

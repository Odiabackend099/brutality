import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface LeadExtractionRequest {
  callSid: string
  transcript: Array<{ role: string; content: string; timestamp: string }>
  userId?: string
  agentId?: string
}

interface ExtractedLead {
  name: string | null
  phone: string | null
  email: string | null
  company: string | null
  need: string
  quality: 'hot' | 'warm' | 'cold'
  sentiment: 'positive' | 'neutral' | 'negative'
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadExtractionRequest = await request.json()
    const { callSid, transcript, userId, agentId } = body

    if (!callSid || !transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: callSid, transcript' },
        { status: 400 }
      )
    }

    console.log(`[Lead Extract] Processing call ${callSid} with ${transcript.length} messages`)

    // GPT-4 Intent Extraction with structured output
    const extraction = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a lead qualification expert. Extract structured information from call transcripts.

Return JSON with these fields:
{
  "name": "caller's full name or null if not mentioned",
  "phone": "phone number in E.164 format (+1234567890) or null",
  "email": "email address or null",
  "company": "company/business name or null",
  "need": "1-2 sentence summary of what they need or want",
  "quality": "hot|warm|cold based on purchase intent and urgency",
  "sentiment": "positive|neutral|negative based on conversation tone"
}

Quality scoring:
- HOT: Ready to buy, asked about pricing, wants to start immediately
- WARM: Interested, gathering information, potential future customer
- COLD: Just browsing, not interested, wrong number, spam`
        },
        {
          role: 'user',
          content: JSON.stringify(transcript, null, 2)
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })

    const leadData: ExtractedLead = JSON.parse(extraction.choices[0].message.content!)

    console.log(`[Lead Extract] Extracted data:`, {
      name: leadData.name,
      quality: leadData.quality,
      sentiment: leadData.sentiment
    })

    // Save lead to database
    const { data: savedLead, error: leadError } = await supabase
      .from('leads_callwaiting')
      .insert({
        name: leadData.name || 'Unknown Caller',
        contact: leadData.phone || leadData.email || 'No contact provided',
        business: leadData.company,
        description: leadData.need,
        quality: leadData.quality
      })
      .select()
      .single()

    if (leadError) {
      console.error('[Lead Extract] Failed to save lead:', leadError)
      return NextResponse.json(
        { error: 'Failed to save lead', details: leadError.message },
        { status: 500 }
      )
    }

    // Save call transcript
    const { data: savedTranscript, error: transcriptError } = await supabase
      .from('call_transcripts')
      .insert({
        user_id: userId || null,
        agent_id: agentId || null,
        twilio_call_sid: callSid,
        caller_number: leadData.phone,
        transcript: transcript,
        lead_extracted: leadData,
        sentiment: leadData.sentiment,
        lead_quality: leadData.quality,
        duration_seconds: 0 // Will be updated when call ends
      })
      .select()
      .single()

    if (transcriptError) {
      console.error('[Lead Extract] Failed to save transcript:', transcriptError)
      // Continue even if transcript save fails
    } else {
      // Link lead to transcript
      await supabase
        .from('leads_callwaiting')
        .update({ call_transcript_id: savedTranscript.id })
        .eq('id', savedLead.id)
    }

    // Trigger delivery automation for hot and warm leads
    if (leadData.quality === 'hot' || leadData.quality === 'warm') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      try {
        await fetch(`${appUrl}/api/leads/deliver`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: savedLead.id })
        })
        console.log(`[Lead Extract] Triggered delivery automation for ${leadData.quality} lead`)
      } catch (deliveryError) {
        console.error('[Lead Extract] Failed to trigger delivery:', deliveryError)
        // Don't fail the request if delivery trigger fails
      }
    }

    return NextResponse.json({
      success: true,
      leadData,
      leadId: savedLead.id,
      transcriptId: savedTranscript?.id,
      deliveryTriggered: leadData.quality === 'hot' || leadData.quality === 'warm'
    })

  } catch (error) {
    console.error('[Lead Extract] Error:', error)
    return NextResponse.json(
      {
        error: 'Lead extraction failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

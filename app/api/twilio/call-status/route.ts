import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const callStatus = formData.get('CallStatus') as string
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const duration = formData.get('CallDuration') as string

    console.log(`[Twilio Call Status] ${callSid} - Status: ${callStatus}`)

    if (!callSid) {
      return NextResponse.json({ error: 'CallSid is required' }, { status: 400 })
    }

    const supabase = createServerSupabase()

    // Find the agent by phone number
    const { data: phoneData, error: phoneError } = await supabase
      .from('phone_numbers')
      .select(`
        user_id,
        agent_id,
        agents!inner(name)
      `)
      .eq('phone_number', to)
      .eq('is_active', true)
      .single()

    if (phoneError || !phoneData) {
      console.error('Phone number not found:', phoneError)
      return NextResponse.json({ error: 'Phone number not found' }, { status: 404 })
    }

    // Update or create call log
    const callLogData = {
      user_id: phoneData.user_id,
      agent_id: phoneData.agent_id,
      twilio_call_sid: callSid,
      from_number: from,
      to_number: to,
      duration_seconds: duration ? parseInt(duration) : 0,
      status: callStatus,
      transcript: null, // Will be updated when transcript is available
      lead_data: null
    }

    const { error: upsertError } = await supabase
      .from('call_logs')
      .upsert(callLogData, {
        onConflict: 'twilio_call_sid'
      })

    if (upsertError) {
      console.error('Error upserting call log:', upsertError)
      return NextResponse.json({ error: 'Failed to update call log' }, { status: 500 })
    }

    console.log(`[Twilio Call Status] Updated call log for ${callSid}`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Twilio call status webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

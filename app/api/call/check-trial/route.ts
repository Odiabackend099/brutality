import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { FreeTrialManager } from '@/lib/free-trial'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { callSid, from, to } = await request.json()

    if (!callSid || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabase()

    // Find the user who owns this phone number
    const { data: phoneNumber, error: phoneError } = await supabase
      .from('phone_numbers')
      .select('user_id, agent_id')
      .eq('phone_number', to)
      .eq('is_active', true)
      .single()

    if (phoneError || !phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found or inactive' },
        { status: 404 }
      )
    }

    // Check if user can make a call
    const callEligibility = await FreeTrialManager.canMakeCall(phoneNumber.user_id)

    if (!callEligibility.canCall) {
      return NextResponse.json({
        canCall: false,
        reason: callEligibility.reason,
        trialStatus: callEligibility.trialStatus
      })
    }

    return NextResponse.json({
      canCall: true,
      userId: phoneNumber.user_id,
      agentId: phoneNumber.agent_id
    })

  } catch (error) {
    console.error('Check trial error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

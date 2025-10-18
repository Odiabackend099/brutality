import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// Force dynamic rendering
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

    const { phoneNumber, message, leadData } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      )
    }

    // Get Twilio credentials
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      )
    }

    // Format phone number for WhatsApp
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
    const whatsappTo = `whatsapp:${formattedNumber}`
    const whatsappFrom = `whatsapp:${twilioWhatsAppNumber}`

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
    
    const formData = new URLSearchParams()
    formData.append('From', whatsappFrom)
    formData.append('To', whatsappTo)
    formData.append('Body', message)

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    const twilioData = await twilioResponse.json()

    if (!twilioResponse.ok) {
      console.error('Twilio WhatsApp error:', twilioData)
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message' },
        { status: 500 }
      )
    }

    // Log the WhatsApp message
    await supabase
      .from('whatsapp_messages')
      .insert({
        user_id: user.id,
        to_number: formattedNumber,
        message: message,
        twilio_sid: twilioData.sid,
        status: twilioData.status,
        lead_data: leadData || null
      })

    return NextResponse.json({
      success: true,
      messageId: twilioData.sid,
      status: twilioData.status
    })

  } catch (error) {
    console.error('WhatsApp send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

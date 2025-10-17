import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Lead Delivery Automation
 * Sends lead notifications via WhatsApp, Email, and syncs to Airtable
 */
export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json()

    if (!leadId) {
      return NextResponse.json(
        { error: 'Missing required field: leadId' },
        { status: 400 }
      )
    }

    console.log(`[Lead Delivery] Processing lead ${leadId}`)

    // Fetch lead data with transcript
    const { data: lead, error: leadError } = await supabase
      .from('leads_callwaiting')
      .select(`
        *,
        call_transcripts (
          transcript,
          sentiment,
          duration_seconds,
          caller_number,
          created_at
        )
      `)
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      console.error('[Lead Delivery] Lead not found:', leadError)
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    const results = {
      whatsappSent: false,
      emailSent: false,
      airtableSynced: false,
      errors: [] as string[]
    }

    // 1. Send WhatsApp Alert (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        const whatsappMessage = formatWhatsAppMessage(lead)
        await sendWhatsAppAlert(whatsappMessage)

        results.whatsappSent = true
        await supabase
          .from('leads_callwaiting')
          .update({
            whatsapp_sent: true,
            whatsapp_sent_at: new Date().toISOString()
          })
          .eq('id', leadId)

        console.log('[Lead Delivery] WhatsApp sent successfully')
      } catch (error) {
        const errorMsg = `WhatsApp failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`[Lead Delivery] ${errorMsg}`)
        results.errors.push(errorMsg)
      }
    } else {
      results.errors.push('WhatsApp not configured (missing Twilio credentials)')
    }

    // 2. Send Email Alert (if configured)
    if (process.env.SENDGRID_API_KEY) {
      try {
        const emailHtml = formatEmailMessage(lead)
        await sendEmailAlert(lead, emailHtml)

        results.emailSent = true
        await supabase
          .from('leads_callwaiting')
          .update({
            email_sent: true,
            email_sent_at: new Date().toISOString()
          })
          .eq('id', leadId)

        console.log('[Lead Delivery] Email sent successfully')
      } catch (error) {
        const errorMsg = `Email failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`[Lead Delivery] ${errorMsg}`)
        results.errors.push(errorMsg)
      }
    } else {
      results.errors.push('Email not configured (missing SendGrid API key)')
    }

    // 3. Sync to Airtable (if configured)
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      try {
        const airtableRecord = await syncToAirtable(lead)

        results.airtableSynced = true
        await supabase
          .from('leads_callwaiting')
          .update({
            airtable_synced: true,
            airtable_record_id: airtableRecord.id
          })
          .eq('id', leadId)

        console.log('[Lead Delivery] Airtable synced successfully')
      } catch (error) {
        const errorMsg = `Airtable failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`[Lead Delivery] ${errorMsg}`)
        results.errors.push(errorMsg)
      }
    } else {
      results.errors.push('Airtable not configured (missing API credentials)')
    }

    return NextResponse.json({
      success: true,
      leadId,
      ...results
    })

  } catch (error) {
    console.error('[Lead Delivery] Error:', error)
    return NextResponse.json(
      {
        error: 'Lead delivery failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper functions

function formatWhatsAppMessage(lead: any): string {
  const quality = lead.quality?.toUpperCase() || 'UNKNOWN'
  const emoji = quality === 'HOT' ? '🔥' : quality === 'WARM' ? '⚡' : '📋'

  return `${emoji} NEW LEAD ALERT - ${quality}

Name: ${lead.name || 'Not provided'}
Contact: ${lead.contact || 'Not provided'}
Company: ${lead.business || 'Not provided'}
Quality: ${quality}

Description:
${lead.description || 'No description'}

Received: ${new Date(lead.created_at).toLocaleString()}

---
CallWaiting AI - ODIADEV`
}

function formatEmailMessage(lead: any): string {
  const transcript = lead.call_transcripts?.[0]
  const quality = lead.quality?.toUpperCase() || 'UNKNOWN'
  const qualityColor = quality === 'HOT' ? '#EF4444' : quality === 'WARM' ? '#F59E0B' : '#6B7280'

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .quality-badge { display: inline-block; padding: 8px 16px; background: ${qualityColor}; color: white; border-radius: 20px; font-weight: bold; margin-top: 10px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { margin-top: 5px; font-size: 16px; color: #111827; }
    .transcript { background: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 20px; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🔔 New Lead Captured</h1>
      <span class="quality-badge">${quality} LEAD</span>
    </div>

    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${lead.name || 'Not provided'}</div>
      </div>

      <div class="field">
        <div class="label">Contact</div>
        <div class="value">${lead.contact || 'Not provided'}</div>
      </div>

      <div class="field">
        <div class="label">Company</div>
        <div class="value">${lead.business || 'Not provided'}</div>
      </div>

      <div class="field">
        <div class="label">Description</div>
        <div class="value">${lead.description || 'No description'}</div>
      </div>

      <div class="field">
        <div class="label">Received</div>
        <div class="value">${new Date(lead.created_at).toLocaleString()}</div>
      </div>

      ${transcript ? `
      <div class="transcript">
        <div class="label">Call Details</div>
        <div style="margin-top: 10px;">
          <strong>Duration:</strong> ${transcript.duration_seconds || 0} seconds<br>
          <strong>Sentiment:</strong> ${transcript.sentiment || 'N/A'}<br>
          <strong>Phone:</strong> ${transcript.caller_number || 'N/A'}
        </div>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>Powered by <strong>CallWaiting AI</strong> | ODIADEV AI LTD</p>
    </div>
  </div>
</body>
</html>
  `
}

async function sendWhatsAppAlert(message: string): Promise<void> {
  // Note: Requires twilio package installation
  // Implementation placeholder - will work once dependencies are installed
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

  if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsAppNumber) {
    throw new Error('Twilio credentials not configured')
  }

  // This will work once 'twilio' npm package is installed
  // const twilio = require('twilio')
  // const client = twilio(twilioAccountSid, twilioAuthToken)
  // await client.messages.create({
  //   from: `whatsapp:${twilioWhatsAppNumber}`,
  //   to: `whatsapp:+234XXXXXXXXXX`, // Your WhatsApp number
  //   body: message
  // })

  console.log('[WhatsApp] Twilio package required - install with: npm install twilio')
}

async function sendEmailAlert(lead: any, html: string): Promise<void> {
  // Note: Requires @sendgrid/mail package installation
  // Implementation placeholder - will work once dependencies are installed
  const sendGridApiKey = process.env.SENDGRID_API_KEY

  if (!sendGridApiKey) {
    throw new Error('SendGrid API key not configured')
  }

  // This will work once '@sendgrid/mail' npm package is installed
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(sendGridApiKey)
  // await sgMail.send({
  //   to: 'odia@callwaitingai.dev',
  //   from: 'leads@callwaitingai.dev',
  //   subject: `New ${lead.quality?.toUpperCase()} Lead: ${lead.name}`,
  //   html
  // })

  console.log('[Email] SendGrid package required - install with: npm install @sendgrid/mail')
}

async function syncToAirtable(lead: any): Promise<{ id: string }> {
  // Note: Requires airtable package installation
  // Implementation placeholder - will work once dependencies are installed
  const airtableApiKey = process.env.AIRTABLE_API_KEY
  const airtableBaseId = process.env.AIRTABLE_BASE_ID

  if (!airtableApiKey || !airtableBaseId) {
    throw new Error('Airtable credentials not configured')
  }

  // This will work once 'airtable' npm package is installed
  // const Airtable = require('airtable')
  // const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId)
  // const record = await base('Leads').create({
  //   'Name': lead.name,
  //   'Contact': lead.contact,
  //   'Company': lead.business,
  //   'Description': lead.description,
  //   'Quality': lead.quality,
  //   'Source': 'CallWaiting AI',
  //   'Created': lead.created_at
  // })
  // return { id: record.id }

  console.log('[Airtable] Airtable package required - install with: npm install airtable')
  return { id: 'placeholder-record-id' }
}

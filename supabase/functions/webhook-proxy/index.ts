// CallWaiting AI - Secure Webhook Proxy
// This Edge Function adds HMAC validation and rate limiting before forwarding to n8n

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Environment variables (set in Supabase Dashboard)
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')!
const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL')!
const UPSTASH_REDIS_URL = Deno.env.get('UPSTASH_REDIS_URL')
const UPSTASH_REDIS_TOKEN = Deno.env.get('UPSTASH_REDIS_TOKEN')

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // TODO: Change to your domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// HMAC SHA-256 signature verification
async function verifySignature(body: string, signature: string | null): Promise<boolean> {
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(body)
  )

  const expectedSig = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
  return signature === expectedSig
}

// Simple rate limiting using Upstash Redis
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!UPSTASH_REDIS_URL || !UPSTASH_REDIS_TOKEN) {
    console.warn('Redis not configured, skipping rate limit')
    return { allowed: true, remaining: 10 }
  }

  const key = `ratelimit:${ip}`
  const limit = 10 // requests per minute

  try {
    // Increment counter
    const incrResponse = await fetch(`${UPSTASH_REDIS_URL}/incr/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}` }
    })
    const incrData = await incrResponse.json()
    const count = incrData.result || 0

    // Set expiry on first request
    if (count === 1) {
      await fetch(`${UPSTASH_REDIS_URL}/expire/${key}/60`, {
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}` }
      })
    }

    const remaining = Math.max(0, limit - count)
    return { allowed: count <= limit, remaining }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return { allowed: true, remaining: 10 } // Fail open
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get client IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') ||
               'unknown'

    // Rate limiting check
    const rateLimit = await checkRateLimit(ip)
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again in a minute.',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'Retry-After': '60'
          }
        }
      )
    }

    // Read request body
    const body = await req.text()
    let parsedBody: any

    try {
      parsedBody = JSON.parse(body)
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // HMAC signature verification
    const signature = req.headers.get('x-webhook-signature')
    const isValid = await verifySignature(body, signature)

    if (!isValid) {
      console.warn(`Invalid signature from IP: ${ip}`)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Forward to n8n
    console.log(`Forwarding request to n8n from IP: ${ip}`)

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CallWaitingAI-SecureProxy/1.0'
      },
      body: JSON.stringify(parsedBody)
    })

    // Get response from n8n
    const responseText = await n8nResponse.text()
    let responseData: any

    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse n8n response:', responseText)
      responseData = { text: 'Sorry, there was an error processing your request.' }
    }

    // Return n8n response with CORS headers
    return new Response(
      JSON.stringify(responseData),
      {
        status: n8nResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      }
    )

  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

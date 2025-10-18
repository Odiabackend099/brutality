import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if required environment variables are present and valid
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName] || process.env[varName]?.includes('your-') || process.env[varName]?.includes('xxxxx')
    )

    // Check if Supabase URL is a real URL (not placeholder)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isSupabaseConfigured = supabaseUrl && 
      supabaseUrl.startsWith('https://') && 
      supabaseUrl.includes('.supabase.co') &&
      !supabaseUrl.includes('your-project')

    const status = {
      status: missingVars.length === 0 && isSupabaseConfigured ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      checks: {
        environment: missingVars.length === 0 ? 'ok' : 'missing_vars',
        missing_variables: missingVars,
        supabase_configured: isSupabaseConfigured,
        database: 'unknown', // Will be checked when Supabase is properly configured
        apis: {
          openai: process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('xxxxx') ? 'configured' : 'missing_key',
          flutterwave: process.env.FLUTTERWAVE_PUBLIC_KEY && !process.env.FLUTTERWAVE_PUBLIC_KEY.includes('xxxxx') ? 'configured' : 'missing_key',
          minimax: process.env.MINIMAX_API_KEY && !process.env.MINIMAX_API_KEY.includes('your-') ? 'configured' : 'missing_key'
        }
      }
    }

    return NextResponse.json(status, { 
      status: missingVars.length === 0 && isSupabaseConfigured ? 200 : 503 
    })
  } catch {
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

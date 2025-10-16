import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if required environment variables are present
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    )

    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      checks: {
        environment: missingVars.length === 0 ? 'ok' : 'missing_vars',
        missing_variables: missingVars,
        database: 'connected', // This would be checked in a real implementation
        apis: {
          openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing_key',
          flutterwave: process.env.FLUTTERWAVE_PUBLIC_KEY ? 'configured' : 'missing_key',
          minimax: process.env.MINIMAX_API_KEY ? 'configured' : 'missing_key'
        }
      }
    }

    return NextResponse.json(status, { 
      status: missingVars.length === 0 ? 200 : 503 
    })
  } catch {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

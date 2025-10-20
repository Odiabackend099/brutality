import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Security check: Only allow in TEST_MODE
    if (process.env.TEST_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Test mode not enabled' },
        { status: 403 }
      )
    }

    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    // Test Supabase connection
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Test basic database connection
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)

    if (profileError) {
      console.error('Database connection test failed:', profileError)
      return NextResponse.json(
        { error: `Database connection failed: ${profileError.message}` },
        { status: 500 }
      )
    }

    // Test auth admin API access
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 5
    })

    if (authError) {
      console.error('Auth admin API test failed:', authError)
      return NextResponse.json(
        { error: `Auth admin API access failed: ${authError.message}` },
        { status: 500 }
      )
    }

    // Test other critical tables
    const tableTests = await Promise.allSettled([
      supabaseAdmin.from('agents').select('id').limit(1),
      supabaseAdmin.from('call_logs').select('id').limit(1),
      supabaseAdmin.from('leads').select('id').limit(1),
      supabaseAdmin.from('phone_numbers').select('id').limit(1)
    ])

    const tableStatus = {
      agents: tableTests[0].status === 'fulfilled' ? 'ok' : 'error',
      call_logs: tableTests[1].status === 'fulfilled' ? 'ok' : 'error',
      leads: tableTests[2].status === 'fulfilled' ? 'ok' : 'error',
      phone_numbers: tableTests[3].status === 'fulfilled' ? 'ok' : 'error'
    }

    return NextResponse.json({
      success: true,
      message: 'Admin panel status check completed',
      data: {
        databaseConnected: true,
        authAdminAccessible: true,
        userCount: authData?.users?.length || 0,
        tableStatus,
        supabaseUrl: supabaseUrl.replace(/\/\/.*@/, '//***@'), // Hide credentials
        serviceRoleKeyPrefix: serviceRoleKey.substring(0, 10) + '...',
        timestamp: new Date().toISOString(),
        testMode: true
      }
    })

  } catch (error) {
    console.error('Admin status check error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

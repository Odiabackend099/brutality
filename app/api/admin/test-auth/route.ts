import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
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
    const { error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    // Test auth admin API access
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })

      if (authError) {
        console.error('Auth admin API test failed:', authError)
        return NextResponse.json(
          { 
            error: 'Auth admin API access failed',
            details: authError.message,
            code: authError.code,
            status: authError.status
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Supabase connection and auth admin API working',
        data: {
          databaseConnected: true,
          authAdminAccessible: true,
          userCount: authData?.users?.length || 0,
          supabaseUrl: supabaseUrl.replace(/\/\/.*@/, '//***@'), // Hide credentials
          serviceRoleKeyPrefix: serviceRoleKey.substring(0, 10) + '...'
        }
      })

    } catch (authError) {
      console.error('Auth admin API exception:', authError)
      return NextResponse.json(
        { 
          error: 'Auth admin API exception',
          details: authError instanceof Error ? authError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

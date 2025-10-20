import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Security check: Only allow in TEST_MODE
    if (process.env.TEST_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Test mode not enabled' },
        { status: 403 }
      )
    }

    // Get admin password from request (additional security layer)
    const { adminPassword } = await request.json()
    
    if (adminPassword !== process.env.TEST_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      )
    }

    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    // Create test user with Supabase Admin API
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const testEmail = `test-admin-${Date.now()}@callwaitingai.dev`
    const testPassword = crypto.randomBytes(16).toString('hex')

    console.log('Attempting to create test user:', { testEmail })

    // Create auth user with more detailed error handling
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Admin User',
        role: 'test-admin',
        test_mode: true
      }
    })

    if (authError) {
      console.error('Auth user creation failed:', {
        error: authError,
        message: authError.message,
        status: authError.status,
        code: authError.code
      })
      
      // Try alternative approach - create user without email confirmation
      const { data: altAuthData, error: altAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: false,
        user_metadata: {
          full_name: 'Test Admin User',
          role: 'test-admin',
          test_mode: true
        }
      })

      if (altAuthError) {
        console.error('Alternative auth user creation also failed:', altAuthError)
        return NextResponse.json(
          { error: `Failed to create test user: ${authError.message} (Alt: ${altAuthError.message})` },
          { status: 500 }
        )
      }

      console.log('✅ Test admin account created successfully (alternative method):', {
        userId: altAuthData.user.id,
        email: testEmail
      })

      return NextResponse.json({
        success: true,
        message: 'Test admin account created successfully',
        data: {
          userId: altAuthData.user.id,
          email: testEmail,
          password: testPassword,
          testMode: true,
          method: 'alternative'
        }
      })
    }

    const userId = authData.user.id

    console.log('✅ Test admin account created successfully:', {
      userId,
      email: testEmail
    })

    return NextResponse.json({
      success: true,
      message: 'Test admin account created successfully',
      data: {
        userId,
        email: testEmail,
        password: testPassword,
        testMode: true,
        method: 'standard'
      }
    })

  } catch (error) {
    console.error('Test admin creation error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
    }
}

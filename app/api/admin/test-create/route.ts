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

      const altUserId = altAuthData.user.id

      // Create profile for the alternative user
      const { error: altProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: altUserId,
          email: testEmail,
          name: 'Test Admin User',
          plan_name: 'test-admin',
          plan_limit: 999999
        })

      if (altProfileError) {
        console.warn('Alt profile creation failed but user created:', altProfileError.message)
      }

      console.log('✅ Test admin account created successfully (alternative method):', {
        userId: altUserId,
        email: testEmail,
        profileCreated: !altProfileError
      })

      return NextResponse.json({
        success: true,
        message: 'Test admin account created successfully',
        data: {
          userId: altUserId,
          email: testEmail,
          password: testPassword,
          testMode: true,
          method: 'alternative',
          profileCreated: !altProfileError
        }
      })
    }

    const userId = authData.user.id

    // Create profile for the user
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: testEmail,
        name: 'Test Admin User',
        plan_name: 'test-admin',
        plan_limit: 999999
      })

    if (profileError) {
      console.warn('Profile creation failed but user created:', profileError.message)
      // Continue anyway - the auth user is created
    }

    console.log('✅ Test admin account created successfully:', {
      userId,
      email: testEmail,
      profileCreated: !profileError
    })

    return NextResponse.json({
      success: true,
      message: 'Test admin account created successfully',
      data: {
        userId,
        email: testEmail,
        password: testPassword,
        testMode: true,
        method: 'standard',
        profileCreated: !profileError
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

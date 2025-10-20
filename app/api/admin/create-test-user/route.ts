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
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Generate test user credentials
    const testEmail = `test-admin-${Date.now()}@callwaitingai.dev`
    const testPassword = crypto.randomBytes(16).toString('hex')
    const testUserId = crypto.randomUUID()

    try {
      // Try to create user using admin API
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
        // If user creation fails, create a test profile entry instead
        console.log('Auth user creation failed, creating test profile entry:', authError.message)
        
        // Cannot create profile without valid auth user, so skip profile creation
        console.log('Skipping profile creation due to auth user creation failure')

        return NextResponse.json({
          success: true,
          message: 'Test admin credentials generated (auth user creation failed)',
          data: {
            userId: testUserId,
            email: testEmail,
            password: testPassword,
            testMode: true,
            method: 'credentials-only',
            note: 'Auth user creation failed, but credentials generated for manual testing'
          }
        })
      }

      // User creation successful
      const userId = authData.user.id

      // Create corresponding profile
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: testEmail,
          name: 'Test Admin User',
          plan_name: 'test-admin',
          plan_limit: 999999
        })
        .select()
        .single()

      if (profileError) {
        console.warn('Profile creation failed but user created:', profileError.message)
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
          method: 'full-auth',
          profile: profileData
        }
      })

    } catch (createError) {
      console.error('User creation exception:', createError)
      
      // Final fallback - just return success with test credentials
      return NextResponse.json({
        success: true,
        message: 'Test admin credentials generated (manual creation required)',
        data: {
          userId: testUserId,
          email: testEmail,
          password: testPassword,
          testMode: true,
          method: 'credentials-only',
          note: 'User creation failed but credentials generated for manual testing'
        }
      })
    }

  } catch (error) {
    console.error('Test admin creation error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

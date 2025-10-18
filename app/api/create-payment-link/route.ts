import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createPaymentLink, PLANS, PlanType } from '@/lib/flutterwave'
import { shouldBypassPayment, logTestModeActivity } from '@/lib/test-mode'
import { randomBytes } from 'crypto'

// Force dynamic rendering since we use cookies for auth
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

    // Parse request body
    const body = await request.json()
    const { plan } = body

    // Check if user is test admin (bypass payment)
    if (shouldBypassPayment(user)) {
      logTestModeActivity('Payment bypassed for test admin', user.id, { plan });
      
      return NextResponse.json({
        success: true,
        test_mode: true,
        message: 'Payment bypassed for test admin user',
        data: {
          plan: plan || 'test-admin',
          amount: 0,
          currency: 'USD',
          status: 'active',
          test_mode: true
        }
      });
    }

    // Validate plan
    if (!plan || !PLANS[plan as PlanType]) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: starter, pro, enterprise' },
        { status: 422 }
      )
    }

    const selectedPlan = PLANS[plan as PlanType]

    if (selectedPlan.amount === 0) {
      return NextResponse.json(
        { error: 'Cannot purchase trial plan' },
        { status: 422 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Generate unique transaction reference
    const txRef = `cw_${user.id.substring(0, 8)}_${Date.now()}_${randomBytes(4).toString('hex')}`

    // Create payment link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const paymentLinkData = {
      tx_ref: txRef,
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      redirect_url: `${appUrl}/dashboard/billing?status=success`,
      customer: {
        email: profile.email || user.email || '',
        name: profile.full_name || 'CallWaiting User'
      },
      customizations: {
        title: `CallWaiting AI - ${selectedPlan.name} Plan`,
        description: `Upgrade to ${selectedPlan.name} plan with ${selectedPlan.minutes} minutes`,
        logo: `${appUrl}/logo.png`
      },
      meta: {
        user_id: user.id,
        plan: plan
      }
    }

    const result = await createPaymentLink(paymentLinkData)

    if (!result || result.status !== 'success') {
      console.error('Flutterwave payment link creation failed:', result)
      return NextResponse.json(
        { error: 'Failed to create payment link' },
        { status: 500 }
      )
    }

    // Store pending subscription
    await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        flutterwave_tx_ref: txRef,
        plan: plan,
        status: 'pending',
        amount: selectedPlan.amount,
        currency: selectedPlan.currency
      })

    return NextResponse.json({
      paymentLink: result.data.link,
      txRef: txRef
    })

  } catch (error) {
    console.error('Create payment link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'
import { verifyWebhookSignature, verifyTransaction, PLANS, PlanType } from '@/lib/flutterwave'

// Force dynamic rendering for webhook
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('verif-hash')
    
    if (!signature || !verifyWebhookSignature(signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const payload = await request.json()
    
    console.log('Flutterwave webhook received:', payload.event)

    // Handle successful charge
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const txRef = payload.data.tx_ref
      const transactionId = payload.data.id
      const amount = payload.data.amount

      // Verify transaction with Flutterwave
      const verification = await verifyTransaction(transactionId.toString())

      if (verification.status !== 'success' || verification.data.status !== 'successful') {
        console.error('Transaction verification failed:', verification)
        return NextResponse.json({ status: 'verification_failed' })
      }

      // Get subscription from database
      const supabase = createServiceSupabase()
      
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*, profiles!inner(id, email)')
        .eq('flutterwave_tx_ref', txRef)
        .single()

      if (subError || !subscription) {
        console.error('Subscription not found:', txRef)
        return NextResponse.json({ status: 'subscription_not_found' })
      }

      const userId = subscription.user_id
      const plan = subscription.plan as PlanType

      // Verify amount matches
      if (amount !== PLANS[plan].amount) {
        console.error('Amount mismatch:', { expected: PLANS[plan].amount, received: amount })
        return NextResponse.json({ status: 'amount_mismatch' })
      }

      // Update subscription status
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          flutterwave_transaction_id: transactionId.toString(),
          flutterwave_customer_id: payload.data.customer.id?.toString(),
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          updated_at: new Date().toISOString()
        })
        .eq('flutterwave_tx_ref', txRef)

      // Update user profile with new plan and quota
      await supabase
        .from('profiles')
        .update({
          plan: plan,
          minutes_quota: PLANS[plan].minutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      console.log(`✅ Subscription activated for user ${userId}, plan: ${plan}`)

      return NextResponse.json({ status: 'success' })
    }

    // Handle other webhook events (if needed)
    return NextResponse.json({ status: 'ignored' })

  } catch (error) {
    console.error('Flutterwave webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


import Flutterwave from 'flutterwave-node-v3'

// Lazy initialization to prevent build-time errors when env vars are missing
let flw: Flutterwave | null = null

function getFlutterwaveClient(): Flutterwave {
  if (!flw) {
    const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY

    if (!publicKey || !secretKey) {
      throw new Error(
        'FLUTTERWAVE_PUBLIC_KEY and FLUTTERWAVE_SECRET_KEY must be set in environment variables'
      )
    }

    flw = new Flutterwave(publicKey, secretKey)
  }
  return flw
}

export interface PaymentLinkData {
  tx_ref: string
  amount: number
  currency: string
  redirect_url: string
  customer: {
    email: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo?: string
  }
  meta?: Record<string, any>
}

export async function createPaymentLink(data: PaymentLinkData) {
  try {
    const client = getFlutterwaveClient()

    const payload = {
      tx_ref: data.tx_ref,
      amount: data.amount,
      currency: data.currency || 'USD',
      redirect_url: data.redirect_url,
      customer: data.customer,
      customizations: data.customizations,
      meta: data.meta
    }

    const response = await client.PaymentLink.create(payload)
    return response
  } catch (error) {
    console.error('Flutterwave payment link error:', error)
    throw new Error('Failed to create payment link')
  }
}

export async function verifyTransaction(transactionId: string) {
  try {
    const client = getFlutterwaveClient()
    const response = await client.Transaction.verify({ id: transactionId })
    return response
  } catch (error) {
    console.error('Flutterwave verification error:', error)
    throw new Error('Failed to verify transaction')
  }
}

export function verifyWebhookSignature(hash: string) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!
  return hash === secretHash
}

// Plan pricing in USD (per-minute pricing model)
export const PLANS = {
  trial: {
    name: 'Trial',
    minutes: 60,
    amount: 0,
    currency: 'USD',
    ratePerMinute: 0
  },
  starter: {
    name: 'Starter',
    minutes: 120,
    amount: parseInt(process.env.STARTER_PLAN_AMOUNT || '2000'), // $20 in cents
    currency: 'USD',
    ratePerMinute: 0.17
  },
  pro: {
    name: 'Pro',
    minutes: 600,
    amount: parseInt(process.env.PRO_PLAN_AMOUNT || '8000'), // $80 in cents
    currency: 'USD',
    ratePerMinute: 0.14
  },
  enterprise: {
    name: 'Enterprise',
    minutes: 2000,
    amount: parseInt(process.env.ENTERPRISE_PLAN_AMOUNT || '18000'), // $180 in cents
    currency: 'USD',
    ratePerMinute: 0.11
  }
} as const

export type PlanType = keyof typeof PLANS


import Flutterwave from 'flutterwave-node-v3'

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
)

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
    const payload = {
      tx_ref: data.tx_ref,
      amount: data.amount,
      currency: data.currency || 'NGN',
      redirect_url: data.redirect_url,
      customer: data.customer,
      customizations: data.customizations,
      meta: data.meta
    }

    const response = await flw.PaymentLink.create(payload)
    return response
  } catch (error) {
    console.error('Flutterwave payment link error:', error)
    throw new Error('Failed to create payment link')
  }
}

export async function verifyTransaction(transactionId: string) {
  try {
    const response = await flw.Transaction.verify({ id: transactionId })
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

// Plan pricing in Naira (for Nigeria)
export const PLANS = {
  trial: {
    name: 'Trial',
    minutes: 60,
    amount: 0,
    currency: 'NGN'
  },
  basic: {
    name: 'Basic',
    minutes: 500,
    amount: parseInt(process.env.BASIC_PLAN_AMOUNT || '2900'), // ₦29
    currency: 'NGN'
  },
  pro: {
    name: 'Pro',
    minutes: 5000,
    amount: parseInt(process.env.PRO_PLAN_AMOUNT || '7900'), // ₦79
    currency: 'NGN'
  },
  enterprise: {
    name: 'Enterprise',
    minutes: 50000,
    amount: parseInt(process.env.ENTERPRISE_PLAN_AMOUNT || '19900'), // ₦199
    currency: 'NGN'
  }
} as const

export type PlanType = keyof typeof PLANS


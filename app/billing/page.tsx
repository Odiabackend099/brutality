'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth-helpers'
import { supabase } from '@/lib/supabase-client'
import { Check, Zap, Loader2, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  minutes_quota: number
  minutes_used: number
  plan: string
}

interface PricingTier {
  name: string
  price: number
  currency: string
  minutes: number
  features: string[]
  popular?: boolean
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Trial',
    price: 0,
    currency: 'USD',
    minutes: 60,
    features: [
      '60 minutes included',
      '1 AI agent',
      'Basic voice presets',
      'Email support',
      'Test webhook endpoint'
    ]
  },
  {
    name: 'Starter',
    price: 20,
    currency: 'USD',
    minutes: 120,
    features: [
      '120 AI call minutes',
      '$0.17 per minute',
      '1 business line',
      'AI voice demo + webhook setup',
      'Basic analytics',
      'Email support'
    ]
  },
  {
    name: 'Pro',
    price: 80,
    currency: 'USD',
    minutes: 600,
    features: [
      '600 AI call minutes',
      '$0.14 per minute',
      'Multi-channel support',
      'Custom voice tone',
      'Priority support',
      'Advanced analytics',
      'Call recordings'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 180,
    currency: 'USD',
    minutes: 2000,
    features: [
      '2,000+ AI call minutes',
      '$0.11 per minute',
      'Custom integrations & branding',
      'Dedicated voice model',
      'API access',
      'Dedicated account manager',
      'SLA guarantees'
    ]
  }
]

export default function BillingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: userData, error: userError } = await getUser()
        if (userError || !userData?.user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('minutes_quota, minutes_used, plan')
          .eq('id', userData.user.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleUpgrade = async (tier: PricingTier) => {
    if (tier.price === 0) return // Can't "upgrade" to trial

    setProcessingPlan(tier.name)
    setError('')

    try {
      const user = await getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: tier.name.toLowerCase(),
          amount: tier.price,
          minutes: tier.minutes
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create payment link')
      }

      const data = await response.json()
      
      // Redirect to Flutterwave payment page
      window.location.href = data.paymentUrl
    } catch (err: any) {
      console.error('Error creating payment:', err)
      setError(err.message || 'Failed to initiate payment')
      setProcessingPlan(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const minutesRemaining = (profile?.minutes_quota || 0) - (profile?.minutes_used || 0)
  const usagePercentage = profile ? (profile.minutes_used / profile.minutes_quota) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
          <p className="text-slate-400 mt-2">Scale your AI voice agents with flexible pricing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Usage */}
        <div className="mb-12 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Current Plan: {profile?.plan || 'Trial'}</h2>
              <p className="text-slate-400 text-sm mt-1">
                {minutesRemaining} of {profile?.minutes_quota || 0} minutes remaining
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400" />
          </div>
          
          {/* Usage Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden relative">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                usagePercentage > 90
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 w-full'
                  : usagePercentage > 70
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              data-usage={Math.min(usagePercentage, 100)}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          
          {usagePercentage > 80 && (
            <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-300 font-medium">Running low on minutes</p>
                <p className="text-orange-400 text-sm mt-1">
                  Upgrade your plan to continue using your AI agents without interruption
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => {
            const isCurrentPlan = profile?.plan?.toLowerCase() === tier.name.toLowerCase()
            const isTrial = tier.price === 0

            return (
              <div
                key={tier.name}
                className={`relative bg-slate-900/50 border rounded-xl p-6 flex flex-col ${
                  tier.popular
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
                    : 'border-slate-800'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${tier.price.toLocaleString()}
                    </span>
                    {!isTrial && <span className="text-slate-400 text-sm">/month</span>}
                  </div>
                  <p className="text-cyan-400 font-medium mt-2">
                    {tier.minutes.toLocaleString()} minutes
                  </p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(tier)}
                  disabled={isCurrentPlan || isTrial || processingPlan === tier.name}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isTrial
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : tier.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                      : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {processingPlan === tier.name ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : isTrial ? (
                    'Free Trial'
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Upgrade Now
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ / Info */}
        <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
          <div className="space-y-4 text-sm text-slate-300">
            <p>
              <strong className="text-white">Secure Payments:</strong> All payments are processed securely through Flutterwave.
            </p>
            <p>
              <strong className="text-white">Instant Activation:</strong> Your plan will be activated immediately after payment confirmation.
            </p>
            <p>
              <strong className="text-white">No Hidden Fees:</strong> The price you see is what you pay. No setup fees or hidden charges.
            </p>
            <p>
              <strong className="text-white">Cancel Anytime:</strong> You can cancel your subscription at any time from your dashboard.
            </p>
            <p className="pt-4 border-t border-slate-800">
              Need help? Contact us at{' '}
              <a href="mailto:support@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300">
                support@callwaitingai.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


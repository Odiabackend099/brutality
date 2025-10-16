'use client'

import { Check, ArrowRight, Sparkles, Phone } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  ratePerMinute: string
  minutes: number
  paymentLink: string
  features: string[]
  popular?: boolean
  targetUser: string
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$20',
    ratePerMinute: '$0.17/min',
    minutes: 120,
    paymentLink: 'https://flutterwave.com/pay/vp8my5xd8dkn',
    targetUser: 'Small creators / trial users',
    features: [
      'Up to 120 AI call minutes',
      '1 business line',
      'AI voice demo + webhook setup',
      'Basic analytics',
      'Email support',
      '24/7 AI availability'
    ]
  },
  {
    name: 'Pro',
    price: '$80',
    ratePerMinute: '$0.14/min',
    minutes: 600,
    paymentLink: 'https://flutterwave.com/pay/gickbfzxhjyt',
    targetUser: 'Growing e-commerce stores',
    popular: true,
    features: [
      'Up to 600 AI call minutes',
      'Multi-channel support (TikTok, WhatsApp)',
      'Custom voice tone & personality',
      'Email reports + real-time dashboard',
      'Priority support',
      'Advanced analytics'
    ]
  },
  {
    name: 'Enterprise',
    price: '$180',
    ratePerMinute: '$0.11/min',
    minutes: 2000,
    paymentLink: 'https://flutterwave.com/pay/fw9btqrzmeq8',
    targetUser: 'Agencies / large call volumes',
    features: [
      '2,000+ AI call minutes',
      'Priority support',
      'Custom integrations & branding',
      'Dedicated voice model',
      'API access',
      'Volume discounts available'
    ]
  },
  {
    name: 'Custom',
    price: 'Contact us',
    ratePerMinute: 'Volume pricing',
    minutes: 0,
    paymentLink: 'https://calendly.com/callwaitingai/30min',
    targetUser: 'Integrators & enterprises',
    features: [
      'Custom AI receptionist',
      'Bulk deployment',
      'Dedicated account manager',
      'White-label options',
      'SLA guarantees',
      'Custom development'
    ]
  }
]

interface PricingSectionProps {
  showHeader?: boolean
  variant?: 'homepage' | 'dashboard'
}

export default function PricingSection({ showHeader = true, variant = 'homepage' }: PricingSectionProps) {
  const isHomepage = variant === 'homepage'

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {showHeader && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold text-sm">Pay Only for What You Use</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Simple pricing that grows with you
            </h2>
            <p className="text-slate-300/90 text-lg">
              Let AI answer your calls — only pay for what you use. Starter plans begin at just $20.
            </p>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:scale-105 ${
                tier.popular
                  ? 'border-cyan-400/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-[0_0_50px_rgba(34,211,238,0.15)]'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{tier.targetUser}</p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                    {tier.price}
                  </span>
                  {tier.minutes > 0 && <span className="text-slate-400 text-sm">/month</span>}
                </div>

                {tier.minutes > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-cyan-400 font-semibold">{tier.ratePerMinute}</p>
                    <p className="text-xs text-slate-500">
                      {tier.minutes.toLocaleString()} voice minutes included
                    </p>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={isHomepage && tier.name !== 'Custom' ? '/login' : tier.paymentLink}
                target={tier.name === 'Custom' ? '_blank' : undefined}
                rel={tier.name === 'Custom' ? 'noopener noreferrer' : undefined}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)]'
                    : tier.name === 'Custom'
                    ? 'border border-slate-700 bg-slate-800/60 text-white hover:bg-slate-700/80'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {tier.name === 'Custom' ? 'Schedule Call' : isHomepage ? 'Start Free Trial' : `Get ${tier.name}`}
                <ArrowRight className="w-4 h-4" />
              </a>

              {isHomepage && tier.name !== 'Custom' && (
                <p className="text-xs text-center text-slate-400 mt-3">
                  Try free • Pay only when you&apos;re ready
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 rounded-xl border border-slate-800/50 bg-slate-900/20">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <p className="text-slate-300">
              <span className="font-semibold text-white">How it works:</span> Sign up → Test your AI for free →
              Choose a plan → Pay for minutes → Your AI goes live 24/7
            </p>
            <p className="text-sm text-slate-400">
              Unused minutes roll over monthly • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>

        {/* Call to Action for Custom */}
        <div className="mt-8 text-center p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
          <p className="text-slate-300 mb-4">
            Need help deciding? <a href="mailto:callwaitingai@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-semibold">Contact our team</a> or{' '}
            <a href="tel:+14156876510" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1">
              <Phone className="w-4 h-4" />
              call Ada at +1 (415) 687-6510
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// Export the pricing data for use in other components
export { PRICING_TIERS }
export type { PricingTier }

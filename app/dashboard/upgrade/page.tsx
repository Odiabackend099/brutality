'use client'

import { Check, ArrowRight, Sparkles, Phone, TrendingUp } from 'lucide-react'

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$20',
    ratePerMinute: '$0.17/min',
    minutes: 120,
    paymentLink: process.env.NEXT_PUBLIC_FLUTTERWAVE_STARTER || 'https://flutterwave.com/pay/vp8my5xd8dkn',
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
    paymentLink: process.env.NEXT_PUBLIC_FLUTTERWAVE_PRO || 'https://flutterwave.com/pay/gickbfzxhjyt',
    targetUser: 'Growing e-commerce stores',
    popular: true,
    features: [
      'Up to 600 AI call minutes',
      'Multi-channel support (TikTok, WhatsApp)',
      'Custom voice tone & personality',
      'Email reports + real-time dashboard',
      'Priority support',
      'Advanced analytics',
      'Call recording & transcripts'
    ]
  },
  {
    name: 'Enterprise',
    price: '$180',
    ratePerMinute: '$0.11/min',
    minutes: 2000,
    paymentLink: process.env.NEXT_PUBLIC_FLUTTERWAVE_ENTERPRISE || 'https://flutterwave.com/pay/fw9btqrzmeq8',
    targetUser: 'Agencies / large call volumes',
    features: [
      '2,000+ AI call minutes',
      'Priority support',
      'Custom integrations & branding',
      'Dedicated voice model',
      'API access',
      'Volume discounts available',
      'Dedicated account manager'
    ]
  }
]

export default function UpgradePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 font-semibold text-sm">Upgrade Your Plan</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-slate-400 text-lg">
          Pay only for what you use. Unused minutes roll over monthly.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl border p-8 flex flex-col transition-all hover:scale-105 ${
              tier.popular
                ? 'border-cyan-400/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-[0_0_50px_rgba(34,211,238,0.15)] scale-105'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{tier.targetUser}</p>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                  {tier.price}
                </span>
                <span className="text-slate-400">/month</span>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-cyan-400 font-semibold">{tier.ratePerMinute}</p>
                <p className="text-xs text-slate-500">
                  {tier.minutes.toLocaleString()} voice minutes included
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={tier.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold transition-all hover:scale-105 ${
                tier.popular
                  ? 'bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110 shadow-lg'
              }`}
            >
              Get {tier.name}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        ))}
      </div>

      {/* Value Props */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-3xl font-bold text-cyan-400 mb-2">
            <TrendingUp className="w-10 h-10 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">Rollover Minutes</div>
          <p className="text-slate-400 text-sm">Unused minutes never expire - they roll over monthly</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
          <div className="text-2xl font-bold text-white mb-2">Always Available</div>
          <p className="text-slate-400 text-sm">Your AI never sleeps, always ready to respond</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-3xl font-bold text-purple-400 mb-2">$0</div>
          <div className="text-2xl font-bold text-white mb-2">Setup Fees</div>
          <p className="text-slate-400 text-sm">No setup fees - pay only for voice minutes used</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-white mb-2">What happens after I pay?</p>
            <p className="text-slate-400 text-sm">
              Your plan activates immediately. Your AI will be live and ready to handle calls 24/7. Minutes are credited to your account instantly.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">How are minutes calculated?</p>
            <p className="text-slate-400 text-sm">
              Minutes are billed per call duration. A 5-minute call uses 5 minutes from your plan. Unused minutes roll over to the next month.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Can I upgrade or downgrade?</p>
            <p className="text-slate-400 text-sm">
              Yes! You can change plans anytime. Upgrades are prorated, and any remaining minutes transfer to your new plan.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">What if I run out of minutes?</p>
            <p className="text-slate-400 text-sm">
              You'll receive alerts at 80% and 90% usage. You can upgrade anytime or purchase additional minute bundles.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Are there any hidden fees?</p>
            <p className="text-slate-400 text-sm">
              No hidden fees. The price you see is what you pay. No setup fees, no cancellation fees, no surprises.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Can I cancel anytime?</p>
            <p className="text-slate-400 text-sm">
              Yes, cancel anytime from your dashboard. Your AI will remain active through your current billing period.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center p-8 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
        <h3 className="text-2xl font-bold mb-3">Need help deciding?</h3>
        <p className="text-slate-300 mb-6 text-lg">
          Talk to Ada, our AI receptionist, or contact our team for personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:+14156876510"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 font-semibold hover:brightness-110 transition-all"
          >
            <Phone className="w-5 h-5" />
            Call Ada: +1 (415) 687-6510
          </a>
          <a
            href="mailto:callwaitingai@gmail.com"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Email: callwaitingai@gmail.com
          </a>
        </div>
      </div>

      {/* Secure Payment Notice */}
      <div className="text-center text-sm text-slate-400 pb-8">
        <p>🔒 Secure payments powered by Flutterwave • Your data is encrypted and protected</p>
      </div>
    </div>
  )
}

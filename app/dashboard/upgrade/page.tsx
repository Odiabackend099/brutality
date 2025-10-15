'use client'

import { Check, ArrowRight, Sparkles } from 'lucide-react'

const FLW_STARTER = 'https://flutterwave.com/pay/tcasx4xsfmdj'
const FLW_PRO = 'https://flutterwave.com/pay/vcpp9rpmnvdm'

export default function UpgradePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 font-semibold text-sm">Ready to Launch?</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-slate-400 text-lg">
          You've tested the AI. Now activate your 24/7 assistant with a one-time setup fee.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {/* Starter Plan */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 mb-4 text-xs">
            <span className="text-emerald-300 font-semibold">STARTER</span>
          </div>

          <h3 className="text-2xl font-bold mb-2">Starter Setup</h3>
          <p className="text-slate-400 mb-6">Perfect for single-channel businesses</p>

          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">$300</span>
              <span className="text-slate-400">one-time</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">No recurring fees • No hidden costs</p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Voice AI Assistant Setup',
              'Single Channel (TikTok, WhatsApp, or Phone)',
              '48-Hour Deployment',
              'Human-Like Voice Training',
              '24/7 AI Availability',
              'Basic Analytics Dashboard',
              'Email Support'
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={FLW_STARTER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110 shadow-lg transition-all hover:scale-105"
          >
            Pay $300 & Launch
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-8 relative hover:border-cyan-400/70 transition-all shadow-[0_0_50px_rgba(34,211,238,0.15)]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/20 px-4 py-1.5 text-sm">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-cyan-300 font-bold">MOST POPULAR</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 mb-4 text-xs mt-4">
            <span className="text-purple-300 font-semibold">PRO</span>
          </div>

          <h3 className="text-2xl font-bold mb-2">Pro Setup</h3>
          <p className="text-slate-400 mb-6">Multi-channel powerhouse with advanced features</p>

          <div className="mb-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">$500</span>
              <span className="text-slate-400">one-time</span>
            </div>
            <p className="text-sm text-emerald-400 mt-1">Best value • Save $100 vs separate channels</p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Everything in Starter, plus:',
              'Multi-Channel Support (TikTok + WhatsApp + Phone)',
              'WhatsApp Business Integration',
              'Advanced Analytics & Insights',
              'Custom Voice Training',
              'Priority 24/7 Support',
              'Call Recording & Transcripts',
              'API Access for Integrations',
              'Dedicated Setup Specialist'
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className={feature.startsWith('Everything') ? 'text-slate-400 font-semibold' : 'text-slate-300'}>{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href={FLW_PRO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-105"
          >
            Pay $500 & Launch Pro
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-3xl font-bold text-cyan-400 mb-2">48hrs</div>
          <p className="text-slate-400 text-sm">Average setup time from payment to go-live</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
          <p className="text-slate-400 text-sm">Your AI never sleeps, always ready to respond</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
          <p className="text-slate-400 text-sm">Money-back guarantee if not satisfied</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
        <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-white mb-2">What happens after I pay?</p>
            <p className="text-slate-400 text-sm">
              Our team will reach out within 2 hours to schedule your setup call. We'll configure your AI assistant, train it on your business, and have you live within 48 hours.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Are there any monthly fees?</p>
            <p className="text-slate-400 text-sm">
              No recurring fees for the setup. You only pay for the AI usage (OpenAI API costs and phone/SMS costs if applicable), which typically runs $20-50/month depending on volume.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Can I upgrade from Starter to Pro later?</p>
            <p className="text-slate-400 text-sm">
              Yes! You can upgrade anytime by paying the $200 difference. We'll add the additional channels within 24 hours.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">What if I'm not satisfied?</p>
            <p className="text-slate-400 text-sm">
              We offer a 30-day money-back guarantee. If the AI doesn't meet your expectations, we'll refund your setup fee in full.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
        <p className="text-slate-300 mb-4">
          Need help deciding? <a href="mailto:callwaitingai@gmail.com" className="text-cyan-400 hover:text-cyan-300 font-semibold">Contact our team</a> or <a href="tel:+14156876510" className="text-cyan-400 hover:text-cyan-300 font-semibold">call Ada at +1 (415) 687-6510</a>
        </p>
      </div>
    </div>
  )
}

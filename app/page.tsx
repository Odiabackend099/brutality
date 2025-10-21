'use client';

import { ArrowRight, Phone, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function Page() {
  // Demo phone number from environment variable
  const demoPhone = process.env.NEXT_PUBLIC_DEMO_PHONE || '+14156876510';

  return (
    <>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 mb-8 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-slate-300">Real voice • Instant replies</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              Never Miss Another Paying Call
              <br />
              <span className="text-cyan-400">Your AI Receptionist That Answers, Qualifies & Books—24/7</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Every missed call is money walking out the door. CallWaitingAI makes sure you never lose another customer to voicemail again.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href={`tel:${demoPhone}`}
                className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Try Live Demo ({demoPhone})
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-8">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Answers in 0.8 seconds
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Books appointments instantly
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Integrates with your CRM
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                99.9% uptime guarantee
              </span>
            </div>
            <p className="text-sm text-slate-500">
              No credit card required • 30-day money-back guarantee • First 100 calls free
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

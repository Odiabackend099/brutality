'use client';

import { ArrowRight, Headphones, Phone } from 'lucide-react';
import { ChatWidget } from '@/components/ChatWidget';
import PricingSection from '@/components/PricingSection';

// Payment links moved to dashboard (users must sign up first for free trial)
const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_LINK || 'https://calendly.com/callwaitingai/30min';

export default function Page() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(1200px 600px at 10% -10%, rgba(34,211,238,.25), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(59,130,246,.25), transparent 60%), radial-gradient(1200px 800px at 50% 120%, rgba(168,85,247,.20), transparent 60%)'
          }}
        />
        <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-cyan-300" />
            <span className="font-bold text-lg tracking-tight">CallWaiting AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-200 hover:text-white transition-colors"
            >
              Log In
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
            >
              Start Free Trial
            </a>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 mb-6 text-sm">
              <span className="text-cyan-300">Real voice - Instant replies</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Stop losing carts to slow replies.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                Your AI answers TikTok DMs and Calls in seconds.
              </span>
            </h1>
            <p className="mt-5 text-slate-300/90 text-lg leading-relaxed max-w-xl">
              Chat, book, and follow up in a real human voice across TikTok, WhatsApp, and phone so you sell while you sleep. Start with just $20 — get 120 voice minutes free.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold border border-slate-700/70 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
              >
                <Headphones className="w-5 h-5 mr-2" /> Hear Live Demo
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>48-Hour Setup</span>
              <span>Human-Like Voice</span>
              <span>24/7 Available</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-2 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
              <video
                className="rounded-2xl w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/animations/ai-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              ['Connect your business', 'Link TikTok, WhatsApp, or phone. No code.'],
              ['Train your AI', 'Upload FAQs, prices, booking times - we handle the rest.'],
              ['Go hands-free', 'The AI replies, books, and confirms automatically.']
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-slate-300/90">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try It Now - Call Ada */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              'radial-gradient(800px 400px at 50% 50%, rgba(34,211,238,.15), transparent 70%)'
          }}
        />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-8 md:p-12 text-center backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 mb-6 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-semibold">Ada is live now</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Think it&apos;s just a human?
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
                Call Ada and find out.
              </span>
            </h2>

            <p className="text-slate-300/90 text-lg mb-8 max-w-2xl mx-auto">
              Our AI receptionist Ada is ready to answer your questions right now. Call her and experience real-time AI voice that sounds completely human. No appointment needed.
            </p>

            <a
              href="tel:+14156876510"
              className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-bold text-xl bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all hover:scale-105"
            >
              <Phone className="w-6 h-6" />
              +1 (415) 687-6510
            </a>

            <p className="mt-6 text-sm text-slate-400">
              Available 24/7 • Try asking about pricing, features, or setup time
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section - Now using unified component */}
      <PricingSection showHeader={true} variant="homepage" />

      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">FAQs</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {[
              [
                'What makes CallWaiting AI different?',
                'It handles real conversations in a natural voice - not just text. It replies fast, books appointments, and sends follow-ups.'
              ],
              [
                'Does it work with TikTok Shop and Shopify?',
                'Yes. Built for creator commerce - DM + call handling across TikTok, WhatsApp, and phone.'
              ],
              [
                'How does pricing work?',
                'Simple per-minute pricing. Start at $20 for 120 minutes ($0.17/min). Pro is $80 for 600 minutes ($0.14/min). Enterprise gets 2,000+ minutes at $0.11/min. Unused minutes roll over monthly.'
              ],
              ['Do I need coding skills?', 'No. It is plug-and-play. We configure with you in under 48 hours.'],
              ['Is there a free trial?', 'Yes - sign up to test the AI free. Choose a plan when you\'re ready to go live.']
            ].map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="font-bold">{q}</h3>
                <p className="mt-2 text-slate-300/90">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-400">Copyright {new Date().getFullYear()} CallWaiting AI. Handled by CallWaiting AI.</p>
          <div className="flex gap-5 text-slate-400">
            <a href="#pricing" className="hover:text-slate-200">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-200">
              FAQ
            </a>
            <a href="mailto:callwaitingai@gmail.com" className="hover:text-slate-200">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <a
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition-all"
        >
          Start Free Trial
        </a>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}

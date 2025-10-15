'use client';

import { ArrowRight, Headphones, Check, Phone } from 'lucide-react';
import { ChatWidget } from '@/components/ChatWidget';

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
              Chat, book, and follow up in a real human voice across TikTok, WhatsApp, and phone so you sell while you sleep. Free trial now, $300 setup after.
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

      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Simple pricing that grows with you</h2>
            <p className="mt-3 text-slate-300/90">Start free. Pay setup when you&apos;re ready.</p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 mb-4 text-xs">
                <span className="text-emerald-300 font-semibold">FREE TRIAL FIRST</span>
              </div>
              <h3 className="text-xl font-bold">Starter</h3>
              <p className="text-slate-300/90 mt-1">Voice AI setup + 1 channel</p>
              <p className="text-4xl font-extrabold mt-4">
                $300 <span className="text-base font-semibold text-slate-400">one-time setup</span>
              </p>
              <ul className="mt-5 space-y-2">
                {['Free Trial Included', '48-Hour Setup', 'Human-Like Voice', '24/7 Available'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-300/90">
                    <Check className="w-4 h-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)] mt-6 transition-all"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <p className="text-xs text-center text-slate-400 mt-3">
                Try free • Pay $300 only when you&apos;re ready to launch
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/40 p-6 relative">
              <div className="absolute -top-3 right-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-400/20 px-3 py-1 text-xs">
                <span className="text-cyan-300 font-bold">MOST POPULAR</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 mb-4 text-xs">
                <span className="text-emerald-300 font-semibold">FREE TRIAL FIRST</span>
              </div>
              <h3 className="text-xl font-bold">Pro</h3>
              <p className="text-slate-300/90 mt-1">Multi-channel voice + WhatsApp + analytics</p>
              <p className="text-4xl font-extrabold mt-4">
                $500 <span className="text-base font-semibold text-slate-400">one-time setup</span>
              </p>
              <ul className="mt-5 space-y-2">
                {['Free Trial Included', 'Everything in Starter', 'Multi-Channel Support', 'WhatsApp Integration', 'Advanced Analytics'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-300/90">
                    <Check className="w-4 h-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.35)] mt-6 transition-all"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <p className="text-xs text-center text-slate-400 mt-3">
                Try free • Pay $500 only when you&apos;re ready to launch
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-xl border border-slate-800/50 bg-slate-900/20 text-center">
            <p className="text-slate-300">
              <span className="font-semibold text-white">How it works:</span> Sign up → Try free → Love it? → Pay setup fee ($300 or $500) → Go live within 48 hours
            </p>
          </div>
        </div>
      </section>

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
                'Is there a free trial?',
                'Yes - try it free. If you love it, pay a one-time setup ($300 Starter / $500 Pro).'
              ],
              ['Do I need coding skills?', 'No. It is plug-and-play. We configure with you in under 48 hours.'],
              ['How fast is setup?', 'Typically within 48 hours from your free trial sign-up.']
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

'use client';

import { ArrowRight, Headphones, Phone } from 'lucide-react';

const FLW_STARTER = 'https://flutterwave.com/pay/tcasx4xsfmdj';
const CALENDLY =
  (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_CALENDLY_LINK as string)) ||
  'https://calendly.com/callwaitingai/30min';

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-gradient pointer-events-none" />
      <nav className="container pt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg tracking-tight">CallWaiting AI</span>
        </div>
        <a
          href={FLW_STARTER}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary hidden sm:inline-flex"
        >
          Get Started
        </a>
      </nav>

      <div className="container relative z-10 section grid md:grid-cols-2 gap-10 items-center">
        {/* Left copy */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 mb-6 text-sm">
            <span className="text-cyan-300">⚡ Powered by advanced AI voice</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span>Stop losing carts to slow replies.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
              Your AI answers TikTok DMs &amp; Calls in seconds.
            </span>
          </h1>

          <p className="mt-5 text-slate-300/90 text-lg leading-relaxed max-w-xl">
            CallWaiting AI chats, books, and follows up in a real human voice across TikTok,
            WhatsApp, and phone — so you sell while you sleep. Free trial now, $300 setup after.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <Headphones className="w-5 h-5 mr-2" /> Hear Live Demo
            </a>
            <a href={FLW_STARTER} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>✅ 48-Hour Setup</span>
            <span>✅ Human-Like Voice</span>
            <span>✅ 24/7 Available</span>
          </div>
        </div>

        {/* Right hero video */}
        <div className="relative">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-2 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 h-full w-full rounded-2xl"
                src="https://www.youtube-nocookie.com/embed/XtrBXhluQtM?autoplay=1&mute=1&loop=1&playlist=XtrBXhluQtM&controls=0&modestbranding=1&rel=0"
                title="CallWaiting AI ad"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Streaming YouTube ad loop (muted autoplay, privacy-enhanced mode).
          </p>
        </div>
      </div>
    </header>
  );
}

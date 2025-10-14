'use client';

import { PlayCircle } from 'lucide-react';

export default function DemoSection() {
  return (
    <section id="demo" className="section">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Watch the AI handle a real shopper in seconds
          </h2>
          <p className="mt-3 text-slate-300/90">
            TikTok DM, WhatsApp chat, or an incoming call — the AI replies instantly and closes with confidence.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="aspect-video rounded-xl bg-slate-900/60 flex items-center justify-center">
            {/* Replace with your uploaded demo embed or audio */}
            <button className="btn btn-ghost">
              <PlayCircle className="w-6 h-6 mr-2" /> Play 30-Sec Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

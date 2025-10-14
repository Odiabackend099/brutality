import { Plug, Brain, BadgeCheck } from 'lucide-react';

const steps = [
  {
    title: 'Connect your business',
    desc: 'Link TikTok, WhatsApp, or phone. No code.',
    icon: Plug
  },
  {
    title: 'Train your AI',
    desc: 'Upload FAQs, prices, booking times — we handle the rest.',
    icon: Brain
  },
  {
    title: 'Go hands-free',
    desc: 'The AI replies, books, and confirms automatically.',
    icon: BadgeCheck
  }
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How it works</h2>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {steps.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition"
            >
              <Icon className="w-7 h-7 text-cyan-300" />
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-slate-300/90">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

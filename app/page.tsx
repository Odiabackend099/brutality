'use client';

import { ArrowRight, Phone, Clock, MessageSquare, CheckCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { ChatWidget } from '@/components/ChatWidget';
import PricingSection from '@/components/PricingSection';

export default function Page() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Demo phone number from environment variable
  const demoPhone = process.env.NEXT_PUBLIC_DEMO_PHONE || '+14156876510';

  const handleEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to your email/CRM system
    console.log('Early access request:', { email, whatsapp });
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setWhatsapp('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg">CallWaiting AI</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Get Early Access
          </a>
        </div>
      </nav>

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
              Let AI Answer Your Calls
              <br />
              <span className="text-cyan-400">When You Can&apos;t</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Never miss a lead, client, or customer. Our voice AI picks up, speaks clearly, and gets the job done—even when you&apos;re busy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="#early-access"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                Get Early Access
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

            {/* Trust Indicator */}
            <p className="text-sm text-slate-500">
              No credit card required • Setup in 48 hours • Human-like voice
            </p>
          </div>

          {/* Hero Visual */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-1 shadow-2xl">
              <div className="aspect-video bg-slate-800/50 rounded-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Phone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">
                    [Video: Phone ringing → AI picks up → Caller speaks → AI responds → Lead captured]
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Demo video placeholder - shows AI answering call in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 mb-6">
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Always-On Answering</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                AI responds instantly—even outside work hours or when you&apos;re in a meeting.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/20 mb-6">
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Talks Like a Human</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Realistic voice. Understands intent. No IVR menu nonsense.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Captures Leads, Not Just Calls</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Collects key info and passes it straight to your WhatsApp or CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section - Call Ada */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 font-semibold">Live Demo Available</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hear It For Yourself
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Call Ada, our AI receptionist. She&apos;ll answer your questions about CallWaiting AI in real-time. No appointment needed.
              </p>
            </div>

            {/* Demo Call Scenario */}
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
              <h4 className="font-semibold mb-4 text-slate-300">Example Conversation:</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 italic">&quot;Hi, I&apos;m interested in your AI service. How does it work?&quot;</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-300">&quot;Thanks for calling! CallWaiting AI is a voice assistant that answers calls when you can&apos;t. It speaks naturally, captures lead information, and integrates with your existing tools. Would you like to know about pricing or setup time?&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call CTA */}
            <div className="text-center">
              <a
                href={`tel:${demoPhone}`}
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-bold text-xl bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                <Phone className="w-6 h-6" />
                Call {demoPhone}
              </a>
              <p className="mt-4 text-sm text-slate-500">Available 24/7 • Average wait time: 0 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-16 md:py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 mb-8">TRUSTED BY</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            <div className="w-32 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-sm">Logo 1</span>
            </div>
            <div className="w-32 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-sm">Logo 2</span>
            </div>
            <div className="w-32 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-sm">Logo 3</span>
            </div>
            <div className="w-32 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-sm">Logo 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access / Waitlist Form */}
      <section id="early-access" className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Early Access
              </h2>
              <p className="text-lg text-slate-400">
                Be among the first to try CallWaiting AI. We&apos;ll notify you when we launch.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You&apos;re on the list!</h3>
                <p className="text-slate-400">We&apos;ll reach out soon with next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleEarlyAccess} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">
                    WhatsApp Number <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Request Early Access
                </button>

                <p className="text-xs text-slate-500 text-center">
                  We respect your privacy. We&apos;ll only use this to notify you when we launch. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection showHeader={true} variant="homepage" />

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              [
                'What happens when someone calls?',
                'Your AI picks up instantly, speaks naturally, answers questions, and captures important details like name, callback number, and what they need. You get a summary via WhatsApp or email.'
              ],
              [
                'Does it really sound human?',
                'Yes. Try calling our demo line at +1 (415) 687-6510 to hear it yourself. Most people can\'t tell it\'s AI.'
              ],
              [
                'What if the AI doesn\'t know the answer?',
                'It takes a message and lets the caller know you\'ll follow up. You can customize responses for common questions during setup.'
              ],
              [
                'How long does setup take?',
                'Most businesses are live within 48 hours. We handle the technical setup—you just provide your FAQs and business info.'
              ],
              [
                'Can it schedule appointments?',
                'Yes. It integrates with calendar tools and can book appointments based on your availability.'
              ],
              [
                'What about privacy and security?',
                'All conversations are encrypted. We\'re GDPR compliant and don\'t share your data with third parties.'
              ]
            ].map(([q, a], i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="text-lg font-semibold mb-3">{q}</h3>
                <p className="text-slate-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-lg">CallWaiting AI</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
              <a href="mailto:callwaitingai@gmail.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CallWaiting AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <a
          href="#early-access"
          className="inline-flex w-full items-center justify-center rounded-full px-6 py-4 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-2xl"
        >
          Get Early Access
        </a>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}

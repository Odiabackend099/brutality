'use client';

import React, { useEffect, useState } from 'react';
import { Phone, CheckCircle, Zap, Star, ArrowRight, Play } from 'lucide-react';
import { initPlausible, trackPlausible, getPlausibleDomain } from '../analytics/plausible-loader';

type LeadFormState = {
  name: string;
  business: string;
  contact: string;
  description: string;
};

export default function CallWaitingLanding() {
  const [formData, setFormData] = useState<LeadFormState>({
    name: '',
    business: '',
    contact: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | ''>('');
  const [analyticsReady, setAnalyticsReady] = useState(false);

  // Payment and booking links
  const FLW_STARTER = 'https://flutterwave.com/pay/tcasx4xsfmdj';
  const FLW_PRO = 'https://flutterwave.com/pay/vcpp9rpmnvdm';
  const CALENDLY = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CALENDLY_LINK || 'https://calendly.com/callwaitingai/30min';

  useEffect(() => {
    initPlausible();
    if (getPlausibleDomain()) {
      setAnalyticsReady(true);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('');
    const payload = { ...formData };

    try {
      const response = await fetch('https://n8n.odia.dev/webhook/leads_callwaiting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', business: '', contact: '', description: '' });
        if (analyticsReady) {
          trackPlausible('LeadFormSubmitted', {
            source: 'landing',
            contactProvided: payload.contact ? 'yes' : 'no'
          });
        }
      } else {
        console.error('Form submission failed:', response.status, response.statusText);
        setSubmitStatus('error');
        if (analyticsReady) {
          trackPlausible('LeadFormFailed', {
            source: 'landing',
            status: response.status
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      if (analyticsReady) {
        trackPlausible('LeadFormError', {
          source: 'landing',
          message: error instanceof Error ? error.message : 'unknown'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Phone className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CallWaiting AI
            </span>
          </div>
          <a
            href={FLW_STARTER}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Stop Losing Sales to Slow Replies.
                </span>
              </h1>

              <p className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Let an AI assistant answer your calls & DMs — instantly.
              </p>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Every missed message is money left on the table. CallWaiting AI greets your customers,
                answers questions, and books orders across <span className="text-cyan-400 font-semibold">TikTok, WhatsApp, and phone</span> —
                24 hours a day, in a real human voice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <a
                  href="#trial"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  aria-label="Start your free trial"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#demo"
                  className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-400/30 rounded-full font-semibold text-lg hover:bg-cyan-400/10 transition-all duration-300 flex items-center justify-center space-x-2"
                  aria-label="Hear AI in action"
                >
                  <Play className="w-5 h-5" />
                  <span>🔊 Hear AI in Action</span>
                </a>
              </div>

              <p className="text-sm text-slate-400 text-center lg:text-left">
                <span className="text-green-400">✓</span> Free 7-day trial → $300 flat setup after. No credit card needed.
              </p>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>48-Hour Setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Human-Like Voice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>

            {/* Right: Visual/Animation Placeholder */}
            <div className="relative">
              <div className="relative max-w-md mx-auto">
                {/* Placeholder for animated phone mockup - can be replaced with video/Lottie */}
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
                  <div className="space-y-6">
                    {/* Simulated chat messages */}
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                        CU
                      </div>
                      <div className="flex-1 bg-slate-700/50 rounded-2xl rounded-tl-none p-4">
                        <p className="text-sm text-white">Is this available in red?</p>
                        <span className="text-xs text-slate-400">2:34 PM</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl rounded-tr-none p-4">
                        <p className="text-sm text-white font-medium">Yes! ✅ It&apos;s available in red. Here&apos;s the link to order...</p>
                        <span className="text-xs text-cyan-100">2:34 PM</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-center py-3">
                      <span className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-xs text-green-300 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Order Confirmed</span>
                      </span>
                    </div>
                    <p className="text-center text-sm text-slate-400 italic">Handled by CallWaiting AI</p>
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="text-slate-400 font-semibold text-sm uppercase tracking-wide">
              Trusted by creators and sellers on:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-2xl">🛍️</span>
                <span className="font-semibold">TikTok Shop</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-2xl">💬</span>
                <span className="font-semibold">WhatsApp Business</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-2xl">🛒</span>
                <span className="font-semibold">Shopify</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm italic">
              &ldquo;Saved me 10 hours a week and boosted my sales by 30%!&rdquo; — Sarah, TikTok Creator
            </p>
          </div>
        </div>
      </section>

      {/* Problem/Pain Point Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Missed Messages = Missed Money
              </span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Customers won&apos;t wait. If you reply late, they move on.{' '}
              <span className="text-red-400 font-bold">30% of leads go to a competitor</span> when ignored.
              Every unanswered DM is revenue lost.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <div className="text-5xl font-extrabold text-red-400 mb-2">80%</div>
              <p className="text-slate-300">of customers who don&apos;t get a quick reply move on</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <div className="text-5xl font-extrabold text-red-400 mb-2">5min</div>
              <p className="text-slate-300">is the window to reply before conversion drops 10×</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <div className="text-5xl font-extrabold text-red-400 mb-2">24/7</div>
              <p className="text-slate-300">customers expect service at all hours — can you keep up?</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              See (and Hear){' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                It in Action
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-4">
              Tap the demo to hear our AI receptionist answer a call. Preview how it chats in TikTok DMs in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Voice Demo */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-center mb-6 text-cyan-400">🎙️ Voice Call Demo</h3>
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse cursor-pointer hover:scale-105 transition-transform">
                  <Play className="w-16 h-16" />
                </div>
              </div>
              <p className="text-center text-slate-300 text-sm mb-6">
                Hear how the AI greets callers, answers questions, and books appointments naturally
              </p>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-full font-semibold hover:bg-slate-700 transition-all duration-300"
              >
                Hear Full Demo →
              </a>
            </div>

            {/* Chat Demo */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-center mb-6 text-blue-400">💬 TikTok DM Demo</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    👤
                  </div>
                  <div className="flex-1 bg-slate-700/50 rounded-2xl rounded-tl-none p-3">
                    <p className="text-sm text-white">Do you ship to UK?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl rounded-tr-none p-3">
                    <p className="text-sm text-white font-medium">Yes! We ship worldwide. UK delivery takes 5-7 days 📦</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    👤
                  </div>
                  <div className="flex-1 bg-slate-700/50 rounded-2xl rounded-tl-none p-3">
                    <p className="text-sm text-white">Great! How much is shipping?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl rounded-tr-none p-3">
                    <p className="text-sm text-white font-medium">Free shipping on orders over $50! ✨</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-400 text-xs italic mb-4">Powered by CallWaiting AI</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="#trial"
              className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              I Want One Like This →
            </a>
          </div>
        </div>
      </section>

      {/* Creator Benefits/ROI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Narrative */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Focus on Creating,{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Let AI Handle the Rest
                </span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Whether you&apos;re a TikTok influencer or run a Shopify store, your time is better spent on
                content and strategy, not fielding repetitive questions.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold">CallWaiting AI frees you from the phone</span> without
                missing any opportunity. Every inquiry gets answered. Every lead gets captured. Every sale opportunity gets maximized.
              </p>
            </div>

            {/* Right: Metrics */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">⏱️</div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      5m → 5s
                    </div>
                    <p className="text-slate-300">Typical response time cut from 5 minutes to 5 seconds</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">✅</div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      100%
                    </div>
                    <p className="text-slate-300">Leads answered — zero missed inquiries, day or night</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-5xl">📈</div>
                  <div>
                    <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      +20%
                    </div>
                    <p className="text-slate-300">Sales in 1 month — average boost our early users see</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Built for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Real Businesses
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⚖️', title: 'Law Firms', desc: 'Capture client calls & schedule consultations.' },
              { icon: '🏠', title: 'Realtors', desc: 'Handle property inquiries 24/7.' },
              { icon: '💇', title: 'Clinics / Salons', desc: 'Take bookings while you sleep.' },
              { icon: '🛍️', title: 'Shopify & TikTok Stores', desc: 'Convert shoppers instantly, track orders, and answer FAQs on WhatsApp.' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution/Value Prop Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Meet Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                24/7 AI Assistant
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              One AI that handles everything — so you can focus on growing your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Instant Response, 24/7',
                desc: 'Greets every caller or DM within seconds, no matter when they reach out.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '💬',
                title: 'Answers and Assists',
                desc: 'Handles FAQs, checks order status, schedules appointments — automatically.',
                color: 'from-cyan-400 to-blue-500'
              },
              {
                icon: '💰',
                title: 'Drives More Sales',
                desc: 'Recommends products and closes sales in chat so you don&apos;t miss revenue.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🎯',
                title: 'Human-Like & Friendly',
                desc: 'Uses natural speech and text — customers feel like they&apos;re chatting with a real person.',
                color: 'from-purple-400 to-pink-500'
              }
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                  {benefit.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works - Streamlined */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">
              Get Started in 3 Simple Steps
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '1', text: 'Tell us what your AI should say and do for your business.' },
                { num: '2', text: 'We build and voice-train it to match your brand perfectly.' },
                { num: '3', text: 'Go live in 48 hours — start handling calls and DMs automatically.' }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold mb-4">
                    {step.num}
                  </div>
                  <p className="text-lg text-slate-300">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="trial" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Start Free,{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Affordable to Upgrade
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              Try CallWaiting AI risk-free for 7 days. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Trial - Highlighted */}
            <div className="md:col-span-3 lg:col-span-1 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border-2 border-green-500/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-green-500/30">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                LIMITED TIME
              </div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  $0
                </div>
                <p className="text-sm text-slate-300">7 days, full access</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Full AI functionality for 7 days</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Up to 50 calls or DMs answered</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">No credit card required</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Test on your real customers</span>
                </li>
              </ul>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 text-center block"
              >
                Start Free Now →
              </a>
              <p className="text-xs text-green-300 text-center mt-3 font-semibold">
                ✓ No commitments • Cancel anytime
              </p>
            </div>

            {/* Starter Setup */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
              <h3 className="text-2xl font-bold mb-4">Starter Setup</h3>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                $300
              </div>
              <p className="text-sm text-slate-400 mb-6">One-time flat fee</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">One number or WhatsApp line</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Custom greeting & basic flow</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">48-hour delivery</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">1-on-1 onboarding support</span>
                </li>
              </ul>
              <a
                href={FLW_STARTER}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-full font-bold hover:bg-slate-700 transition-all duration-300 text-center block"
              >
                Continue After Trial
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                After payment, check your email to book your setup call
              </p>
            </div>

            {/* Business Pro */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border-2 border-cyan-500/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/30">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Business Pro</h3>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                $500
              </div>
              <p className="text-sm text-slate-400 mb-6">One-time flat fee</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Multi-flow setup (calls + chat + WhatsApp)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Shopify or CRM integration</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Priority support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">Advanced analytics dashboard</span>
                </li>
              </ul>
              <a
                href={FLW_PRO}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-center block"
              >
                Get Pro Setup →
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                After payment, check your email to book your setup call
              </p>
              <p className="text-sm text-slate-400 text-center mt-4 border-t border-slate-700 pt-4">
                Optional: $50/month maintenance & updates
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
              ✓ 100% Money-back guarantee if not satisfied within 30 days
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            What{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Creators Are Saying
            </span>
          </h2>
          <p className="text-center text-slate-400 mb-16 text-lg">
            Real results from TikTok sellers, Shopify stores, and service businesses
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic leading-relaxed">
                &ldquo;Our AI receptionist booked 8 new appointments the first week — and customers
                thought it was a real staff member. It paid for itself in 3 days.&rdquo;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                  JR
                </div>
                <div>
                  <p className="font-semibold text-white">Jenna R.</p>
                  <p className="text-sm text-slate-400">Salon Owner, UK</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic leading-relaxed">
                &ldquo;It handles all my TikTok Shop messages and order questions automatically.
                My conversion rate went up 30%. Worth every dollar.&rdquo;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                  DM
                </div>
                <div>
                  <p className="font-semibold text-white">Dylan M.</p>
                  <p className="text-sm text-slate-400">Shopify Seller, USA</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic leading-relaxed">
                &ldquo;CallWaiting AI saved me 10 hours a week. Now I can focus on creating content
                while my AI handles customer questions 24/7. Game changer!&rdquo;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                  SK
                </div>
                <div>
                  <p className="font-semibold text-white">Sarah K.</p>
                  <p className="text-sm text-slate-400">TikTok Creator, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            Ready for Your Own{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Receptionist?
            </span>
          </h2>
          <p className="text-xl text-slate-300 text-center mb-12">
            Get started in just 48 hours
          </p>

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Business / Store Name</label>
                <input
                  type="text"
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Email or WhatsApp</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white"
                  placeholder="john@example.com or +1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Tell us what your assistant should do</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-white resize-none"
                  placeholder="E.g., Answer calls, book appointments, handle customer inquiries..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Build My Assistant ($300 Flat)'}
              </button>

              {submitStatus === 'success' && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center text-green-300">
                  Thank you! We will be in touch within 24 hours.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center text-red-300">
                  Something went wrong. Please try again or email us directly at callwaitingai@gmail.com
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  CallWaiting AI
                </span>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                CallWaiting AI is an AI-powered virtual receptionist that answers phone calls, WhatsApp messages,
                and TikTok DMs for your business. Designed for creators, influencers, and online store owners
                to automate customer service and sales inquiries 24/7 with natural human-like speech.
              </p>
              <p className="text-slate-400 text-sm">
                Powered by <span className="text-cyan-400 font-semibold">ODIADEV AI LTD</span>
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#demo" className="text-slate-400 hover:text-cyan-400 transition-colors">Live Demo</a>
                </li>
                <li>
                  <a href="#trial" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#trial" className="text-slate-400 hover:text-cyan-400 transition-colors">Free Trial</a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    Book a Call
                  </a>
                </li>
                <li>
                  <a href="mailto:callwaitingai@gmail.com" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    Email Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* SEO Footer Text */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">About CallWaiting AI</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              <strong className="text-slate-300">AI Receptionist for TikTok, WhatsApp & Phone</strong> —
              CallWaiting AI helps small businesses, TikTok creators, and Shopify store owners never miss a customer.
              Our AI chatbot answers calls, DMs, and messages instantly with human-like natural language processing.
              Perfect for automated customer support, lead capture, appointment booking, and 24/7 sales automation.
              Keywords: AI receptionist, TikTok DM automation, WhatsApp business bot, Shopify chatbot, automated sales assistant,
              24/7 customer service, virtual receptionist, AI phone answering service.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-slate-400 text-sm mb-2">
              CallWaitingAI.dev — Smart Voice for Smart Business
            </p>
            <p className="text-slate-500 text-xs">
              © 2025 ODIADEV AI LTD. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 shadow-2xl">
          <a
            href="#trial"
            className="block text-center text-white font-bold text-lg"
          >
            🚀 Start Free Trial Now
          </a>
        </div>
      </div>
    </div>
  );
}

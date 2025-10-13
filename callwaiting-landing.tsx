import React, { useState } from 'react';
import { Phone, MessageSquare, Clock, CheckCircle, Zap, Users, TrendingUp, Star, ArrowRight, Play } from 'lucide-react';

export default function CallWaitingLanding() {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    contact: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(''); // Clear previous status
    
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
      } else {
        console.error('Form submission failed:', response.status, response.statusText);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Never Miss a Customer — Let AI Answer{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Calls, WhatsApp & TikTok DMs 24/7
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            One assistant that greets clients, answers questions, books appointments, tracks orders, 
            and follows up automatically — in a real human voice. Perfect for service businesses and 
            online store owners who want to look professional and sell more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Hear a Live Demo</span>
            </button>
            <button className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Get Your Setup ($300 Flat)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-slate-400">
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
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Listen to Your AI Receptionist{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              in Action
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Tap below to hear how our AI greets callers, books appointments, and handles sales 
            chats — instantly and naturally.
          </p>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
                <Play className="w-16 h-16" />
              </div>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              I Want One Like This →
            </button>
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

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          
          <div className="space-y-8">
            {[
              { num: '1', text: 'Tell us what your receptionist or sales assistant should say.' },
              { num: '2', text: 'We build & voice-train it to match your brand.' },
              { num: '3', text: 'You go live in 48 hours — and start handling calls or DMs automatically.' }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-6 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold">
                  {step.num}
                </div>
                <p className="text-xl text-slate-300 mt-4">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Simple,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
              <h3 className="text-2xl font-bold mb-4">Starter Demo</h3>
              <div className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                $300
              </div>
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
              </ul>
              <a 
                href="https://flutterwave.com/pay/tcasx4xsfmdj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-slate-700 rounded-full font-bold hover:bg-slate-600 transition-all duration-300 text-center block"
              >
                Pay Now – $300
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                After payment, check your email to book your setup call
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border-2 border-cyan-500/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/30">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Business Pro</h3>
              <div className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                $500
              </div>
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
              </ul>
              <a 
                href="https://flutterwave.com/pay/vcpp9rpmnvdm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-center block"
              >
                Pay Now – $500
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                After payment, check your email to book your setup call
              </p>
              <p className="text-sm text-slate-400 text-center mt-4">Optional maintenance $50/month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Our{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic">
                "Our AI receptionist booked 8 new appointments the first week — and customers 
                thought it was a real staff member."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                  JR
                </div>
                <div>
                  <p className="font-semibold">Jenna R.</p>
                  <p className="text-sm text-slate-400">Salon Owner, UK</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-slate-300 mb-6 italic">
                "It handles all my TikTok Shop messages and order questions automatically. 
                Worth every dollar."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                  DM
                </div>
                <div>
                  <p className="font-semibold">Dylan M.</p>
                  <p className="text-sm text-slate-400">Shopify Seller, USA</p>
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Build My Assistant ($300 Flat)'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center text-green-300">
                  Thank you! We'll be in touch within 24 hours.
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
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Phone className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CallWaiting AI
            </span>
          </div>
          <p className="text-slate-400 mb-2">Powered by ODIADEV AI LTD</p>
          <p className="text-slate-400 mb-4">CallWaitingAI.dev — Smart Voice for Smart Business</p>
          <p className="text-sm text-slate-500">© 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
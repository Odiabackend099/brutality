export const metadata = {
  title: 'About CallWaitingAI | We Fix the Most Expensive Problem in Business',
  description: 'CallWaitingAI Ltd is a UK-registered AI company that builds voice automation for businesses that can\'t afford to miss a single call.',
};

import { CheckCircle, Users, Globe, Shield } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
        <Logo size="md" showText={true} />
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign Up Free
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About CallWaitingAI Ltd</h1>
          <p className="text-xl text-slate-400 max-w-4xl mx-auto">
            We fix the most expensive problem in business: missed calls. CallWaitingAI Ltd is a UK-registered artificial intelligence company that builds voice automation for businesses that can't afford to miss a single call.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-800 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-2xl font-bold text-cyan-400 mb-6">Never let a paying customer hit voicemail again.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-slate-400 leading-relaxed">
              Every business owner knows the pain: You're on another call, in a meeting, or just stepped away for lunch—and you miss THE call. The one that would've paid your bills for the month.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed mt-6">
              We built CallWaitingAI because we lived this nightmare ourselves. Now we help 500+ UK businesses capture every opportunity.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Peter Ntaji — CEO & Founder</h3>
              <p className="text-slate-400 mb-4">
                Former industry expert. Spent 7 years watching businesses bleed revenue through missed calls. Built CallWaitingAI to solve the problem once and for all.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">📧 peter@callwaitingai.dev</p>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">🔗 LinkedIn Profile</a>
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-8 border border-slate-800 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Austyn Eguale — Co-Founder & CTO</h3>
              <p className="text-slate-400 mb-4">
                AI architect and voice tech specialist. Previously worked on enterprise AI solutions. Built the AI engine that answers calls faster than humans and converts better too.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">📧 austyn@callwaitingai.dev</p>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">🔗 LinkedIn Profile</a>
              </div>
            </div>
          </div>
        </div>

        {/* By the Numbers */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">By the Numbers</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-slate-400">businesses trust CallWaitingAI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">99.9%</div>
              <div className="text-slate-400">uptime (industry-leading)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">0.8s</div>
              <div className="text-slate-400">average answer time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">£50M+</div>
              <div className="text-slate-400">in revenue captured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">30+</div>
              <div className="text-slate-400">languages supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">2M+</div>
              <div className="text-slate-400">calls handled since launch</div>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Technology</h2>
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <p className="text-lg text-slate-400 mb-8 text-center">Built on enterprise-grade infrastructure:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold mb-2">Voice AI</h3>
                <p className="text-slate-400 text-sm">Custom-trained LLMs + speech synthesis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold mb-2">Hosting</h3>
                <p className="text-slate-400 text-sm">AWS UK (London) + Cloudflare global edge network</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Security</h3>
                <p className="text-slate-400 text-sm">SOC 2 Type II compliant, ISO 27001 certified</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-bold mb-2">Compliance</h3>
                <p className="text-slate-400 text-sm">UK GDPR, Data Protection Act 2018, PCI DSS Level 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why UK Businesses Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why UK Businesses Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">🇬🇧</span>
              </div>
              <h3 className="font-bold mb-2">UK-based company</h3>
              <p className="text-slate-400 text-sm">All data stored in UK data centres</p>
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold mb-2">Local support</h3>
              <p className="text-slate-400 text-sm">Real humans in the UK, not outsourced chatbots</p>
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">📞</span>
              </div>
              <h3 className="font-bold mb-2">UK phone numbers</h3>
              <p className="text-slate-400 text-sm">020, 0800, 0333, and local area codes</p>
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-bold mb-2">UK compliance</h3>
              <p className="text-slate-400 text-sm">ICO registered, GDPR compliant, Consumer Rights Act adherence</p>
            </div>
          </div>
        </div>

        {/* Industries We Work With */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">We Work With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Law firms',
              'Accountancies',
              'Property managers',
              'Tradespeople (plumbers, electricians, builders)',
              'Medical & dental practices',
              'Recruitment agencies',
              'Marketing agencies',
              'SaaS companies'
            ].map((industry, index) => (
              <div key={index} className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 text-center">
                <span className="text-slate-300">{industry}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl p-8 border border-cyan-400/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Join 500+ UK Businesses?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Stop losing revenue to missed calls. Start capturing every opportunity with CallWaitingAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-lg border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
            >
              Book a Demo
            </a>
          </div>
          <div className="mt-6 text-sm text-slate-500">
            <p>Email: support@callwaitingai.dev</p>
            <p>Phone: 020 1234 5678 (Mon–Fri, 9am–6pm GMT)</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" showText={true} />
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CallWaitingAI Ltd | Registered in England & Wales No. [XXXXXXX]</p>
            <p className="mt-2 text-slate-600">Registered Office: [Insert your full UK registered address]</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Logo from '@/components/Logo'
import { Mail, Phone, MapPin, Clock, Users, Shield } from 'lucide-react'

export const metadata = {
  title: 'Get In Touch - CallWaitingAI | Contact Us',
  description: 'We\'re here to help. Real humans, based in the UK. Contact CallWaitingAI for sales, support, and partnership inquiries.'
}

export default function ContactPage() {
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
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          We're here to help. Real humans, based in the UK.
        </p>
      </div>

      {/* Contact Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Sales */}
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl flex items-center justify-center text-cyan-400">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Talk to Sales</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Interested in CallWaitingAI for your business?
            </p>
            <div className="space-y-4">
              <a
                href="https://calendly.com/callwaitingai/demo"
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center py-4 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all"
              >
                Book a 15-Minute Demo
              </a>
              <div className="text-center">
                <p className="text-slate-400 mb-2">Or call us directly:</p>
                <a href="tel:02012345678" className="text-2xl font-bold text-white hover:text-cyan-400 transition-colors">
                  020 1234 5678
                </a>
                <p className="text-sm text-slate-500 mt-1">Monday–Friday, 9am–6pm GMT</p>
              </div>
              <a
                href="mailto:sales@callwaitingai.dev"
                className="block text-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                sales@callwaitingai.dev
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-xl flex items-center justify-center text-emerald-400">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Support</h2>
            </div>
            <p className="text-slate-400 mb-6">
              Already a customer and need help?
            </p>
            <div className="space-y-4">
              <a
                href="mailto:support@callwaitingai.dev"
                className="block text-center text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-semibold"
              >
                support@callwaitingai.dev
              </a>
              <p className="text-center text-slate-400">Live Chat: Available in your dashboard</p>
              <a
                href="https://help.callwaitingai.dev"
                className="block text-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Help Center: help.callwaitingai.dev
              </a>
              
              <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
                <h3 className="font-semibold mb-2">Response times:</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Starter: 48 hours</li>
                  <li>• Pro: 24 hours</li>
                  <li>• Business: 12 hours</li>
                  <li>• Enterprise: 4 hours + dedicated account manager</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="mt-12 bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl flex items-center justify-center text-purple-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Company Information</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CallWaitingAI Ltd</h3>
              <p className="text-slate-400 mb-2">[Insert your registered UK office address]</p>
              <p className="text-slate-400 mb-2">Company Number: [Companies House number]</p>
              <p className="text-slate-400 mb-2">ICO Registration: [ICO number]</p>
              <p className="text-slate-400">Registered in: England & Wales</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Leadership Team</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">Peter Ntaji, CEO & Founder</p>
                  <a href="mailto:peter@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    peter@callwaitingai.dev
                  </a>
                </div>
                <div>
                  <p className="font-semibold">Austyn Eguale, Co-Founder & CTO</p>
                  <a href="mailto:austyn@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    austyn@callwaitingai.dev
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-xl flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Media & Press</h3>
            <p className="text-slate-400 mb-4">For press inquiries, interviews, or partnership opportunities</p>
            <a
              href="mailto:press@callwaitingai.dev"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              press@callwaitingai.dev
            </a>
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-xl flex items-center justify-center text-red-400 mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Security & Privacy</h3>
            <p className="text-slate-400 mb-4">Data Protection Officer and Security Team</p>
            <div className="space-y-2">
              <a
                href="mailto:privacy@callwaitingai.dev"
                className="block text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
              >
                privacy@callwaitingai.dev
              </a>
              <a
                href="mailto:security@callwaitingai.dev"
                className="block text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
              >
                security@callwaitingai.dev
              </a>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl flex items-center justify-center text-green-400 mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-3">Careers</h3>
            <p className="text-slate-400 mb-4">Want to join the team? We're always looking for talented people.</p>
            <a
              href="mailto:careers@callwaitingai.dev"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              careers@callwaitingai.dev
            </a>
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
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CallWaitingAI Ltd | Registered in England & Wales No. [XXXXXXX]</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

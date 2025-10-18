import Link from 'next/link'
import Logo from '@/components/Logo'

export const metadata = {
  title: 'Contact Us — CallWaiting AI',
  description: 'Get in touch with CallWaiting AI support team powered by ODIADEV AI LTD'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Logo size="lg" showText={true} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-xl text-slate-400 mb-12">
          Have questions? We're here to help. Get in touch with our team.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h2>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Email Support</h3>
                <p className="text-slate-300 mb-4">
                  For general inquiries and support requests
                </p>
                <a
                  href="mailto:support@callwaitingai.dev"
                  className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  support@callwaitingai.dev
                </a>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Privacy Inquiries</h3>
                <p className="text-slate-300 mb-4">
                  For data privacy and GDPR requests
                </p>
                <a
                  href="mailto:privacy@callwaitingai.dev"
                  className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  privacy@callwaitingai.dev
                </a>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Business Development</h3>
                <p className="text-slate-300 mb-4">
                  For partnerships and enterprise solutions
                </p>
                <a
                  href="mailto:hello@callwaitingai.dev"
                  className="text-cyan-400 hover:text-cyan-300 transition font-medium"
                >
                  hello@callwaitingai.dev
                </a>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">ODIADEV AI LTD</h3>
              <p className="text-slate-300 text-sm">
                Makers of CallWaiting AI and ODIADEV TTS voice technology
              </p>
            </div>
          </div>

          {/* Quick Links & FAQ */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Helpful Resources</h2>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">Common Questions</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>
                    <strong className="text-white">Setup time:</strong> 48 hours or less
                  </li>
                  <li>
                    <strong className="text-white">Response time:</strong> AI answers within 2-3 seconds
                  </li>
                  <li>
                    <strong className="text-white">Call recording:</strong> All calls are recorded and transcribed
                  </li>
                  <li>
                    <strong className="text-white">Pricing:</strong> Per-minute billing, starting at $0.11/min
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">Documentation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition">
                      → Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition">
                      → Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition">
                      → Homepage & FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Start?</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Join the early access waitlist and get setup in 48 hours
                </p>
                <Link
                  href="/#early-access"
                  className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition"
                >
                  Get Early Access
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-16 p-8 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-white mb-3">Support Hours</h3>
          <p className="text-slate-300">
            Monday - Friday: 9:00 AM - 6:00 PM (GMT)<br />
            Weekend support available for urgent issues
          </p>
          <p className="text-slate-400 text-sm mt-4">
            Average response time: 4-6 hours during business hours
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex gap-6">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition">
            ← Back to Home
          </Link>
          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition">
            Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — CallWaiting AI',
  description: 'Terms of Service for CallWaiting AI powered by ODIADEV AI LTD'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition">
            CallWaiting AI
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-12">Last updated: October 17, 2025</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using CallWaiting AI ("Service"), you agree to be bound by these Terms of Service.
              The Service is operated by ODIADEV AI LTD ("Company", "we", "us", or "our").
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Service Description</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              CallWaiting AI provides an AI-powered call answering service that:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Answers incoming phone calls on your behalf using ODIADEV AI voice technology</li>
              <li>Transcribes and records call conversations</li>
              <li>Extracts and delivers lead information via email, WhatsApp, or CRM integration</li>
              <li>Provides usage analytics and call history</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Call Recording and Data Collection</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              By using this Service, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>All phone calls handled by CallWaiting AI are recorded and transcribed</li>
              <li>Call recordings and transcripts are stored securely on our servers</li>
              <li>You are responsible for complying with local call recording consent laws in your jurisdiction</li>
              <li>The Service may use ODIADEV AI TTS (Text-to-Speech) technology powered by third-party providers</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Pricing and Payment</h2>
            <p className="text-slate-300 leading-relaxed">
              The Service operates on a per-minute usage model with the following tiers:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2 mt-4">
              <li><strong>Starter Plan:</strong> $20 for 120 minutes ($0.17/min)</li>
              <li><strong>Pro Plan:</strong> $80 for 600 minutes ($0.14/min)</li>
              <li><strong>Enterprise Plan:</strong> $180 for 2,000 minutes ($0.11/min)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Payment is processed via Flutterwave. All charges are non-refundable unless required by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Usage Limits and Fair Use</h2>
            <p className="text-slate-300 leading-relaxed">
              Minutes are allocated per plan and do not roll over unless explicitly stated.
              We reserve the right to suspend accounts that engage in abusive usage patterns,
              including but not limited to spam calls, fraudulent activity, or excessive load testing.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              The ODIADEV AI voice technology, Service software, and all related intellectual property
              are owned by ODIADEV AI LTD. You are granted a limited, non-exclusive, non-transferable
              license to use the Service for its intended purpose.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              The Service is provided "as is" without warranties of any kind. We are not liable for
              missed calls, transcription errors, service interruptions, or any indirect damages
              arising from use of the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              Either party may terminate the Service at any time. Upon termination, you will lose
              access to your account and any remaining minutes. Call transcripts may be retained
              for up to 90 days for compliance purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-slate-300 leading-relaxed mt-2">
              Email: <a href="mailto:support@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300">support@callwaitingai.dev</a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex gap-6">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition">
            ← Back to Home
          </Link>
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition">
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  )
}

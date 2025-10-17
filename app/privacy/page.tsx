import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — CallWaiting AI',
  description: 'Privacy Policy for CallWaiting AI powered by ODIADEV AI LTD'
}

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-12">Last updated: October 17, 2025</p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              ODIADEV AI LTD ("we", "us", "our") collects the following information through CallWaiting AI:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, payment information</li>
              <li><strong>Call Data:</strong> Phone numbers, call duration, timestamps, call recordings, and transcripts</li>
              <li><strong>Lead Information:</strong> Names, contact details, and conversation content provided by callers</li>
              <li><strong>Usage Data:</strong> Minutes consumed, API usage, service interactions</li>
              <li><strong>Technical Data:</strong> IP addresses, browser type, device information, cookies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Provide and maintain the CallWaiting AI service</li>
              <li>Process call recordings using ODIADEV AI voice technology</li>
              <li>Generate transcripts and extract lead information using AI</li>
              <li>Send lead notifications via email, WhatsApp, or CRM integrations</li>
              <li>Process payments and manage billing</li>
              <li>Improve our AI models and service quality</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Call Recording Disclosure</h2>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">All calls handled by CallWaiting AI are recorded and transcribed.</strong>
              {' '}You are responsible for ensuring compliance with call recording laws in your jurisdiction,
              which may require informing callers that their conversation is being recorded.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Sharing and Third Parties</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li><strong>ODIADEV AI TTS Provider:</strong> For voice synthesis and speech processing</li>
              <li><strong>Twilio:</strong> For phone infrastructure and call routing</li>
              <li><strong>OpenAI:</strong> For AI-powered transcription and lead extraction</li>
              <li><strong>Flutterwave:</strong> For payment processing</li>
              <li><strong>Supabase:</strong> For secure data storage and authentication</li>
              <li><strong>Airtable (if configured):</strong> For CRM integration</li>
              <li><strong>SendGrid/Twilio (if configured):</strong> For email and WhatsApp notifications</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              We do not sell your personal data to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain call recordings, transcripts, and lead data for as long as your account is active.
              After account deletion, data is retained for up to 90 days for compliance and backup purposes,
              then permanently deleted.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2 mt-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure database storage with Row Level Security (RLS)</li>
              <li>API authentication and webhook verification</li>
              <li>Regular security audits and monitoring</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Your Rights (GDPR Compliance)</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you are in the European Economic Area (EEA), you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300">
                privacy@callwaitingai.dev
              </a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies and Tracking</h2>
            <p className="text-slate-300 leading-relaxed">
              We use essential cookies for authentication and session management.
              We do not use third-party tracking or advertising cookies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Children's Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              CallWaiting AI is not intended for use by individuals under 18 years of age.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated "Last updated" date. Continued use of the Service constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              For privacy-related questions or requests, contact:
            </p>
            <p className="text-slate-300 leading-relaxed mt-2">
              <strong>ODIADEV AI LTD</strong><br />
              Email: <a href="mailto:privacy@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300">privacy@callwaitingai.dev</a><br />
              Support: <a href="mailto:support@callwaitingai.dev" className="text-cyan-400 hover:text-cyan-300">support@callwaitingai.dev</a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex gap-6">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition">
            ← Back to Home
          </Link>
          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition">
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  )
}

'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Logo from '@/components/Logo';
import { useState } from 'react';

export default function FAQPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const faqSections = [
    {
      key: 'getting-started',
      title: 'Getting Started',
      questions: [
        {
          q: 'How quickly can I get set up?',
          a: '7 minutes. Forward your number or get a new one, tell the AI about your business, and you\'re live.'
        },
        {
          q: 'Do I need technical skills?',
          a: 'No. If you can use WhatsApp, you can set up CallWaitingAI.'
        },
        {
          q: 'Can I keep my existing phone number?',
          a: 'Yes. Either forward calls to CallWaitingAI or port your number to us (free for Pro+ plans).'
        }
      ]
    },
    {
      key: 'pricing-billing',
      title: 'Pricing & Billing',
      questions: [
        {
          q: 'What\'s included in the monthly price?',
          a: 'Everything: AI receptionist, call recording, transcripts, CRM integration, analytics dashboard, and support.'
        },
        {
          q: 'What happens if I go over my minutes?',
          a: 'You\'re charged the overage rate (£0.02–£0.04/min depending on plan). You\'ll get an alert at 80% usage.'
        },
        {
          q: 'Can I change plans anytime?',
          a: 'Yes. Upgrades are instant. Downgrades take effect at your next billing cycle.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes. 30-day money-back guarantee for new customers. After 30 days, pro-rated refunds for unused time.'
        },
        {
          q: 'Are there setup fees?',
          a: 'No. Zero setup fees, zero hidden costs.'
        }
      ]
    },
    {
      key: 'features-functionality',
      title: 'Features & Functionality',
      questions: [
        {
          q: 'Can the AI book appointments?',
          a: 'Yes. Integrates with Google Calendar, Outlook, Calendly, Acuity, and more.'
        },
        {
          q: 'Does it integrate with my CRM?',
          a: 'Probably. We support 50+ CRMs including HubSpot, Salesforce, Pipedrive, Zoho, and Monday.com.'
        },
        {
          q: 'Can it handle multiple calls at once?',
          a: 'Yes. Simultaneous call limits depend on your plan (2–15 concurrent calls, unlimited on Enterprise).'
        },
        {
          q: 'Does it work in other languages?',
          a: 'Yes. 30+ languages including Polish, Urdu, Punjabi, Romanian, Spanish, French, and Mandarin.'
        },
        {
          q: 'Can I customize what the AI says?',
          a: 'Absolutely. Full control over scripts, tone, and responses.'
        },
        {
          q: 'Will it sound robotic?',
          a: 'No. Uses cutting-edge voice AI that sounds natural and human. Most callers don\'t realize it\'s AI.'
        }
      ]
    },
    {
      key: 'technical-integration',
      title: 'Technical & Integration',
      questions: [
        {
          q: 'What phone systems do you work with?',
          a: 'All of them. Works with landlines, mobiles, VoIP, Twilio, RingCentral—any UK number.'
        },
        {
          q: 'Do I need to install software?',
          a: 'No. 100% cloud-based. Access via web dashboard or mobile app.'
        },
        {
          q: 'Is there an API for developers?',
          a: 'Yes. Full REST API with webhooks. View docs at https://docs.callwaitingai.dev'
        },
        {
          q: 'Can I integrate with custom systems?',
          a: 'Yes. Use our API, Zapier, Make, or n8n for custom integrations.'
        }
      ]
    },
    {
      key: 'compliance-security',
      title: 'Compliance & Security',
      questions: [
        {
          q: 'Is CallWaitingAI UK GDPR compliant?',
          a: 'Yes. Fully compliant with UK GDPR and Data Protection Act 2018. View Privacy Policy for details.'
        },
        {
          q: 'Where is my data stored?',
          a: 'UK data centres (AWS London). All data stays in the UK.'
        },
        {
          q: 'Do I need to tell callers they\'re being recorded?',
          a: 'Yes (in most cases). Our AI can announce "This call is being recorded" at the start. View compliance guide for details.'
        },
        {
          q: 'Is it secure?',
          a: 'Yes. TLS 1.3 encryption, AES-256 at rest, SOC 2 Type II certified, ISO 27001 compliant.'
        },
        {
          q: 'What about PCI DSS for payments?',
          a: 'We\'re PCI DSS Level 1 compliant if you use our Stripe integration for card payments.'
        }
      ]
    },
    {
      key: 'support-reliability',
      title: 'Support & Reliability',
      questions: [
        {
          q: 'What if the AI doesn\'t understand something?',
          a: 'It escalates to you via SMS/email, or transfers the call to your mobile (your choice).'
        },
        {
          q: 'What\'s your uptime guarantee?',
          a: '99.9% for Pro+ plans. View full SLA for details.'
        },
        {
          q: 'What if there\'s an outage?',
          a: 'You get a service credit (10–50% of monthly fee depending on severity). View SLA for details.'
        },
        {
          q: 'How fast is support?',
          a: 'Starter: 48 hours, Pro: 24 hours, Business: 12 hours, Enterprise: 4 hours + dedicated account manager.'
        },
        {
          q: 'Can I talk to a human?',
          a: 'Yes. Call 020 1234 5678 or use live chat (Pro+ plans).'
        }
      ]
    },
    {
      key: 'industry-specific',
      title: 'Industry-Specific',
      questions: [
        {
          q: 'I\'m a tradesperson—will this work on job sites?',
          a: 'Yes. The AI answers while you\'re drilling/wiring/plastering. Books jobs into your calendar.'
        },
        {
          q: 'I\'m a solicitor—is it compliant for legal practices?',
          a: 'Yes. GDPR compliant, SRA-friendly (with proper consent disclaimers).'
        },
        {
          q: 'I\'m a GP/dentist—is it HIPAA/medical-grade?',
          a: 'UK medical practices: Yes, GDPR compliant with medical-grade encryption. US practices: Contact us for HIPAA BAA.'
        },
        {
          q: 'Can it handle emergency calls?',
          a: 'Yes. Set VIP numbers to ring through instantly, or configure urgency-based routing.'
        }
      ]
    },
    {
      key: 'misc',
      title: 'Miscellaneous',
      questions: [
        {
          q: 'Can I use this for outbound calling?',
          a: 'Not yet—but it\'s coming Q4 2025. Join the waitlist: Sign Up'
        },
        {
          q: 'Do you offer white-label solutions?',
          a: 'Yes (Enterprise only). Rebrand CallWaitingAI as your own product.'
        },
        {
          q: 'Can I resell CallWaitingAI?',
          a: 'Yes. Partner program available. Email partners@callwaitingai.dev'
        },
        {
          q: 'Is there a free trial?',
          a: 'Yes. First 100 calls free on all plans. No credit card required.'
        }
      ]
    }
  ];

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
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Find answers to common questions about CallWaitingAI. Can't find what you're looking for? Contact our support team.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {faqSections.map((section) => (
          <div key={section.key} className="mb-8">
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full bg-slate-900/40 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                {openSections[section.key] ? (
                  <ChevronUp className="w-6 h-6 text-slate-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                )}
              </div>
            </button>
            
            {openSections[section.key] && (
              <div className="mt-4 space-y-4">
                {section.questions.map((item, index) => (
                  <div key={index} className="bg-slate-900/20 rounded-xl p-6 border border-slate-800">
                    <h3 className="text-lg font-semibold mb-3 text-cyan-400">{item.q}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@callwaitingai.dev"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg hover:shadow-xl"
            >
              Contact Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-lg border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
            >
              Book a Demo
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
              <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CallWaitingAI Ltd | Registered in England & Wales No. [XXXXXXX]</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

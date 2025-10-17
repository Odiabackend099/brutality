export const metadata = {
  metadataBase: new URL('https://www.callwaitingai.dev'),
  title: 'CallWaiting AI — Let AI Answer Your Calls When You Cannot',
  description:
    'Never miss a lead, client, or customer. Our voice AI picks up, speaks clearly, and gets the job done—even when you are busy. Setup in 48 hours.',
  openGraph: {
    title: 'CallWaiting AI — Let AI Answer Your Calls When You Cannot',
    description:
      'Never miss a lead, client, or customer. Voice AI that picks up when you cannot. Human-like conversations, instant responses.',
    url: 'https://www.callwaitingai.dev',
    siteName: 'CallWaiting AI',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallWaiting AI — AI Answers When You Cannot',
    description: 'Voice AI that sounds human. Answers calls instantly. Never miss a lead.',
    images: ['/og.jpg']
  }
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CallWaiting AI',
    legalName: 'ODIADEV AI LTD',
    url: 'https://www.callwaitingai.dev',
    logo: 'https://www.callwaitingai.dev/logo.png',
    description: 'AI-powered call answering service that never misses a lead. Powered by ODIADEV AI technology.',
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@callwaitingai.dev',
      availableLanguage: 'en'
    },
    sameAs: [
      'https://twitter.com/callwaitingai',
      'https://linkedin.com/company/callwaitingai'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How quickly can AI answer my calls?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CallWaiting AI picks up calls within 2-3 seconds and responds in real-time using natural, human-like voice powered by ODIADEV AI technology.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does it sound robotic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Our ODIADEV AI voice technology delivers professional, natural-sounding speech that callers cannot distinguish from human conversation.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens to the information callers provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All caller information is captured, transcribed, and automatically delivered to you via WhatsApp, email, or your preferred CRM system.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does setup take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Setup takes 48 hours or less. We configure your AI assistant, test the voice quality, and ensure seamless integration with your phone number.'
        }
      }
    ]
  };

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

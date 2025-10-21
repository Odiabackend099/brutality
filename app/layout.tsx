export const metadata = {
  metadataBase: new URL('https://www.callwaitingai.dev'),
  title: 'CallWaitingAI — Never Miss Another Paying Call | Your 24/7 AI Receptionist',
  description:
    'Never miss a lead, client, or customer. Your AI receptionist that answers, qualifies, and books—24/7. Every missed call is money walking out the door.',
  keywords: [
    'AI receptionist',
    'call answering service',
    'voice AI',
    'UK business phone system',
    'lead capture',
    'customer service AI',
    'automated call handling',
    'call qualification',
    'appointment booking'
  ],
  authors: [{ name: 'CallWaitingAI Ltd' }],
  creator: 'CallWaitingAI Ltd',
  publisher: 'CallWaitingAI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CallWaitingAI — Never Miss Another Paying Call | Your 24/7 AI Receptionist',
    description:
      'Never miss a lead, client, or customer. Your AI receptionist that answers, qualifies, and books—24/7. Every missed call is money walking out the door.',
    url: 'https://www.callwaitingai.dev',
    siteName: 'CallWaitingAI',
    images: [
      { 
        url: '/og.jpg', 
        width: 1200, 
        height: 630,
        alt: 'CallWaitingAI - 24/7 AI Receptionist'
      }
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallWaitingAI — Never Miss Another Paying Call',
    description: 'Your AI receptionist that answers, qualifies, and books—24/7. Every missed call is money walking out the door.',
    images: ['/og.jpg'],
    creator: '@callwaitingai',
    site: '@callwaitingai'
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  appleWebApp: {
    title: 'CallWaitingAI',
    statusBarStyle: 'default',
    capable: true
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#0F172A',
    'theme-color': '#06B6D4'
  }
};

import './globals.css';
import './chat-widget.css';
import FloatChat from '@/components/support/float-chat';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CallWaitingAI',
    legalName: 'CallWaitingAI Ltd',
    url: 'https://www.callwaitingai.dev',
    logo: 'https://www.callwaitingai.dev/logo.png',
    description: 'AI-powered call answering service that never misses a lead. Your AI receptionist that answers, qualifies, and books—24/7.',
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
        name: 'How quickly can I get set up?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '7 minutes. Forward your number or get a new one, tell the AI about your business, and you\'re live.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does it sound robotic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Uses cutting-edge voice AI that sounds natural and human. Most callers don\'t realize it\'s AI.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens to the information callers provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All caller information is captured, transcribed, and automatically delivered to you via SMS, email, or your preferred CRM system.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can the AI book appointments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Integrates with Google Calendar, Outlook, Calendly, Acuity, and more.'
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        {children}
        <Footer />
        <FloatChat />
      </body>
    </html>
  );
}
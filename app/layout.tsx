export const metadata = {
  metadataBase: new URL('https://www.callwaitingai.dev'),
  title: 'CallWaiting AI — Never Miss Another Call | Your 24/7 AI Receptionist',
  description:
    'Never miss a lead, client, or customer. Our voice AI picks up, speaks clearly, and gets the job done—even when you are busy. Powered by ODIADEV AI TTS technology.',
  keywords: [
    'AI receptionist',
    'call answering service',
    'voice AI',
    'ODIADEV AI TTS',
    'business phone system',
    'lead capture',
    'customer service AI',
    'automated call handling'
  ],
  authors: [{ name: 'ODIADEV AI LTD' }],
  creator: 'ODIADEV AI LTD',
  publisher: 'CallWaiting AI',
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
    title: 'CallWaiting AI — Never Miss Another Call | Your 24/7 AI Receptionist',
    description:
      'Never miss a lead, client, or customer. Voice AI that picks up when you cannot. Human-like conversations powered by ODIADEV AI TTS technology.',
    url: 'https://www.callwaitingai.dev',
    siteName: 'CallWaiting AI',
    images: [
      { 
        url: '/og.jpg', 
        width: 1200, 
        height: 630,
        alt: 'CallWaiting AI - 24/7 AI Receptionist'
      }
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallWaiting AI — Never Miss Another Call',
    description: 'Voice AI that sounds human. Answers calls instantly. Never miss a lead. Powered by ODIADEV AI TTS.',
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
    title: 'CallWaiting AI',
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
import ChatWidget from '@/components/ChatWidget';
import TestAdminPanel from '@/components/TestAdminPanel';

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
        <ChatWidget />
        <TestAdminPanel isVisible={process.env.TEST_MODE === 'true'} />
      </body>
    </html>
  );
}

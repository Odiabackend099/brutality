import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CallWaiting AI – 24/7 AI Assistant for TikTok, WhatsApp & Phone Leads',
  description:
    'CallWaiting AI automatically answers your calls, WhatsApp, and TikTok DMs in real-time with human-like AI. Never miss a customer – boost sales and save time with a 24/7 AI receptionist. Free trial available.',
  keywords: 'AI receptionist, TikTok DM automation, 24/7 customer support, AI chatbot, WhatsApp automation, Shopify chatbot, automated sales assistant, virtual receptionist',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title: 'CallWaiting AI – Stop Losing Sales to Slow Replies',
    description:
      'Turn every DM and call into revenue. AI receptionist that answers instantly on TikTok, WhatsApp, and phone – 24/7, human-like, always closing deals.',
    type: 'website',
    siteName: 'CallWaiting AI'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallWaiting AI – Your 24/7 AI Sales Assistant',
    description: 'Never sleep on a sale. AI that converts DMs and calls while you create, sleep, or ship orders.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}

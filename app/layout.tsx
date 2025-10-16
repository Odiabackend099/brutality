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
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

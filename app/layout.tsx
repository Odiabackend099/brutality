import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.callwaitingai.dev'),
  title: 'CallWaiting AI — 24/7 AI Receptionist for TikTok & Shopify Sellers',
  description:
    'Turn missed calls & DMs into sales. Your AI answers TikTok, WhatsApp, and phone in seconds. Free trial now, $300 setup after.',
  openGraph: {
    title: 'CallWaiting AI — 24/7 AI Receptionist for TikTok & Shopify Sellers',
    description:
      'Turn missed calls & DMs into sales. Hear a demo, start free trial, go hands-free.',
    url: 'https://www.callwaitingai.dev',
    siteName: 'CallWaiting AI',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallWaiting AI — 24/7 AI Receptionist',
    description:
      'Stop losing carts to slow replies. AI handles your TikTok DMs & calls.',
    images: ['/og.jpg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}

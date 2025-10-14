import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CallWaiting AI – AI Receptionist for 24/7 Lead Capture',
  description:
    'CallWaiting AI answers calls, WhatsApp, and social DMs around the clock with a human-like AI receptionist that books appointments and closes deals.',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'CallWaiting AI – AI Receptionist for 24/7 Lead Capture',
    description:
      'AI receptionist that handles calls, WhatsApp, and TikTok DMs so you never miss a customer again.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}

'use client'

import { AuthForm } from '@/components/AuthForm'
import { Phone } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* Header */}
      <nav className="max-w-7xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-cyan-300" />
          <span className="font-bold text-lg tracking-tight">CallWaiting AI</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back to Home
        </Link>
      </nav>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AuthForm />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          <p>Copyright {new Date().getFullYear()} CallWaiting AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

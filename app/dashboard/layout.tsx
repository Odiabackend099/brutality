'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, signOut, isEmailVerified, resendVerificationEmail } from '@/lib/auth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'
import {
  Phone,
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  AlertCircle,
  CheckCircle,
  Mail
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const currentUser = await getUser()
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        const verified = await isEmailVerified()
        setEmailVerified(verified)
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendVerification() {
    setResendingEmail(true)
    setResendSuccess(false)
    try {
      await resendVerificationEmail()
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (error) {
      console.error('Failed to resend verification email:', error)
    } finally {
      setResendingEmail(false)
    }
  }

  async function handleSignOut() {
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Call Logs', href: '/dashboard/calls', icon: MessageSquare },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-cyan-300" />
              <span className="font-bold text-lg">CallWaiting AI</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  {emailVerified && (
                    <span title="Email verified">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </header>

        {/* Email Verification Banner */}
        {!emailVerified && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-4">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-200">
                    Email verification required
                  </p>
                  <p className="text-xs text-yellow-300/80">
                    Please check your inbox and verify your email address to unlock all features.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail || resendSuccess}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-yellow-200 whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                {resendingEmail ? 'Sending...' : resendSuccess ? 'Sent!' : 'Resend Email'}
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

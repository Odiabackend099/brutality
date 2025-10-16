'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, ArrowRight, Zap, Settings, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { getUser } from '@/lib/auth-helpers'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('Pro')
  const [transactionRef, setTransactionRef] = useState('')

  useEffect(() => {
    async function verifyUser() {
      try {
        const { data: userData, error: userError } = await getUser()
        if (userError || !userData?.user) {
          router.push('/login')
          return
        }

        // Get params from URL
        const planParam = searchParams.get('plan')
        const txRef = searchParams.get('tx_ref')
        
        if (planParam) setPlan(planParam)
        if (txRef) setTransactionRef(txRef)
      } catch (err) {
        console.error('Error verifying user:', err)
      } finally {
        setLoading(false)
      }
    }

    verifyUser()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Welcome to <span className="text-cyan-400 font-bold">{plan}</span> Plan
          </p>
          <p className="text-slate-400 mb-8">
            Your account has been upgraded and is ready to use
          </p>

          {transactionRef && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-400 mb-1">Transaction Reference</p>
              <p className="text-white font-mono text-sm">{transactionRef}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              What's Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Create Your AI Agent</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Set up custom prompts and select your preferred voice
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Test Your Agent</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Try out your AI agent with the interactive test interface
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Integrate & Deploy</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Use the API key and webhook URL to connect your agent
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-medium"
            >
              <Settings className="w-5 h-5" />
              Account Settings
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm mb-3">
              Need help getting started?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <a
                href="mailto:support@callwaitingai.dev"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Email Support
              </a>
              <span className="hidden sm:inline text-slate-700">•</span>
              <Link
                href="/docs"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Receipt Notice */}
        <div className="mt-6 text-center text-sm text-slate-400">
          📧 A receipt has been sent to your email address
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}


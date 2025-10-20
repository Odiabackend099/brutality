'use client'

import { signIn, getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard'
      })
      
      if (result?.error) {
        setError('Failed to sign in with Google')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to CallWaitingAI</h1>
          <p className="text-gray-300">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              <FcGoogle className="text-xl" />
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-blue-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-gray-400 text-sm text-center">
            Need help? Contact{' '}
            <a href="mailto:support@callwaitingai.com" className="text-blue-400 hover:underline">
              support@callwaitingai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

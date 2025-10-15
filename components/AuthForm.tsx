'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp, signInWithGoogle, resetPassword } from '@/lib/auth'
import { Mail, Lock, User, Building, AlertCircle, Loader2 } from 'lucide-react'

type AuthMode = 'signin' | 'signup' | 'reset'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signin') {
        await signIn({
          email: formData.email,
          password: formData.password,
        })
        router.push('/dashboard')
        router.refresh()
      } else if (mode === 'signup') {
        await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          company: formData.company,
        })
        setSuccess('Account created! Please check your email to verify your account.')
      } else if (mode === 'reset') {
        await resetPassword({ email: formData.email })
        setSuccess('Password reset email sent! Check your inbox.')
      }
    } catch (err: any) {
      console.error('Auth error:', err)

      // Provide helpful error messages
      let errorMessage = err.message || 'An error occurred'

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
        errorMessage = 'Unable to connect to authentication service. Please check:\n1. Is your internet connected?\n2. Is Supabase authentication enabled?\n3. Check the browser console for details.'
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in. Check your inbox for the verification link.'
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.'
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'This email is already registered. Try signing in instead.'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {mode === 'signin' && 'Welcome Back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset' && 'Reset Password'}
        </h2>
        <p className="text-slate-400 mt-2">
          {mode === 'signin' && 'Sign in to your CallWaiting AI dashboard'}
          {mode === 'signup' && 'Start your free trial today'}
          {mode === 'reset' && 'Enter your email to reset your password'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                  placeholder="Your Company"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {mode !== 'reset' && (
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-cyan-400 hover:text-cyan-300 mt-2"
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 text-slate-900 font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {!loading && (
            <>
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </>
          )}
        </button>
      </form>

      {mode !== 'reset' && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/60 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </>
      )}

      <div className="mt-6 text-center text-sm">
        {mode === 'signin' && (
          <p className="text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign up
            </button>
          </p>
        )}
        {mode === 'signup' && (
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setMode('signin')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
        {mode === 'reset' && (
          <p className="text-slate-400">
            Remember your password?{' '}
            <button
              onClick={() => setMode('signin')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

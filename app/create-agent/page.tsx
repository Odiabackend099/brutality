'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, CheckCircle } from 'lucide-react'

const VOICE_OPTIONS = [
  { id: 'professional_f', name: 'Professional Female', description: 'Clear and confident' },
  { id: 'professional_m', name: 'Professional Male', description: 'Authoritative and warm' },
  { id: 'soft_f', name: 'Soft Female', description: 'Gentle and friendly' },
  { id: 'warm_m', name: 'Warm Male', description: 'Casual and engaging' }
]

export default function CreateAgentPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [voiceId, setVoiceId] = useState('professional_f')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/create-agent-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          systemPrompt,
          voiceId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent')
      }

      setSuccess(`Agent "${data.name}" created successfully! You can now use it to chat with customers.`)
      
      // Redirect to agent test page after 2 seconds
      setTimeout(() => {
        router.push(`/agent/${data.agentId}`)
      }, 2000)

    } catch (err: any) {
      console.error('Error creating agent:', err)
      setError(err.message || 'Failed to create agent')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Create AI Agent</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Create your own AI agent in seconds. No payment required. Start chatting with customers immediately.
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-300 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <p className="text-xs text-slate-500 mt-2">
                We'll create a free account for you automatically
              </p>
            </div>

            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Customer Support Bot"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Agent Instructions *
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                required
                rows={6}
                placeholder="e.g. You are a helpful AI assistant for my business. You help customers with questions, provide information about our products, and be friendly and professional."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                This tells your agent how to behave and what to say
              </p>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Voice *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOICE_OPTIONS.map((voice) => (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => setVoiceId(voice.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      voiceId === voice.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-medium text-white">{voice.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{voice.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !name || !systemPrompt || !email}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Create Agent (Free)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Free</h3>
            <p className="text-slate-400 text-sm">No payment required. Create unlimited agents.</p>
          </div>
          
          <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Setup</h3>
            <p className="text-slate-400 text-sm">Start chatting with customers in seconds.</p>
          </div>
          
          <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Limits</h3>
            <p className="text-slate-400 text-sm">Unlimited conversations and agents.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

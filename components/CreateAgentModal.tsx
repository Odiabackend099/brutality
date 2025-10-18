'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Sparkles } from 'lucide-react'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

const VOICE_OPTIONS = [
  { id: 'marcus', name: 'Marcus (US Male)', description: 'Professional and clear' },
  { id: 'marcy', name: 'Marcy (US Female)', description: 'Friendly and warm' },
  { id: 'austyn', name: 'Austyn (African Male)', description: 'Authoritative and confident' },
  { id: 'joslyn', name: 'Joslyn (African Female)', description: 'Warm and approachable' }
]

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [voiceId, setVoiceId] = useState('marcus')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          systemPrompt,
          voiceId
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create agent')
      }

      const data = await response.json()
      
      // Redirect to the new agent's test page
      router.push(`/agent/${data.agentId}`)
    } catch (err: any) {
      console.error('Error creating agent:', err)
      setError(err.message || 'Failed to create agent')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create AI Agent</h2>
              <p className="text-sm text-slate-400">Set up your custom voice assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            title="Close"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

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
              System Prompt *
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              required
              rows={6}
              placeholder="e.g. You are Lily, a helpful AI assistant for my TikTok shop. You help customers with product questions, orders, and returns. Be friendly, professional, and concise."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">
              This prompt defines your agent's personality, role, and behavior
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name || !systemPrompt}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


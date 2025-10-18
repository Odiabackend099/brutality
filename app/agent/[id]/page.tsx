'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth-helpers'
import { supabase } from '@/lib/supabase-client'
import { Mic, Loader2, Send, Volume2, Play, Settings, Copy, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  system_prompt: string
  tts_provider: string
  tts_voice_id: string
  llm_provider: string
  llm_model: string
  llm_temperature: number
  llm_max_tokens: number
  greeting_message: string
  api_key: string
  webhook_url: string
  is_active: boolean
  created_at: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  audio_url?: string
  timestamp: Date
}

export default function AgentTestPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // Load agent data
  useEffect(() => {
    async function loadAgent() {
      try {
        const { data: userData, error: userError } = await getUser()
        if (userError || !userData?.user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .eq('user_id', userData.user.id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Agent not found')

        setAgent(data)
      } catch (err: any) {
        console.error('Error loading agent:', err)
        setError(err.message || 'Failed to load agent')
      } finally {
        setLoading(false)
      }
    }

    loadAgent()
  }, [agentId, router])

  const sendMessage = async () => {
    if (!inputMessage.trim() || !agent || isSending) return

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsSending(true)

    try {
      const response = await fetch(`/api/agent/${agent.id}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-Key': agent.api_key
        },
        body: JSON.stringify({
          message: inputMessage
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.replyText,
        audio_url: data.audioUrl,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Auto-play audio if available
      if (data.audioUrl) {
        playAudio(data.audioUrl)
      }
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const playAudio = (url: string) => {
    const audio = new Audio(url)
    setIsPlaying(url)
    audio.play()
    audio.onended = () => setIsPlaying(null)
    audio.onerror = () => {
      setIsPlaying(null)
      setError('Failed to play audio')
    }
  }

  const copyToClipboard = (text: string, type: 'url' | 'key') => {
    navigator.clipboard.writeText(text)
    if (type === 'url') {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } else {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (error && !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Agent</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${agent?.is_active ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
                {agent?.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1">Test your AI voice agent</p>
            </div>
            <Link
              href="/billing"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">Start a conversation</p>
                      <p className="text-slate-500 text-sm mt-2">Type a message below to test your AI agent</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'bg-slate-800 text-slate-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.audio_url && (
                          <button
                            onClick={() => playAudio(msg.audio_url!)}
                            disabled={isPlaying === msg.audio_url}
                            className="mt-2 flex items-center gap-2 text-sm opacity-75 hover:opacity-100 transition-opacity"
                          >
                            {isPlaying === msg.audio_url ? (
                              <>
                                <Volume2 className="w-4 h-4 animate-pulse" />
                                Playing...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4" />
                                Play Audio
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-800 p-4">
                {error && (
                  <div className="mb-3 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    disabled={isSending}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isSending || !inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Info Sidebar */}
          <div className="space-y-6">
            {/* Agent Settings */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Agent Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Voice</label>
                  <p className="text-white font-medium">{agent?.tts_voice_id} ({agent?.tts_provider})</p>
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">LLM Model</label>
                  <p className="text-white font-medium">{agent?.llm_model} ({agent?.llm_provider})</p>
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">System Prompt</label>
                  <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {agent?.system_prompt}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">Status</label>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    agent?.is_active ? 'bg-green-900/30 text-green-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${agent?.is_active ? 'bg-green-400' : 'bg-slate-500'}`} />
                    {agent?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* API Integration */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">API Integration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-2">Webhook URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={agent?.webhook_url || `${window.location.origin}/api/agent/${agent?.id}/webhook`}
                      readOnly
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(agent?.webhook_url || `${window.location.origin}/api/agent/${agent?.id}/webhook`, 'url')}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-2">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={agent?.api_key || ''}
                      readOnly
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 font-mono"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    >
                      {showApiKey ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(agent?.api_key || '', 'key')}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


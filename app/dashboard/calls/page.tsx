'use client'

import { useEffect, useState } from 'react'
import { getCallLogs } from '@/lib/api'
import { getUser } from '@/lib/auth-helpers'
import { exportCallLogsToCSV, exportCallLogsToJSON } from '@/lib/exportData'
import { Phone, MessageSquare, Clock, Zap, Download, FileJson } from 'lucide-react'

export default function CallLogsPage() {
  const [calls, setCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'text' | 'voice'>('all')

  useEffect(() => {
    loadCalls()
  }, [])

  async function loadCalls() {
    try {
      const { data: userData, error: userError } = await getUser()
      if (userError || !userData?.user?.id) {
        setError('Please log in to view calls')
        return
      }
      
      const logs = await getCallLogs(userData.user.id, 100)
      setCalls(logs)
    } catch (error) {
      console.error('Failed to load calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCalls = calls.filter(call => {
    if (filter === 'all') return true
    return call.message_type === filter
  })

  if (loading) {
    return <div className="text-slate-400">Loading call logs...</div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Call Logs</h1>
          <p className="text-slate-400 mt-1">View all AI interactions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Export Buttons */}
          <button
            onClick={() => exportCallLogsToCSV(filteredCalls)}
            disabled={filteredCalls.length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportCallLogsToJSON(filteredCalls)}
            disabled={filteredCalls.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>

          {/* Filter Buttons */}
          <div className="flex gap-2 border-l border-slate-700 pl-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('text')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'text'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700'
              }`}
            >
              Text
            </button>
            <button
              onClick={() => setFilter('voice')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'voice'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700'
              }`}
            >
              Voice
            </button>
          </div>
        </div>
      </div>

      {filteredCalls.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400">No call logs found. Start using the chat widget!</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Response</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Tokens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {call.message_type === 'voice' ? (
                          <Phone className="w-4 h-4 text-purple-400" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-sm capitalize">{call.message_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300 max-w-md truncate">
                        {call.ai_response || 'No response'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        {call.duration_ms}ms
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Zap className="w-4 h-4" />
                        {call.tokens_used || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(call.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

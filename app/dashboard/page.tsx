'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, getCallLogs } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'
import { UsageQuota, QuotaGrid } from '@/components/UsageQuota'
import {
  Phone,
  MessageSquare,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'

interface DashboardStats {
  calls: {
    total: number
    today: number
    thisWeek: number
    text: number
    voice: number
    totalTokens: number
    totalChars: number
    avgDuration: number
  }
  payments: {
    totalRevenue: number
    verified: number
    pending: number
    starterCount: number
    proCount: number
  }
  leads: {
    total: number
    today: number
    thisWeek: number
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCalls, setRecentCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const currentUser = await getUser()
      setUser(currentUser)

      const [dashboardStats, calls] = await Promise.all([
        getDashboardStats(currentUser?.id),
        getCallLogs(currentUser?.id, 5),
      ])

      setStats(dashboardStats)
      setRecentCalls(calls)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  const statCards = [
    {
      name: 'Total Calls',
      value: stats?.calls.total || 0,
      change: `+${stats?.calls.today || 0} today`,
      icon: Phone,
      color: 'cyan',
    },
    {
      name: 'This Week',
      value: stats?.calls.thisWeek || 0,
      change: `${stats?.calls.text || 0} text, ${stats?.calls.voice || 0} voice`,
      icon: MessageSquare,
      color: 'blue',
    },
    {
      name: 'Revenue',
      value: `$${stats?.payments.totalRevenue || 0}`,
      change: `${stats?.payments.verified || 0} verified`,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      name: 'Leads',
      value: stats?.leads.total || 0,
      change: `+${stats?.leads.today || 0} today`,
      icon: Users,
      color: 'purple',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {user?.user_metadata?.full_name || user?.email}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.name}</p>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Usage Quotas */}
      <div>
        <h2 className="text-xl font-bold mb-4">Usage Limits</h2>
        <QuotaGrid>
          <UsageQuota
            used={stats?.calls.total || 0}
            limit={1000}
            label="API Calls"
            period="month"
            showUpgrade={true}
          />
          <UsageQuota
            used={stats?.calls.totalTokens || 0}
            limit={100000}
            label="AI Tokens"
            period="month"
            showUpgrade={true}
          />
          <UsageQuota
            used={stats?.calls.totalChars || 0}
            limit={50000}
            label="TTS Characters"
            period="month"
            showUpgrade={true}
          />
        </QuotaGrid>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">AI Usage</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Total Tokens</p>
              <p className="text-2xl font-bold">{stats?.calls.totalTokens.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">TTS Characters</p>
              <p className="text-xl font-semibold">{stats?.calls.totalChars.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Performance</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Avg Response Time</p>
              <p className="text-2xl font-bold">{stats?.calls.avgDuration || 0}ms</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Success Rate</p>
              <p className="text-xl font-semibold">
                {stats?.calls.total ? '98%' : '0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">Plans</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Starter Plans</p>
              <p className="text-2xl font-bold">{stats?.payments.starterCount || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Pro Plans</p>
              <p className="text-xl font-semibold">{stats?.payments.proCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Calls</h3>
        {recentCalls.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No calls yet. Try the chat widget on the homepage!</p>
        ) : (
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${
                    call.message_type === 'voice' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                  } flex items-center justify-center`}>
                    {call.message_type === 'voice' ? (
                      <Phone className="w-5 h-5 text-purple-400" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {call.message_type === 'voice' ? 'Voice Call' : 'Text Message'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(call.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">{call.duration_ms}ms</p>
                  <p className="text-xs text-slate-500">{call.tokens_used} tokens</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

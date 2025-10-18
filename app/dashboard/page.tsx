'use client'

import { useEffect, useState } from 'react'
import { getUsageStats, getCalls } from '@/lib/api-client'
import { getUser } from '@/lib/auth-helpers'
import { UsageQuota, QuotaGrid } from '@/components/UsageQuota'
import { CreateAgentModal } from '@/components/CreateAgentModal'
import QuickAgentTest from '@/components/QuickAgentTest'
import {
  Phone,
  Users,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentCalls, setRecentCalls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const { data: userData } = await getUser()
      setUser(userData?.user)

      const [usageData, callsData] = await Promise.all([
        getUsageStats(),
        getCalls(5),
      ])

      if (usageData.data) {
        setStats(usageData.data)
      }

      if (callsData.data) {
        setRecentCalls(callsData.data)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Calls',
      value: stats?.total_calls || 0,
      change: `${stats?.calls_this_month || 0} this month`,
      icon: Phone,
      color: 'cyan',
    },
    {
      name: 'Total Minutes',
      value: stats?.total_minutes || 0,
      change: `${stats?.minutes_this_month || 0} this month`,
      icon: Clock,
      color: 'blue',
    },
    {
      name: 'Total Leads',
      value: stats?.total_leads || 0,
      change: 'All time',
      icon: Users,
      color: 'emerald',
    },
    {
      name: 'Current Plan',
      value: stats?.plan_name || 'Free',
      change: `${stats?.plan_limit || 0} min limit`,
      icon: Zap,
      color: 'purple',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/create-agent"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Free Agent Creator
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </button>
        </div>
      </div>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

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
        <h2 className="text-xl font-bold mb-4">Usage This Month</h2>
        <QuotaGrid>
          <UsageQuota
            used={stats?.minutes_this_month || 0}
            limit={stats?.plan_limit || 100}
            label="Call Minutes"
            period="month"
            showUpgrade={true}
          />
          <UsageQuota
            used={stats?.calls_this_month || 0}
            limit={Math.floor((stats?.plan_limit || 100) * 2)}
            label="Total Calls"
            period="month"
            showUpgrade={true}
          />
          <UsageQuota
            used={stats?.total_leads || 0}
            limit={1000}
            label="Leads Captured"
            period="all time"
            showUpgrade={false}
          />
        </QuotaGrid>
      </div>

      {/* Agent Testing */}
      <QuickAgentTest />

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold">Activity Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Calls Today</span>
              <span className="text-lg font-semibold">{stats?.calls_this_month || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Minutes Used</span>
              <span className="text-lg font-semibold">{stats?.minutes_this_month || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Remaining</span>
              <span className="text-lg font-semibold text-emerald-400">
                {(stats?.plan_limit || 0) - (stats?.minutes_this_month || 0)} min
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <a
              href="/dashboard/calls"
              className="block px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <p className="font-medium">View All Calls</p>
              <p className="text-xs text-slate-400 mt-1">See your call history and recordings</p>
            </a>
            <a
              href="/dashboard/leads"
              className="block px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <p className="font-medium">Manage Leads</p>
              <p className="text-xs text-slate-400 mt-1">Follow up with captured leads</p>
            </a>
            <a
              href="/dashboard/settings"
              className="block px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <p className="font-medium">Settings</p>
              <p className="text-xs text-slate-400 mt-1">Configure your AI assistant</p>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Calls</h3>
        {recentCalls.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No calls yet</p>
            <p className="text-sm text-slate-500 mt-2">Your call history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${
                    call.status === 'completed' ? 'bg-emerald-500/10' : 'bg-slate-500/10'
                  } flex items-center justify-center`}>
                    <Phone className={`w-5 h-5 ${
                      call.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{call.customer_phone || 'Unknown'}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(call.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm capitalize">{call.status}</p>
                  <p className="text-xs text-slate-500">{Math.round(call.duration / 60)}min</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

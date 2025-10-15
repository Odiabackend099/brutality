'use client'

import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface UsageQuotaProps {
  used: number
  limit: number
  label: string
  period?: string
  showUpgrade?: boolean
}

export function UsageQuota({ used, limit, label, period = 'month', showUpgrade = false }: UsageQuotaProps) {
  const percentage = (used / limit) * 100
  const remaining = Math.max(0, limit - used)
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{label}</h3>
          <p className="text-sm text-slate-400">
            {used.toLocaleString()} / {limit.toLocaleString()} used this {period}
          </p>
        </div>
        {!isCritical && !isWarning && (
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        )}
        {isWarning && !isCritical && (
          <AlertCircle className="w-6 h-6 text-yellow-400" />
        )}
        {isCritical && (
          <AlertCircle className="w-6 h-6 text-red-400" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : isWarning
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
              : 'bg-gradient-to-r from-cyan-500 to-blue-400'
          }`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-slate-400">Remaining</p>
          <p className="font-semibold text-lg">{remaining.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400">Usage</p>
          <p className="font-semibold text-lg">{percentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* Warning Message */}
      {isCritical && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-300">
            You've used {percentage.toFixed(0)}% of your quota. Consider upgrading your plan.
          </p>
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-300">
            You're approaching your limit. {remaining} {label.toLowerCase()} remaining.
          </p>
        </div>
      )}

      {/* Upgrade CTA */}
      {showUpgrade && (isCritical || isWarning) && (
        <a
          href="/#pricing"
          className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 transition-all text-sm font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          Upgrade Plan
        </a>
      )}
    </div>
  )
}

export function QuotaGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}

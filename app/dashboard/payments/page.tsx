'use client'

import { useEffect, useState } from 'react'
import { getPayments, getPaymentsByEmail } from '@/lib/api'
import { getUser } from '@/lib/auth-helpers'
import { exportPaymentsToCSV, exportPaymentsToJSON } from '@/lib/exportData'
import { DollarSign, Check, Clock, ExternalLink, Download, FileJson } from 'lucide-react'
import type { Payment } from '@/lib/supabase'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')

  useEffect(() => {
    loadPayments()
  }, [])

  async function loadPayments() {
    try {
      const { data: userData, error: userError } = await getUser()
      if (userError || !userData?.user?.email) {
        setError('Please log in to view payments')
        return
      }
      
      // Try to get user's payments first
      const userPayments = await getPaymentsByEmail(userData.user.email)
      if (userPayments.length > 0) {
        setPayments(userPayments)
      } else {
        // If no user payments, show all (admin view)
        const allPayments = await getPayments(50)
        setPayments(allPayments)
      }
    } catch (error) {
      console.error('Failed to load payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (filter === 'verified') return payment.verified
    if (filter === 'pending') return !payment.verified
    return true
  })

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const verifiedCount = filteredPayments.filter(p => p.verified).length
  const pendingCount = filteredPayments.filter(p => !p.verified).length

  if (loading) {
    return <div className="text-slate-400">Loading payments...</div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-slate-400 mt-1">View payment history and transactions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Export Buttons */}
          <button
            onClick={() => exportPaymentsToCSV(filteredPayments)}
            disabled={filteredPayments.length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportPaymentsToJSON(filteredPayments)}
            disabled={filteredPayments.length === 0}
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
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700'
              }`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700'
            }`}
          >
            Pending
          </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">{filteredPayments.length} transactions</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">Verified</h3>
          </div>
          <p className="text-3xl font-bold">{verifiedCount}</p>
          <p className="text-sm text-slate-400 mt-1">Completed payments</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Pending</h3>
          </div>
          <p className="text-3xl font-bold">{pendingCount}</p>
          <p className="text-sm text-slate-400 mt-1">Awaiting confirmation</p>
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
          <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No payments found. Make your first payment to get started!</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{payment.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{payment.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold">
                        {payment.currency || '$'}{Number(payment.amount || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.plan === 'pro'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {payment.plan || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.flutterwave_id && (
                        <a
                          href={`https://dashboard.flutterwave.com/transactions/${payment.flutterwave_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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

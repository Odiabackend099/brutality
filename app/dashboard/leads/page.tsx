'use client'

import { useEffect, useState } from 'react'
import { getLeads } from '@/lib/api'
import { exportLeadsToCSV, exportLeadsToJSON } from '@/lib/exportData'
import { Users, Mail, Building, MessageSquare, Calendar, Download, FileJson } from 'lucide-react'
import type { Lead } from '@/lib/supabase'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    try {
      const allLeads = await getLeads(100)
      setLeads(allLeads)
    } catch (error) {
      console.error('Failed to load leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const search = searchTerm.toLowerCase()
    return (
      lead.name?.toLowerCase().includes(search) ||
      lead.business?.toLowerCase().includes(search) ||
      lead.contact?.toLowerCase().includes(search) ||
      lead.description?.toLowerCase().includes(search)
    )
  })

  const todayCount = leads.filter(l => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(l.created_at) >= today
  }).length

  const thisWeekCount = leads.filter(l => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(l.created_at) >= weekAgo
  }).length

  if (loading) {
    return <div className="text-slate-400">Loading leads...</div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-slate-400 mt-1">Manage your business leads and inquiries</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Export Buttons */}
          <button
            onClick={() => exportLeadsToCSV(filteredLeads)}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportLeadsToJSON(filteredLeads)}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>

          {/* Search */}
          <div className="relative border-l border-slate-700 pl-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="pl-4 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Total Leads</h3>
          </div>
          <p className="text-3xl font-bold">{leads.length}</p>
          <p className="text-sm text-slate-400 mt-1">All time</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold">This Week</h3>
          </div>
          <p className="text-3xl font-bold">{thisWeekCount}</p>
          <p className="text-sm text-slate-400 mt-1">Last 7 days</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold">Today</h3>
          </div>
          <p className="text-3xl font-bold">{todayCount}</p>
          <p className="text-sm text-slate-400 mt-1">New leads</p>
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            {searchTerm ? 'No leads found matching your search.' : 'No leads yet. They will appear here when submitted via your website.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-900" />
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2">{lead.name || 'Unknown'}</h3>

              {lead.business && (
                <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
                  <Building className="w-4 h-4" />
                  <span>{lead.business}</span>
                </div>
              )}

              {lead.contact && (
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{lead.contact}</span>
                </div>
              )}

              {lead.description && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-300 line-clamp-3">{lead.description}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-800">
                <a
                  href={`mailto:${lead.contact}`}
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  <Mail className="w-4 h-4" />
                  Contact Lead
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

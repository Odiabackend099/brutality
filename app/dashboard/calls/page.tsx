'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, MessageSquare, Download, Filter, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CallLog {
  id: string;
  twilio_call_sid: string;
  from_number: string;
  to_number: string;
  agent_name: string;
  duration_seconds: number;
  status: string;
  transcript: string;
  lead_data: any;
  created_at: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('call_logs')
        .select(`
          id,
          twilio_call_sid,
          from_number,
          to_number,
          duration_seconds,
          status,
          transcript,
          lead_data,
          created_at,
          agents!inner(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        twilio_call_sid: item.twilio_call_sid,
        from_number: item.from_number,
        to_number: item.to_number,
        agent_name: item.agents?.[0]?.name || 'Unknown Agent',
        duration_seconds: item.duration_seconds,
        status: item.status,
        transcript: item.transcript,
        lead_data: item.lead_data,
        created_at: item.created_at
      })) || [];

      setCalls(formattedData);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'busy':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'no-answer':
        return 'text-red-400 bg-red-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.from_number.includes(searchTerm) || 
                         call.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || call.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Call Logs</h1>
        <p className="text-slate-400">View and manage all incoming calls handled by your AI agents</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search calls, numbers, or transcripts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Filter by call status"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="busy">Busy</option>
              <option value="no-answer">No Answer</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call Logs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        {filteredCalls.length === 0 ? (
          <div className="p-8 text-center">
            <Phone className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Call Logs</h3>
            <p className="text-slate-400">
              {calls.length === 0 
                ? "No calls have been received yet. Configure your phone numbers to start receiving calls."
                : "No calls match your current filters."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-semibold">
                          {formatPhoneNumber(call.from_number)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Agent: {call.agent_name}</span>
                        <span>•</span>
                        <span>Duration: {formatDuration(call.duration_seconds)}</span>
                        <span>•</span>
                        <span>{new Date(call.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    title="Download call data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {call.transcript && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white">Call Transcript</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {call.transcript}
                    </p>
                  </div>
                )}

                {call.lead_data && (
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Lead Information</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {Object.entries(call.lead_data).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-slate-400 capitalize w-24">{key}:</span>
                          <span className="text-white">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {calls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="text-2xl font-bold text-white">{calls.length}</div>
            <div className="text-sm text-slate-400">Total Calls</div>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="text-2xl font-bold text-green-400">
              {calls.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="text-2xl font-bold text-cyan-400">
              {calls.filter(c => c.lead_data).length}
            </div>
            <div className="text-sm text-slate-400">Leads Captured</div>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(calls.reduce((acc, c) => acc + c.duration_seconds, 0) / calls.length / 60)}m
            </div>
            <div className="text-sm text-slate-400">Avg Duration</div>
          </div>
        </div>
      )}
    </div>
  );
}
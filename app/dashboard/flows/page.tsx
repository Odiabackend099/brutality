'use client';

import React, { useState, useEffect } from 'react';
import { Play, Settings, Save, Mic, MessageSquare, Phone, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CallFlow {
  id: string;
  agent_id: string;
  agent_name: string;
  flow_name: string;
  greeting_message: string;
  max_duration: number;
  capture_lead: boolean;
  send_whatsapp: boolean;
  is_active: boolean;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  voice_id: string;
  is_active: boolean;
}

export default function CallFlowsPage() {
  const [flows, setFlows] = useState<CallFlow[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFlow, setEditingFlow] = useState<CallFlow | null>(null);
  const [formData, setFormData] = useState({
    flow_name: '',
    greeting_message: '',
    max_duration: 300,
    capture_lead: true,
    send_whatsapp: true
  });

  useEffect(() => {
    fetchCallFlows();
    fetchAgents();
  }, []);

  const fetchCallFlows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('call_flows')
        .select(`
          id,
          agent_id,
          flow_name,
          flow_config,
          is_active,
          created_at,
          agents!inner(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        agent_id: item.agent_id,
        agent_name: item.agents?.[0]?.name || 'Unknown Agent',
        flow_name: item.flow_name,
        greeting_message: item.flow_config?.greeting || '',
        max_duration: item.flow_config?.max_duration || 300,
        capture_lead: item.flow_config?.capture_lead || false,
        send_whatsapp: item.flow_config?.send_whatsapp || false,
        is_active: item.is_active,
        created_at: item.created_at
      })) || [];

      setFlows(formattedData);
    } catch (error) {
      console.error('Error fetching call flows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agents')
        .select('id, name, voice_id, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const createCallFlow = async (agentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('call_flows')
        .insert({
          user_id: user.id,
          agent_id: agentId,
          flow_name: `Default Flow for ${agents.find(a => a.id === agentId)?.name}`,
          flow_config: {
            greeting: 'Hello! Thank you for calling. How can I help you today?',
            max_duration: 300,
            capture_lead: true,
            send_whatsapp: true
          },
          is_active: true
        });

      if (error) throw error;
      fetchCallFlows();
    } catch (error) {
      console.error('Error creating call flow:', error);
    }
  };

  const updateCallFlow = async () => {
    if (!editingFlow) return;

    try {
      const { error } = await supabase
        .from('call_flows')
        .update({
          flow_name: formData.flow_name,
          flow_config: {
            greeting: formData.greeting_message,
            max_duration: formData.max_duration,
            capture_lead: formData.capture_lead,
            send_whatsapp: formData.send_whatsapp
          }
        })
        .eq('id', editingFlow.id);

      if (error) throw error;
      setShowEditModal(false);
      setEditingFlow(null);
      fetchCallFlows();
    } catch (error) {
      console.error('Error updating call flow:', error);
    }
  };

  const openEditModal = (flow: CallFlow) => {
    setEditingFlow(flow);
    setFormData({
      flow_name: flow.flow_name,
      greeting_message: flow.greeting_message,
      max_duration: flow.max_duration,
      capture_lead: flow.capture_lead,
      send_whatsapp: flow.send_whatsapp
    });
    setShowEditModal(true);
  };

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
        <h1 className="text-2xl font-bold text-white">Call Flows</h1>
        <p className="text-slate-400">Configure how your AI agents handle incoming calls</p>
      </div>

      {/* Agents without flows */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Agents Without Call Flows</h3>
        {agents.filter(agent => !flows.some(flow => flow.agent_id === agent.id)).length === 0 ? (
          <p className="text-slate-400">All agents have call flows configured</p>
        ) : (
          <div className="space-y-3">
            {agents
              .filter(agent => !flows.some(flow => flow.agent_id === agent.id))
              .map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-medium">{agent.name}</span>
                  </div>
                  <button
                    onClick={() => createCallFlow(agent.id)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Create Flow
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Existing flows */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Configured Call Flows</h3>
        </div>
        {flows.length === 0 ? (
          <div className="p-8 text-center">
            <Play className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Call Flows</h3>
            <p className="text-slate-400">Create call flows for your agents to handle incoming calls</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {flows.map((flow) => (
              <div key={flow.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{flow.flow_name}</h4>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{flow.agent_name}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Greeting: "{flow.greeting_message}"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>Max duration: {flow.max_duration}s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>
                          Lead capture: {flow.capture_lead ? 'Enabled' : 'Disabled'} • 
                          WhatsApp: {flow.send_whatsapp ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openEditModal(flow)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    title="Edit call flow"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Flow Modal */}
      {showEditModal && editingFlow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Call Flow</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Flow Name
                </label>
                <input
                  type="text"
                  value={formData.flow_name}
                  onChange={(e) => setFormData({...formData, flow_name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  aria-label="Call flow name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Greeting Message
                </label>
                <textarea
                  value={formData.greeting_message}
                  onChange={(e) => setFormData({...formData, greeting_message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Hello! Thank you for calling. How can I help you today?"
                  aria-label="Greeting message for callers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Call Duration (seconds)
                </label>
                <input
                  type="number"
                  value={formData.max_duration}
                  onChange={(e) => setFormData({...formData, max_duration: parseInt(e.target.value)})}
                  min="60"
                  max="1800"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  aria-label="Maximum call duration in seconds"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.capture_lead}
                    onChange={(e) => setFormData({...formData, capture_lead: e.target.checked})}
                    className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-slate-300">Capture lead information</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.send_whatsapp}
                    onChange={(e) => setFormData({...formData, send_whatsapp: e.target.checked})}
                    className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-slate-300">Send WhatsApp notifications</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={updateCallFlow}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Mic, Play, Pause } from 'lucide-react';
import CallAgentButton from '@/components/CallAgentButton';
import { getUser } from '@/lib/auth-helpers';
import { supabase } from '@/lib/supabase-client';

interface Agent {
  id: string;
  name: string;
  system_prompt: string;
  voice_id: string;
  is_active: boolean;
  created_at: string;
}

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // Get user using the same auth helper as other dashboard pages
      const { data: userData, error: userError } = await getUser();
      if (userError || !userData?.user) {
        console.error('User not authenticated:', userError);
        return;
      }

      setUser(userData.user);

      // Fetch agents using the authenticated user's ID
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      console.log('Fetched agents:', data);
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          name: `Agent ${agents.length + 1}`,
          system_prompt: 'You are a helpful AI assistant. How can I help you today?',
          voice_id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', // Marcus voice
          api_key: `agent_${Date.now()}`,
          webhook_secret: `secret_${Date.now()}`,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating agent:', error);
        return;
      }

      setAgents(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        console.error('Error deleting agent:', error);
        return;
      }

      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_active: !currentStatus })
        .eq('id', agentId);

      if (error) {
        console.error('Error updating agent:', error);
        return;
      }

      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, is_active: !currentStatus }
          : agent
      ));
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
          <p className="text-slate-400">
            Create and test your AI voice agents
          </p>
        </div>
        
        <button
          onClick={createAgent}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Agent
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No agents yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first AI agent to get started
          </p>
          <button
            onClick={createAgent}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.is_active ? 'bg-green-400' : 'bg-slate-400'
                      }`}></div>
                      <span className="text-sm text-slate-400">
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      agent.is_active
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                    title={agent.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {agent.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400 mb-2">System Prompt:</p>
                <p className="text-sm text-slate-300 bg-slate-900 rounded p-3 max-h-20 overflow-y-auto">
                  {agent.system_prompt}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-2">Voice ID:</p>
                <p className="text-xs text-slate-500 font-mono bg-slate-900 rounded p-2">
                  {agent.voice_id}
                </p>
              </div>

              <CallAgentButton
                agentId={agent.id}
                agentName={agent.name}
                variant="card"
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Test Section */}
      {agents.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Test</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {agents.slice(0, 2).map((agent) => (
              <div key={`test-${agent.id}`} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Test {agent.name}
                </h3>
                <CallAgentButton
                  agentId={agent.id}
                  agentName={agent.name}
                  variant="inline"
                  className="w-full justify-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;

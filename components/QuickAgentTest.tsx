'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mic, Loader2 } from 'lucide-react';
import CallAgentButton from './CallAgentButton';
import { createClient } from '@supabase/supabase-js';

interface Agent {
  id: string;
  name: string;
  system_prompt: string;
  voice_id: string;
  is_active: boolean;
}

const QuickAgentTest: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agents')
        .select('id, name, system_prompt, voice_id, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(3);

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Test Your Agents</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Test Your Agents</h3>
        </div>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400 mb-4">
            Create an AI agent to start testing
          </p>
          <a
            href="/dashboard/agents"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
          >
            <Mic className="w-4 h-4" />
            Create Agent
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Test Your Agents</h3>
          <p className="text-sm text-slate-400">
            Click to start a voice chat with your AI agents
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-white">{agent.name}</h4>
                <p className="text-xs text-slate-400">
                  {agent.system_prompt.substring(0, 50)}...
                </p>
              </div>
            </div>
            
            <CallAgentButton
              agentId={agent.id}
              agentName={agent.name}
              variant="inline"
            />
          </div>
        ))}
        
        {agents.length > 0 && (
          <div className="pt-2">
            <a
              href="/dashboard/agents"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all agents →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAgentTest;

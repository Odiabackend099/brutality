'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Plus, Settings, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PhoneNumber {
  id: string;
  phone_number: string;
  agent_id: string;
  agent_name: string;
  is_active: boolean;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  voice_id: string;
  is_active: boolean;
}

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchPhoneNumbers();
    fetchAgents();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('phone_numbers')
        .select(`
          id,
          phone_number,
          agent_id,
          is_active,
          created_at,
          agents!inner(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        phone_number: item.phone_number,
        agent_id: item.agent_id,
        agent_name: item.agents?.[0]?.name || 'Unknown Agent',
        is_active: item.is_active,
        created_at: item.created_at
      })) || [];

      setPhoneNumbers(formattedData);
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
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

  const addPhoneNumber = async () => {
    if (!newPhoneNumber || !selectedAgent) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('phone_numbers')
        .insert({
          user_id: user.id,
          phone_number: newPhoneNumber,
          agent_id: selectedAgent,
          is_active: true
        });

      if (error) throw error;

      setNewPhoneNumber('');
      setSelectedAgent('');
      setShowAddModal(false);
      fetchPhoneNumbers();
    } catch (error) {
      console.error('Error adding phone number:', error);
    }
  };

  const togglePhoneNumber = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchPhoneNumbers();
    } catch (error) {
      console.error('Error toggling phone number:', error);
    }
  };

  const deletePhoneNumber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this phone number?')) return;

    try {
      const { error } = await supabase
        .from('phone_numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPhoneNumbers();
    } catch (error) {
      console.error('Error deleting phone number:', error);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
          <p className="text-slate-400">Manage your Twilio phone numbers and assign them to AI agents</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Phone Number
        </button>
      </div>

      {/* Phone Numbers List */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        {phoneNumbers.length === 0 ? (
          <div className="p-8 text-center">
            <Phone className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Phone Numbers</h3>
            <p className="text-slate-400 mb-4">Add a phone number to start receiving calls with your AI agents</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Add Your First Phone Number
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{phone.phone_number}</span>
                      {phone.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-slate-400">Assigned to: {phone.agent_name}</p>
                    <p className="text-slate-500 text-sm">
                      Added: {new Date(phone.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePhoneNumber(phone.id, phone.is_active)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      phone.is_active
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {phone.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deletePhoneNumber(phone.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg"
                    title="Delete phone number"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Phone Number Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Add Phone Number</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: +1 (XXX) XXX-XXXX
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Assign to Agent
                </label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  aria-label="Select agent to assign"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={addPhoneNumber}
                disabled={!newPhoneNumber || !selectedAgent}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
              >
                Add Phone Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

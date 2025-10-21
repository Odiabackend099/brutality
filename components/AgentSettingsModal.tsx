'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

interface Agent {
  id: string;
  name: string;
  system_prompt: string;
  voice_id: string;
  is_active: boolean;
  created_at: string;
  llm_model?: string;
  llm_temperature?: number;
  llm_max_tokens?: number;
  voice_speed?: number;
  voice_pitch?: number;
  voice_emotion?: string;
}

interface AgentSettingsModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
}

const AVAILABLE_VOICES = [
  { id: 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc', name: 'Odia (African Male)', description: 'Warm, professional African male voice' },
  { id: 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc', name: 'Marcus (American Male)', description: 'Clear, confident American male voice' },
  { id: 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a', name: 'Marcy (American Female)', description: 'Friendly, energetic American female voice' },
  { id: 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82', name: 'Joslyn (African Female)', description: 'Smooth, professional African female voice' }
];

const LLM_MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Fast)' },
  { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B (Powerful)' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
];

export default function AgentSettingsModal({ agent, isOpen, onClose, onSave }: AgentSettingsModalProps) {
  const [formData, setFormData] = useState<Agent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (agent) {
      setFormData({
        ...agent,
        llm_model: agent.llm_model || 'llama-3.1-8b-instant',
        llm_temperature: agent.llm_temperature ?? 0.6,
        llm_max_tokens: agent.llm_max_tokens ?? 400,
        voice_speed: agent.voice_speed ?? 1.0,
        voice_pitch: agent.voice_pitch ?? 1.0,
        voice_emotion: agent.voice_emotion || 'neutral'
      });
    }
  }, [agent]);

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    setError('');

    try {
      const { data, error: updateError } = await supabase
        .from('agents')
        .update({
          name: formData.name,
          system_prompt: formData.system_prompt,
          voice_id: formData.voice_id,
          is_active: formData.is_active,
          llm_model: formData.llm_model,
          llm_temperature: formData.llm_temperature,
          llm_max_tokens: formData.llm_max_tokens,
          voice_speed: formData.voice_speed,
          voice_pitch: formData.voice_pitch,
          voice_emotion: formData.voice_emotion
        })
        .eq('id', formData.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      onSave(data);
      onClose();
    } catch (err) {
      console.error('Error saving agent:', err);
      setError(err instanceof Error ? err.message : 'Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Agent Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Settings</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="agent-name" className="block text-sm font-medium text-slate-300 mb-2">
                  Agent Name
                </label>
                <input
                  id="agent-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="My AI Agent"
                />
              </div>

              <div>
                <label htmlFor="system-prompt" className="block text-sm font-medium text-slate-300 mb-2">
                  System Prompt
                </label>
                <textarea
                  id="system-prompt"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  rows={6}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                  placeholder="You are a helpful AI assistant..."
                />
                <p className="text-xs text-slate-400 mt-1">
                  Define your agent's personality and instructions
                </p>
              </div>
            </div>
          </div>

          {/* Voice Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Voice Settings</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="voice-id" className="block text-sm font-medium text-slate-300 mb-2">
                  Voice
                </label>
                <select
                  id="voice-id"
                  value={formData.voice_id}
                  onChange={(e) => setFormData({ ...formData, voice_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {AVAILABLE_VOICES.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  {AVAILABLE_VOICES.find(v => v.id === formData.voice_id)?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="voice-speed" className="block text-sm font-medium text-slate-300 mb-2">
                    Speed: {formData.voice_speed?.toFixed(1)}x
                  </label>
                  <input
                    id="voice-speed"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={formData.voice_speed}
                    onChange={(e) => setFormData({ ...formData, voice_speed: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="voice-pitch" className="block text-sm font-medium text-slate-300 mb-2">
                    Pitch: {formData.voice_pitch?.toFixed(1)}x
                  </label>
                  <input
                    id="voice-pitch"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={formData.voice_pitch}
                    onChange={(e) => setFormData({ ...formData, voice_pitch: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="voice-emotion" className="block text-sm font-medium text-slate-300 mb-2">
                  Emotion
                </label>
                <select
                  id="voice-emotion"
                  value={formData.voice_emotion}
                  onChange={(e) => setFormData({ ...formData, voice_emotion: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="neutral">Neutral</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="excited">Excited</option>
                  <option value="calm">Calm</option>
                </select>
              </div>
            </div>
          </div>

          {/* LLM Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">LLM Settings</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="llm-model" className="block text-sm font-medium text-slate-300 mb-2">
                  Model
                </label>
                <select
                  id="llm-model"
                  value={formData.llm_model}
                  onChange={(e) => setFormData({ ...formData, llm_model: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {LLM_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="llm-temperature" className="block text-sm font-medium text-slate-300 mb-2">
                  Temperature: {formData.llm_temperature?.toFixed(1)}
                </label>
                <input
                  id="llm-temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.llm_temperature}
                  onChange={(e) => setFormData({ ...formData, llm_temperature: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Higher values make output more random and creative
                </p>
              </div>

              <div>
                <label htmlFor="llm-max-tokens" className="block text-sm font-medium text-slate-300 mb-2">
                  Max Tokens: {formData.llm_max_tokens}
                </label>
                <input
                  id="llm-max-tokens"
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={formData.llm_max_tokens}
                  onChange={(e) => setFormData({ ...formData, llm_max_tokens: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Short</span>
                  <span>Long</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Maximum length of the response
                </p>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
              />
              <div>
                <span className="text-sm font-medium text-white">Active</span>
                <p className="text-xs text-slate-400">Agent is available for calls</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

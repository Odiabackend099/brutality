'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Radio, AlertCircle, Settings, Volume2, VolumeX } from 'lucide-react';
import { VoiceAIManager, ConnectionState } from '@/lib/voice-ai-manager';

interface VoiceChatProps {
  agentId?: string;
  defaultVoice?: string;
  systemPrompt?: string;
}

const AVAILABLE_VOICES = [
  { id: 'odia', name: 'Odia (African Male)', description: 'Warm, professional African male voice' },
  { id: 'marcus', name: 'Marcus (American Male)', description: 'Clear, confident American male voice' },
  { id: 'marcy', name: 'Marcy (American Female)', description: 'Friendly, energetic American female voice' },
  { id: 'joslyn', name: 'Joslyn (African Female)', description: 'Smooth, professional African female voice' }
];

export default function VoiceChat({ agentId, defaultVoice, systemPrompt }: VoiceChatProps) {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(defaultVoice || 'odia');

  const voiceAIManagerRef = useRef<VoiceAIManager | null>(null);

  useEffect(() => {
    // Initialize Voice AI Manager with optional system prompt and voice
    voiceAIManagerRef.current = new VoiceAIManager(systemPrompt, selectedVoice);

    return () => {
      if (voiceAIManagerRef.current) {
        voiceAIManagerRef.current.disconnect();
      }
    };
  }, [systemPrompt, selectedVoice]);

  const connect = async () => {
    if (!voiceAIManagerRef.current) return;

    try {
      await voiceAIManagerRef.current.connect({
        onStateChange: setState,
        onListeningChange: setIsListening,
        onSpeakingChange: setIsSpeaking,
        onTranscriptChange: setTranscript,
        onError: setError,
      });
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect. Please try again.');
    }
  };

  const disconnect = () => {
    if (voiceAIManagerRef.current) {
      voiceAIManagerRef.current.disconnect();
    }
    setTranscript('');
    setError('');
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (voiceAIManagerRef.current) {
      voiceAIManagerRef.current.setMuted(newMutedState);
    }
  };

  const testSystem = async () => {
    if (voiceAIManagerRef.current) {
      const isWorking = await voiceAIManagerRef.current.testSystem();
      if (isWorking) {
        setError('');
      } else {
        setError('System test failed. Check console for details.');
      }
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (voiceAIManagerRef.current) {
      voiceAIManagerRef.current.setVoice(voiceId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CallWaitingAI Voice</h1>
          <p className="text-gray-300">Your intelligent voice assistant</p>
          {agentId && (
            <p className="text-xs text-gray-500 mt-2">Testing agent ID: {agentId}</p>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Status Indicator */}
          <div className="flex items-center justify-center mb-6">
            {state === 'connected' && (
              <div className="flex items-center gap-2 text-green-400">
                <Radio className="w-5 h-5 animate-pulse" />
                <span>Connected</span>
              </div>
            )}
            {state === 'connecting' && (
              <div className="flex items-center gap-2 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
            {state === 'error' && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>Connection Error</span>
              </div>
            )}
          </div>

          {/* Voice Visual */}
          <div className="flex justify-center mb-8">
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? 'bg-red-500/30 scale-110' : 
              isSpeaking ? 'bg-blue-500/30 scale-110' : 
              'bg-gray-500/20'
            }`}>
              <div className={`absolute inset-0 rounded-full animate-ping ${
                isListening ? 'bg-red-500/50' : 
                isSpeaking ? 'bg-blue-500/50' : 
                'opacity-0'
              }`} />
              <Mic className={`w-16 h-16 ${
                isListening ? 'text-red-400' : 
                isSpeaking ? 'text-blue-400' : 
                'text-gray-400'
              }`} />
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center mb-6">
            <p className="text-white text-lg font-medium">
              {isListening ? 'Listening...' : 
               isSpeaking ? 'Speaking...' : 
               state === 'connected' ? 'Ready to chat' : 
               'Not connected'}
            </p>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <label htmlFor="voice-select" className="block text-white text-sm font-medium mb-2">
              Voice Selection
            </label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              disabled={state === 'connected'}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {AVAILABLE_VOICES.map((voice) => (
                <option key={voice.id} value={voice.id} className="bg-gray-900">
                  {voice.name}
                </option>
              ))}
            </select>
            <p className="text-gray-400 text-xs mt-1">
              {AVAILABLE_VOICES.find(v => v.id === selectedVoice)?.description}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-black/30 rounded-2xl p-4 mb-6 min-h-[100px]">
              <p className="text-white text-sm">{transcript}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-4">
            {state === 'disconnected' || state === 'error' ? (
              <button
                onClick={connect}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Mic className="w-5 h-5" />
                Start Conversation
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MicOff className="w-5 h-5" />
                End Conversation
              </button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              onClick={testSystem}
              className="flex items-center gap-2 bg-gray-500/20 text-gray-400 border border-gray-500/50 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:bg-gray-500/30"
            >
              <Settings className="w-4 h-4" />
              Test System
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="bg-white/5 backdrop-blur rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">LLM</p>
            <p className="text-white font-bold">Groq</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">STT</p>
            <p className="text-white font-bold">Deepgram</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">TTS</p>
            <p className="text-white font-bold">Custom</p>
          </div>
        </div>
      </div>
    </div>
  );
}

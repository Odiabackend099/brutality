'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { StreamingVoiceAIManager, StreamingConfig } from '@/lib/streaming-voice-ai-manager';
import { EnhancedVADProcessor } from '@/lib/enhanced-vad-processor';
import { StreamingAudioPlayer } from '@/lib/streaming-audio-player';

interface StreamingVoiceChatProps {
  className?: string;
  config?: Partial<StreamingConfig>;
}

export default function StreamingVoiceChat({ className = '', config = {} }: StreamingVoiceChatProps) {
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [latency, setLatency] = useState(0);
  const [volume, setVolume] = useState(1.0);
  
  // Refs
  const voiceAIManagerRef = useRef<StreamingVoiceAIManager | null>(null);
  const vadProcessorRef = useRef<EnhancedVADProcessor | null>(null);
  const audioPlayerRef = useRef<StreamingAudioPlayer | null>(null);

  // Initialize components
  useEffect(() => {
    const initializeComponents = async () => {
      try {
        // Initialize VAD processor
        vadProcessorRef.current = new EnhancedVADProcessor({
          enableInterruption: true,
          interruptionThreshold: 0.9,
          silenceTimeout: 3000
        });

        // Initialize audio player
        audioPlayerRef.current = new StreamingAudioPlayer({
          enableInterruption: true,
          maxQueueSize: 5
        });

        // Initialize voice AI manager
        voiceAIManagerRef.current = new StreamingVoiceAIManager({
          maxLatency: 200,
          preBufferResponses: true,
          enableInterruption: true,
          ...config
        });

        // Set up callbacks
        await voiceAIManagerRef.current.initialize({
          onTranscript: (text) => {
            setTranscript(text);
            console.log('📝 Transcript:', text);
          },
          onResponse: (response) => {
            setResponse(response.text);
            setLatency(response.latency);
            setIsInterrupted(false);
            console.log('🧠 Response:', response.text, `(${response.latency}ms)`);
          },
          onError: (error) => {
            setError(error.message);
            console.error('❌ Voice AI Error:', error);
          },
          onLatency: (latency) => {
            setLatency(latency);
          },
          onInterruption: () => {
            setIsInterrupted(true);
            console.log('⚠️ Interruption detected');
          }
        });

        // Initialize audio player
        await audioPlayerRef.current.initialize({
          onPlaybackStart: () => setIsSpeaking(true),
          onPlaybackEnd: () => setIsSpeaking(false),
          onInterruption: () => setIsInterrupted(true),
          onError: (error) => setError(error.message)
        });

        setIsConnected(true);
        console.log('✅ StreamingVoiceChat initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize StreamingVoiceChat:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize');
      }
    };

    initializeComponents();

    // Cleanup on unmount
    return () => {
      if (voiceAIManagerRef.current) {
        voiceAIManagerRef.current.disconnect();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.destroy();
      }
    };
  }, [config]);

  // Handle connection
  const handleConnect = useCallback(async () => {
    if (!voiceAIManagerRef.current) return;
    
    try {
      setError(null);
      await voiceAIManagerRef.current.connect();
      setIsConnected(true);
      console.log('🎤 Connected to streaming voice AI');
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect');
    }
  }, []);

  // Handle disconnection
  const handleDisconnect = useCallback(async () => {
    if (!voiceAIManagerRef.current) return;
    
    try {
      await voiceAIManagerRef.current.disconnect();
      setIsConnected(false);
      setIsListening(false);
      setIsProcessing(false);
      setIsSpeaking(false);
      setIsInterrupted(false);
      console.log('🔇 Disconnected from streaming voice AI');
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect');
    }
  }, []);

  // Handle microphone toggle
  const handleMicrophoneToggle = useCallback(async () => {
    if (!voiceAIManagerRef.current) return;
    
    try {
      if (isListening) {
        await voiceAIManagerRef.current.stopListening();
        setIsListening(false);
      } else {
        await voiceAIManagerRef.current.startListening();
        setIsListening(true);
        setIsInterrupted(false);
      }
    } catch (error) {
      console.error('❌ Failed to toggle microphone:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle microphone');
    }
  }, [isListening]);

  // Handle interruption
  const handleInterrupt = useCallback(async () => {
    if (!voiceAIManagerRef.current) return;
    
    try {
      await voiceAIManagerRef.current.interrupt();
      setIsInterrupted(true);
      console.log('⚠️ Manual interruption triggered');
    } catch (error) {
      console.error('❌ Failed to interrupt:', error);
      setError(error instanceof Error ? error.message : 'Failed to interrupt');
    }
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback(async (newVolume: number) => {
    if (!audioPlayerRef.current) return;
    
    try {
      await audioPlayerRef.current.setVolume(newVolume);
      setVolume(newVolume);
    } catch (error) {
      console.error('❌ Failed to change volume:', error);
    }
  }, []);

  // Get status for UI
  const getStatus = () => {
    if (!voiceAIManagerRef.current) return 'disconnected';
    
    const status = voiceAIManagerRef.current.getStatus();
    
    if (status.isSpeaking) return 'speaking';
    if (status.isProcessing) return 'processing';
    if (status.isListening) return 'listening';
    if (status.isConnected) return 'connected';
    
    return 'disconnected';
  };

  const status = getStatus();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 text-white ${className}`}>
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Streaming Voice AI</h1>
          <p className="text-gray-300">Ultra-low latency voice interaction</p>
        </div>

        {/* Status Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
            {status === 'connected' && <CheckCircle className="w-5 h-5 text-green-400" />}
            {status === 'listening' && <Mic className="w-5 h-5 text-blue-400 animate-pulse" />}
            {status === 'processing' && <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />}
            {status === 'speaking' && <Volume2 className="w-5 h-5 text-purple-400" />}
            {status === 'disconnected' && <AlertCircle className="w-5 h-5 text-red-400" />}
            <span className="capitalize">{status}</span>
          </div>
        </div>

        {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          {isInterrupted && !error && (
            <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-4 mb-6 flex items-center gap-2 text-yellow-100 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Interruption detected. Listening has been paused to protect the conversation flow.</span>
            </div>
          )}

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Connection Controls */}
          <div className="flex gap-4 justify-center">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5" />
                Connect
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200"
              >
                <AlertCircle className="w-5 h-5" />
                Disconnect
              </button>
            )}
          </div>

          {/* Microphone Controls */}
          {isConnected && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleMicrophoneToggle}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </button>

              <button
                onClick={handleInterrupt}
                disabled={!isSpeaking}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <VolumeX className="w-5 h-5" />
                Interrupt
              </button>
            </div>
          )}
        </div>

        {/* Volume Control */}
        {isConnected && (
          <div className="mb-6">
            <label htmlFor="streaming-volume" className="block text-sm font-medium mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              id="streaming-volume"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>{Math.round(volume * 100)}%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-200">{transcript}</p>
            </div>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-200">{response}</p>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-gray-400">Latency</div>
            <div className="text-white font-semibold">{latency}ms</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-gray-400">Status</div>
            <div className="text-white font-semibold capitalize">{status}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

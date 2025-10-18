'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceChatProps {
  agentId: string;
  agentName: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ 
  agentId, 
  agentName, 
  onCallStart, 
  onCallEnd 
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callStartTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate agent responses
  const simulateAgentResponse = (userMessage: string) => {
    const responses = [
      "Hello! I'm your AI assistant. How can I help you today?",
      "That's interesting! Tell me more about that.",
      "I understand. Let me help you with that.",
      "Great question! Here's what I think...",
      "I'm here to assist you. What else would you like to know?",
      "That sounds like a good plan. Is there anything else I can help with?",
      "I'm processing that information. Give me a moment...",
      "Thank you for sharing that with me. How else can I assist?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      setIsSpeaking(true);
      const agentMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'agent',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Simulate speaking duration
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }, 1000);
  };

  const startCall = async () => {
    try {
      setIsConnecting(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Here you would send the audio to your AI agent
        console.log('Audio recorded:', audioBlob);
        audioChunksRef.current = [];
      };
      
      // Start recording
      mediaRecorder.start();
      
      setIsCallActive(true);
      setIsConnecting(false);
      callStartTimeRef.current = new Date();
      
      // Start call duration timer
      intervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const duration = Math.floor((Date.now() - callStartTimeRef.current.getTime()) / 1000);
          setCallDuration(duration);
        }
      }, 1000);
      
      // Add initial agent greeting
      const greeting: ChatMessage = {
        id: '1',
        type: 'agent',
        content: `Hello! I'm ${agentName}, your AI assistant. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
      
      onCallStart?.();
      
    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const endCall = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all audio tracks
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCallDuration(0);
    callStartTimeRef.current = null;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onCallEnd?.();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would mute/unmute the microphone
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, you would toggle speaker output
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    simulateAgentResponse(content);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isCallActive) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Test {agentName}
          </h3>
          <p className="text-slate-400 text-sm">
            Click to start a voice chat with your AI agent
          </p>
        </div>
        
        <button
          onClick={startCall}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white rounded-lg font-semibold transition-colors"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Start Voice Chat
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      {/* Call Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agentName}</h3>
            <p className="text-sm text-green-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {formatDuration(callDuration)}
            </p>
          </div>
        </div>
        
        <button
          onClick={endCall}
          className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="bg-slate-900 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isSpeaking && (
          <div className="text-left">
            <div className="inline-block bg-slate-700 text-slate-200 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Agent is speaking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
            } text-white`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleSpeaker}
            className={`p-3 rounded-full transition-colors ${
              isSpeakerOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-600 hover:bg-slate-500'
            } text-white`}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder="Type a message..."]') as HTMLInputElement;
              if (input?.value) {
                sendMessage(input.value);
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;

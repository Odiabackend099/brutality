'use client';

import React, { useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import VoiceChat from './VoiceChat';

interface CallAgentButtonProps {
  agentId: string;
  agentName: string;
  variant?: 'button' | 'card' | 'inline';
  className?: string;
}

const CallAgentButton: React.FC<CallAgentButtonProps> = ({
  agentId,
  agentName,
  variant = 'button',
  className = ''
}) => {
  const [isCallActive, setIsCallActive] = useState(false);

  const handleCallStart = () => {
    setIsCallActive(true);
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
  };

  if (isCallActive) {
    return (
      <VoiceChat
        agentId={agentId}
        agentName={agentName}
        onCallStart={handleCallStart}
        onCallEnd={handleCallEnd}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-slate-800 rounded-lg border border-slate-700 p-6 text-center ${className}`}>
        <div className="mb-4">
          <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Test {agentName}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Click to start a voice chat with your AI agent
          </p>
        </div>
        
        <button
          onClick={handleCallStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors w-full justify-center"
        >
          <Phone className="w-5 h-5" />
          Start Voice Chat
        </button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleCallStart}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors ${className}`}
      >
        <Phone className="w-4 h-4" />
        Call Agent
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleCallStart}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors ${className}`}
    >
      <Phone className="w-5 h-5" />
      Test {agentName}
    </button>
  );
};

export default CallAgentButton;

'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { VoiceRecorder } from './VoiceRecorder';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendText = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();
    setInputText('');

    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob) => {
    try {
      await sendMessage('Voice message', audioBlob);
    } catch (err) {
      console.error('Failed to send voice message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  return (
    <>
      {/* Floating Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:brightness-110 flex items-center justify-center transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_0_60px_rgba(34,211,238,0.3)] flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  {process.env.NEXT_PUBLIC_BRAND_NAME || 'CallWaiting AI'}
                </h3>
                <p className="text-xs text-slate-400">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-3 bg-slate-900/50 border-b border-slate-800">
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                inputMode === 'text'
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                inputMode === 'voice'
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-white mb-2">Start a conversation</h4>
                <p className="text-sm text-slate-400 max-w-xs">
                  Type a message or use voice to chat with our AI assistant
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.audioUrl && (
                    <audio
                      controls
                      src={message.audioUrl}
                      className="mt-2 w-full h-8"
                      style={{ maxWidth: '200px' }}
                    />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            {inputMode === 'text' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all disabled:opacity-50"
                />
                <button
                  onClick={handleSendText}
                  disabled={!inputText.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 hover:brightness-110 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecording}
                disabled={isLoading}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

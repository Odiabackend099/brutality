'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Mic, Volume2 } from 'lucide-react';
import { ChatMessage, getPageContext } from '@/lib/groq-chat-widget';

interface ChatWidgetProps {
  className?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isTyping = false }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white ml-4'
            : 'bg-slate-100 text-slate-800 mr-4 border border-slate-200'
        }`}
      >
        <p className="text-sm leading-relaxed">
          {message.content}
          {isTyping && (
            <span className="inline-block ml-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse animation-delay-200">●</span>
              <span className="animate-pulse animation-delay-400">●</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl mr-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-100"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-200"></div>
      </div>
    </div>
  </div>
);

const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  // Check browser support for speech APIs
  useEffect(() => {
  setSpeechSupported(!!(window as any)?.webkitSpeechRecognition || !!(window as any)?.SpeechRecognition);
    setTtsSupported(!!window?.speechSynthesis);
  }, []);
  // Speech-to-text logic
  const recognitionRef = useRef<any>(null);
  const handleMicClick = () => {
    if (!speechSupported) return;
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
      inputRef.current?.focus();
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };
  // Text-to-speech for AI responses
  const speak = (text: string) => {
    if (!ttsSupported || !text) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your CallWaitingAI assistant. How can I help you today? 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingMessage]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getCurrentPage = (): string => {
    if (typeof window !== 'undefined') {
      return getPageContext(window.location.pathname);
    }
    return 'unknown';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setStreamingMessage('');

    // Set timeout fallback
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setIsTyping(false);
        setIsLoading(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Apologies, there\'s a delay. Let me retry that for you...',
          timestamp: new Date()
        }]);
        // Retry logic could be added here
      }
    }, 10000);

    try {
      const response = await fetch('/api/chat/widget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.slice(-5), // Keep last 5 messages for context
          page: getCurrentPage()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let assistantResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantResponse += data.content;
                setStreamingMessage(assistantResponse);
              }
              if (data.done) {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: assistantResponse,
                  timestamp: new Date()
                }]);
                setStreamingMessage('');
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oops, something went wrong. Please try again later.',
        timestamp: new Date()
      }]);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <MessageCircle size={20} className="text-cyan-400" />
          <span className="text-sm font-medium">Chat with us</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-80 h-96 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} className="text-cyan-400" />
            <div>
              <h3 className="font-semibold text-sm">ODIADEV Assistant</h3>
              <p className="text-xs text-slate-300">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors p-1 rounded"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          
          {isTyping && (
            <>
              {streamingMessage ? (
                <div className="flex items-center">
                  <MessageBubble 
                    message={{
                      role: 'assistant',
                      content: streamingMessage,
                      timestamp: new Date()
                    }}
                    isTyping={true}
                  />
                  {ttsSupported && (
                    <button
                      className="ml-2 p-1 rounded hover:bg-slate-200"
                      title="Play response"
                      onClick={() => speak(streamingMessage)}
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <TypingIndicator />
              )}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={!speechSupported || isLoading}
              className={`p-2 rounded-lg border ${isRecording ? 'bg-cyan-100 border-cyan-500' : 'bg-slate-100 border-slate-300'} transition-colors`}
              title={isRecording ? 'Stop recording' : 'Speak'}
            >
              <Mic size={16} className={isRecording ? 'animate-pulse text-cyan-500' : 'text-slate-500'} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px]"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
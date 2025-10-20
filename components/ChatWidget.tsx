'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
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

const ChatInterface: React.FC<{
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isTyping: boolean;
  streamingMessage: string;
  input: string;
  setInput: (input: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onMicClick: () => void;
  isRecording: boolean;
  speechSupported: boolean;
  isLoading: boolean;
}> = ({
  onClose,
  onMinimize,
  onSendMessage,
  messages,
  isTyping,
  streamingMessage,
  input,
  setInput,
  onKeyPress,
  onMicClick,
  isRecording,
  speechSupported,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingMessage]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-80 h-[32rem] flex flex-col overflow-hidden">
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
            onClick={onMinimize}
            className="text-slate-300 hover:text-white transition-colors p-1 rounded"
            aria-label="Minimize chat"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors p-1 rounded"
            aria-label="Close chat"
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
              <MessageBubble 
                message={{
                  role: 'assistant',
                  content: streamingMessage,
                  timestamp: new Date()
                }}
                isTyping={true}
              />
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
          {speechSupported && (
            <button
              type="button"
              onClick={onMicClick}
              disabled={isLoading}
              className={`p-2 rounded-lg border ${isRecording ? 'bg-cyan-100 border-cyan-500' : 'bg-slate-100 border-slate-300'} transition-colors`}
              title={isRecording ? 'Stop recording' : 'Speak'}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              <Mic size={16} className={isRecording ? 'animate-pulse text-cyan-500' : 'text-slate-500'} />
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px]"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Import icons directly to avoid dynamic imports
import { Send, Minimize2, Mic, X } from 'lucide-react';

const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  // Check browser support for speech APIs - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setSpeechSupported(isSpeechRecognitionSupported);
    }
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

  // Only render on client-side to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="w-40 h-12"></div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
          aria-label="Open chat widget"
        >
          <MessageCircle size={20} className="text-cyan-400" />
          <span className="text-sm font-medium">Chat with us</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <ChatInterface
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsOpen(false)}
        onSendMessage={handleSend}
        messages={messages}
        isTyping={isTyping}
        streamingMessage={streamingMessage}
        input={input}
        setInput={setInput}
        onKeyPress={handleKeyPress}
        onMicClick={handleMicClick}
        isRecording={isRecording}
        speechSupported={speechSupported}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWidget;
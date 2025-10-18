'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage, getPageContext, type ChatMessage } from '@/lib/groq-chat';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          message.role === 'user'
            ? 'bg-cyan-500 text-white'
            : 'bg-slate-700 text-slate-100'
        }`}
      >
        <p className="text-sm leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
          )}
        </p>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setCurrentStreamingMessage('');

    try {
      const pageContext = getPageContext(pathname);
      const stream = sendChatMessage(newMessages, pageContext);
      
      let assistantContent = '';
      
      for await (const chunk of stream) {
        if (chunk.done) {
          // Add the complete assistant message to the conversation
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: assistantContent
          }]);
          setCurrentStreamingMessage('');
          setIsStreaming(false);
        } else {
          assistantContent = chunk.content;
          setCurrentStreamingMessage(assistantContent);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentStreamingMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">ODIADEV AI Assistant</h3>
                <p className="text-xs text-slate-400">Powered by GROQ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-slate-400 hover:text-slate-200 transition-colors text-xs"
              >
                Clear
              </button>
            <button
              onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
          </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Hi! I'm your ODIADEV AI Assistant.</p>
                <p>How can I help you today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            
            {isStreaming && currentStreamingMessage && (
              <MessageBubble 
                message={{ role: 'assistant', content: currentStreamingMessage }} 
                isStreaming={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CallWaiting AI..."
                className="flex-1 bg-slate-800 text-white placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 hover:from-purple-600 hover:via-blue-600 hover:to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Chat with us</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </button>
      )}
    </div>
  );
}
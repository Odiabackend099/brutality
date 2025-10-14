import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface ChatResponse {
  text: string;
  audio_url?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, audioBlob?: Blob) => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK || 'https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax';

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      let payload: any;

      if (audioBlob) {
        // Convert audio blob to base64
        const reader = new FileReader();
        const base64Audio = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data:audio/webm;base64, prefix
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });

        payload = {
          type: 'voice',
          audio: base64Audio,
          message: content,
        };
      } else {
        payload = {
          type: 'text',
          message: content,
        };
      }

      console.log('Sending to webhook:', webhookUrl, payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Get response as text first to debug
      const responseText = await response.text();
      console.log('Response body:', responseText);

      // Try to parse as JSON
      let data: ChatResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        console.error('Raw response:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Response is not a valid object');
      }

      if (!data.text || typeof data.text !== 'string') {
        console.warn('Response missing or invalid "text" field:', data);
        // Provide a fallback message
        data.text = 'Received response from AI (no text content)';
      }

      console.log('Parsed response data:', data);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.text,
        audioUrl: data.audio_url,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Play audio if available
      if (data.audio_url) {
        const audio = new Audio(data.audio_url);
        audio.play().catch(err => {
          console.error('Failed to play audio:', err);
        });
      }

      return aiMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

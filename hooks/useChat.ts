import { useState, useCallback } from 'react';
import { generateSignature } from '@/lib/generateSignature';

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
  // Some backends may return base64 audio
  audio_hex?: string;
  status?: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, audioBlob?: Blob) => {
    // Use secure Supabase Edge Function proxy (with HMAC validation + rate limiting)
    const primaryUrl = process.env.NEXT_PUBLIC_WEBHOOK_PROXY_URL ||
      'https://bcufohulqrceytkrqpgd.supabase.co/functions/v1/webhook-proxy';

    // Webhook secret for HMAC signature
    const webhookSecret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET || '';

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

      // Generate HMAC signature for request
      const bodyString = JSON.stringify(payload);
      const signature = await generateSignature(bodyString, webhookSecret);

      console.log('Sending to secure webhook proxy:', primaryUrl);

      // Abort if the webhook hangs
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      let response: Response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-webhook-signature': signature,
          },
          body: bodyString,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }

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

      // Normalize audio URL: support audio_url or audio_hex (base64)
      let audioUrl: string | undefined;
      if (data.audio_url && typeof data.audio_url === 'string' && data.audio_url.length > 0) {
        audioUrl = data.audio_url;
      } else if (data.audio_hex && typeof data.audio_hex === 'string' && data.audio_hex.length > 0) {
        audioUrl = `data:audio/mp3;base64,${data.audio_hex}`;
      }

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.text,
        audioUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Play audio if available
      if (audioUrl) {
        const audio = new Audio(audioUrl);
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

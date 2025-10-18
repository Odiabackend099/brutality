import Groq from 'groq-sdk';

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GroqLLM {
  private client: Groq | null;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('GROQ_API_KEY environment variable is not set');
      this.client = null;
    } else {
      this.client = new Groq({ apiKey });
    }
  }

  async respond({
    history,
    systemPrompt,
    model,
    temperature,
    maxTokens
  }: {
    history: { role: 'user' | 'assistant' | 'system'; content: string }[];
    systemPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('Groq client not initialized - check GROQ_API_KEY');
    }
    
    try {
      const messages = [
        { role: 'system' as const, content: systemPrompt || 'You are a professional AI receptionist. Be concise and helpful. Capture caller details when relevant.' },
        ...history,
      ];

      const response = await this.client.chat.completions.create({
        model: model || process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
        messages,
        temperature: temperature ?? 0.6,
        max_tokens: maxTokens ?? 400,
        stream: false
      });

      const choice = response.choices?.[0];
      if (!choice?.message?.content) {
        throw new Error('No response content from Groq');
      }

      return {
        content: choice.message.content.trim(),
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens
        } : undefined
      };
    } catch (error) {
      console.error('Groq LLM error:', error);
      throw new Error('Failed to generate response');
    }
  }

  async respondStreaming({
    history,
    systemPrompt,
    model,
    temperature,
    maxTokens
  }: {
    history: { role: 'user' | 'assistant' | 'system'; content: string }[];
    systemPrompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<ReadableStream<Uint8Array>> {
    if (!this.client) {
      throw new Error('Groq client not initialized - check GROQ_API_KEY');
    }
    
    try {
      const messages = [
        { role: 'system' as const, content: systemPrompt || 'You are a professional AI receptionist. Be concise and helpful. Capture caller details when relevant.' },
        ...history,
      ];

      const response = await this.client.chat.completions.create({
        model: model || process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
        messages,
        temperature: temperature ?? 0.6,
        max_tokens: maxTokens ?? 400,
        stream: true
      });

      return response as any; // Groq SDK returns a stream
    } catch (error) {
      console.error('Groq LLM streaming error:', error);
      throw new Error('Failed to generate streaming response');
    }
  }
}

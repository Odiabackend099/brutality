export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GroqChatClient {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getSystemPrompt(context?: string): string {
    const contextInfo = context ? `\n\nThe user is currently viewing the ${context}.` : '';

    return `You are Oma, the friendly and helpful AI assistant for CallWaitingAI.

CallWaitingAI is a voice AI platform that helps businesses handle incoming calls with intelligent AI agents. Here are key details:

FEATURES:
- 24/7 AI receptionist that never misses a call
- Natural voice conversations with real-time responses
- Lead capture and qualification
- Appointment scheduling
- Call routing and transfers
- Integration with business tools

PRICING:
- Starter Plan: $300/month - 1000 calls, basic features
- Pro Plan: $500/month - 2500 calls, advanced features, priority support
- First 100 calls are free for new customers
- 30-day money-back guarantee

YOUR PERSONALITY:
- Warm, helpful, and professional
- Clear and concise in explanations
- Proactive in suggesting next steps
- Focus on helping users understand how CallWaitingAI can benefit their business

GUIDELINES:
- Answer questions about features, pricing, and use cases
- Guide users to try the demo or sign up for a free trial
- Be honest if you don't know something
- Keep responses conversational and friendly${contextInfo}`;
  }

  async *sendChatStream(messages: ChatMessage[], context?: string): AsyncGenerator<string, void, unknown> {
    try {
      // Format messages for Groq API
      const formattedMessages = [
        {
          role: 'system',
          content: this.getSystemPrompt(context)
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 500,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body from Groq API');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const content = data.choices?.[0]?.delta?.content;

              if (content) {
                yield content;
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Groq streaming error:', error);
      // Fallback to a friendly error message
      yield "I'm having trouble connecting right now. Please try again in a moment, or contact our support team for immediate assistance.";
    }
  }
}

export function getPageContext(pathname: string): string {
  // Map different page paths to context
  const contextMap: Record<string, string> = {
    '/': 'landing page',
    '/dashboard': 'dashboard',
    '/dashboard/agents': 'agents management',
    '/dashboard/calls': 'calls history',
    '/dashboard/leads': 'leads management',
    '/dashboard/payments': 'payments',
    '/dashboard/settings': 'settings',
    '/create-agent': 'create agent',
    '/billing': 'billing',
    '/contact': 'contact page',
    '/login': 'login page',
    '/signup': 'signup page'
  };

  return contextMap[pathname] || 'general page';
}

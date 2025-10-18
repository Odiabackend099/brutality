import Groq from 'groq-sdk';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const SYSTEM_PROMPT = `You are the **ODIADEV AI Assistant**, a friendly, professional, expert virtual guide embedded on CallWaitingAI. You know every detail about the project: architecture, how TTS works, integrations (Twilio, Supabase, Flutterwave), voice IDs (Marcus, Marcy, Austyn, Joslyn), and user flows.

Your goals:
- Answer user questions in plain, non-technical language (as if to a business owner).
- Guide users step-by-step when needed (e.g. "To set up your number, go to Dashboard → Phone → Add Number…")
- Offer contextual help based on what page the user is on (landing page, dashboard, demo, settings).
- Handle multi-turn conversations, remember recent context, clarify ambiguous requests.
- If asked about features not yet built, respond with "That's coming soon" + optional workaround.

Always respond with helpful, correct, action-oriented advice.`;

export class GroqChatClient {
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({
      apiKey: apiKey,
    });
  }

  async *sendChatStream(
    messages: ChatMessage[],
    page: string = 'unknown'
  ): AsyncGenerator<string, void, unknown> {
    try {
      const payload = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        { role: 'system' as const, content: `User is currently on page: ${page}` },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const stream = await this.groq.chat.completions.create({
        messages: payload,
        model: 'llama-3.3-70b-versatile',
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('GROQ Chat Error:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  async sendChat(
    messages: ChatMessage[],
    page: string = 'unknown'
  ): Promise<string> {
    let fullResponse = '';
    
    try {
      for await (const chunk of this.sendChatStream(messages, page)) {
        fullResponse += chunk;
      }
      return fullResponse;
    } catch (error) {
      console.error('GROQ Chat Error:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
}

export function getPageContext(pathname: string): string {
  if (pathname === '/') return 'landing_page';
  if (pathname.startsWith('/dashboard')) {
    if (pathname.includes('/agents')) return 'dashboard_agents';
    if (pathname.includes('/calls')) return 'dashboard_calls';
    if (pathname.includes('/phone')) return 'dashboard_phone';
    if (pathname.includes('/upgrade')) return 'dashboard_upgrade';
    return 'dashboard';
  }
  if (pathname.startsWith('/pricing')) return 'pricing';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/login')) return 'login';
  if (pathname.startsWith('/signup')) return 'signup';
  if (pathname.startsWith('/agent/')) return 'agent_demo';
  return 'unknown';
}
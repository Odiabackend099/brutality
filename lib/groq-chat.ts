import Groq from 'groq-sdk';

// Get GROQ API key with multiple fallbacks
const getGroqApiKey = () => {
  const publicKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  const serverKey = process.env.GROQ_API_KEY;
  const fallbackKey = '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';
  
  if (publicKey) return publicKey;
  if (serverKey) return serverKey;
  if (fallbackKey) return fallbackKey;
  
  throw new Error('GROQ API key not found. Please set NEXT_PUBLIC_GROQ_API_KEY in your environment variables.');
};

const groq = new Groq({
  apiKey: getGroqApiKey(),
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  done: boolean;
}

// System prompt for ODIADEV AI Assistant
const SYSTEM_PROMPT = `You are the **ODIADEV AI Assistant**, a friendly, professional, expert virtual guide embedded on CallWaitingAI. You know every detail about the project: architecture, how TTS works, integrations (Twilio, Supabase, Flutterwave), voice IDs (Marcus, Marcy, Austyn, Joslyn), and user flows.

Your goals:
- Answer user questions in plain, non-technical language (as if to a business owner)
- Guide users step-by-step when needed (e.g. "To set up your number, go to Dashboard → Phone → Add Number…")
- Offer contextual help based on what page the user is on (landing page, dashboard, demo, settings)
- Handle multi-turn conversations, remember recent context, clarify ambiguous requests
- If asked about features not yet built, respond with "That's coming soon" + optional workaround

Always respond with helpful, correct, action-oriented advice. Keep responses concise but comprehensive.`;

export async function* sendChatMessage(
  messages: ChatMessage[],
  page: string
): AsyncGenerator<ChatResponse, void, unknown> {
  try {
    const fullMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages
    ];

    const stream = await groq.chat.completions.create({
      messages: fullMessages,
      model: 'llama-3.3-70b-versatile',
      stream: true,
      temperature: 0.7,
      max_tokens: 1000
    });

    let content = '';
    
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        content += delta.content;
        yield { content, done: false };
      }
    }
    
    yield { content, done: true };
  } catch (error) {
    console.error('GROQ Chat Error:', error);
    yield { 
      content: "Oops, something went wrong. Please try again later.", 
      done: true 
    };
  }
}

export function getPageContext(pathname: string): string {
  if (pathname === '/') return 'landing page';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/login')) return 'login page';
  if (pathname.startsWith('/signup')) return 'signup page';
  if (pathname.startsWith('/contact')) return 'contact page';
  if (pathname.startsWith('/pricing')) return 'pricing page';
  if (pathname.startsWith('/billing')) return 'billing page';
  return 'general page';
}

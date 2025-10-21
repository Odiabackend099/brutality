export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GroqChatClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async *sendChatStream(messages: ChatMessage[], context?: string): AsyncGenerator<string, void, unknown> {
    // Mock implementation for now - in production this would use Groq API
    const lastMessage = messages[messages.length - 1];
    const response = await this.generateResponse(lastMessage.content, context);
    
    // Simulate streaming by breaking response into chunks
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
      yield words[i] + (i < words.length - 1 ? ' ' : '');
    }
  }

  private async generateResponse(message: string, context?: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple mock responses based on message content
    const lowerMessage = message.toLowerCase();
    const contextNote = context ? ` [Context: ${context}]` : '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm your CallWaiting AI assistant. How can I help you today?${contextNote}`;
    }
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      return `We offer flexible pricing plans starting from $300 for the Starter plan and $500 for the Pro plan. Both include AI receptionist services and call handling capabilities.${contextNote}`;
    }
    
    if (lowerMessage.includes('features') || lowerMessage.includes('what can you do')) {
      return `CallWaiting AI provides 24/7 AI receptionist services, voice AI call handling, lead capture, and seamless integration with your business workflows.${contextNote}`;
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('test')) {
      return `You can test our AI receptionist by clicking the "Test Agent" button or scheduling a demo call with our team.${contextNote}`;
    }
    
    return `Thank you for your message! Our team will get back to you soon. In the meantime, feel free to explore our features or schedule a demo.${contextNote}`;
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

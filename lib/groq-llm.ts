import Groq from 'groq-sdk';

export class GroqLLM {
  private groq: Groq;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key',
      dangerouslyAllowBrowser: true, // Only for client-side usage
    });
  }

  async generateResponse(userMessage: string, systemPrompt?: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({ role: 'user', content: userMessage });

      // Prepare messages array
      const messages: Array<{ role: string; content: string }> = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      // Add conversation history (last 10 messages to keep context manageable)
      const recentHistory = this.conversationHistory.slice(-10);
      messages.push(...recentHistory);

      console.log('🤖 Sending to Groq:', { messageCount: messages.length, lastMessage: userMessage });

      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        max_tokens: 150, // Keep responses concise for voice
        stream: false,
      });

      const response = chatCompletion.choices[0]?.message?.content || 'I apologize, I didn\'t understand that.';

      // Add AI response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: response });

      console.log('🤖 Groq response:', response);
      return response;

    } catch (error) {
      console.error('❌ Groq LLM error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  clearHistory() {
    this.conversationHistory = [];
    console.log('🧹 Conversation history cleared');
  }

  getHistoryLength(): number {
    return this.conversationHistory.length;
  }

  // Get conversation context for debugging
  getConversationContext(): string {
    return this.conversationHistory.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');
  }
}

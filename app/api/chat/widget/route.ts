import { NextRequest, NextResponse } from 'next/server';
import { GroqChatClient, ChatMessage } from '@/lib/groq-chat-widget';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { messages, page } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Chat service temporarily unavailable' },
        { status: 500 }
      );
    }

    const chatClient = new GroqChatClient(groqApiKey);

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatClient.sendChatStream(
            messages as ChatMessage[],
            page || 'unknown'
          )) {
            // Send each chunk as SSE format
            const data = JSON.stringify({ content: chunk, done: false });
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
          
          // Send completion signal
          const doneData = JSON.stringify({ content: '', done: true });
          controller.enqueue(new TextEncoder().encode(`data: ${doneData}\n\n`));
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({ 
            error: 'Failed to generate response', 
            done: true 
          });
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
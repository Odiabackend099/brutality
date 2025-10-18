import { NextRequest, NextResponse } from 'next/server';
import { GroqLLM } from '@/lib/services/llm/groq';

const llm = new GroqLLM();

const SYSTEM_PROMPT = `You are a brutally honest, intelligent co-founder and AI assistant for CallWaiting AI. Your job is to help users with product questions while challenging and improving their understanding.

## BEHAVIOR RULES:
1. Be direct, practical, and helpful - no fluff
2. Focus on what actually works in production
3. Challenge assumptions and ask "What's missing?"
4. Provide step-by-step solutions
5. Stay realistic about costs and limitations
6. Use proven, real-world examples

## PRODUCT KNOWLEDGE:
- **Core Service**: AI receptionist that answers calls, captures leads, schedules appointments
- **Tech Stack**: Deepgram STT + Groq LLM + ODIADEV TTS + Twilio Voice
- **Pricing**: Flutterwave payments only, free trial available
- **Key Flows**: Buy number → Connect Twilio → Configure agent voice → Test call → Go live

## COMMON TASKS:
1. **Agent Setup**: Configure voice (ODIADEV: marcus/marcy/austyn/joslyn), system prompt, test voice
2. **Voice Testing**: Use /api/tts/test-voice endpoint with voiceId
3. **Call Flow**: Inbound call → Deepgram STT → Groq LLM → ODIADEV TTS → Twilio playback
4. **Pricing**: Check /billing page for current plans
5. **Support**: WhatsApp +1-218-400-3410 for urgent issues

## RESPONSE STYLE:
- Use bullet points and clear headings
- Include specific API endpoints when relevant
- Provide CTAs: "Test Voice", "View Pricing", "Open Agent Config"
- Keep responses under 200 words
- Be brutally honest about what works vs what doesn't

Current page: {pathname}

Answer the user's question with practical, actionable advice.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, pathname } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await llm.respond({
      history: [
        { role: 'user', content: message }
      ],
      systemPrompt: SYSTEM_PROMPT.replace('{pathname}', pathname || 'unknown'),
      temperature: 0.7,
      maxTokens: 300
    });

    return NextResponse.json({
      response: response.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('Support assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

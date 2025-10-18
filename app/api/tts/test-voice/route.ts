import { NextRequest, NextResponse } from 'next/server';
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, voiceId, text } = body;

    if (provider !== 'odiadev') {
      return NextResponse.json(
        { error: 'Only ODIADEV TTS provider is supported' },
        { status: 400 }
      );
    }

    if (!voiceId) {
      return NextResponse.json(
        { error: 'voiceId is required' },
        { status: 400 }
      );
    }

    const testText = text || "Hello! This is a test of the voice synthesis. How does this sound?";
    const tts = new OdiaDevTTS();
    const result = await tts.synthesize({ 
      text: testText, 
      voiceId 
    });

    return NextResponse.json({ 
      success: true, 
      audioUrl: result.audioUrl,
      voiceId,
      text: testText,
      duration: result.duration,
      size: result.size
    });
  } catch (error) {
    console.error('Error testing TTS voice:', error);
    return NextResponse.json(
      { error: 'Failed to test voice synthesis' },
      { status: 500 }
    );
  }
}

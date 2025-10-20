import { NextRequest, NextResponse } from 'next/server';
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId } = body;

    console.log('=== TTS Test Request ===');
    console.log('Text:', text);
    console.log('Voice ID:', voiceId);

    const tts = new OdiaDevTTS();
    const testText = text || "Hello! This is a test of the text to speech system. How does this sound?";
    
    // Test the TTS generation
    const result = await tts.synthesize({
      text: testText,
      voiceId: voiceId || process.env.DEFAULT_VOICE || 'marcus'
    });
    
    console.log('TTS Result:', result);
    
    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'TTS generation successful',
      result: result,
      environment: {
        apiKeySet: !!process.env.ODIADEV_TTS_API_KEY,
        baseUrl: process.env.ODIADEV_TTS_BASE_URL,
        defaultVoice: process.env.DEFAULT_VOICE
      }
    });
  } catch (error) {
    console.error('TTS Test Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
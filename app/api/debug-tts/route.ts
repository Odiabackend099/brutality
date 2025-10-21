import { NextResponse } from 'next/server';
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';

export async function GET() {
  try {
    console.log('=== Debugging ODIADEV TTS Service ===');
    
    const tts = new OdiaDevTTS();
    
    // Check if API key is set
    console.log('API Key set:', !!process.env.ODIADEV_TTS_API_KEY);
    console.log('Base URL:', process.env.ODIADEV_TTS_BASE_URL || 'Using default');
    
    // Test voices
    console.log('\n--- Testing Voices ---');
    const voices = await tts.voices();
    console.log('Voices retrieved successfully:', voices.length);
    console.log('First voice:', voices[0]);
    
    // Test synthesis
    console.log('\n--- Testing Synthesis ---');
    const result = await tts.synthesize({
      text: 'Hello, this is a test of the text to speech system.',
      voiceId: 'marcus'
    });
    console.log('Synthesis result:', result);
    
    return NextResponse.json({ 
      success: true,
      voices: voices,
      synthesis: result
    });
  } catch (error) {
    console.error('Debug TTS Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

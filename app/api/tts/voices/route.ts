import { NextRequest, NextResponse } from 'next/server';
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'odiadev';

    if (provider !== 'odiadev') {
      return NextResponse.json(
        { error: 'Only ODIADEV TTS provider is supported' },
        { status: 400 }
      );
    }

    const tts = new OdiaDevTTS();
    const voices = await tts.voices();

    return NextResponse.json({ 
      voices,
      provider: 'odiadev'
    });
  } catch (error) {
    console.error('Error fetching TTS voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

import { VoiceId } from './services/tts/odiadev';

export type { VoiceId };

export interface TTSResponse {
  audioUrl?: string;
  duration?: number;
  error?: string;
}

export function estimateDuration(text: string): number {
  // Estimate ~150 words per minute for TTS
  const words = text.split(/\s+/).length;
  return Math.ceil((words / 150) * 60);
}

export async function generateTTS(text: string, voiceId: VoiceId): Promise<TTSResponse> {
  try {
    // Check if we have the required environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Call the actual TTS API endpoint
    const response = await fetch(`${baseUrl}/api/tts/test-voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'odiadev',
        voiceId: voiceId || 'marcus',
        text: text
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Return the actual audio URL from the API
    return {
      audioUrl: data.audioUrl,
      duration: data.duration || estimateDuration(text)
    };
  } catch (error) {
    console.error('TTS Generation Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate TTS audio'
    };
  }
}
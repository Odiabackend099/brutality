export type VoiceId = string;

export interface Voice {
  id: string;
  name: string;
  gender?: string;
  language?: string;
  accent?: string;
}

// MiniMax Voice ID Mappings
export const VOICE_MAPPINGS = {
  // Friendly names -> MiniMax Voice IDs
  'odia': 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',       // Odia - African Male (Default)
  'marcus': 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',     // Marcus - American Male
  'marcy': 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',      // Marcy - American Female
  'joslyn': 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',     // Joslyn - African Female

  // Alternative spellings
  'austyn': 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',     // Alias for Odia
} as const;

export type VoiceName = keyof typeof VOICE_MAPPINGS;

export interface TTSResponse {
  audioUrl: string;
  duration?: number;
  size?: number;
}

export interface TTSOptions {
  text: string;
  voiceId: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
}

export class OdiaDevTTS {
  private baseUrl: string;
  private apiKey: string;
  private groupId: string;

  constructor() {
    this.baseUrl = process.env.ODIADEV_TTS_BASE_URL || 'https://minimax-tts-odiadev.onrender.com';
    this.apiKey = process.env.ODIADEV_TTS_API_KEY || process.env.MINIMAX_API_KEY || '';
    this.groupId = process.env.ODIADEV_TTS_GROUP_ID || process.env.MINIMAX_GROUP_ID || '';
    
    if (!this.apiKey) {
      console.warn('ODIADEV_TTS_API_KEY or MINIMAX_API_KEY environment variable is not set');
    }
    
    if (!this.groupId) {
      console.warn('ODIADEV_TTS_GROUP_ID or MINIMAX_GROUP_ID environment variable is not set');
    }
  }

  async voices(): Promise<Voice[]> {
    // Return available voices with friendly names and MiniMax IDs
    return [
      {
        id: 'odia',
        name: 'Odia',
        gender: 'male',
        accent: 'African',
        language: 'en'
      },
      {
        id: 'marcus',
        name: 'Marcus',
        gender: 'male',
        accent: 'American',
        language: 'en'
      },
      {
        id: 'marcy',
        name: 'Marcy',
        gender: 'female',
        accent: 'American',
        language: 'en'
      },
      {
        id: 'joslyn',
        name: 'Joslyn',
        gender: 'female',
        accent: 'African',
        language: 'en'
      }
    ];
  }

  async synthesize({ text, voiceId, speed, pitch, emotion }: TTSOptions): Promise<TTSResponse> {
    if (!this.apiKey) {
      throw new Error('ODIADEV_TTS_API_KEY not set - cannot synthesize speech');
    }

    try {
      if (!text.trim()) {
        throw new Error('Text cannot be empty');
      }

      // Map friendly voice name to MiniMax voice ID
      const friendlyVoiceId = voiceId || process.env.DEFAULT_VOICE || 'odia';
      const actualVoiceId = VOICE_MAPPINGS[friendlyVoiceId as VoiceName] || VOICE_MAPPINGS.odia;

      console.log(`[TTS] Mapping voice: ${friendlyVoiceId} -> ${actualVoiceId}`);

      const requestBody: any = {
        text: text.trim(),
        voice_id: actualVoiceId,
        model: process.env.MINIMAX_MODEL || 'speech-02-hd',
        speed: speed ?? parseFloat(process.env.DEFAULT_SPEED || '1.0'),
        pitch: pitch !== undefined ? pitch : parseFloat(process.env.DEFAULT_PITCH || '0'),
        emotion: emotion || process.env.DEFAULT_EMOTION || 'neutral'
      };

      // Add group_id if available
      if (this.groupId) {
        requestBody.group_id = this.groupId;
      }

      console.log(`[TTS] Sending request to ${this.baseUrl}/v1/tts`);

      const response = await fetch(`${this.baseUrl}/v1/tts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS synthesis failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();

      return {
        audioUrl: data.audio_url || data.url || data.audioUrl || '',
        duration: data.duration,
        size: data.size
      };
    } catch (error) {
      console.error('OdiaDevTTS synthesis error:', error);
      throw new Error(`Failed to synthesize speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testVoice(voiceId: string): Promise<TTSResponse> {
    const testText = "Hello! This is a test of the voice synthesis. How does this sound?";
    return this.synthesize({ text: testText, voiceId });
  }
}
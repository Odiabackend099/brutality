export interface Voice {
  id: string;
  name: string;
  gender?: string;
  language?: string;
}

export interface TTSResponse {
  audioUrl: string;
  duration?: number;
  size?: number;
}

export class OdiaDevTTS {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.ODIADEV_TTS_BASE_URL || 'https://minimax-tts-odiadev.onrender.com';
    this.apiKey = process.env.ODIADEV_TTS_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('ODIADEV_TTS_API_KEY environment variable is not set');
    }
  }

  async voices(): Promise<Voice[]> {
    if (!this.apiKey) {
      console.warn('ODIADEV_TTS_API_KEY not set, returning fallback voices');
      return [
        { id: 'marcus', name: 'Marcus (US Male)', gender: 'male', language: 'en' },
        { id: 'marcy', name: 'Marcy (US Female)', gender: 'female', language: 'en' },
        { id: 'austyn', name: 'Austyn (African Male)', gender: 'male', language: 'en' },
        { id: 'joslyn', name: 'Joslyn (African Female)', gender: 'female', language: 'en' }
      ];
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/voices`, {
        headers: { 
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map to our Voice interface
      return (data.voices || []).map((v: any) => ({
        id: v.slug || v.id || v.voice_id,
        name: v.name || v.display_name || v.voice_name,
        gender: v.gender,
        language: v.language || 'en'
      }));
    } catch (error) {
      console.error('OdiaDevTTS voices error:', error);
      
      // Fallback voices if API fails
      return [
        { id: 'marcus', name: 'Marcus (US Male)', gender: 'male', language: 'en' },
        { id: 'marcy', name: 'Marcy (US Female)', gender: 'female', language: 'en' },
        { id: 'austyn', name: 'Austyn (African Male)', gender: 'male', language: 'en' },
        { id: 'joslyn', name: 'Joslyn (African Female)', gender: 'female', language: 'en' }
      ];
    }
  }

  async synthesize({ text, voiceId }: { text: string; voiceId: string }): Promise<TTSResponse> {
    if (!this.apiKey) {
      throw new Error('ODIADEV_TTS_API_KEY not set - cannot synthesize speech');
    }
    
    try {
      if (!text.trim()) {
        throw new Error('Text cannot be empty');
      }

      const response = await fetch(`${this.baseUrl}/v1/tts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text: text.trim(),
          voice_id: voiceId,
          format: 'mp3',
          speed: 1.0
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS synthesis failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        audioUrl: data.audio_url || data.url || data.audioUrl,
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

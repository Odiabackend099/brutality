export class CustomTTS {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  async generateSpeech(text: string, voiceId?: string): Promise<ArrayBuffer> {
    try {
      console.log('🔊 Generating speech for:', text.substring(0, 50) + '...');

      const response = await fetch(`${this.apiUrl}/api/generate-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: voiceId || 'alloy', // Default voice
          speed: 1.0,
          pitch: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      console.log('🔊 Speech generated successfully');
      return audioBuffer;

    } catch (error) {
      console.error('❌ TTS generation error:', error);
      throw new Error('Failed to generate speech');
    }
  }

  async generateSpeechStream(text: string, voiceId?: string, onChunk?: (chunk: ArrayBuffer) => void): Promise<void> {
    try {
      console.log('🔊 Generating streaming speech for:', text.substring(0, 50) + '...');

      const response = await fetch(`${this.apiUrl}/api/generate-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: voiceId || 'alloy',
          speed: 1.0,
          pitch: 1.0,
          streaming: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Handle streaming audio chunks
        if (onChunk) {
          onChunk(value);
        }
      }

      console.log('🔊 Streaming speech completed');

    } catch (error) {
      console.error('❌ TTS streaming error:', error);
      throw new Error('Failed to generate streaming speech');
    }
  }

  // Get available voices
  async getAvailableVoices(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch(`${this.apiUrl}/api/tts/voices`);
      
      if (!response.ok) {
        throw new Error(`Voices API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];

    } catch (error) {
      console.error('❌ Failed to get voices:', error);
      return [];
    }
  }

  // Test TTS functionality
  async testTTS(): Promise<boolean> {
    try {
      const testText = "Hello, this is a test of the text to speech system.";
      await this.generateSpeech(testText);
      return true;
    } catch (error) {
      console.error('❌ TTS test failed:', error);
      return false;
    }
  }
}

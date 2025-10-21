import { OdiaDevTTS } from './services/tts/odiadev';

export interface VoiceParameters {
  speed?: number;
  pitch?: number;
  emotion?: string;
}

export class CustomTTS {
  private apiUrl: string;
  private ttsService: OdiaDevTTS;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // Start with 1 second

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.ttsService = new OdiaDevTTS();
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.maxRetries,
    delay: number = this.retryDelay
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      console.log(`⚠️ Retry attempt ${this.maxRetries - retries + 1}/${this.maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Exponential backoff
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }

  async generateSpeech(text: string, voiceId?: string, params?: VoiceParameters): Promise<ArrayBuffer> {
    return this.retryWithBackoff(async () => {
      try {
        console.log('🔊 Generating speech for:', text.substring(0, 50) + '...');

        // Use the actual TTS generation function
        const result = await this.ttsService.synthesize({
          text: text,
          voiceId: voiceId || process.env.DEFAULT_VOICE || 'odia',
          speed: params?.speed,
          pitch: params?.pitch,
          emotion: params?.emotion
        });

        if (!result.audioUrl) {
          throw new Error('No audio URL returned from TTS service');
        }

        // Fetch the actual audio file
        const audioResponse = await fetch(result.audioUrl);

        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }

        const audioBuffer = await audioResponse.arrayBuffer();
        console.log('🔊 Speech generated successfully');
        return audioBuffer;

      } catch (error) {
        console.error('❌ TTS generation error:', error);
        throw new Error('Failed to generate speech: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }

  async generateSpeechStream(text: string, voiceId?: string, params?: VoiceParameters, onChunk?: (chunk: ArrayBuffer) => void): Promise<void> {
    return this.retryWithBackoff(async () => {
      try {
        console.log('🔊 Generating streaming speech for:', text.substring(0, 50) + '...');

        // For streaming, we'll use the TTS service directly
        const result = await this.ttsService.synthesize({
          text: text,
          voiceId: voiceId || process.env.DEFAULT_VOICE || 'odia',
          speed: params?.speed,
          pitch: params?.pitch,
          emotion: params?.emotion
        });

        if (!result.audioUrl) {
          throw new Error('No audio URL returned from TTS service');
        }

        // Fetch the actual audio file
        const audioResponse = await fetch(result.audioUrl);

        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }

        const audioBuffer = await audioResponse.arrayBuffer();

        // Handle streaming audio chunks
        if (onChunk) {
          onChunk(audioBuffer);
        }

        console.log('🔊 Streaming speech completed');

      } catch (error) {
        console.error('❌ TTS streaming error:', error);
        throw new Error('Failed to generate streaming speech: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    });
  }

  // Get available voices
  async getAvailableVoices(): Promise<Array<{ id: string; name: string }>> {
    try {
      const ttsService = new OdiaDevTTS();
      const voices = await ttsService.voices();
      
      // Map to the expected format
      return voices.map(voice => ({
        id: voice.id,
        name: voice.name
      }));

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
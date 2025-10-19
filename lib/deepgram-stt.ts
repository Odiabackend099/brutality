import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramSTT {
  private deepgram: any = null;
  private connection: any = null;
  private onTranscript?: (text: string, isFinal: boolean) => void;
  private onError?: (error: string) => void;
  private isConnected = false;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || 'your-deepgram-api-key';
    this.deepgram = createClient(apiKey);
  }

  async connect(callbacks: {
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
  }) {
    this.onTranscript = callbacks.onTranscript;
    this.onError = callbacks.onError;

    try {
      this.connection = this.deepgram.listen.live({
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        interim_results: true,
        endpointing: 300,
        utterance_end_ms: 1000,
        vad_events: true,
      });

      this.connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('🎤 Deepgram connection opened');
        this.isConnected = true;
      });

      this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        const isFinal = data.is_final;
        
        if (transcript && this.onTranscript) {
          console.log(`📝 Transcript: "${transcript}" (final: ${isFinal})`);
          this.onTranscript(transcript, isFinal);
        }
      });

      this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
        console.error('❌ Deepgram error:', error);
        if (this.onError) this.onError(error.message || 'Deepgram connection error');
      });

      this.connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('🎤 Deepgram connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to Deepgram:', error);
      if (this.onError) this.onError('Failed to connect to Deepgram');
      throw error;
    }
  }

  sendAudio(audioData: Float32Array) {
    if (this.connection && this.isConnected) {
      // Convert Float32Array to Int16Array for Deepgram
      const int16Data = new Int16Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        int16Data[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
      }
      
      this.connection.send(int16Data.buffer);
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.finish();
      this.connection = null;
    }
    this.isConnected = false;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

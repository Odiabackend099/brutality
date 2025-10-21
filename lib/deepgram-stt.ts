import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramSTT {
  private deepgram: any = null;
  private connection: any = null;
  private onTranscript?: (text: string, isFinal: boolean) => void;
  private onError?: (error: string) => void;
  private isConnected = false;
  private apiKey: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || '';

    // Validate API key
    if (!this.apiKey || this.apiKey === 'your-deepgram-api-key') {
      console.error('❌ DEEPGRAM_API_KEY environment variable is not set');
      throw new Error('Deepgram API key is missing. Please set NEXT_PUBLIC_DEEPGRAM_API_KEY in your environment variables.');
    }

    this.deepgram = createClient(this.apiKey);
    console.log('✅ Deepgram client created successfully');
  }

  async connect(callbacks: {
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
  }) {
    this.onTranscript = callbacks.onTranscript;
    this.onError = callbacks.onError;

    // Clear any existing connection timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    try {
      console.log('🔌 Attempting to connect to Deepgram...');

      this.connection = this.deepgram.listen.live({
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        interim_results: true,
        endpointing: 300,
        utterance_end_ms: 1000,
        vad_events: true,
      });

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.error('❌ Deepgram connection timeout');
          if (this.onError) this.onError('Connection timeout. Please try again.');
          this.attemptReconnect();
        }
      }, 10000); // 10 second timeout

      this.connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('✅ Deepgram connection opened successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0; // Reset reconnect counter on successful connection

        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
      });

      this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        const isFinal = data.is_final;

        if (transcript && this.onTranscript) {
          console.log(`📝 Transcript (${isFinal ? 'final' : 'interim'}): "${transcript}"`);
          this.onTranscript(transcript, isFinal);
        }
      });

      this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
        console.error('❌ Deepgram error:', error);
        const errorMessage = error.message || 'Speech recognition error';

        if (this.onError) this.onError(errorMessage);

        // Attempt to reconnect on error
        this.attemptReconnect();
      });

      this.connection.on(LiveTranscriptionEvents.Close, (event: any) => {
        console.log('🔌 Deepgram connection closed', event);
        this.isConnected = false;

        // Attempt to reconnect if closed unexpectedly
        if (event?.code !== 1000) { // 1000 is normal closure
          console.log('🔄 Unexpected closure, attempting to reconnect...');
          this.attemptReconnect();
        }
      });

    } catch (error: any) {
      console.error('❌ Failed to connect to Deepgram:', error);
      const errorMessage = error.message || 'Failed to connect to speech recognition service';

      if (this.onError) this.onError(errorMessage);

      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      if (this.onError) {
        this.onError('Speech recognition disconnected. Please refresh the page.');
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000); // Exponential backoff

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect({
        onTranscript: this.onTranscript,
        onError: this.onError
      });
    }, delay);
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
    console.log('🔌 Disconnecting from Deepgram...');

    // Clear connection timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    // Reset reconnect attempts
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent automatic reconnection

    if (this.connection) {
      try {
        this.connection.finish();
      } catch (error) {
        console.error('Error finishing connection:', error);
      }
      this.connection = null;
    }

    this.isConnected = false;
    console.log('✅ Disconnected from Deepgram');
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

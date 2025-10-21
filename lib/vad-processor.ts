import { MicVAD } from '@ricky0123/vad-web';

export class VADProcessor {
  private vad: any = null;
  private onSpeechStart?: () => void;
  private onSpeechEnd?: (audio: Float32Array) => void;
  private onVADMisfire?: () => void;
  private isInitialized = false;

  async initialize(callbacks: {
    onSpeechStart?: () => void;
    onSpeechEnd?: (audio: Float32Array) => void;
    onVADMisfire?: () => void;
  }) {
    if (this.isInitialized) return;

    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;
    this.onVADMisfire = callbacks.onVADMisfire;

    try {
      // Request microphone permission explicitly first
      console.log('🎤 Requesting microphone permission...');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close the stream immediately after permission granted
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Microphone permission granted');
      } catch (permError: any) {
        console.error('❌ Microphone permission denied:', permError);

        // Throw a user-friendly error
        const errorMessage = permError.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser settings and refresh the page.'
          : permError.name === 'NotFoundError'
          ? 'No microphone found. Please connect a microphone and try again.'
          : `Microphone access error: ${permError.message}`;

        throw new Error(errorMessage);
      }

      // Initialize VAD after permission granted
      this.vad = await MicVAD.new({
        onSpeechStart: () => {
          console.log('🎤 Speech started');
          if (this.onSpeechStart) this.onSpeechStart();
        },
        onSpeechEnd: (audio) => {
          console.log('🎤 Speech ended');
          if (this.onSpeechEnd) this.onSpeechEnd(audio);
        },
        onVADMisfire: () => {
          console.log('🎤 VAD misfire');
          if (this.onVADMisfire) this.onVADMisfire();
        },
        positiveSpeechThreshold: 0.8,
        negativeSpeechThreshold: 0.75,
        redemptionMs: 128, // Convert frames to ms (8 * 16)
        submitUserSpeechOnPause: true,
        onnxWASMBasePath: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/',
        baseAssetPath: 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.27/dist/',
      });

      this.isInitialized = true;
      console.log('✅ VAD initialized successfully');
    } catch (error) {
      console.error('❌ VAD initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  start() {
    if (this.vad && this.isInitialized) {
      this.vad.start();
      console.log('🎤 VAD started');
    }
  }

  pause() {
    if (this.vad && this.isInitialized) {
      this.vad.pause();
      console.log('🎤 VAD paused');
    }
  }

  destroy() {
    if (this.vad) {
      this.vad.destroy();
      this.vad = null;
      this.isInitialized = false;
      console.log('🎤 VAD destroyed');
    }
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

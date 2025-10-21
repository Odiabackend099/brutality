import { MicVAD } from '@ricky0123/vad-web';

export interface EnhancedVADConfig {
  positiveSpeechThreshold: number;
  negativeSpeechThreshold: number;
  redemptionFrames: number;
  frameSamples: number;
  preSpeechPadFrames: number;
  minSpeechFrames: number;
  submitUserSpeechOnPause: boolean;
  enableInterruption: boolean;
  interruptionThreshold: number; // Volume threshold for interruption detection
  silenceTimeout: number; // Timeout for silence detection
}

export interface VADCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (audio: Float32Array) => void;
  onVADMisfire?: () => void;
  onInterruption?: () => void;
  onSilenceTimeout?: () => void;
  onVolumeChange?: (volume: number) => void;
}

export interface VADMetrics {
  speechDuration: number;
  silenceDuration: number;
  interruptionCount: number;
  averageVolume: number;
  lastSpeechTime: number;
}

export class EnhancedVADProcessor {
  private config: EnhancedVADConfig;
  private vad: any = null;
  private callbacks: VADCallbacks = {};
  private isInitialized = false;
  private isActive = false;
  
  // Interruption detection
  private interruptionDetected = false;
  private lastSpeechTime = 0;
  private silenceStartTime = 0;
  private silenceTimeout: NodeJS.Timeout | null = null;
  
  // Volume tracking
  private volumeHistory: number[] = [];
  private maxVolumeHistory = 100;
  private currentVolume = 0;
  
  // Metrics
  private metrics: VADMetrics = {
    speechDuration: 0,
    silenceDuration: 0,
    interruptionCount: 0,
    averageVolume: 0,
    lastSpeechTime: 0
  };

  constructor(config: Partial<EnhancedVADConfig> = {}) {
    this.config = {
      positiveSpeechThreshold: 0.8,
      negativeSpeechThreshold: 0.75,
      redemptionFrames: 8,
      frameSamples: 1536,
      preSpeechPadFrames: 1,
      minSpeechFrames: 3,
      submitUserSpeechOnPause: true,
      enableInterruption: true,
      interruptionThreshold: 0.9,
      silenceTimeout: 3000, // 3 seconds
      ...config
    };
  }

  async initialize(callbacks: VADCallbacks) {
    this.callbacks = callbacks;

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
        onSpeechStart: () => this.handleSpeechStart(),
        onSpeechEnd: (audio) => this.handleSpeechEnd(audio),
        onVADMisfire: () => this.handleVADMisfire(),
        positiveSpeechThreshold: this.config.positiveSpeechThreshold,
        negativeSpeechThreshold: this.config.negativeSpeechThreshold,
        submitUserSpeechOnPause: this.config.submitUserSpeechOnPause,
        onnxWASMBasePath: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/',
        baseAssetPath: 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.27/dist/',
      });

      this.isInitialized = true;
      console.log('✅ EnhancedVADProcessor initialized successfully');
    } catch (error) {
      console.error('❌ EnhancedVADProcessor initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  start() {
    if (!this.isInitialized || this.isActive) return;
    
    try {
      this.vad.start();
      this.isActive = true;
      this.interruptionDetected = false;
      
      // Start silence timeout
      this.startSilenceTimeout();
      
      console.log('🎤 Enhanced VAD started');
    } catch (error) {
      console.error('❌ Failed to start Enhanced VAD:', error);
    }
  }

  pause() {
    if (!this.isActive) return;
    
    try {
      this.vad.pause();
      this.isActive = false;
      
      // Clear silence timeout
      this.clearSilenceTimeout();
      
      console.log('🎤 Enhanced VAD paused');
    } catch (error) {
      console.error('❌ Failed to pause Enhanced VAD:', error);
    }
  }

  destroy() {
    if (this.vad) {
      try {
        this.vad.destroy();
        this.vad = null;
        this.isInitialized = false;
        this.isActive = false;
        
        // Clear timeouts
        this.clearSilenceTimeout();
        
        console.log('🎤 Enhanced VAD destroyed');
      } catch (error) {
        console.error('❌ Error destroying Enhanced VAD:', error);
      }
    }
  }

  private handleSpeechStart() {
    console.log('🎤 Speech started');
    
    // Update metrics
    this.metrics.lastSpeechTime = Date.now();
    this.lastSpeechTime = Date.now();
    
    // Clear silence timeout
    this.clearSilenceTimeout();
    
    // Reset interruption flag
    this.interruptionDetected = false;
    
    // Notify callback
    if (this.callbacks.onSpeechStart) {
      this.callbacks.onSpeechStart();
    }
  }

  private handleSpeechEnd(audio: Float32Array) {
    console.log('🎤 Speech ended');
    
    // Calculate speech duration
    const speechDuration = Date.now() - this.lastSpeechTime;
    this.metrics.speechDuration = speechDuration;
    
    // Calculate average volume
    const volume = this.calculateVolume(audio);
    this.updateVolumeMetrics(volume);
    
    // Start silence timeout
    this.startSilenceTimeout();
    
    // Notify callback
    if (this.callbacks.onSpeechEnd) {
      this.callbacks.onSpeechEnd(audio);
    }
  }

  private handleVADMisfire() {
    console.log('🎤 VAD misfire');
    
    // Update silence duration
    this.metrics.silenceDuration = Date.now() - this.lastSpeechTime;
    
    // Notify callback
    if (this.callbacks.onVADMisfire) {
      this.callbacks.onVADMisfire();
    }
  }

  private handleInterruption() {
    if (!this.config.enableInterruption || this.interruptionDetected) return;
    
    console.log('⚠️ Interruption detected');
    
    this.interruptionDetected = true;
    this.metrics.interruptionCount++;
    
    // Clear silence timeout
    this.clearSilenceTimeout();
    
    // Notify callback
    if (this.callbacks.onInterruption) {
      this.callbacks.onInterruption();
    }
  }

  private handleSilenceTimeout() {
    console.log('🔇 Silence timeout reached');
    
    // Notify callback
    if (this.callbacks.onSilenceTimeout) {
      this.callbacks.onSilenceTimeout();
    }
  }

  private calculateVolume(audio: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audio.length; i++) {
      sum += Math.abs(audio[i]);
    }
    return sum / audio.length;
  }

  private updateVolumeMetrics(volume: number) {
    this.currentVolume = volume;
    
    // Add to volume history
    this.volumeHistory.push(volume);
    if (this.volumeHistory.length > this.maxVolumeHistory) {
      this.volumeHistory.shift();
    }
    
    // Calculate average volume
    const sum = this.volumeHistory.reduce((a, b) => a + b, 0);
    this.metrics.averageVolume = sum / this.volumeHistory.length;
    
    // Notify volume change
    if (this.callbacks.onVolumeChange) {
      this.callbacks.onVolumeChange(volume);
    }
    
    // Check for interruption
    if (volume > this.config.interruptionThreshold) {
      this.handleInterruption();
    }
  }

  private startSilenceTimeout() {
    this.clearSilenceTimeout();
    
    this.silenceTimeout = setTimeout(() => {
      this.handleSilenceTimeout();
    }, this.config.silenceTimeout);
  }

  private clearSilenceTimeout() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  // Public methods for external control
  setInterruptionThreshold(threshold: number) {
    this.config.interruptionThreshold = Math.max(0, Math.min(1, threshold));
  }

  setSilenceTimeout(timeout: number) {
    this.config.silenceTimeout = timeout;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isActive: this.isActive,
      interruptionDetected: this.interruptionDetected,
      currentVolume: this.currentVolume,
      silenceTimeoutActive: this.silenceTimeout !== null
    };
  }

  getMetrics(): VADMetrics {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      speechDuration: 0,
      silenceDuration: 0,
      interruptionCount: 0,
      averageVolume: 0,
      lastSpeechTime: 0
    };
    this.volumeHistory = [];
  }

  // Method to manually trigger interruption
  triggerInterruption() {
    this.handleInterruption();
  }
}

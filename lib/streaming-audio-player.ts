export interface AudioPlayerConfig {
  enableInterruption: boolean;
  bufferSize: number;
  crossfadeDuration: number; // Duration for crossfading between audio clips
  maxQueueSize: number;
}

export interface AudioPlayerCallbacks {
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onInterruption?: () => void;
  onError?: (error: Error) => void;
  onBufferUpdate?: (bufferSize: number) => void;
}

export interface AudioClip {
  id: string;
  buffer: ArrayBuffer;
  timestamp: number;
  priority: number; // Higher priority clips play first
}

export class StreamingAudioPlayer {
  private config: AudioPlayerConfig;
  private callbacks: AudioPlayerCallbacks = {};
  
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private audioQueue: AudioClip[] = [];
  private currentSource: AudioBufferSourceNode | null = null;
  
  private isInitialized = false;
  private isPlaying = false;
  private isInterrupted = false;
  private currentVolume = 1.0;
  private fadeOutDuration = 100; // ms
  
  // Performance tracking
  private playbackMetrics = {
    totalPlayed: 0,
    totalInterrupted: 0,
    averageLatency: 0,
    lastPlaybackTime: 0
  };

  constructor(config: Partial<AudioPlayerConfig> = {}) {
    this.config = {
      enableInterruption: true,
      bufferSize: 4096,
      crossfadeDuration: 50,
      maxQueueSize: 10,
      ...config
    };
  }

  async initialize(callbacks: AudioPlayerCallbacks) {
    this.callbacks = callbacks;
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.currentVolume;
      
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
      console.log('✅ StreamingAudioPlayer initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize StreamingAudioPlayer:', error);
      throw error;
    }
  }

  async play(audioBuffer: ArrayBuffer, priority: number = 0): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('StreamingAudioPlayer not initialized');
    }

    try {
      // Create audio clip
      const clip: AudioClip = {
        id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        buffer: audioBuffer,
        timestamp: Date.now(),
        priority
      };

      // Add to queue
      this.addToQueue(clip);
      
      // Start playback if not already playing
      if (!this.isPlaying) {
        await this.processQueue();
      }
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error as Error);
      }
    }
  }

  async stop(): Promise<void> {
    if (this.currentSource) {
      try {
        // Fade out current audio
        await this.fadeOut();
        
        // Stop current source
        this.currentSource.stop();
        this.currentSource.disconnect();
        this.currentSource = null;
      } catch (error) {
        console.debug('Audio source already stopped:', error);
      }
    }
    
    this.isPlaying = false;
    this.isInterrupted = true;
    
    // Clear queue
    this.audioQueue = [];
    
    // Notify interruption
    if (this.callbacks.onInterruption) {
      this.callbacks.onInterruption();
    }
    
    console.log('🔇 Audio playback stopped');
  }

  async interrupt(): Promise<void> {
    if (this.config.enableInterruption) {
      await this.stop();
      this.playbackMetrics.totalInterrupted++;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (this.gainNode) {
      this.currentVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setValueAtTime(this.currentVolume, this.audioContext!.currentTime);
    }
  }

  async pause(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private addToQueue(clip: AudioClip): void {
    // Add clip to queue with priority sorting
    this.audioQueue.push(clip);
    this.audioQueue.sort((a, b) => b.priority - a.priority);
    
    // Limit queue size
    if (this.audioQueue.length > this.config.maxQueueSize) {
      this.audioQueue = this.audioQueue.slice(0, this.config.maxQueueSize);
    }
    
    // Notify buffer update
    if (this.callbacks.onBufferUpdate) {
      this.callbacks.onBufferUpdate(this.audioQueue.length);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.audioQueue.length === 0 || this.isPlaying) {
      return;
    }

    try {
      // Get next clip from queue
      const clip = this.audioQueue.shift()!;
      
      // Decode audio buffer
      const audioBuffer = await this.audioContext!.decodeAudioData(clip.buffer);
      
      // Create audio source
      this.currentSource = this.audioContext!.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      this.currentSource.connect(this.gainNode!);
      
      // Set up event handlers
      this.currentSource.onended = () => {
        this.handlePlaybackEnd();
      };
      
      // Start playback
      this.currentSource.start();
      this.isPlaying = true;
      this.isInterrupted = false;
      
      // Track metrics
      this.playbackMetrics.lastPlaybackTime = Date.now();
      this.playbackMetrics.totalPlayed++;
      
      // Notify playback start
      if (this.callbacks.onPlaybackStart) {
        this.callbacks.onPlaybackStart();
      }
      
      console.log(`🔊 Playing audio clip: ${clip.id}`);
      
    } catch (error) {
      console.error('❌ Error processing audio queue:', error);
      this.isPlaying = false;
      
      // Try next clip in queue
      if (this.audioQueue.length > 0) {
        await this.processQueue();
      }
    }
  }

  private async handlePlaybackEnd(): Promise<void> {
    this.isPlaying = false;
    
    // Clean up current source
    if (this.currentSource) {
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    
    // Notify playback end
    if (this.callbacks.onPlaybackEnd) {
      this.callbacks.onPlaybackEnd();
    }
    
    console.log('🔊 Audio playback ended');
    
    // Process next clip in queue
    if (this.audioQueue.length > 0) {
      await this.processQueue();
    }
  }

  private async fadeOut(): Promise<void> {
    if (!this.gainNode) return;
    
    const currentTime = this.audioContext!.currentTime;
    const fadeOutTime = this.fadeOutDuration / 1000;
    
    // Fade out audio
    this.gainNode.gain.setValueAtTime(this.currentVolume, currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeOutTime);
    
    // Wait for fade out to complete
    await new Promise(resolve => setTimeout(resolve, this.fadeOutDuration));
    
    // Reset volume
    this.gainNode.gain.setValueAtTime(this.currentVolume, currentTime + fadeOutTime);
  }

  // Public methods for status and control
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      isInterrupted: this.isInterrupted,
      queueSize: this.audioQueue.length,
      currentVolume: this.currentVolume,
      audioContextState: this.audioContext?.state
    };
  }

  getMetrics() {
    return {
      ...this.playbackMetrics,
      queueSize: this.audioQueue.length,
      currentLatency: this.isPlaying ? Date.now() - this.playbackMetrics.lastPlaybackTime : 0
    };
  }

  clearQueue(): void {
    this.audioQueue = [];
    if (this.callbacks.onBufferUpdate) {
      this.callbacks.onBufferUpdate(0);
    }
  }

  async destroy(): Promise<void> {
    try {
      // Stop current playback
      await this.stop();
      
      // Close audio context
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
      
      // Clear references
      this.gainNode = null;
      this.audioQueue = [];
      
      this.isInitialized = false;
      console.log('🔇 StreamingAudioPlayer destroyed');
    } catch (error) {
      console.error('❌ Error destroying StreamingAudioPlayer:', error);
    }
  }
}

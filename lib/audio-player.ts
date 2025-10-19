export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private bufferQueue: AudioBuffer[] = [];
  private isPlaying = false;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextPlayTime = 0;
  private onPlaybackEnd?: () => void;
  private onPlaybackStart?: () => void;

  async initialize() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000,
      latencyHint: 'interactive',
    });
    this.nextPlayTime = this.audioContext.currentTime;
  }

  async addAudioChunk(audioData: ArrayBuffer) {
    if (!this.audioContext) await this.initialize();
    
    try {
      const audioBuffer = await this.audioContext!.decodeAudioData(audioData);
      this.bufferQueue.push(audioBuffer);
      
      if (!this.isPlaying) {
        this.playNext();
      }
    } catch (err) {
      console.error('Audio decode error:', err);
    }
  }

  private playNext() {
    if (this.bufferQueue.length === 0) {
      this.isPlaying = false;
      if (this.onPlaybackEnd) this.onPlaybackEnd();
      return;
    }

    this.isPlaying = true;
    if (this.onPlaybackStart) this.onPlaybackStart();
    
    const buffer = this.bufferQueue.shift()!;
    const source = this.audioContext!.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext!.destination);

    const currentTime = this.audioContext!.currentTime;
    const playTime = Math.max(currentTime, this.nextPlayTime);
    
    source.start(playTime);
    this.nextPlayTime = playTime + buffer.duration;
    this.currentSource = source;

    source.onended = () => this.playNext();
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Already stopped
      }
    }
    this.bufferQueue = [];
    this.isPlaying = false;
    this.nextPlayTime = this.audioContext?.currentTime || 0;
  }

  setOnPlaybackEnd(callback: () => void) {
    this.onPlaybackEnd = callback;
  }

  setOnPlaybackStart(callback: () => void) {
    this.onPlaybackStart = callback;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getQueueLength(): number {
    return this.bufferQueue.length;
  }
}

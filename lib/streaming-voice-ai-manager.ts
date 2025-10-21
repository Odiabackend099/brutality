import { EnhancedVADProcessor } from './enhanced-vad-processor';
import { DeepgramSTT } from './deepgram-stt';
import { GroqLLM } from './groq-llm';
import { CustomTTS } from './custom-tts';
import { StreamingAudioPlayer } from './streaming-audio-player';

export interface StreamingConfig {
  maxLatency: number; // Maximum acceptable latency in ms
  bufferSize: number; // Audio buffer size
  chunkSize: number; // Processing chunk size
  overlapSize: number; // Overlap between chunks
  preBufferResponses: boolean; // Enable response pre-buffering
  enableInterruption: boolean; // Enable user interruption
}

export interface AudioChunk {
  data: Float32Array;
  timestamp: number;
  sequence: number;
}

export interface StreamingResponse {
  text: string;
  audio: ArrayBuffer;
  isComplete: boolean;
  latency: number;
}

export class StreamingVoiceAIManager {
  private vadProcessor: EnhancedVADProcessor;
  private deepgramSTT: DeepgramSTT;
  private groqLLM: GroqLLM;
  private customTTS: CustomTTS;
  private audioPlayer: StreamingAudioPlayer;
  
  private config: StreamingConfig;
  private isConnected = false;
  private isProcessing = false;
  private isSpeaking = false;
  private isListening = false;
  
  // Streaming pipeline components
  private audioBuffer: AudioChunk[] = [];
  private responseBuffer: StreamingResponse[] = [];
  private processingQueue: Promise<any>[] = [];
  private abortController: AbortController | null = null;
  
  // Performance tracking
  private latencyTracker = {
    sttStart: 0,
    llmStart: 0,
    ttsStart: 0,
    totalStart: 0
  };
  
  // Event callbacks
  private onTranscript?: (text: string) => void;
  private onResponse?: (response: StreamingResponse) => void;
  private onError?: (error: Error) => void;
  private onLatency?: (latency: number) => void;
  private onInterruption?: () => void;

  constructor(config: Partial<StreamingConfig> = {}) {
    this.config = {
      maxLatency: 200, // 200ms target latency
      bufferSize: 4096,
      chunkSize: 1024,
      overlapSize: 256,
      preBufferResponses: true,
      enableInterruption: true,
      ...config
    };
    
    this.vadProcessor = new EnhancedVADProcessor();
    this.deepgramSTT = new DeepgramSTT();
    this.groqLLM = new GroqLLM();
    this.customTTS = new CustomTTS();
    this.audioPlayer = new StreamingAudioPlayer();
  }

  async initialize(callbacks: {
    onTranscript?: (text: string) => void;
    onResponse?: (response: StreamingResponse) => void;
    onError?: (error: Error) => void;
    onLatency?: (latency: number) => void;
    onInterruption?: () => void;
  }) {
    this.onTranscript = callbacks.onTranscript;
    this.onResponse = callbacks.onResponse;
    this.onError = callbacks.onError;
    this.onLatency = callbacks.onLatency;
    this.onInterruption = callbacks.onInterruption;

    try {
      // Initialize VAD with enhanced callbacks
      await this.vadProcessor.initialize({
        onSpeechStart: () => this.handleSpeechStart(),
        onSpeechEnd: (audio) => this.handleSpeechEnd(audio),
        onVADMisfire: () => this.handleVADMisfire()
      });

      // Initialize STT with streaming
      await this.deepgramSTT.connect({
        onTranscript: (text) => this.handleTranscript(text),
        onError: (error) => this.handleError(new Error(error))
      });

      // TTS is ready to use (no initialization needed)

      // Audio player is ready to use

      this.isConnected = true;
      console.log('✅ StreamingVoiceAIManager initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize StreamingVoiceAIManager:', error);
      throw error;
    }
  }

  async connect() {
    if (!this.isConnected) {
      throw new Error('StreamingVoiceAIManager not initialized');
    }

    try {
      this.abortController = new AbortController();
      
      // Start VAD processor
      this.vadProcessor.start();
      this.isListening = true;
      
      // Start response pre-buffering if enabled
      if (this.config.preBufferResponses) {
        this.startResponsePreBuffering();
      }
      
      console.log('🎤 Streaming voice AI connected and listening');
    } catch (error) {
      console.error('❌ Failed to connect streaming voice AI:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      // Stop all processing
      this.abortController?.abort();

      // Stop VAD
      this.vadProcessor.pause();
      this.isListening = false;

      // Stop audio playback
      this.audioPlayer.stop();
      this.isSpeaking = false;

      // Clear buffers
      this.audioBuffer = [];
      this.responseBuffer = [];
      this.processingQueue = [];

      console.log('🔇 Streaming voice AI disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting streaming voice AI:', error);
    }
  }

  // Mute/unmute microphone
  setMuted(muted: boolean) {
    if (this.vadProcessor) {
      if (muted) {
        this.vadProcessor.pause();
        this.isListening = false;
        console.log('🔇 Microphone muted');
      } else {
        this.vadProcessor.start();
        this.isListening = true;
        console.log('🔊 Microphone unmuted');
      }
    }
  }

  private async handleSpeechStart() {
    if (!this.isListening) return;
    
    console.log('🎤 Speech started - beginning capture');
    this.latencyTracker.totalStart = Date.now();
    
    // Clear previous audio buffer
    this.audioBuffer = [];
  }

  private async handleSpeechEnd(audio: Float32Array) {
    if (!this.isListening) return;
    
    console.log('🎤 Speech ended - processing audio');
    this.latencyTracker.sttStart = Date.now();
    
    // Add audio chunk to buffer
    const chunk: AudioChunk = {
      data: audio,
      timestamp: Date.now(),
      sequence: this.audioBuffer.length
    };
    this.audioBuffer.push(chunk);
    
    // Start parallel processing pipeline
    await this.startParallelProcessing();
  }

  private async startParallelProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.abortController = new AbortController();
    
    try {
      // Parallel processing pipeline
      const processingPromises = [
        this.processSTT(),
        this.processLLM(),
        this.processTTS()
      ];
      
      // Wait for all processing to complete
      await Promise.all(processingPromises);
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('❌ Parallel processing error:', error);
        this.handleError(error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processSTT(): Promise<string> {
    const startTime = Date.now();
    
    try {
      // Combine audio chunks
      const combinedAudio = this.combineAudioChunks();
      
      // Send to Deepgram STT (streaming approach)
      this.deepgramSTT.sendAudio(combinedAudio);
      
      const latency = Date.now() - startTime;
      console.log(`📝 STT processing started in ${latency}ms`);
      
      // Transcript will be handled by the streaming callback
      
      return '';
    } catch (error) {
      console.error('❌ STT processing error:', error);
      throw error;
    }
  }

  private async processLLM(transcript?: string): Promise<string> {
    const startTime = Date.now();
    
    try {
      // Use transcript from STT or provided transcript
      const text = transcript || '';
      
      if (!text.trim()) {
        return '';
      }
      
      // Generate response using Groq LLM
      const response = await this.groqLLM.generateResponse(
        text,
        'You are a helpful AI assistant. Respond concisely and naturally.'
      );
      
      const latency = Date.now() - startTime;
      console.log(`🧠 LLM completed in ${latency}ms: "${response}"`);
      
      return response;
    } catch (error) {
      console.error('❌ LLM processing error:', error);
      throw error;
    }
  }

  private async processTTS(text?: string): Promise<ArrayBuffer> {
    const startTime = Date.now();
    
    try {
      // Use text from LLM or provided text
      const responseText = text || '';
      
      if (!responseText.trim()) {
        return new ArrayBuffer(0);
      }
      
      // Generate audio using custom TTS
      const audioBuffer = await this.customTTS.generateSpeech(responseText);
      
      const latency = Date.now() - startTime;
      console.log(`🔊 TTS completed in ${latency}ms`);
      
      return audioBuffer;
    } catch (error) {
      console.error('❌ TTS processing error:', error);
      throw error;
    }
  }

  private async handleTranscript(text: string) {
    console.log('📝 Transcript received:', text);
    
    if (this.onTranscript) {
      this.onTranscript(text);
    }
  }

  private async handleAudioReady(audio: ArrayBuffer) {
    console.log('🔊 Audio ready for playback');
    
    // Create streaming response
    const response: StreamingResponse = {
      text: '', // Will be filled by LLM
      audio: audio,
      isComplete: false,
      latency: Date.now() - this.latencyTracker.totalStart
    };
    
    // Add to response buffer
    this.responseBuffer.push(response);
    
    // Start immediate playback for low latency
    await this.audioPlayer.play(audio);
    
    // Notify response ready
    if (this.onResponse) {
      this.onResponse(response);
    }
    
    // Track latency
    if (this.onLatency) {
      this.onLatency(response.latency);
    }
  }

  private async handlePlaybackStart() {
    this.isSpeaking = true;
    console.log('🔊 Audio playback started');
  }

  private async handlePlaybackEnd() {
    this.isSpeaking = false;
    console.log('🔊 Audio playback ended');
  }

  private async handleInterruption() {
    console.log('⚠️ User interruption detected');
    
    // Stop current playback
    this.audioPlayer.stop();
    this.isSpeaking = false;
    
    // Abort current processing
    this.abortController?.abort();
    this.isProcessing = false;
    
    // Notify interruption
    if (this.onInterruption) {
      this.onInterruption();
    }
  }

  private async handleVADMisfire() {
    console.log('🎤 VAD misfire - ignoring');
    // VAD misfires are common, just ignore them
  }

  private async handleError(error: Error) {
    console.error('❌ Streaming voice AI error:', error);
    
    if (this.onError) {
      this.onError(error);
    }
  }

  private combineAudioChunks(): Float32Array {
    if (this.audioBuffer.length === 0) {
      return new Float32Array(0);
    }
    
    if (this.audioBuffer.length === 1) {
      return this.audioBuffer[0].data;
    }
    
    // Calculate total length
    const totalLength = this.audioBuffer.reduce((sum, chunk) => sum + chunk.data.length, 0);
    const combined = new Float32Array(totalLength);
    
    // Copy all chunks
    let offset = 0;
    for (const chunk of this.audioBuffer) {
      combined.set(chunk.data, offset);
      offset += chunk.data.length;
    }
    
    return combined;
  }

  private async startResponsePreBuffering() {
    // Pre-generate common responses for instant playback
    const commonResponses = [
      "Hello, how can I help you?",
      "I'm listening, please continue.",
      "Could you repeat that?",
      "Thank you for calling."
    ];
    
    try {
      for (const response of commonResponses) {
        const audioBuffer = await this.customTTS.generateSpeech(response);
        const preBufferedResponse: StreamingResponse = {
          text: response,
          audio: audioBuffer,
          isComplete: true,
          latency: 0
        };
        this.responseBuffer.push(preBufferedResponse);
      }
      
      console.log(`✅ Pre-buffered ${commonResponses.length} common responses`);
    } catch (error) {
      console.error('❌ Failed to pre-buffer responses:', error);
    }
  }

  // Public methods for external control
  async startListening() {
    if (this.isConnected && !this.isListening) {
      this.vadProcessor.start();
      this.isListening = true;
    }
  }

  async stopListening() {
    if (this.isListening) {
      this.vadProcessor.pause();
      this.isListening = false;
    }
  }

  async interrupt() {
    await this.handleInterruption();
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      isListening: this.isListening,
      isProcessing: this.isProcessing,
      isSpeaking: this.isSpeaking,
      bufferSize: this.audioBuffer.length,
      responseBufferSize: this.responseBuffer.length
    };
  }

  getLatencyMetrics() {
    return {
      ...this.latencyTracker,
      totalLatency: Date.now() - this.latencyTracker.totalStart
    };
  }
}

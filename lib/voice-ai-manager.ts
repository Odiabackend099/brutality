import { AudioPlayer } from './audio-player';
import { VADProcessor } from './vad-processor';
import { DeepgramSTT } from './deepgram-stt';
import { GroqLLM } from './groq-llm';
import { CustomTTS } from './custom-tts';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export class VoiceAIManager {
  private audioPlayer: AudioPlayer;
  private vadProcessor: VADProcessor;
  private deepgramSTT: DeepgramSTT;
  private groqLLM: GroqLLM;
  private customTTS: CustomTTS;
  
  private state: ConnectionState = 'disconnected';
  private isListening = false;
  private isSpeaking = false;
  private currentTranscript = '';
  private systemPrompt: string;

  private onStateChange?: (state: ConnectionState) => void;
  private onListeningChange?: (isListening: boolean) => void;
  private onSpeakingChange?: (isSpeaking: boolean) => void;
  private onTranscriptChange?: (transcript: string) => void;
  private onError?: (error: string) => void;

  constructor(systemPrompt?: string) {
    this.systemPrompt = systemPrompt || this.getDefaultSystemPrompt();
    
    this.audioPlayer = new AudioPlayer();
    this.vadProcessor = new VADProcessor();
    this.deepgramSTT = new DeepgramSTT();
    this.groqLLM = new GroqLLM();
    this.customTTS = new CustomTTS();

    this.setupAudioPlayer();
  }

  private getDefaultSystemPrompt(): string {
    return `You are Maya, an intelligent and empathetic AI voice assistant for CallWaitingAI.

## Core Personality
- Warm, conversational, and natural
- Professional yet friendly
- Concise responses (2-3 sentences max for most queries)
- Proactive and helpful

## Communication Style
- Speak naturally, as if having a real conversation
- Use contractions (I'm, you're, let's)
- Keep responses under 30 seconds of speech
- Prioritize clarity over completeness
- Be helpful with CallWaitingAI features

## Key Behaviors
- Provide actionable next steps
- Remember context from the conversation
- Ask clarifying questions when needed
- Stay focused on business communication needs

Remember: You're having a voice conversation. Be natural, brief, and helpful.`;
  }

  private setupAudioPlayer() {
    this.audioPlayer.setOnPlaybackStart(() => {
      this.setIsSpeaking(true);
    });

    this.audioPlayer.setOnPlaybackEnd(() => {
      this.setIsSpeaking(false);
    });
  }

  async connect(callbacks: {
    onStateChange?: (state: ConnectionState) => void;
    onListeningChange?: (isListening: boolean) => void;
    onSpeakingChange?: (isSpeaking: boolean) => void;
    onTranscriptChange?: (transcript: string) => void;
    onError?: (error: string) => void;
  }) {
    this.onStateChange = callbacks.onStateChange;
    this.onListeningChange = callbacks.onListeningChange;
    this.onSpeakingChange = callbacks.onSpeakingChange;
    this.onTranscriptChange = callbacks.onTranscriptChange;
    this.onError = callbacks.onError;

    try {
      this.setState('connecting');

      // Initialize audio player
      await this.audioPlayer.initialize();

      // Initialize VAD
      await this.vadProcessor.initialize({
        onSpeechStart: () => {
          this.handleSpeechStart();
        },
        onSpeechEnd: (audio) => {
          this.handleSpeechEnd(audio);
        },
        onVADMisfire: () => {
          console.log('VAD misfire detected');
        },
      });

      // Connect to Deepgram STT
      await this.deepgramSTT.connect({
        onTranscript: (text, isFinal) => {
          this.handleTranscript(text, isFinal);
        },
        onError: (error) => {
          this.handleError(error);
        },
      });

      // Start VAD
      this.vadProcessor.start();

      this.setState('connected');
      console.log('✅ Voice AI Manager connected successfully');

    } catch (error) {
      console.error('❌ Voice AI Manager connection failed:', error);
      this.handleError('Failed to connect voice AI system');
      this.setState('error');
    }
  }

  private handleSpeechStart() {
    console.log('🎤 Speech detected - starting to listen');
    this.setIsListening(true);
    
    // If AI is speaking, interrupt it
    if (this.isSpeaking) {
      console.log('🛑 Interrupting AI speech');
      this.audioPlayer.stop();
      this.setIsSpeaking(false);
    }
  }

  private handleSpeechEnd(audio: Float32Array) {
    console.log('🎤 Speech ended - processing audio');
    this.setIsListening(false);
    
    // Send audio to Deepgram for transcription
    this.deepgramSTT.sendAudio(audio);
  }

  private async handleTranscript(text: string, isFinal: boolean) {
    console.log(`📝 Transcript: "${text}" (final: ${isFinal})`);
    
    if (isFinal && text.trim()) {
      this.setTranscript(text);
      
      try {
        // Generate AI response using Groq
        const response = await this.groqLLM.generateResponse(text, this.systemPrompt);
        
        // Convert response to speech using custom TTS
        await this.generateAndPlaySpeech(response);
        
      } catch (error) {
        console.error('❌ Error processing transcript:', error);
        this.handleError('Failed to process your message');
      }
    }
  }

  private async generateAndPlaySpeech(text: string) {
    try {
      console.log('🔊 Generating speech for AI response');
      const audioBuffer = await this.customTTS.generateSpeech(text);
      await this.audioPlayer.addAudioChunk(audioBuffer);
    } catch (error) {
      console.error('❌ Error generating speech:', error);
      this.handleError('Failed to generate speech response');
    }
  }

  private handleError(error: string) {
    console.error('❌ Voice AI error:', error);
    if (this.onError) this.onError(error);
  }

  private setState(state: ConnectionState) {
    this.state = state;
    if (this.onStateChange) this.onStateChange(state);
  }

  private setIsListening(isListening: boolean) {
    this.isListening = isListening;
    if (this.onListeningChange) this.onListeningChange(isListening);
  }

  private setIsSpeaking(isSpeaking: boolean) {
    this.isSpeaking = isSpeaking;
    if (this.onSpeakingChange) this.onSpeakingChange(isSpeaking);
  }

  private setTranscript(transcript: string) {
    this.currentTranscript = transcript;
    if (this.onTranscriptChange) this.onTranscriptChange(transcript);
  }

  disconnect() {
    console.log('🔌 Disconnecting Voice AI Manager');
    
    this.vadProcessor.destroy();
    this.deepgramSTT.disconnect();
    this.audioPlayer.stop();
    
    this.setState('disconnected');
    this.setIsListening(false);
    this.setIsSpeaking(false);
    this.setTranscript('');
  }

  // Public getters
  getState(): ConnectionState {
    return this.state;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  // Test system functionality
  async testSystem(): Promise<boolean> {
    try {
      console.log('🧪 Testing Voice AI system components...');
      
      // Test TTS
      const ttsWorking = await this.customTTS.testTTS();
      if (!ttsWorking) {
        console.error('❌ TTS test failed');
        return false;
      }

      console.log('✅ All system tests passed');
      return true;
    } catch (error) {
      console.error('❌ System test failed:', error);
      return false;
    }
  }

  // Update system prompt
  updateSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
    this.groqLLM.clearHistory();
    console.log('📝 System prompt updated');
  }
}

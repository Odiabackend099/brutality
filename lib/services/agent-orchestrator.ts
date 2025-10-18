import { DeepgramSTT } from '@/lib/services/stt/deepgram';
import { GroqLLM } from '@/lib/services/llm/groq';
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';
import { 
  saveMessage, 
  getConversationSession, 
  getConversationHistory, 
  getAgent 
} from '@/lib/services/conversation-manager';

const stt = new DeepgramSTT();
const llm = new GroqLLM();
const tts = new OdiaDevTTS();

export interface ProcessAudioResult {
  responseText: string;
  audioUrl: string;
  sessionId: string;
  userText: string;
}

export async function processMulawAudioChunk({
  buffer,
  sessionId
}: {
  buffer: Buffer;
  sessionId: string;
}): Promise<ProcessAudioResult | null> {
  try {
    console.log(`Processing audio chunk for session ${sessionId}, buffer size: ${buffer.length}`);

    // 1) STT - Convert audio to text
    const userText = await stt.transcribeMulaw8k(buffer);
    if (!userText.trim()) {
      console.log('No speech detected in audio chunk');
      return null;
    }

    console.log(`Transcribed user speech: "${userText}"`);
    await saveMessage({
      sessionId,
      role: 'user',
      content: userText
    });

    // 2) Get conversation context
    const session = await getConversationSession(sessionId);
    const agent = await getAgent(session.agent_id);
    const history = await getConversationHistory(sessionId);

    console.log(`Agent: ${agent.name}, History length: ${history.length}`);

    // 3) LLM - Generate response
    const llmResponse = await llm.respond({
      history: history.map(m => ({ 
        role: m.role === 'agent' ? 'assistant' : m.role, 
        content: m.content 
      })),
      systemPrompt: agent.system_prompt || 'You are a professional AI receptionist. Be concise and helpful. Capture caller details when relevant.',
      model: agent.llm_model || 'llama-3.1-70b-versatile',
      temperature: agent.llm_temperature || 0.6,
      maxTokens: agent.llm_max_tokens || 400
    });

    const responseText = llmResponse.content;
    console.log(`Generated response: "${responseText}"`);

    await saveMessage({
      sessionId,
      role: 'agent',
      content: responseText
    });

    // 4) TTS - Convert response to speech
    const ttsResponse = await tts.synthesize({ 
      text: responseText, 
      voiceId: agent.tts_voice_id || agent.voice_id || 'marcus'
    });

    console.log(`Generated audio URL: ${ttsResponse.audioUrl}`);

    return {
      responseText,
      audioUrl: ttsResponse.audioUrl,
      sessionId,
      userText
    };
  } catch (error) {
    console.error('Error processing audio chunk:', error);
    throw error;
  }
}

export async function processWavAudioChunk({
  buffer,
  sessionId
}: {
  buffer: Buffer;
  sessionId: string;
}): Promise<ProcessAudioResult | null> {
  try {
    console.log(`Processing WAV audio chunk for session ${sessionId}, buffer size: ${buffer.length}`);

    // 1) STT - Convert audio to text
    const userText = await stt.transcribeWav(buffer);
    if (!userText.trim()) {
      console.log('No speech detected in audio chunk');
      return null;
    }

    console.log(`Transcribed user speech: "${userText}"`);
    await saveMessage({
      sessionId,
      role: 'user',
      content: userText
    });

    // 2) Get conversation context
    const session = await getConversationSession(sessionId);
    const agent = await getAgent(session.agent_id);
    const history = await getConversationHistory(sessionId);

    console.log(`Agent: ${agent.name}, History length: ${history.length}`);

    // 3) LLM - Generate response
    const llmResponse = await llm.respond({
      history: history.map(m => ({ 
        role: m.role === 'agent' ? 'assistant' : m.role, 
        content: m.content 
      })),
      systemPrompt: agent.system_prompt || 'You are a professional AI receptionist. Be concise and helpful. Capture caller details when relevant.',
      model: agent.llm_model || 'llama-3.1-70b-versatile',
      temperature: agent.llm_temperature || 0.6,
      maxTokens: agent.llm_max_tokens || 400
    });

    const responseText = llmResponse.content;
    console.log(`Generated response: "${responseText}"`);

    await saveMessage({
      sessionId,
      role: 'agent',
      content: responseText
    });

    // 4) TTS - Convert response to speech
    const ttsResponse = await tts.synthesize({ 
      text: responseText, 
      voiceId: agent.tts_voice_id || agent.voice_id || 'marcus'
    });

    console.log(`Generated audio URL: ${ttsResponse.audioUrl}`);

    return {
      responseText,
      audioUrl: ttsResponse.audioUrl,
      sessionId,
      userText
    };
  } catch (error) {
    console.error('Error processing WAV audio chunk:', error);
    throw error;
  }
}

export async function generateGreeting(agentId: string): Promise<string> {
  try {
    const agent = await getAgent(agentId);
    const greetingText = agent.greeting_message || "Hello! Thank you for calling. How can I help you today?";
    
    const ttsResponse = await tts.synthesize({ 
      text: greetingText, 
      voiceId: agent.tts_voice_id || agent.voice_id || 'marcus'
    });

    return ttsResponse.audioUrl;
  } catch (error) {
    console.error('Error generating greeting:', error);
    throw error;
  }
}

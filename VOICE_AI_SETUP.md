# 🎯 Custom Voice AI System Setup Guide

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

Add these to your `.env.local` file:

```env
# Groq LLM API Key
GROQ_API_KEY=gsk_your-groq-api-key-here

# Deepgram STT API Key (for client-side usage)
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-api-key-here

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 **INSTALLATION STEPS**

### 1. Install Dependencies
```bash
npm install @ricky0123/vad-web onnxruntime-web
```

### 2. Set Up API Keys

#### **Groq API Key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Create account and get API key
3. Add to `.env.local` as `GROQ_API_KEY`

#### **Deepgram API Key:**
1. Go to [deepgram.com](https://deepgram.com)
2. Create account and get API key
3. Add to `.env.local` as `NEXT_PUBLIC_DEEPGRAM_API_KEY`

### 3. Test the System
```bash
npm run dev
# Navigate to http://localhost:3000/voice-ai
```

## 🎯 **FEATURES IMPLEMENTED**

✅ **Groq LLM Integration** - Fast, cost-effective AI responses  
✅ **Deepgram STT** - Real-time speech-to-text  
✅ **Custom TTS** - Your existing odiadev-tts service  
✅ **Silero VAD** - Voice activity detection  
✅ **Interruption Handling** - Natural conversation flow  
✅ **Audio Queue Management** - Smooth playback  
✅ **WebRTC Ready** - Real-time audio streaming  

## 🔧 **ARCHITECTURE OVERVIEW**

```
Voice AI System
├── VAD Processor (Silero) → Detects speech start/end
├── Deepgram STT → Converts speech to text
├── Groq LLM → Generates AI responses
├── Custom TTS → Converts text to speech
└── Audio Player → Manages playback queue
```

## 🧪 **TESTING CHECKLIST**

- [ ] Install dependencies
- [ ] Set environment variables
- [ ] Test Groq API connection
- [ ] Test Deepgram STT
- [ ] Test custom TTS integration
- [ ] Test VAD functionality
- [ ] Test interruption handling
- [ ] Test audio playback

## 🚨 **TROUBLESHOOTING**

### "Failed to connect to Deepgram"
- Check `NEXT_PUBLIC_DEEPGRAM_API_KEY` is set correctly
- Verify Deepgram API key is valid
- Check network connectivity

### "Groq LLM error"
- Check `GROQ_API_KEY` is set correctly
- Verify Groq API key has sufficient credits
- Check model availability (`llama-3.1-8b-instant`)

### "VAD not detecting speech"
- Grant microphone permissions
- Check browser audio settings
- Try different VAD sensitivity settings

### "Audio not playing"
- Check browser audio isn't muted
- Verify audio output device
- Check TTS service is running

## 📊 **PERFORMANCE METRICS**

| Component | Target Latency | Expected Performance |
|-----------|----------------|---------------------|
| VAD Detection | <100ms | ~80ms |
| STT Processing | <500ms | ~300ms |
| LLM Response | <1000ms | ~800ms |
| TTS Generation | <2000ms | ~1500ms |
| **Total E2E** | **<4000ms** | **~3000ms** |

## 🔐 **SECURITY NOTES**

- ✅ API keys stored in environment variables
- ✅ Client-side keys marked as `NEXT_PUBLIC_`
- ✅ Server-side keys kept private
- ✅ No hardcoded credentials

## 📈 **COST ESTIMATION**

### Groq LLM:
- **Input**: $0.20 per 1M tokens
- **Output**: $0.80 per 1M tokens
- **Estimated**: ~$0.01 per conversation

### Deepgram STT:
- **Audio**: $0.0043 per minute
- **Estimated**: ~$0.005 per conversation

### **Total Cost**: ~$0.015 per conversation

## 🎉 **READY TO USE**

Your custom voice AI system is now ready! Navigate to `/voice-ai` to test the implementation.

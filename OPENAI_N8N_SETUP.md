# 🤖 OpenAI + MiniMax TTS Integration Guide

## 🎯 Complete AI Chat Widget with Voice Responses

This guide will help you set up the full AI + TTS workflow in n8n.

---

## 📋 What You'll Get

✅ **OpenAI GPT-4** - Intelligent AI responses
✅ **MiniMax TTS** - Natural voice audio
✅ **Full Integration** - Text + Audio responses in chat widget

---

## 🚀 Setup Steps

### Step 1: Add OpenAI Credentials to n8n

1. **Go to n8n:** https://callwaitingai.app.n8n.cloud

2. **Click Settings** (gear icon, bottom-left)

3. **Click "Credentials"**

4. **Click "Add Credential"**

5. **Search for "OpenAI"**

6. **Configure:**
   - **Name:** `OpenAI API`
   - **API Key:** `sk-...` *(your OpenAI API key)*

7. **Click "Save"**

---

### Step 2: Import Complete Workflow

1. **Go to n8n workflows page**

2. **Click "Add Workflow"** → **"Import from File"**

3. **Upload:** `n8n-workflow-complete-ai-tts.json`

4. **The workflow will open with these nodes:**
   ```
   Webhook → Extract Input → OpenAI Chat → Extract AI Response
   → MiniMax TTS → Format Response → Respond to Webhook
   ```

---

### Step 3: Configure OpenAI Node

1. **Click on "OpenAI Chat" node**

2. **In "Credentials" dropdown:**
   - Select: `OpenAI API` (the credential you just created)

3. **Verify settings:**
   - Model: `gpt-4o-mini` (fast and cost-effective)
   - Temperature: `0.7` (balanced creativity)
   - Max Tokens: `150` (concise responses)

4. **System prompt is already set:**
   ```
   You are CallWaiting AI, a friendly and professional AI receptionist
   assistant. You help businesses manage calls, bookings, and customer
   inquiries. Be concise, helpful, and professional. Keep responses
   under 100 words.
   ```

---

### Step 4: Verify MiniMax TTS Configuration

The MiniMax TTS node is already configured with your credentials:

- ✅ Authorization header with your JWT token
- ✅ Voice: `female_1` (professional female voice)
- ✅ Format: `mp3` (widely supported)
- ✅ Sample rate: `24000` Hz (high quality)

**No changes needed here!**

---

### Step 5: Save & Activate

1. **Click "Save"** (top-right)

2. **Toggle "Active"** (switch to ON)

3. **You should see:** ✅ "Workflow activated"

---

## 🧪 Test the Complete Workflow

### Test 1: Command Line

```bash
cd /Users/odiadev/callwaitingai.dev\ 2025
node test-webhook.js "What services does CallWaiting AI offer?"
```

**Expected result:**
```json
{
  "text": "CallWaiting AI offers... [GPT-4 response]",
  "audio_url": "https://minimax-audio-url.mp3"
}
```

### Test 2: Chat Widget

1. Open: **http://localhost:3002**
2. Click the chat bubble
3. Ask: **"How can CallWaiting AI help my business?"**
4. Watch:
   - ✅ AI generates intelligent response
   - ✅ Text appears in chat
   - ✅ Voice audio auto-plays

---

## 🎨 Customize AI Behavior

### Change the AI Personality

Edit the **System Prompt** in "OpenAI Chat" node:

**For a casual tone:**
```
You are a friendly AI assistant for CallWaiting AI. Chat casually
and use emojis. Keep it fun and helpful!
```

**For formal business:**
```
You are a professional business assistant for CallWaiting AI.
Provide detailed, formal responses about our AI receptionist services.
```

**For sales-focused:**
```
You are a sales assistant for CallWaiting AI. Highlight benefits,
address objections, and guide customers toward booking a demo or trial.
```

### Change Voice Settings

In **MiniMax TTS** node, you can change:

**Different voices:**
- `female_1` - Professional female (current)
- `female_2` - Warm female
- `male_1` - Professional male
- `male_2` - Friendly male

**Audio quality:**
- `sample_rate`: 16000 (lower quality, faster) or 24000 (higher quality)
- `bitrate`: 64000 (smaller files) or 128000 (better quality)

---

## 📊 Workflow Data Flow

```
User sends message → "Hello, what do you do?"
    ↓
Extract Input → userMessage = "Hello, what do you do?"
    ↓
OpenAI Chat → GPT-4 generates intelligent response
    ↓
Extract AI Response → aiResponseText = "CallWaiting AI is..."
    ↓
MiniMax TTS → Convert text to speech MP3
    ↓
Format Response → { text, audio_url }
    ↓
Respond to Webhook → Send JSON to chat widget
    ↓
Chat widget displays text and plays audio!
```

---

## 💰 Cost Considerations

### OpenAI Pricing (GPT-4o-mini)
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- **~150 tokens per response = ~$0.0001 per message**

### MiniMax TTS Pricing
- Check your MiniMax plan
- Typically charged per character or minute of audio

**Estimated cost: < $0.001 per chat interaction**

---

## 🔧 Troubleshooting

### OpenAI Node Fails

**Error: "Invalid API key"**
- Check credentials are saved correctly
- Verify API key is active in OpenAI dashboard
- Make sure you selected the credential in the node

**Error: "Rate limit exceeded"**
- You're sending too many requests
- Add rate limiting or upgrade OpenAI plan

### MiniMax TTS Fails

**Error: "Unauthorized"**
- Your JWT token may have expired
- Generate new token from MiniMax dashboard
- Update the Authorization header

**No audio_url returned:**
- Check MiniMax response format
- Add error handling node
- Log the response to see structure

### Chat Widget Shows Error

1. **Check browser console** (F12)
2. **Run test:** `node test-webhook.js`
3. **Check n8n execution logs** for errors
4. **Verify all nodes executed successfully**

---

## 🎯 Advanced Features

### Add Conversation History

Modify the OpenAI node to include chat history:

```json
{
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" },
    { "role": "user", "content": "{{ $json.userMessage }}" }
  ]
}
```

Store history in:
- Database (Supabase, PostgreSQL)
- Redis cache
- n8n memory node

### Add Function Calling

Make AI perform actions:
- Book appointments (Calendly integration)
- Check availability
- Send emails
- Create leads in CRM

### Add Voice Transcription

For voice messages from users:
- Use OpenAI Whisper API
- Transcribe audio before sending to GPT-4
- Process both text and voice seamlessly

---

## ✅ Final Checklist

- [ ] OpenAI credentials added to n8n
- [ ] Complete workflow imported
- [ ] OpenAI node configured with credentials
- [ ] Workflow saved and activated
- [ ] Tested with `node test-webhook.js`
- [ ] Tested in chat widget at localhost:3002
- [ ] AI responses are intelligent and relevant
- [ ] Audio is generated and plays correctly

---

## 🎉 You're Done!

Your chat widget now has:
- ✅ Real AI intelligence (GPT-4)
- ✅ Natural voice responses (MiniMax TTS)
- ✅ Professional UI
- ✅ Full text + voice chat

**Next Steps:**
- Deploy to production
- Add conversation memory
- Integrate with your CRM
- Add appointment booking
- Track analytics

Enjoy your intelligent AI chat widget! 🚀

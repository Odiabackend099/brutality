# Fix Your n8n Workflow - Empty Response Issue

## 🔍 Problem Identified

Your webhook is returning **HTTP 200 OK** but with an **empty response body**.

```
✅ Status: 200
❌ Content-Length: 0
❌ Body: (empty)
```

This is why the chat widget fails with: `Unexpected end of JSON input`

## ✅ Solution

Your n8n workflow needs to **respond with JSON data**. There are two ways to do this:

---

## Option 1: Add "Respond to Webhook" Node (Recommended)

### Step-by-Step Fix

1. **Open your n8n workflow**
   - Go to https://callwaitingai.app.n8n.cloud
   - Open the workflow with path `/webhook/webhook/tts_minimax`

2. **Add "Respond to Webhook" node**
   - Click the (+) button after your last node
   - Search for "Respond to Webhook"
   - Add it as the final node

3. **Configure the Response**
   - In the "Respond to Webhook" node settings:

   **Respond With:** `JSON`

   **Response Body:**
   ```json
   {
     "text": "{{ $json.responseText }}",
     "audio_url": "{{ $json.audioUrl }}"
   }
   ```

   Or use static values for testing:
   ```json
   {
     "text": "Hello! I'm CallWaiting AI. How can I help you today?",
     "audio_url": ""
   }
   ```

4. **Save and Activate**
   - Click "Save" (top-right)
   - Make sure the workflow is **Activated** (toggle switch)

---

## Option 2: Configure Webhook Node to Respond

If you don't want to add a separate node:

1. **Open the Webhook node** (the first node)

2. **Scroll down to "Options"**

3. **Set these values:**
   - Response Mode: `When Last Node Finishes`
   - Response Data: `Last Node`

   OR

   - Response Mode: `Using 'Respond to Webhook' Node`

4. **Save and Activate**

---

## 🧪 Test Your Fix

After making changes, test with the provided tool:

```bash
cd /Users/odiadev/callwaitingai.dev\ 2025
node test-webhook.js "Test message"
```

You should see:
```
✅ Valid JSON Response:
{
  "text": "Hello! I'm CallWaiting AI...",
  "audio_url": "..."
}

🎉 Webhook test PASSED!
```

---

## 📋 Required Response Format

Your webhook **must** return JSON like this:

```json
{
  "text": "The AI response text that will be displayed",
  "audio_url": "https://optional-url-to-audio-file.mp3"
}
```

### Field Details

- **`text`** (required): The text message from your AI
  - Type: String
  - Example: "Hello! How can I help you today?"

- **`audio_url`** (optional): URL to a TTS audio file
  - Type: String (URL)
  - Example: "https://your-tts-service.com/audio/response.mp3"
  - If provided, the widget will auto-play this audio

---

## 🎯 Example n8n Workflow Structure

Here's what your workflow should look like:

```
┌─────────────────────┐
│   Webhook (POST)    │  Receives: { type, message }
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Process Input     │  Extract user message
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Call AI/LLM       │  Generate response text
│   (OpenAI, etc)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Generate TTS      │  Optional: Convert to audio
│   (MiniMax, etc)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Set Variables    │  Prepare response data
│                     │  responseText = "..."
│                     │  audioUrl = "..."
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Respond to Webhook  │  Return JSON
│                     │  { text, audio_url }
└─────────────────────┘
```

---

## 🔧 Quick Test Workflow (Simple Version)

To quickly test that responses are working, create a simple workflow:

1. **Webhook Node**
   - Method: POST
   - Path: `webhook/webhook/tts_minimax`

2. **Set Node** (to prepare response)
   - Add fields:
     - `text` = `"Hello! I received your message: {{ $json.body.message }}"`
     - `audio_url` = `""`

3. **Respond to Webhook Node**
   - Respond With: `Using Fields Below`
   - Response Body: `{{ $json }}`

4. **Activate workflow**

This simple workflow will echo back your message and confirm everything works!

---

## 🚨 Common Mistakes

### ❌ Mistake 1: No Response Node
**Problem:** Workflow processes data but doesn't send response
**Fix:** Add "Respond to Webhook" node at the end

### ❌ Mistake 2: Wrong Response Format
**Problem:** Returning HTML or plain text instead of JSON
**Fix:** Ensure response is JSON object with `text` field

### ❌ Mistake 3: Workflow Not Activated
**Problem:** Webhook only works when workflow is active
**Fix:** Click the activate toggle (top-right)

### ❌ Mistake 4: Webhook URL Mismatch
**Problem:** Testing wrong webhook URL
**Fix:** Verify path matches: `/webhook/webhook/tts_minimax`

---

## 📞 Next Steps

1. **Fix your n8n workflow** (add response node)
2. **Test with the tool:** `node test-webhook.js`
3. **Test in the chat widget** (open http://localhost:3002)
4. **Check browser console** for detailed logs

Once you see `🎉 Webhook test PASSED!` your chat widget will work perfectly!

---

## 🆘 Still Stuck?

If you're still having issues:

1. Share your n8n workflow screenshot
2. Share the output from `node test-webhook.js`
3. Check n8n execution logs for errors

The test tool will tell you exactly what's wrong!

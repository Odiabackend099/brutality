# CallWaiting AI Webhook Debugging Guide

## The Issue

You encountered: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`

This means your n8n webhook is either:
1. Returning an empty response
2. Returning non-JSON content
3. Returning malformed JSON
4. Timing out before responding

## ✅ What I Fixed

I've updated the `useChat` hook with extensive debugging and error handling:

### Enhanced Error Handling
- Logs the request payload before sending
- Logs response status and headers
- Captures response as text first (prevents JSON parsing errors)
- Provides detailed error messages
- Validates response structure
- Provides fallback messages if data is incomplete

### Debugging Logs
Open your browser console (F12) to see detailed logs:
- Request payload being sent
- Response status code
- Response headers
- Raw response body
- Parsed JSON data
- Any errors encountered

## 🧪 Testing Your n8n Webhook

### Step 1: Test the Webhook Directly

Use `curl` or Postman to test your webhook:

```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax \
  -H "Content-Type: application/json" \
  -d '{"type":"text","message":"Hello, test message"}'
```

**Expected Response:**
```json
{
  "text": "AI response text here",
  "audio_url": "https://url-to-audio-file.mp3"
}
```

### Step 2: Check n8n Workflow

In your n8n workflow, ensure:

1. **Webhook Node is Active**
   - Workflow must be activated (not just saved)
   - Webhook path matches: `/webhook/webhook/tts_minimax`

2. **Webhook Settings**
   - Method: POST
   - Response Mode: "Respond to Webhook" (not "Last Node")
   - Response Code: 200
   - Response Data: JSON

3. **Response Format**
   - Must return JSON object with `text` field
   - Optional: `audio_url` field with audio file URL
   - Example:
     ```json
     {
       "text": "Hello! How can I help?",
       "audio_url": "https://example.com/audio.mp3"
     }
     ```

4. **CORS Headers** (if needed)
   - Add "Set Headers" node if testing from localhost
   - Headers needed:
     - `Access-Control-Allow-Origin: *`
     - `Access-Control-Allow-Methods: POST, OPTIONS`
     - `Access-Control-Allow-Headers: Content-Type`

### Step 3: Common n8n Issues

#### Issue: Empty Response
**Cause:** Webhook not set to "Respond to Webhook" mode
**Fix:** In webhook node, set "Respond" to "Immediately" or use a "Respond to Webhook" node

#### Issue: Wrong Content Type
**Cause:** Response not set as JSON
**Fix:** Ensure response is JSON object, not string

#### Issue: Workflow Not Active
**Cause:** Webhook only works when workflow is activated
**Fix:** Click the activate toggle in n8n

#### Issue: Timeout
**Cause:** Workflow takes too long (>30 seconds)
**Fix:** Optimize workflow or use async processing

## 🔍 Browser Console Debugging

### What to Look For

1. **Request Sent:**
   ```
   Sending to webhook: https://... {type: "text", message: "..."}
   ```

2. **Response Received:**
   ```
   Response status: 200
   Response headers: {...}
   Response body: {"text":"...","audio_url":"..."}
   Parsed response data: {...}
   ```

3. **Errors:**
   - `HTTP error! status: 404` - Webhook URL incorrect
   - `HTTP error! status: 500` - n8n workflow error
   - `Invalid JSON response` - Response is not JSON
   - `CORS error` - Cross-origin request blocked

## 🛠️ Troubleshooting Steps

### 1. Verify Webhook URL

Check `.env.local`:
```bash
NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
```

Make sure:
- URL is correct (no typos)
- Workflow is activated
- n8n instance is running

### 2. Test with Simple Message

In the chat widget:
1. Open browser console (F12)
2. Click the chat bubble
3. Type: "test"
4. Send message
5. Watch console for logs

### 3. Check n8n Execution Log

In n8n:
1. Go to "Executions"
2. Find the execution from your test
3. Check each node's output
4. Look for errors

### 4. Verify Response Format

Your n8n workflow should return:
```javascript
// In a "Set" or "Function" node before responding:
{
  "text": "Your AI response text",
  "audio_url": "https://url-to-tts-audio.mp3"  // Optional
}
```

## 🔧 Quick Fixes

### Fix 1: Mock Response (for testing)

If your n8n webhook isn't ready, you can test with a mock response:

Edit `hooks/useChat.ts` and temporarily add:

```typescript
// TEMPORARY: Mock response for testing
if (webhookUrl.includes('MOCK')) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  const data: ChatResponse = {
    text: "This is a mock AI response. Your n8n webhook will replace this.",
    audio_url: undefined
  };
  // ... rest of code to add message
  return aiMessage;
}
```

Then set in `.env.local`:
```bash
NEXT_PUBLIC_N8N_WEBHOOK=MOCK
```

### Fix 2: Add CORS Proxy (if CORS issue)

If you get CORS errors, you may need to:
1. Add CORS headers in n8n workflow
2. Or use a CORS proxy temporarily

### Fix 3: Check n8n Response Node

Ensure your n8n workflow ends with:
- **"Respond to Webhook" node** with JSON data
- Or webhook node set to "Respond Immediately"

## 📋 n8n Workflow Checklist

- [ ] Workflow is **activated** (toggle in top-right)
- [ ] Webhook node path matches URL
- [ ] Webhook method is POST
- [ ] Response mode is "Respond to Webhook"
- [ ] Response data is valid JSON with `text` field
- [ ] Test execution shows successful response
- [ ] Response time is under 30 seconds
- [ ] CORS headers added (if needed for localhost testing)

## 🎯 Expected Workflow Structure

```
Webhook (POST)
    ↓
Process Input (text or voice)
    ↓
Generate AI Response
    ↓
Generate TTS Audio (optional)
    ↓
Set Response Data
{
  "text": "AI response",
  "audio_url": "https://..."
}
    ↓
Respond to Webhook (200 OK)
```

## 📞 Next Steps

1. **Test your webhook directly with curl** (see Step 1 above)
2. **Check n8n execution logs** for errors
3. **Open browser console** and test the chat widget
4. **Review console logs** for detailed error info
5. **Share console output** if you need help debugging

## 🆘 Getting Help

If still stuck, provide:
1. Browser console output (full logs)
2. n8n execution log screenshot
3. n8n workflow structure
4. curl test results

The enhanced error handling will now show you exactly what's happening! Open http://localhost:3002 and check the browser console for detailed debugging info.

# MiniMax TTS Workflow Fix Guide

## Problem
Your current n8n workflow has an "invalid api key" error because the JWT token may be expired or incorrectly configured.

## Solution

### Option 1: Update Your Existing Workflow (Quick Fix)

1. **Open your n8n workflow:**
   - Go to: `https://callwaitingai.app.n8n.cloud`
   - Find your workflow

2. **Update the HTTP Request Node:**

   In your "Call MiniMax TTS API" node, make sure the **Headers** section looks like this:

   ```
   Header Name: Authorization
   Header Value: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJPRElBIGJhY2tlbmQiLCJVc2VyTmFtZSI6Ik9ESUEgYmFja2VuZCIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTMzNTEwOTg4MDAzMjgzNzUxIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkzMzUxMDk4Nzk5NDg5NTE0MyIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im9kaWFiYWNrZW5kQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTEwLTEyIDA3OjU0OjM2IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.bNkZV8ocPKShS5gATCWX8P1OrKfkMHK1q8PSBoDYxEBCZsqAhIPj8_7ndN2QEEWjxusGFNHIVBWMj_34P-SSKJ4P-d9Rlsuji7XKZZsja7sJc-zOMRX8lSB_TO7Pn-MErhMID-z7ld7hSihtCeFBuqD_xDwd2g6jIsUFtVlQ8S3SfBHv1PM65Fly9fUAh36BEpEIYhga8E27_x0f26bHBhvMis8WsQthENWXd4lBXu2b5lvrQ64IlPRUBok2dJ4fZViHxnwIcJPRNjxsRW9-EArBowPwFTeTmeAUaPaSv-SdMslJK6jVFb0Y7ULFJUdJAoLJWCYmzphvVGhmbdKVgw
   ```

   **IMPORTANT:**
   - Make sure there's only ONE "Bearer" word
   - Format: `Bearer TOKEN_HERE`
   - NOT: `Bearer Bearer TOKEN_HERE`

3. **If using HTTP Header Auth credential:**

   Delete the credential and switch to using Headers directly:

   - Remove the `httpHeaderAuth` credential
   - Change Authentication to: **None**
   - Add the Authorization header manually in the "Headers" section

### Option 2: Import the Fixed Workflow (Recommended)

I've created a complete, working workflow for you:

1. **Download:** [n8n-workflow-minimax-fixed.json](./n8n-workflow-minimax-fixed.json)

2. **Import to n8n:**
   - Go to your n8n dashboard
   - Click "Import from File"
   - Select `n8n-workflow-minimax-fixed.json`
   - Activate the workflow

3. **Features of the fixed workflow:**
   - ✅ Proper webhook trigger at `/webhook/minimax-tts`
   - ✅ JWT token already configured (you may need to update if expired)
   - ✅ Error handling (success/error responses)
   - ✅ Returns JSON with audio URL and metadata
   - ✅ Supports custom parameters

## Get a Fresh Token (If Current Token is Expired)

If you still get "invalid api key" error, the token may be expired:

1. **Visit MiniMax Platform:**
   - Go to: https://platform.minimaxi.com/ or https://api.minimax.chat
   - Log in with: odiabackend@gmail.com

2. **Generate New API Key:**
   - Navigate to "API Keys" or "Settings"
   - Click "Create New Key" or "Generate JWT"
   - Copy the new token

3. **Update the Workflow:**
   - Replace the old token in the Authorization header
   - Format: `Bearer YOUR_NEW_TOKEN_HERE`

## How to Use the Workflow

### Test with curl:

```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/minimax-tts \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Calling hour notification. This is your scheduled calling hour. Please be ready to receive important calls during this time period."
  }'
```

### Custom Parameters:

```bash
curl -X POST https://callwaitingai.app.n8n.cloud/webhook/minimax-tts \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Your 30-second message here",
    "voice_id": "female-shaonv",
    "speed": 1.0
  }'
```

### Expected Response (Success):

```json
{
  "success": true,
  "audio_url": "https://minimax-audio.cdn.com/files/audio_12345.mp3",
  "text": "Your message",
  "duration": 30.5
}
```

### Expected Response (Error):

```json
{
  "success": false,
  "error": "invalid api key",
  "error_code": 2049,
  "text": "Your message"
}
```

## Available Voice IDs

Choose from these voice options:

- `female-shaonv` - Female, young voice (default)
- `female-yujie` - Female, mature voice
- `female-chengshu` - Female, professional
- `male-qn-qingse` - Male, clear voice
- `male-qn-jingying` - Male, energetic
- `male-qn-badao` - Male, authoritative

## Troubleshooting

### Error: "invalid api key" (status_code: 2049)

**Solution:**
1. Token is expired → Get a new token from MiniMax platform
2. Token is malformed → Check for extra spaces or "Bearer Bearer" duplication
3. Check the Authorization header format: `Bearer YOUR_TOKEN`

### Error: Empty response

**Solution:**
1. Make sure you have a "Respond to Webhook" node
2. Verify the workflow is active (not paused)
3. Check the webhook path matches your URL

### Error: Timeout

**Solution:**
1. MiniMax API might be slow for long text
2. Increase timeout in n8n settings
3. Reduce message length

## Cost Estimation

MiniMax TTS pricing (check current rates):
- Approximately $0.015 per 1000 characters
- 30-second audio ≈ 300 characters ≈ $0.0045 per request

## Next Steps

1. ✅ Import the fixed workflow
2. ✅ Update the JWT token if needed
3. ✅ Test with curl
4. ✅ Verify audio URL is returned
5. ✅ Test audio playback

---

**Need help?** Check the test script: [test-minimax-direct.js](./test-minimax-direct.js)

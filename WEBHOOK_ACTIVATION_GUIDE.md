# n8n Webhook Activation Guide

## Current Error

```
"The requested webhook 'minimax-tts' is not registered."
```

This means your workflow is **not activated** in n8n.

## Solution: Activate the Workflow

### Step 1: Go to n8n Dashboard
Open: https://callwaitingai.app.n8n.cloud

### Step 2: Find Your Workflow
Look for the workflow named:
- "MiniMax TTS - Calling Hour Generator" (if you imported my fixed version)
- OR your existing workflow with the MiniMax TTS node

### Step 3: Activate It
Click the **toggle switch** in the top-right corner to activate the workflow.

**Before (inactive):**
```
[ OFF ] Workflow Name
```

**After (active):**
```
[ ON ] Workflow Name  ← Should be green/blue
```

### Step 4: Verify the Webhook Path

In the **Webhook Trigger** node, check the path:

#### Current Paths to Check:

1. **Production Mode:**
   - Path in workflow: `minimax-tts`
   - Full URL: `https://callwaitingai.app.n8n.cloud/webhook/minimax-tts`

2. **Test Mode:**
   - Path in workflow: `minimax-tts`
   - Full URL: `https://callwaitingai.app.n8n.cloud/webhook-test/minimax-tts`

**Important:**
- Test mode only works ONCE after clicking "Execute Workflow"
- Production mode works continuously when the workflow is activated

## Testing After Activation

### Test Command:

```bash
# Production endpoint (workflow must be ACTIVATED)
curl -X POST "https://callwaitingai.app.n8n.cloud/webhook/minimax-tts" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Calling hour notification test"
  }'
```

### Expected Success Response:

```json
{
  "success": true,
  "audio_url": "https://minimax-audio.cdn.com/files/audio_xxxxx.mp3",
  "text": "Calling hour notification test",
  "duration": 5.2
}
```

### Expected Error Response (if token is invalid):

```json
{
  "success": false,
  "error": "invalid api key",
  "error_code": 2049,
  "text": "Calling hour notification test"
}
```

## Troubleshooting

### Error: "webhook is not registered"
**Solution:** Activate the workflow (toggle switch to ON)

### Error: Empty response (content-length: 0)
**Solution:**
1. Make sure you have a "Respond to Webhook" node
2. Check that all nodes are connected properly
3. Import the fixed workflow: `n8n-workflow-minimax-fixed.json`

### Error: "invalid api key" (status_code: 2049)
**Solution:** The JWT token is expired or invalid
1. Get a new token from https://platform.minimaxi.com/
2. Update the Authorization header in the "Call MiniMax TTS API" node
3. Format: `Bearer YOUR_NEW_TOKEN_HERE`

### Error: 404 Not Found
**Solution:** Check the webhook path matches your URL:
- Workflow path: `minimax-tts`
- Test URL: `/webhook-test/minimax-tts` (test mode)
- Production URL: `/webhook/minimax-tts` (production mode)

## Quick Reference

| Mode | Workflow Status | URL Format | How Long It Works |
|------|----------------|------------|-------------------|
| Test | Any | `/webhook-test/PATH` | One execution only |
| Production | ACTIVATED | `/webhook/PATH` | Continuous |

## Next Steps

1. ✅ Go to n8n dashboard
2. ✅ Find your workflow
3. ✅ Activate it (toggle to ON)
4. ✅ Note the webhook path
5. ✅ Test with the correct URL
6. ✅ Verify you get a JSON response

---

**Still having issues?** Check if the MiniMax JWT token needs to be refreshed at https://platform.minimaxi.com/

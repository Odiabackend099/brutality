# How to Get a Fresh MiniMax API Token

## Current Problem

```
{"base_resp":{"status_code":2049,"status_msg":"invalid api key"}}
```

Your MiniMax JWT token has **expired** (it was created on 2025-10-12 and JWT tokens typically expire).

## Solution: Get a New Token

### Step 1: Go to MiniMax Platform

**Primary URL:** https://platform.minimaxi.com/user-center/basic-information/interface-key

**Alternative URLs:**
- https://api.minimax.chat
- https://www.minimaxi.com/
- https://platform.minimaxi.com/

### Step 2: Log In

**Email:** odiabackend@gmail.com
**Password:** [your password]

### Step 3: Navigate to API Keys

Look for one of these sections:
- "API Keys"
- "Interface Key" (接口密钥)
- "Credentials"
- "Developer Settings"

### Step 4: Generate New Key

1. Click **"Create New Key"** or **"Generate Token"** or **"Generate JWT"**
2. Give it a name (optional): "CallWaiting AI TTS"
3. Click **"Generate"** or **"Create"**
4. **Copy the entire token** (it will be a long string starting with "eyJ...")

The token format looks like:
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOi...VERY_LONG_STRING...
```

### Step 5: Update Your n8n Workflow

1. **Go to n8n:** https://callwaitingai.app.n8n.cloud

2. **Open your workflow** (MiniMax TTS workflow)

3. **Find the node:** "Call MiniMax TTS API" or "HTTP Request" node

4. **Update the Authorization header:**
   - Click on the node
   - Go to "Headers" section
   - Find the header named "Authorization"
   - Update the value to: `Bearer YOUR_NEW_TOKEN_HERE`

   **Important:** Make sure it's formatted as:
   ```
   Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_FULL_TOKEN
   ```

   - There should be exactly ONE space between "Bearer" and your token
   - Don't include quotes
   - Don't have "Bearer Bearer" (double)

5. **Save the workflow** (click Save button)

6. **Make sure the workflow is ACTIVATED** (toggle switch should be ON/green)

### Step 6: Test the Webhook

Run this command to test:

```bash
cd "/Users/odiadev/callwaitingai.dev 2025"
./generate-calling-hour-audio.sh
```

Or manually test:

```bash
curl -X POST "https://callwaitingai.app.n8n.cloud/webhook/minimax-tts" \
  -H "Content-Type: application/json" \
  -d '{"message": "Calling hour notification test"}'
```

### Expected Success Response:

```json
{
  "success": true,
  "audio_url": "https://file.minimax.chat/public-file-cdn-01/public/.../audio_12345.mp3",
  "text": "Calling hour notification test",
  "duration": 5.2
}
```

## Quick Reference

| Step | Action | URL |
|------|--------|-----|
| 1 | Get Token | https://platform.minimaxi.com/user-center/basic-information/interface-key |
| 2 | Update Workflow | https://callwaitingai.app.n8n.cloud |
| 3 | Test | Run `./generate-calling-hour-audio.sh` |

## Troubleshooting

### Can't Access MiniMax Platform?

Try these alternatives:
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Try a different browser
4. Check if you need to verify your email
5. Try password reset if needed

### Still Getting "invalid api key"?

1. **Check token format:**
   - Should start with "eyJ"
   - Should be VERY long (500+ characters)
   - Should have dots (.) separating three parts

2. **Check Authorization header:**
   - Format: `Bearer TOKEN` (not `Bearer Bearer TOKEN`)
   - Exactly one space after "Bearer"
   - No quotes around the token

3. **Check workflow is saved and activated:**
   - Green/blue toggle switch = activated
   - Gray toggle switch = not activated

### Token Expired Immediately?

Some possible causes:
1. Account issue - check if your MiniMax account is active
2. Payment issue - check if you have credits/balance
3. Trial expired - check if you need to upgrade
4. Token was copied incorrectly - regenerate and try again

## Next Steps

1. ✅ Get fresh token from MiniMax platform
2. ✅ Update n8n workflow Authorization header
3. ✅ Save and activate workflow
4. ✅ Test with: `./generate-calling-hour-audio.sh`
5. ✅ Verify you get audio URL in response
6. ✅ Download and play the audio

---

**Need Help?** The helper script `generate-calling-hour-audio.sh` will tell you exactly what the error is and how to fix it.

# 🎯 Exact Fix for Your n8n Workflow

## Current Problem

Your workflow returns **empty response** because the "Respond to Webhook" node doesn't have the right data.

---

## ⚡ Quick Fix (2 Options)

### Option 1: Simple Test (Recommended - Start Here)

This will make the chat widget work **immediately** without TTS.

#### Import This Workflow

1. Go to n8n: https://callwaitingai.app.n8n.cloud
2. Click "Add Workflow" → "Import from File"
3. Upload: [`n8n-workflow-simple-test.json`](n8n-workflow-simple-test.json)
4. **Activate** the workflow
5. Test with: `node test-webhook.js`

This creates a simple echo response that proves everything works!

---

### Option 2: Fix Your Existing Workflow

If you want to keep your current workflow and add the response:

#### Step A: Add "Set" Node Before "Respond to Webhook"

1. In your workflow, click **between** "MiniMax TTS API" and "Respond to Webhook"
2. Click the **(+)** button
3. Search for **"Set"** and add it
4. Rename it to **"Format Response"**

#### Step B: Configure the "Set" Node

In the "Format Response" node:

**Keep Only Set:** ✅ Check this box!

**Add Field 1:**
- Click "+ Add Assignment"
- Name: `text`
- Value: `={{ $('Webhook Trigger').item.json.body.message }}`

**Add Field 2:**
- Click "+ Add Assignment"
- Name: `audio_url`
- Value: Leave empty for now: `""`

Or if MiniMax returns an audio URL in the response, use:
- Value: `={{ $json.data.audio_url }}`

#### Step C: Update "Respond to Webhook"

Your "Respond to Webhook" node should already be correct, but verify:

**Options → Response Headers:**
- Content-Type: `application/json`
- Access-Control-Allow-Origin: `*` (add this if testing from localhost)

#### Step D: Save & Activate

1. Click **Save** (top right)
2. Make sure toggle is **ON** (activated)
3. Test: `node test-webhook.js`

---

## 🎯 Expected Result

After the fix, `node test-webhook.js` should show:

```bash
✅ Valid JSON Response:
{
  "text": "Hello! I received your message: ...",
  "audio_url": ""
}

🎉 Webhook test PASSED!
```

---

## 🔍 Understanding the Fix

### What Was Wrong

Your original workflow:
```
Webhook → MiniMax TTS → Respond to Webhook
```

The "Respond to Webhook" node was trying to return the **file data from MiniMax**, not JSON.

### What We Fixed

New workflow:
```
Webhook → Extract Input → MiniMax TTS → Format Response → Respond to Webhook
                                              ↑
                                    This creates JSON!
```

The "Format Response" node creates the JSON object:
```json
{
  "text": "User's message",
  "audio_url": "MiniMax audio URL"
}
```

---

## 📋 Workflow Files Provided

| File | Purpose |
|------|---------|
| [`n8n-workflow-simple-test.json`](n8n-workflow-simple-test.json) | ⚡ Quick test without TTS (USE THIS FIRST) |
| [`n8n-workflow-fixed.json`](n8n-workflow-fixed.json) | 🔧 Full version with TTS integration |
| [`n8n-workflow-example.json`](n8n-workflow-example.json) | 📖 Basic example for reference |

---

## 🧪 Testing Steps

### 1. Import Simple Test Workflow
```bash
# Import n8n-workflow-simple-test.json in n8n
# Activate it
```

### 2. Test with Command Line
```bash
cd /Users/odiadev/callwaitingai.dev\ 2025
node test-webhook.js "Hello test"
```

Should see: `🎉 Webhook test PASSED!`

### 3. Test Chat Widget
```bash
# Open http://localhost:3002
# Click chat bubble
# Type message
# See response!
```

### 4. Check Browser Console
- Press F12
- Look for green ✅ logs
- Should see: "Parsed response data: {text: '...'}"

---

## 🆘 Troubleshooting

### Still Getting Empty Response?

Check these:

1. **Is workflow activated?**
   - Toggle should be ON (blue)

2. **Is webhook path correct?**
   - Should be: `/webhook/tts_minimax`

3. **Is "Set" node before "Respond to Webhook"?**
   - Order matters!

4. **Did you check "Keep Only Set"?**
   - In Set node options

5. **Run test again:**
   ```bash
   node test-webhook.js
   ```

### Getting Different Error?

Share the output of:
```bash
node test-webhook.js
```

---

## ✅ Success Checklist

- [ ] Import simple test workflow OR fix existing workflow
- [ ] Activate workflow (toggle ON)
- [ ] Run `node test-webhook.js` → sees "PASSED"
- [ ] Open http://localhost:3002
- [ ] Click chat bubble
- [ ] Send test message
- [ ] See AI response in chat

Once all checked, you're **DONE**! 🎉

---

## 🎊 Next: Add TTS Audio

Once the simple version works, you can add MiniMax TTS:

1. Use [`n8n-workflow-fixed.json`](n8n-workflow-fixed.json)
2. Update the `audio_url` field to use MiniMax response
3. Handle file upload if needed

But **start with the simple test first** to confirm everything works!

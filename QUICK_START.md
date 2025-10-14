# ⚡ Quick Start Guide - CallWaiting AI Chat Widget

## 🚨 Current Issue

Your n8n webhook returns **empty response** → Chat widget shows JSON parse error.

---

## ✅ Fix in 3 Steps (5 minutes)

### Step 1: Open Your n8n Workflow
Go to: https://callwaitingai.app.n8n.cloud
Open workflow with path: `/webhook/webhook/tts_minimax`

### Step 2: Add Response Node
1. Click (+) after your last node
2. Search: "Respond to Webhook"
3. Add it

### Step 3: Configure Response
In the "Respond to Webhook" node:

**Respond With:** `JSON`

**Response Body:**
```json
{
  "text": "Hello! I'm CallWaiting AI. How can I help you?",
  "audio_url": ""
}
```

**Save & Activate** the workflow ✅

---

## 🧪 Test It

```bash
cd /Users/odiadev/callwaitingai.dev\ 2025
node test-webhook.js
```

Should see: `🎉 Webhook test PASSED!`

---

## 🎉 Use the Chat Widget

Open: http://localhost:3002

1. Click floating chat bubble (bottom-right)
2. Toggle between text/voice mode
3. Send a message
4. See AI response!

---

## 📚 Full Documentation

- [N8N_WORKFLOW_FIX.md](N8N_WORKFLOW_FIX.md) - Detailed n8n fix
- [WEBHOOK_DEBUGGING_GUIDE.md](WEBHOOK_DEBUGGING_GUIDE.md) - Debug help
- [CHAT_WIDGET_README.md](CHAT_WIDGET_README.md) - Widget docs
- [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - Complete overview

---

## 🆘 Still Not Working?

Run the test tool and share output:
```bash
node test-webhook.js
```

Check browser console (F12) for detailed error logs.

---

**That's it! Fix your n8n workflow and you're live!** 🚀

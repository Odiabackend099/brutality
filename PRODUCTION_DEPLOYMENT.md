# 🚀 Production Deployment Guide

## Complete Setup: Chat Widget + AI + TTS

---

## 📋 Pre-Deployment Checklist

### ✅ Local Testing Complete
- [ ] Chat widget works at localhost:3002
- [ ] Simple test workflow passes (`node test-webhook.js`)
- [ ] AI + TTS workflow imported and activated
- [ ] OpenAI responses are intelligent
- [ ] MiniMax audio plays correctly

---

## 🎯 n8n Workflow Setup (Do This First!)

### Option 1: Full AI + TTS (Recommended)

**File:** `n8n-workflow-openai-http.json`

**Features:**
- ✅ OpenAI GPT-4o-mini for intelligent responses
- ✅ MiniMax TTS for voice
- ✅ Complete text + audio responses

**Steps:**
1. Go to https://callwaitingai.app.n8n.cloud
2. Import `n8n-workflow-openai-http.json`
3. Verify OpenAI API key in "OpenAI API" node
4. Verify MiniMax token in "MiniMax TTS" node
5. Save and **Activate**

### Option 2: Simple Test (For Testing)

**File:** `n8n-workflow-simple-test.json`

**Features:**
- ✅ Simple echo responses
- ❌ No AI intelligence
- ❌ No voice audio

**Use for:** Quick testing only

---

## 🌐 Deploy to Vercel

### Step 1: Prepare Environment Variables

Create `.env.production` or set in Vercel dashboard:

```bash
# Required
NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
NEXT_PUBLIC_BRAND_NAME=CallWaiting AI

# Optional
NEXT_PUBLIC_CALENDLY_LINK=https://calendly.com/callwaitingai/30min
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=callwaitingai.dev
```

### Step 2: Build and Test Locally

```bash
cd /Users/odiadev/callwaitingai.dev\ 2025

# Test production build
npm run build

# Test production server
npm start

# Open http://localhost:3000
# Test chat widget
```

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Add complete AI chat widget with OpenAI + MiniMax TTS integration"
git push origin main
```

### Step 4: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_N8N_WEBHOOK`
   - `NEXT_PUBLIC_BRAND_NAME`
5. Click "Deploy"

### Step 5: Configure Custom Domain (Optional)

In Vercel dashboard:
1. Go to project settings
2. Click "Domains"
3. Add: `callwaitingai.dev`
4. Follow DNS configuration instructions

---

## 🔐 Security Best Practices

### Protect Your API Keys

**⚠️ IMPORTANT:** Your OpenAI key is currently in the workflow JSON!

**Fix:**
1. In n8n, create HTTP Header Auth credential
2. Name: `OpenAI API Key`
3. Header Name: `Authorization`
4. Header Value: `Bearer YOUR_API_KEY`
5. Use this credential in the OpenAI API node
6. Remove hardcoded key from JSON

Same for MiniMax token.

### Enable Rate Limiting

Add rate limiting to your n8n webhook:
- Max 10 requests per minute per IP
- Prevent abuse and control costs

### CORS Configuration

Production CORS settings in "Respond to Webhook":
```json
{
  "Access-Control-Allow-Origin": "https://callwaitingai.dev",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

Change from `*` to your actual domain.

---

## 💰 Cost Management

### OpenAI Costs

**Model:** gpt-4o-mini
- Input: $0.150 / 1M tokens (~$0.00002 per message)
- Output: $0.600 / 1M tokens (~$0.00009 per message)

**~150 tokens per chat = ~$0.0001 per message**

**1,000 chats = ~$0.10**

### MiniMax TTS Costs

Check your MiniMax plan for pricing.
Typically: $X per 1M characters

### Monthly Estimates

| Users/Day | Chats/Day | Cost/Month (OpenAI) |
|-----------|-----------|---------------------|
| 10        | 50        | ~$0.15              |
| 100       | 500       | ~$1.50              |
| 1,000     | 5,000     | ~$15                |
| 10,000    | 50,000    | ~$150               |

### Cost Optimization

1. **Use cheaper models:**
   - Switch to `gpt-3.5-turbo` (10x cheaper)
   - Trade-off: less intelligent responses

2. **Reduce max_tokens:**
   - Current: 150 tokens
   - Reduce to 100 for shorter responses

3. **Add caching:**
   - Cache common questions
   - Respond without calling OpenAI

4. **Rate limit users:**
   - Max 5 messages per session
   - Prevent spam/abuse

---

## 📊 Monitoring & Analytics

### n8n Execution Logs

Monitor in n8n dashboard:
- Execution count
- Success rate
- Error logs
- Response times

### Vercel Analytics

Add to your site:
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Logging

Add to `useChat.ts`:
```typescript
// Log chat interactions
console.log('Chat started:', {
  timestamp: new Date(),
  message: content,
  type: audioBlob ? 'voice' : 'text'
});
```

Send to analytics platform:
- Plausible
- Google Analytics
- PostHog
- Mixpanel

---

## 🐛 Production Troubleshooting

### Chat Widget Not Appearing

**Check:**
1. Is ChatWidget imported in page.tsx? ✅
2. Is z-index correct (z-50)? ✅
3. Are there CSS conflicts?
4. Check browser console for errors

### No AI Responses

**Check:**
1. Is n8n workflow activated?
2. Run `node test-webhook.js` from server
3. Check n8n execution logs
4. Verify OpenAI API key is valid
5. Check OpenAI usage limits

### Audio Not Playing

**Check:**
1. MiniMax TTS returning audio URL?
2. Audio URL accessible (test in browser)?
3. CORS headers allow audio loading?
4. Browser audio autoplay policy?

### Slow Responses

**Causes:**
- OpenAI API latency (~1-3 seconds)
- MiniMax TTS generation (~2-5 seconds)
- Network latency

**Solutions:**
- Show "Typing..." indicator (already done)
- Use faster model (gpt-3.5-turbo)
- Cache common responses
- Pre-generate audio for FAQs

---

## 🎯 Post-Deployment Testing

### 1. Test on Production URL

```bash
# Test production webhook
curl -X POST https://callwaitingai.dev/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"text","message":"Hello production!"}'
```

### 2. Test Chat Widget

- Open production site
- Click chat bubble
- Send text message
- Send voice message (if enabled)
- Verify audio plays

### 3. Test on Mobile

- iOS Safari
- Android Chrome
- Test microphone permissions
- Test audio playback

### 4. Load Testing

Use tools like:
- Apache Bench
- K6
- Artillery

Test concurrent users to ensure stability.

---

## 📈 Scaling Considerations

### Current Setup
- ✅ Good for: 0-1,000 daily users
- ✅ Serverless (auto-scales)
- ✅ Pay-per-use

### For Higher Traffic

**Add:**
1. **CDN** - Cloudflare for caching
2. **Database** - Store chat history
3. **Queue System** - Handle bursts
4. **Load Balancer** - Distribute traffic

**Optimize:**
- Response caching
- Background processing
- Batch TTS requests
- Use Redis for sessions

---

## ✅ Go-Live Checklist

### n8n
- [ ] AI + TTS workflow imported
- [ ] OpenAI credentials configured
- [ ] MiniMax credentials configured
- [ ] Workflow activated
- [ ] Test webhook passes

### Next.js App
- [ ] Production build successful
- [ ] Environment variables set
- [ ] Chat widget tested locally
- [ ] No console errors

### Vercel Deployment
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Environment variables set in Vercel

### Testing
- [ ] Production webhook responds
- [ ] Chat widget appears
- [ ] AI responses work
- [ ] Audio plays correctly
- [ ] Mobile works
- [ ] No CORS errors

### Security
- [ ] API keys not in public code
- [ ] CORS restricted to domain
- [ ] Rate limiting enabled
- [ ] HTTPS only

### Monitoring
- [ ] Vercel analytics installed
- [ ] n8n execution logging enabled
- [ ] Error tracking configured
- [ ] Cost alerts set

---

## 🎉 You're Live!

Once all checkboxes are complete:

✅ Your AI chat widget is **LIVE** in production!
✅ Users can chat with intelligent AI
✅ Voice responses play automatically
✅ Fully scalable and monitored

**Share your site:** https://callwaitingai.dev

---

## 🆘 Production Support

### Quick Fixes

**Workflow stopped?**
- Check if it's still activated in n8n
- Re-save and re-activate

**High costs?**
- Check OpenAI usage dashboard
- Add rate limiting
- Switch to cheaper model

**Slow responses?**
- Check n8n execution times
- Optimize workflow
- Add caching

### Resources

- [OpenAI Status](https://status.openai.com)
- [Vercel Status](https://vercel-status.com)
- [n8n Community](https://community.n8n.io)

---

**Congratulations on your production deployment!** 🚀

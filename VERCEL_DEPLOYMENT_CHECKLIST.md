# ✅ Vercel Deployment Checklist

## Quick Deployment Guide for CallWaitingAI

---

## 🎯 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier is fine)
- [ ] All API keys obtained:
  - [ ] Supabase (URL + 2 keys)
  - [ ] Deepgram API key
  - [ ] Groq API key
  - [ ] MiniMax API key + Group ID

---

## 📝 Step 1: Get API Keys

### Supabase (Database & Auth)

1. Go to <https://supabase.com/dashboard>
2. Select your project (or create new)
3. Navigate to: **Settings → API**
4. Copy these 3 values:

   ```text
   ✅ URL: https://your-project.supabase.co
   ✅ anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ✅ service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Deepgram (Speech-to-Text)

1. Go to <https://console.deepgram.com>
2. Sign up/login (free $200 credits)
3. Navigate to: **API Keys**
4. Click **Create New Key**
5. Copy the key:

   ```text
   ✅ API Key: your_deepgram_api_key_here
   ```

### Groq (AI Language Model)

1. Go to <https://console.groq.com>
2. Sign up/login (free tier)
3. Navigate to: **API Keys**
4. Click **Create API Key**
5. Copy the key:

   ```text
   ✅ API Key: gsk_your_groq_api_key_here
   ```

### MiniMax (Text-to-Speech)

1. Go to <https://platform.minimaxi.com>
2. Sign up/login
3. Navigate to: **API Section**
4. Copy both values:

   ```text
   ✅ API Key: your_minimax_api_key
   ✅ Group ID: your_minimax_group_id
   ```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Visit: <https://vercel.com/new>
   - Click **"Import Git Repository"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **`.`** (default)
   - Build Command: **`npm run build`** (default)
   - Click **"Deploy"** (first deployment will fail - that's OK!)

---

## 🔧 Step 3: Add Environment Variables

In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**

2. Add the following variables **one by one**:

### Required for Voice AI (Add these to ALL environments)

| Variable Name | Example Value | Get From |
|--------------|---------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1...` | Supabase Dashboard |
| `NEXT_PUBLIC_DEEPGRAM_API_KEY` | `your_key_here` | Deepgram Console |
| `GROQ_API_KEY` | `gsk_your_key_here` | Groq Console |
| `MINIMAX_API_KEY` | `your_key_here` | MiniMax Platform |
| `MINIMAX_GROUP_ID` | `your_group_id` | MiniMax Platform |
| `ODIADEV_TTS_API_KEY` | `your_key_here` | Same as MINIMAX_API_KEY |
| `ODIADEV_TTS_GROUP_ID` | `your_group_id` | Same as MINIMAX_GROUP_ID |

### Application URLs (Add these to ALL environments)

| Variable Name | Value (Production) | Value (Preview/Dev) |
|--------------|-------------------|---------------------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | `https://your-domain.vercel.app` | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | `http://localhost:3000` |

### Optional TTS Settings (Add to ALL environments)

| Variable Name | Value |
|--------------|-------|
| `ODIADEV_TTS_BASE_URL` | `https://minimax-tts-odiadev.onrender.com` |
| `MINIMAX_MODEL` | `speech-02-hd` |
| `DEFAULT_VOICE` | `odia` |
| `DEFAULT_SPEED` | `1.0` |
| `DEFAULT_PITCH` | `0` |
| `DEFAULT_EMOTION` | `neutral` |

---

## 📋 Step 4: Add Variables in Vercel

For EACH variable above:

1. Click **"Add New"** button
2. Enter **Variable Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Paste **Value** (your actual API key/URL)
4. Select environments:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Click **"Save"**

**Repeat for all variables!**

---

## 🔄 Step 5: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots menu (⋯)**
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional)
6. Click **"Redeploy"**

---

## ✅ Step 6: Verify Deployment

1. **Wait for deployment to complete** (usually 2-5 minutes)

2. **Visit your site:**

   ```text
   https://your-project-name.vercel.app
   ```

3. **Test voice conversation:**
   - Navigate to: **Dashboard → Agents**
   - Click **"Create Agent"**
   - Fill in agent details
   - Click **"Call Agent"**
   - Allow microphone permission
   - Start speaking!

4. **Check browser console:**
   ```javascript
   // Open DevTools (F12) and run:
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   // Should show your Supabase URL, not undefined
   ```

---

## 🐛 Troubleshooting

### Issue: Build Failed

**Check build logs:**

1. Deployments → Latest deployment
2. Look for error messages
3. Common issues:
   - TypeScript errors → Run `npm run build` locally
   - Missing dependencies → Check `package.json`
   - Node version mismatch → Add `.nvmrc` or set in Vercel

**Fix:**

```bash
# Test build locally first
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build errors"
git push origin main
```

---

### Issue: Environment Variables Not Working

**Symptoms:**

- "API key not found" errors
- Features not working
- Console shows `undefined` for env vars

**Solutions:**

1. **Verify variable names:**
   - Must be EXACT (case-sensitive)
   - Public vars MUST start with `NEXT_PUBLIC_`

2. **Check environments:**
   - Ensure variables are added to Production
   - Verify checkboxes are selected

3. **Redeploy after adding:**
   - Variables only apply to NEW deployments
   - Must redeploy after adding/changing variables

4. **Check in dashboard:**
   - Settings → Environment Variables
   - Verify all variables are listed

---

### Issue: Voice Conversation Not Working

**Check each service:**

1. **Microphone:**
   - Browser permission granted?
   - Try different browser (Chrome recommended)
   - Check browser console for errors

2. **Deepgram (STT):**

   ```text
   Error: "Deepgram API key is missing"
   Fix: Add NEXT_PUBLIC_DEEPGRAM_API_KEY
   ```

3. **Groq (LLM):**

   ```text
   Error: "Failed to generate response"
   Fix: Add GROQ_API_KEY
   ```

4. **MiniMax (TTS):**

   ```text
   Error: "Failed to generate speech"
   Fix: Add MINIMAX_API_KEY and MINIMAX_GROUP_ID
   ```

---

### Issue: Database Connection Failed

**Check Supabase:**

1. Verify URL is correct:

   ```text
   https://your-project.supabase.co
   NOT: https://your-project.supabase.com (wrong!)
   ```

2. Verify keys:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key (public)
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (secret)

3. Check Supabase project:
   - Is it paused? (Free tier pauses after inactivity)
   - Go to Dashboard → Activate if needed

---

## 📊 Environment Variables Summary

### Minimum Required (7 variables)

```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_DEEPGRAM_API_KEY
✅ GROQ_API_KEY
✅ MINIMAX_API_KEY
✅ MINIMAX_GROUP_ID
```

### Recommended (12 variables)

```bash
# Above 7 plus:
✅ ODIADEV_TTS_API_KEY (same as MINIMAX_API_KEY)
✅ ODIADEV_TTS_GROUP_ID (same as MINIMAX_GROUP_ID)
✅ NEXT_PUBLIC_APP_URL
✅ NEXT_PUBLIC_API_URL
✅ NEXT_PUBLIC_SITE_URL
```

### Optional (6 variables)

```bash
✅ ODIADEV_TTS_BASE_URL
✅ MINIMAX_MODEL
✅ DEFAULT_VOICE
✅ DEFAULT_SPEED
✅ DEFAULT_PITCH
✅ DEFAULT_EMOTION
```

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Site loads at your Vercel URL
- ✅ Dashboard is accessible
- ✅ Can create agents
- ✅ Voice conversation works:
  - ✅ Microphone permission granted
  - ✅ Speech transcription appears
  - ✅ AI responds with voice
  - ✅ Can select different voices

---

## 📞 Quick Test

1. Visit: `https://your-domain.vercel.app/dashboard/agents`
2. Click **"Create Agent"**
3. Choose voice: **Odia**
4. Set system prompt: **"You are a helpful assistant"**
5. Click **"Save"**
6. Click **"Call Agent"**
7. Speak: **"Hello, can you hear me?"**
8. Should hear AI response!

---

## 🔗 Useful Links

- **Vercel Dashboard**: <https://vercel.com/dashboard>
- **Vercel Docs**: <https://vercel.com/docs>
- **Supabase Dashboard**: <https://supabase.com/dashboard>
- **Deepgram Console**: <https://console.deepgram.com>
- **Groq Console**: <https://console.groq.com>
- **MiniMax Platform**: <https://platform.minimaxi.com>

---

## 📝 Final Checklist

Before going live:

- [ ] All environment variables added
- [ ] Build successful
- [ ] Site loads without errors
- [ ] Database connection working
- [ ] Voice conversation tested
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)
- [ ] Error tracking enabled (optional)

---

**Need help?** Check the detailed guide: `VERCEL_ENV_SETUP.md`

**Last Updated**: 2025-10-21
**Status**: ✅ Ready for Production

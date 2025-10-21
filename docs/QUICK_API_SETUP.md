# ⚡ Quick API Setup Guide - 5 Minutes

## 🎯 **Essential Services Setup (Copy-Paste Ready)**

### **1. Supabase (Database) - 2 minutes**
```
1. Visit: https://supabase.com
2. Click "Start your project"
3. Create new project
4. Go to Settings > API
5. Copy these values:
   - Project URL: https://your-project-id.supabase.co
   - anon public key: eyJ... (long string)
   - service_role key: eyJ... (long string)
```

### **2. Groq (AI) - 1 minute**
```
1. Visit: https://console.groq.com
2. Sign up with Google/GitHub
3. Go to API Keys
4. Click "Create API Key"
5. Copy: gsk_your-key-here
```

### **3. Twilio (Phone) - 2 minutes**
```
1. Visit: https://console.twilio.com
2. Sign up (free trial)
3. Dashboard shows:
   - Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - Auth Token: your-auth-token
4. Buy phone number: Console > Phone Numbers > Manage > Buy a number
```

### **4. Flutterwave (Payments) - 2 minutes**
```
1. Visit: https://dashboard.flutterwave.com
2. Sign up for account
3. Go to Settings > API Keys
4. Copy:
   - Public Key: FLWPUBK_...
   - Secret Key: FLWSECK_...
   - Encryption Key: (from Settings > API Keys)
```

### **5. Resend (Email) - 1 minute**
```
1. Visit: https://resend.com
2. Sign up
3. Go to API Keys
4. Create new key
5. Copy: re_your-key-here
```

### **6. Google reCAPTCHA - 1 minute**
```
1. Visit: https://www.google.com/recaptcha/admin
2. Click "+" to create new site
3. Choose reCAPTCHA v3
4. Add your domain
5. Copy:
   - Site Key: 6LdX...
   - Secret Key: 6LdX...
```

## 🚀 **Vercel Deployment (3 minutes)**

### **Step 1: Connect GitHub**
```
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Click "Import"
```

### **Step 2: Add Environment Variables**
```
1. Go to Project Settings > Environment Variables
2. Add each variable from the list below
3. Click "Save" after each one
```

### **Step 3: Deploy**
```
1. Click "Deploy" button
2. Wait 2-3 minutes
3. Your site is live!
```

## 📋 **Copy-Paste Environment Variables**

Add these to Vercel (replace YOUR_VALUES with actual values):

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY

# Authentication
NEXTAUTH_SECRET=YOUR_RANDOM_SECRET_HERE
NEXTAUTH_URL=https://YOUR_DOMAIN.vercel.app

# AI Services
GROQ_API_KEY=gsk_YOUR_GROQ_KEY

# Telephony
TWILIO_ACCOUNT_SID=AC_YOUR_TWILIO_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_TOKEN
TWILIO_PHONE_NUMBER=+1YOUR_PHONE_NUMBER

# Payments (Flutterwave)
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_YOUR_PUBLIC_KEY
FLUTTERWAVE_SECRET_KEY=FLWSECK_YOUR_SECRET_KEY
FLUTTERWAVE_ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY

# Email
RESEND_API_KEY=re_YOUR_RESEND_KEY

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdX_YOUR_SITE_KEY
RECAPTCHA_SECRET_KEY=6LdX_YOUR_SECRET_KEY

# App Config
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN.vercel.app
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN.vercel.app/api
```

## 🎯 **Total Time: 8 minutes**

1. **Supabase**: 2 min
2. **Groq**: 1 min  
3. **Twilio**: 2 min
4. **Flutterwave**: 2 min
5. **Resend**: 1 min
6. **reCAPTCHA**: 1 min
7. **Vercel**: 3 min

## 🚨 **Important Notes:**

- **Use test keys first** (Flutterwave test mode, Twilio trial)
- **Replace YOUR_DOMAIN** with your actual Vercel domain
- **Generate random NEXTAUTH_SECRET** (use any random string)
- **Test everything** before going live

## 🆘 **Need Help?**

- **Supabase**: https://supabase.com/docs
- **Groq**: https://console.groq.com/docs
- **Twilio**: https://www.twilio.com/docs
- **Flutterwave**: https://developer.flutterwave.com/docs
- **Vercel**: https://vercel.com/docs

---

**🎉 After 8 minutes, your CallWaitingAI website will be live and ready to generate leads!**

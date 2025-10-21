# 🚀 Vercel Deployment Guide for CallWaitingAI

## 📋 **Step-by-Step Deployment Process**

### **1. Prerequisites**
- [ ] Vercel account (free tier available)
- [ ] GitHub repository connected
- [ ] Domain name (optional, Vercel provides free subdomain)

### **2. Environment Variables Setup**

Copy these environment variables to your Vercel project:

#### **🔐 Core Configuration**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### **🤖 AI Services**
```bash
GROQ_API_KEY=gsk_your-groq-api-key-here
DEEPGRAM_API_KEY=your-deepgram-api-key-here
ODIADEV_API_KEY=your-odiadev-api-key-here
```

#### **📞 Telephony**
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### **💳 Payments**
```bash
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_your-public-key
FLUTTERWAVE_SECRET_KEY=FLWSECK_your-secret-key
FLUTTERWAVE_ENCRYPTION_KEY=your-encryption-key
FLUTTERWAVE_WEBHOOK_HASH=your-webhook-hash
```

#### **📧 Email**
```bash
RESEND_API_KEY=re_your-resend-api-key
```

#### **🔒 Security**
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp
RECAPTCHA_SECRET_KEY=6LdXOu8rAAAAAH5inDMTaEgDzVeWMMdSZip2Xu8Y
```

#### **📈 Analytics**
```bash
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token
```

#### **🔗 Integrations**
```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/tool-submission
HUBSPOT_API_KEY=your-hubspot-api-key
```

#### **🌍 App Configuration**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true
NEXT_PUBLIC_ENABLE_FREE_TOOLS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### **3. Deployment Steps**

#### **Option A: GitHub Integration (Recommended)**
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose "Import"

2. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add each variable from the list above
   - Set environment scope (Production/Preview/Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

#### **Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Deploy to production
vercel --prod
```

### **4. Custom Domain Setup (Optional)**

1. **Add Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled automatically

### **5. Post-Deployment Configuration**

#### **🔧 Update Environment Variables**
- Update `NEXTAUTH_URL` to your production domain
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Update `NEXT_PUBLIC_API_URL` to your production domain

#### **📊 Analytics Setup**
- Add your Google Analytics tracking ID
- Configure Mixpanel events
- Test analytics tracking

#### **🔒 Security Configuration**
- Verify reCAPTCHA is working
- Test rate limiting
- Check security headers

### **6. Testing Your Deployment**

#### **🧪 Basic Functionality Tests**
- [ ] Homepage loads correctly
- [ ] Free tools are accessible
- [ ] Contact forms work
- [ ] API endpoints respond
- [ ] Authentication works

#### **🔧 Advanced Features Tests**
- [ ] reCAPTCHA validation
- [ ] Email sending
- [ ] Payment processing
- [ ] AI chat functionality
- [ ] File uploads/downloads

### **7. Performance Optimization**

#### **⚡ Vercel Optimizations**
- **Edge Functions:** Already configured for API routes
- **Image Optimization:** Next.js Image component
- **Caching:** Automatic static file caching
- **CDN:** Global edge network

#### **📈 Monitoring**
- **Vercel Analytics:** Built-in performance monitoring
- **Error Tracking:** Configure Sentry
- **Uptime Monitoring:** Set up alerts

### **8. Troubleshooting Common Issues**

#### **🚨 Build Failures**
```bash
# Common solutions:
npm install --legacy-peer-deps
npm run build
```

#### **🔐 Environment Variable Issues**
- Check variable names match exactly
- Ensure no trailing spaces
- Verify production vs development values

#### **📞 API Issues**
- Test API endpoints individually
- Check CORS configuration
- Verify webhook URLs

### **9. Production Checklist**

- [ ] All environment variables configured
- [ ] Custom domain set up (if applicable)
- [ ] SSL certificate active
- [ ] Analytics tracking working
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Backup strategy in place

### **10. Maintenance & Updates**

#### **🔄 Automatic Deployments**
- Connect GitHub for automatic deployments
- Set up preview deployments for testing
- Configure branch protection rules

#### **📊 Monitoring**
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics

---

## 🎯 **Quick Start Commands**

```bash
# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove
```

---

## 📞 **Support & Resources**

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Environment Variables:** [vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**🎉 Your CallWaitingAI website will be live and ready to start generating leads!**

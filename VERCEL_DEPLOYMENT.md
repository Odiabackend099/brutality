# Vercel Deployment Guide for CallWaiting AI

## 🚀 Quick Deploy to Vercel

Your repository is now ready at: [https://github.com/Odiabackend099/callwaitingai-landing-2025.git](https://github.com/Odiabackend099/callwaitingai-landing-2025.git)

### Method 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Odiabackend099/callwaitingai-landing-2025.git)

### Method 2: Manual Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import Git Repository**: `Odiabackend099/callwaitingai-landing-2025`
4. **Configure Project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: _leave blank_ (Vercel uses `.next`)
   - Install Command: `npm install` (default)

5. **Environment Variables** (Optional):
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
   ```

6. **Click "Deploy"**

### Method 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? callwaitingai-landing
# - In which directory is your code located? ./
# - Want to override settings? No
```

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `callwaitingai.dev`)
3. Update DNS records as instructed by Vercel

### 2. Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
```

### 3. Analytics (Optional)

Enable Vercel Analytics in Project Settings → Analytics.

## 📊 Performance Features

Your deployment includes:

- ✅ **Static Optimization**: Next.js App Router `app` directory prerendered for CDN
- ✅ **Security Headers**: Production-ready security
- ✅ **Mobile Responsive**: Optimized for all devices
- ✅ **SEO Optimized**: Meta tags and structured data
- ✅ **Fast Loading**: Optimized images and code splitting

## 🔗 Integration Points

### Frontend → Backend Integration

The landing page integrates with:

1. **Payment Links**: Direct links to Flutterwave
   - Starter: `https://flutterwave.com/pay/tcasx4xsfmdj`
   - Pro: `https://flutterwave.com/pay/vcpp9rpmnvdm`

2. **Calendly CTA**: Uses `NEXT_PUBLIC_CALENDLY_LINK` for demo bookings

3. **Webhook Processing**: n8n workflows handle
   - Payment verification via Flutterwave API
   - Lead capture with email alerts
   - Database storage in Supabase

## 🧪 Testing Your Deployment

### 1. Frontend Tests

- [ ] Landing page loads correctly
- [ ] Payment buttons open Flutterwave links in new tab
- [ ] Calendly CTA opens scheduling link
- [ ] Mobile responsive design works
- [ ] All links and navigation work

### 2. Integration Tests

- [ ] Payment webhook processes correctly
- [ ] Customer receives confirmation email

## 🚀 Deployment URLs

After deployment, your site will be available at:

- **Vercel URL**: `https://callwaitingai-landing-2025.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## 📈 Monitoring

### Vercel Analytics

Monitor your deployment:
- Page views and traffic
- Performance metrics
- Error tracking
- Real-time analytics

### Backend Monitoring

Monitor the backend (see `callwaiting-backend/README.md`):
- n8n execution logs
- Docker container health
- Supabase database metrics
- Email delivery status

## 🔄 Continuous Deployment

Your repository is configured for:
- **Automatic deploys** on push to `main` branch
- **Preview deploys** on pull requests
- **Branch protection** (recommended)

## 🛠 Troubleshooting

### Common Issues

**Build Failures**:
- Check `package.json` dependencies
- Verify `next.config.js` configuration
- Review build logs in Vercel dashboard

**Environment Variables**:
- Ensure variables are set in Vercel dashboard
- Check variable names match code usage
- Redeploy after adding variables

**Domain Issues**:
- Verify DNS configuration
- Check SSL certificate status
- Ensure domain is properly linked

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Test locally with `npm run build`
4. Contact: callwaitingai@gmail.com

---

**Your CallWaiting AI landing page is now ready for production! 🎉**

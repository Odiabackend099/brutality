# CallWaiting AI - AI Receptionist Landing Page

> **Stop Losing Sales to Slow Replies — Let AI Answer Calls & DMs Instantly**

A high-conversion, TikTok-native landing page for CallWaiting AI service with integrated payment processing, free trial offering, and automated lead capture. Designed for creators, influencers, and Shopify store owners.

## ✨ Latest Redesign (October 2025)

**Complete landing page overhaul focused on conversion optimization:**
- 🎯 **New ROI-Focused Messaging**: "Stop Losing Sales to Slow Replies" headline
- 🆓 **Free Trial First**: 7-day free trial prominently featured (no credit card required)
- 📱 **TikTok-Native Design**: 3-5 second attention span optimization
- 💰 **Creator-Focused Copy**: Revenue metrics, time savings, and social proof
- 📊 **Enhanced Social Proof**: 3 detailed testimonials with specific results
- 🚀 **Sticky Mobile CTA**: Always-visible conversion button on mobile
- 🎨 **Interactive Demos**: Voice call + TikTok DM chat examples
- 📈 **ROI Metrics Section**: +20% sales, 5s response time, 100% leads answered

## 🚀 Features

- **High-Conversion Design**: TikTok-native layout with urgency messaging and ROI focus
- **Free Trial Offering**: Risk-free 7-day trial with no credit card required
- **Payment Integration**: Flutterwave payment links for $300 Starter and $500 Pro plans
- **Lead Capture**: Automated form submission with CORS support to n8n webhook
- **Mobile First**: Sticky CTA bar for mobile users, responsive across all devices
- **SEO Optimized**: Meta tags for TikTok/Shopify keywords, LLM-friendly footer content
- **Interactive Demos**: Side-by-side voice and chat demo previews
- **Security**: Production-ready security headers and best practices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (frontend), Docker (backend)
- **Payments**: Flutterwave
- **Automation**: n8n workflows
- **Database**: Supabase

## 📦 Project Structure

```
callwaitingai-landing-2025/
├── app/                         # Next.js App Router source
│   ├── layout.tsx               # Root layout and metadata
│   └── page.tsx                 # Landing page UI
├── analytics/                   # Client-side analytics helpers
├── callwaiting-backend/         # Backend deployment archive
├── public/                      # Static assets (optional)
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS pipeline for Tailwind
├── package.json                 # Dependencies and scripts
├── next.config.js               # Next.js configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## 🚀 Quick Start

### Frontend (Vercel Deployment)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Odiabackend099/callwaitingai-landing-2025.git
   cd callwaitingai-landing-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   ```bash
   # Connect to Vercel
   vercel
   
   # Or push to GitHub and connect via Vercel dashboard
   git push origin main
   ```

### Backend (Self-hosted)

See `callwaiting-backend/README.md` for complete backend deployment instructions.

## 🔧 Configuration

### Environment Variables

For Vercel deployment, set these environment variables:

- `NEXT_PUBLIC_APP_URL` - Your domain (e.g., `https://callwaitingai.dev`)
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` - n8n webhook URL (e.g., `https://n8n.odia.dev`)

### Payment Links

Update the Flutterwave payment links near the top of `app/page.tsx`:

```tsx
// Starter plan ($300)
href="https://flutterwave.com/pay/tcasx4xsfmdj"

// Pro plan ($500)
href="https://flutterwave.com/pay/vcpp9rpmnvdm"
```

### Lead Form

The lead form is configured to submit to:
```
https://n8n.odia.dev/webhook/leads_callwaiting
```

## 🎨 Page Structure & Sections

The redesigned landing page follows a proven conversion funnel:

1. **Hero Section**: ROI-focused headline + visual demo mockup
2. **Social Proof Bar**: TikTok Shop, WhatsApp, Shopify logos + testimonial
3. **Problem/Pain Point**: "Missed Messages = Missed Money" with urgency stats
4. **Solution/Value Prop**: 4 benefit cards (Instant, Answers, Sales, Human-like)
5. **Demo Section**: Interactive voice call + TikTok DM chat examples
6. **Creator Benefits/ROI**: Narrative + 3 metric cards with results
7. **Use Cases**: Law firms, realtors, clinics, TikTok/Shopify stores
8. **Pricing**: Free Trial (highlighted) + $300 Starter + $500 Pro
9. **Testimonials**: 3 detailed reviews with specific results
10. **Contact Form**: Lead capture with n8n webhook integration
11. **SEO Footer**: Keyword-rich description for search engines
12. **Sticky Mobile CTA**: Fixed bottom bar on mobile devices

### Colors and Branding

The design uses the CallWaiting AI brand colors:

- **Primary Gradient**: Cyan (#22D3EE) → Blue (#3B82F6)
- **Accent Purple**: For headline flourishes
- **Success Green**: (#4ADE80) for free trial and checkmarks
- **Urgency Red/Orange**: For pain point section
- **Dark Background**: Slate-950 (#020617) for premium feel

To customize:
1. Update gradient classes in `app/page.tsx`
2. Modify Tailwind color values in components
3. Maintain high contrast for accessibility

### Content Customization

Key sections to update:
- **Hero**: Headline variants in comments (test A/B options)
- **Pricing**: Update Flutterwave links and amounts
- **Testimonials**: Add real customer reviews with results
- **Use Cases**: Tailor to your target industries
- **Footer**: Update company info and keywords

## 🔒 Security Features

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **CORS Protection**: Proper CORS handling for form submissions
- **Input Validation**: Client-side and server-side validation
- **Rate Limiting**: Backend rate limiting via n8n and Nginx

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly buttons and interactions
- Optimized images and loading
- Mobile-first approach

## 🚀 Performance

- **Next.js Optimization**: Automatic code splitting and optimization
- **Image Optimization**: Optimized images and lazy loading
- **Bundle Analysis**: Optimized bundle size
- **CDN**: Vercel's global CDN for fast loading

## 📊 Analytics & Monitoring

To add analytics:

1. **Google Analytics**: Add GA4 tracking code
2. **Vercel Analytics**: Built-in analytics with Vercel
3. **Custom Events**: Track form submissions and button clicks

## 🔧 Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style

- ESLint configuration included
- TypeScript for type safety
- Consistent code formatting

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
# Serve the production build locally or behind your own reverse proxy
```

## 📞 Support

For technical support or questions:
- Email: callwaitingai@gmail.com
- GitHub Issues: Create an issue in this repository

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons by Lucide React
- Deployed on Vercel
- Backend automation with n8n

---

**CallWaiting AI** - Smart Voice for Smart Business

# CallWaiting AI - Conversion-Optimized Landing Page

> **Stop losing carts to slow replies. CallWaiting AI answers TikTok DMs, WhatsApp, and phone calls in seconds.**

A high-converting landing experience tailored for TikTok and Shopify traffic. Includes hero demo video slot, sticky mobile CTA, and direct purchase links for Flutterwave.

## 🚀 Features

- **Hero Conversion Block**: Gradient hero with video slot and dual CTAs (free trial + Calendly)
- **Embedded Demo Video**: YouTube ad loop autoplaying via privacy-enhanced embed
- **Mobile Sticky CTA**: Persistent bottom CTA to boost conversions on mobile
- **Pricing Grid**: Direct Flutterwave payment buttons for Starter and Pro plans
- **SEO Ready**: Optimized metadata, OG tags, and Twitter cards
- **Tailwind Styling**: Clean utility-first styling with custom gradient helpers
- **Analytics-Ready**: Optional Plausible hook via env var

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
├── app/
│   ├── components/              # Landing page sections (Hero, Pricing, etc.)
│   ├── globals.css              # Tailwind directives + custom utilities
│   ├── layout.tsx               # Metadata and root layout
│   └── page.tsx                 # Landing page composition
├── analytics/                   # Client-side analytics helpers (optional Plausible)
├── callwaiting-backend/         # Backend deployment archive
├── public/
│   ├── animations/ai-demo.mp4   # Optional fallback hero video loop
│   ├── logo.svg                 # Brand mark
│   ├── og.jpg                   # OpenGraph image (1200x630)
│   └── poster.jpg               # Hero video poster frame
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

Set these in your deployment environment:

- `NEXT_PUBLIC_APP_URL` - Your domain (e.g., `https://callwaitingai.dev`)
- `NEXT_PUBLIC_N8N_WEBHOOK` - Full n8n webhook endpoint for the chat/voice widget (default `https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax`)
- `NEXT_PUBLIC_CALENDLY_LINK` - Calendly link for demo bookings (optional override)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Domain for Plausible analytics (optional)

### Payment Links

Payment buttons live in `app/components/Pricing.tsx`:

```tsx
// Starter plan ($300)
href="https://flutterwave.com/pay/tcasx4xsfmdj"

// Pro plan ($500)
href="https://flutterwave.com/pay/vcpp9rpmnvdm"
```

### Lead Capture

The previous lead form has been removed in favour of direct trial and payment CTAs. Capture leads via Calendly bookings or your CRM of choice.

### Chat & Voice AI Webhook

The floating chat widget sends both text and voice inputs to the n8n workflow at:

```
https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
```

Override the endpoint with `NEXT_PUBLIC_N8N_WEBHOOK` if you deploy another environment.

## 🎨 Customization

### Colors and Branding

The design uses a cyan/blue/emerald gradient theme. To customize:

1. Update gradient helpers in `app/globals.css`
2. Adjust section copy or Tailwind classes inside `app/components`
3. Replace assets in `public/` (`logo.svg`, `og.jpg`, `poster.jpg`, optional `animations/ai-demo.mp4`)

### Content

Key sections to customize:
- Hero headline and description
- Demo CTA copy
- How It Works steps
- Pricing plans and features
- FAQ entries
- Footer content
- YouTube embed URL in `app/components/Hero.tsx` if the ad video changes

## 🔒 Security Features

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Backend Hardening**: See `callwaiting-backend` documentation
- **Payment Links**: Direct Flutterwave checkout links (no card data handled onsite)

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Sticky CTA for mobile conversions
- Touch-friendly buttons and interactions
- Optimized video and gradient backgrounds

## 🚀 Performance

- **Next.js Optimization**: Automatic code splitting and optimization
- **Tailwind CSS**: Purges unused styles in production
- **Static Assets**: CDN friendly OG image, poster, and video slot
- **CDN**: Vercel's global CDN for fast loading

## 📊 Analytics & Monitoring

Enable the tools you need:

1. **Google Analytics**: Add GA4 tracking code
2. **Vercel Analytics**: Built-in analytics with Vercel
3. **Plausible**: Enable via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

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
- Tailwind utility classes for styling

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

# CallWaiting AI - AI Receptionist Landing Page

> **Never Miss a Customer — Let AI Answer Calls, WhatsApp & TikTok DMs 24/7**

A modern, responsive landing page for CallWaiting AI service with integrated payment processing via Flutterwave and automated lead capture.

## 🚀 Features

- **Modern Design**: Clean, professional landing page with dark theme
- **Payment Integration**: Flutterwave payment links for $300 Starter and $500 Pro plans
- **Lead Capture**: Automated form submission with CORS support
- **Mobile Responsive**: Optimized for all devices
- **SEO Optimized**: Meta tags, structured data, and performance optimized
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
├── callwaiting-landing.tsx      # Main landing page component
├── callwaiting-backend/         # Backend deployment archive
│   ├── docker-compose.yml       # Production Docker stack
│   ├── n8n_workflows/           # Automation workflows
│   ├── db/                      # Database schema
│   └── README.md               # Backend setup guide
├── package.json                # Dependencies and scripts
├── next.config.js              # Next.js configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
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

Update the Flutterwave payment links in `callwaiting-landing.tsx`:

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

## 🎨 Customization

### Colors and Branding

The design uses a cyan/blue gradient theme. To customize:

1. Update the gradient classes in `callwaiting-landing.tsx`
2. Modify the color scheme in Tailwind classes
3. Update the logo and branding elements

### Content

Key sections to customize:
- Hero headline and description
- Pricing plans and features
- Testimonials
- Contact information
- Footer content

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
npm run export
# Upload 'out' folder to your hosting provider
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

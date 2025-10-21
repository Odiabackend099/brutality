# CallWaiting AI - Voice AI Receptionist System

A Next.js 14 SaaS application that provides AI-powered voice receptionists for businesses, featuring real-time call handling, lead qualification, and appointment booking.

## 🚀 Features

- **Voice AI Receptionist**: Real-time voice processing with Groq LLM integration
- **Speech-to-Text**: Deepgram STT for accurate voice recognition
- **Text-to-Speech**: Custom TTS with multiple voice options
- **Call Management**: Twilio integration for inbound/outbound calls
- **Lead Qualification**: AI-powered lead scoring and qualification
- **Appointment Booking**: Automated scheduling system
- **Analytics Dashboard**: Real-time monitoring and reporting
- **Multi-tenant Architecture**: Supabase-backed with RLS policies
- **Payment Processing**: Flutterwave integration for subscriptions
- **Security**: Enterprise-grade security with rate limiting and encryption

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI Services**: Groq LLM, Deepgram STT, Custom TTS
- **Voice Processing**: Twilio, WebRTC, VAD (Voice Activity Detection)
- **Database**: Supabase PostgreSQL with RLS
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Flutterwave
- **Monitoring**: Winston logging, real-time health checks

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── auth/             # Authentication pages
│   └── tools/            # Free tools pages
├── components/           # React components
├── lib/                  # Utility libraries
│   ├── services/        # Service layer
│   └── *.ts            # Core utilities
├── docs/                # Documentation
├── public/              # Static assets
└── types/               # TypeScript definitions
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brutality
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WEBHOOK_SECRET=your_webhook_secret

# AI Services
GROQ_API_KEY=your_groq_key
DEEPGRAM_API_KEY=your_deepgram_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Payments
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret

# Security
ENCRYPTION_KEY=your_encryption_key
REDIS_URL=your_redis_url
```

## 📚 Documentation

- [Setup Guide](docs/SETUP_GUIDE.md)
- [API Documentation](docs/API_DOCS.md)
- [Security Guide](docs/SECURITY_GUIDE.md)
- [Deployment Guide](docs/VERCEL_DEPLOYMENT_GUIDE.md)
- [Test Reports](docs/reports/)

## 🧪 Testing

The application includes comprehensive testing with TestSprite:

- **Frontend Tests**: UI component testing
- **API Tests**: Endpoint functionality testing
- **Security Tests**: Authentication and authorization testing
- **Performance Tests**: Load and stress testing

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🔒 Security

- **Rate Limiting**: Redis-based rate limiting
- **API Key Security**: Bcrypt hashing and secure storage
- **Data Encryption**: AES-256 encryption for sensitive data
- **Webhook Validation**: Twilio signature verification
- **CORS Protection**: Configured CORS policies
- **Input Validation**: Comprehensive input sanitization

## 📊 Monitoring

- **Health Checks**: Real-time system health monitoring
- **Logging**: Winston-based structured logging
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Response time and uptime tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Open an issue on GitHub
- **Email**: support@callwaitingai.com

## 🎯 Roadmap

- [ ] Advanced AI voice training
- [ ] Multi-language support
- [ ] CRM integrations
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API marketplace

---

**Built with ❤️ by the CallWaiting AI team**
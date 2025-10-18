# ODIADEV AI TTS - Environment Setup Guide

## 🔑 Required Environment Variables

Add these to your `.env.local` file:

```bash
# ODIADEV TTS API Key (REQUIRED)
ODIADEV_TTS_API_KEY=LfPJcTNReFDwLZk8yQbajQNAGFIH7Yh25i11eIiyPEw
```

## 🌐 Service Configuration (Optional)

```bash
# Base URL for the ODIADEV AI TTS service
ODIADEV_TTS_BASE_URL=https://minimax-tts-odiadev.onrender.com

# Request timeout in seconds
ODIADEV_TTS_TIMEOUT=30

# Maximum retry attempts
ODIADEV_TTS_MAX_RETRIES=3
```

## 🎤 Voice Configuration

Your app's voice presets are now mapped to ODIADEV voices:

| App Voice ID | ODIADEV Voice | Description |
|-------------|---------------|-------------|
| `professional_f` | `joslyn` | African Female - Warm, Professional |
| `professional_m` | `marcus` | American Male - Professional, Authoritative |
| `soft_f` | `marcy` | American Female - Professional, Friendly |
| `warm_m` | `austyn` | African Male - Strong, Confident |

## 🚀 Testing Your Setup

1. **Health Check**: Visit https://minimax-tts-odiadev.onrender.com/health
2. **API Docs**: Visit https://minimax-tts-odiadev.onrender.com/docs
3. **Test Voice Generation**: Use your app's TTS feature

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Check your API key
2. **429 Rate Limited**: Wait and try again
3. **500 Server Error**: Check service status

### Debug Commands:

```bash
# Test API key
curl -X GET https://minimax-tts-odiadev.onrender.com/health \
  -H "Authorization: Bearer YOUR_API_KEY"

# Test voice generation
curl -X POST https://minimax-tts-odiadev.onrender.com/v1/tts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from ODIADEV TTS!", "voice_id": "marcus"}'
```

## 📞 Support

- Service URL: https://minimax-tts-odiadev.onrender.com
- API Docs: https://minimax-tts-odiadev.onrender.com/docs
- Status: ✅ OPERATIONAL

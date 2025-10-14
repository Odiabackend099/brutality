# CallWaiting AI Chat Widget

A fully functional voice and text chat widget integrated with your n8n TTS workflow.

## Features

- **Dual Input Modes**
  - Text chat with keyboard input
  - Voice recording with real-time audio capture
  - Easy toggle between modes

- **Real-Time Communication**
  - Connected to n8n webhook at `https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax`
  - Sends text or voice (base64-encoded audio) to webhook
  - Receives AI text responses and TTS audio URLs
  - Auto-plays AI voice responses

- **Modern UI/UX**
  - Floating bubble button (bottom-right)
  - Smooth slide-up animation when opened
  - Gradient design matching CallWaiting AI brand
  - Responsive chat window (400x600px)
  - Auto-scroll to latest messages
  - Loading states and error handling

## File Structure

```
/Users/odiadev/callwaitingai.dev 2025/
├── components/
│   ├── ChatWidget.tsx       # Main chat widget component
│   └── VoiceRecorder.tsx    # Voice recording component
├── hooks/
│   └── useChat.ts           # Chat logic and webhook integration
├── app/
│   ├── page.tsx             # Main page with widget integration
│   └── globals.css          # Global styles with animations
└── .env.local               # Environment variables
```

## Installation

Already installed! The widget is now live on your site.

## Configuration

Environment variables are set in `.env.local`:

```bash
NEXT_PUBLIC_N8N_WEBHOOK=https://callwaitingai.app.n8n.cloud/webhook/webhook/tts_minimax
NEXT_PUBLIC_BRAND_NAME=CallWaiting AI
```

## Usage

### On Your Website

The widget automatically appears on all pages. Users can:

1. Click the floating chat bubble (bottom-right)
2. Choose text or voice mode
3. Type a message or record voice
4. Receive AI responses with text and audio

### For Developers

Import and use the widget in any page:

```tsx
import { ChatWidget } from '@/components/ChatWidget';

export default function Page() {
  return (
    <>
      {/* Your page content */}
      <ChatWidget />
    </>
  );
}
```

## API Integration

### Request Format

**Text Message:**
```json
{
  "type": "text",
  "message": "Hello, I need help"
}
```

**Voice Message:**
```json
{
  "type": "voice",
  "audio": "base64_encoded_audio_data",
  "message": "Voice message"
}
```

### Expected Response

```json
{
  "text": "Hello! How can I help you today?",
  "audio_url": "https://example.com/response-audio.mp3"
}
```

## Features Breakdown

### ChatWidget Component
- Floating bubble button
- Expandable chat window
- Text/Voice mode toggle
- Message display with sender distinction
- Audio player for AI responses
- Loading and error states

### VoiceRecorder Component
- MediaRecorder API integration
- Real-time recording timer
- Visual feedback (pulsing red dot)
- Automatic audio encoding (WebM format)
- Graceful error handling for mic permissions

### useChat Hook
- Message state management
- Webhook API calls
- Audio blob to base64 conversion
- Automatic audio playback
- Error handling

## Customization

### Colors
The widget uses your brand gradient:
```css
from-cyan-400 via-blue-500 to-emerald-400
```

### Animations
Defined in `globals.css`:
- Slide-up animation on open
- Pulse animation for recording
- Smooth transitions throughout

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14.3+)
- Opera: ✅ Full support

**Note:** Voice recording requires HTTPS in production and microphone permissions.

## Development

### Running Locally

```bash
npm run dev
# Opens on http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

### Testing the Widget

1. Open the site
2. Click the chat bubble
3. Test text mode:
   - Type a message and press Enter or click Send
4. Test voice mode:
   - Toggle to voice mode
   - Click the mic button to start recording
   - Click again to stop and send
5. Verify AI responses appear with audio

## Troubleshooting

### Widget Not Appearing
- Check that `ChatWidget` is imported in your page
- Verify z-index isn't being overridden (widget uses z-50)

### Voice Recording Not Working
- Ensure HTTPS is enabled (required for getUserMedia)
- Check browser microphone permissions
- Look for console errors related to MediaRecorder

### No AI Response
- Verify webhook URL in `.env.local`
- Check network tab for failed requests
- Ensure n8n workflow is active and responding correctly

### Audio Not Playing
- Check that response includes `audio_url`
- Verify audio URL is accessible
- Check browser console for playback errors

## Next Steps

### Embed on Other Sites

To embed this widget on external sites, create a script tag loader:

```html
<script src="https://callwaitingai.dev/widget.js"></script>
```

Then create `public/widget.js` that loads the React component in an iframe.

### Additional Features to Consider

- Chat history persistence (localStorage)
- User authentication
- Typing indicators
- Message timestamps
- File/image uploads
- Emoji support
- Multi-language support
- Analytics tracking

## Support

For issues or questions:
- Email: callwaitingai@gmail.com
- GitHub: Check repository issues

---

Built with Next.js 14, TypeScript, Tailwind CSS, and n8n integration.

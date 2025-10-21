# MiniMax TTS Integration Update

## Overview
Successfully updated the project to use MiniMax TTS endpoint with new voice mappings.

## Changes Made

### 1. Voice Mappings (lib/services/tts/odiadev.ts)

Added new voice ID mappings to translate friendly names to MiniMax voice IDs:

```typescript
export const VOICE_MAPPINGS = {
  'odia': 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',       // Odia - African Male (Default)
  'marcus': 'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',     // Marcus - American Male
  'marcy': 'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',      // Marcy - American Female
  'joslyn': 'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',     // Joslyn - African Female
  'austyn': 'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',     // Alias for Odia
} as const;
```

### 2. Updated Voice List

Modified the `voices()` method to return the new voice configuration:

- **Odia** - African Male (Default)
- **Marcus** - American Male
- **Marcy** - American Female
- **Joslyn** - African Female

### 3. Environment Variables

Updated default voice in `.env.local`:
```env
DEFAULT_VOICE=odia
```

The existing MiniMax credentials are already configured:
```env
MINIMAX_API_KEY=eyJhbGci...
MINIMAX_GROUP_ID=1933510987994895143
MINIMAX_MODEL=speech-02-hd
```

### 4. Updated Scripts

Modified `scripts/fix-agent-tts-config.js`:
- Changed default voice from 'marcus' to 'odia'
- Added 'odia' to the list of valid voices
- Removed 'austyn' from the default list (now an alias)

### 5. Synthesis Method

Enhanced the `synthesize()` method in `lib/services/tts/odiadev.ts`:
- Maps friendly voice names (odia, marcus, marcy, joslyn) to actual MiniMax voice IDs
- Adds logging for voice mapping
- Automatically falls back to 'odia' if an invalid voice is provided

### 6. Test Script

Created `scripts/test-minimax-tts.js`:
- Tests all four voices
- Validates API configuration
- Shows detailed response data
- Useful for debugging TTS issues

## Testing Results

All voices tested successfully:
- ✅ Odia (African Male)
- ✅ Marcus (American Male)
- ✅ Marcy (American Female)
- ✅ Joslyn (African Female)

The TTS endpoint is responding correctly and generating audio for all voices.

## Usage

### In Code

```typescript
import { OdiaDevTTS } from '@/lib/services/tts/odiadev';

const tts = new OdiaDevTTS();

// Use friendly voice names
const result = await tts.synthesize({
  text: "Hello, this is a test",
  voiceId: "odia" // or "marcus", "marcy", "joslyn"
});
```

### Testing

Run the test script to verify TTS configuration:

```bash
node scripts/test-minimax-tts.js
```

## API Endpoint

The TTS service connects to:
```
Base URL: https://minimax-tts-odiadev.onrender.com
Endpoint: POST /v1/tts
```

Request format:
```json
{
  "text": "Text to synthesize",
  "voice_id": "moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc",
  "model": "speech-02-hd",
  "speed": 1.0,
  "pitch": 0,
  "emotion": "neutral",
  "group_id": "1933510987994895143"
}
```

Response format:
```json
{
  "audio_base64": "base64_encoded_audio_data",
  ...
}
```

## Migration Notes

- All existing agents will continue to work
- Agents using 'marcus', 'marcy', or 'joslyn' will use the new MiniMax voice IDs
- New default voice is 'odia' (African Male)
- Run `scripts/fix-agent-tts-config.js` to update existing agents to the new default

## Next Steps

1. Test TTS in the live application
2. Update agent configurations if needed
3. Monitor API usage and response times
4. Consider adding more voices as MiniMax expands their voice library

## Notes

- The voice ID mapping is done transparently - users can continue using friendly names
- Logging has been added to track voice mappings for debugging
- The system maintains backward compatibility with existing voice configurations

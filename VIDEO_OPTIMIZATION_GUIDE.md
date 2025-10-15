# Video Optimization Guide

## Current Status
- **Current file size**: 47MB
- **Target file size**: 3-5MB (90% reduction)
- **Location**: `public/animations/ai-demo.mp4`

## Why This Matters
A 47MB video will:
- ❌ Take 10-15 seconds to load on average connections
- ❌ Consume mobile data quickly
- ❌ Hurt your Google PageSpeed score
- ❌ Reduce conversions (users leave before seeing content)

## Quick Optimizations Already Applied ✅
1. **`preload="metadata"`** - Only loads video metadata initially, not the full file
2. **Proper attributes** - autoPlay, muted, loop, playsInline for smooth playback

## Option 1: Online Compression (Easiest - No Installation)

### Using CloudConvert (Free)
1. Go to https://cloudconvert.com/mp4-converter
2. Upload `public/animations/ai-demo.mp4`
3. Click "Settings" and configure:
   - **Video Codec**: H.264
   - **Resolution**: 1280x720 (or lower if original is higher)
   - **Quality**: 23-28 (lower number = better quality)
   - **Bitrate**: 1000-1500 kbps
4. Convert and download
5. Replace the file in `public/animations/ai-demo.mp4`

### Using FreeConvert (Free)
1. Go to https://www.freeconvert.com/video-compressor
2. Upload your video
3. Set compression level to "Strong compression"
4. Download and replace

## Option 2: Install FFmpeg (Professional Tool)

### Install FFmpeg on Mac:
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install FFmpeg
brew install ffmpeg
```

### Compress the video:
```bash
# Navigate to your project
cd "/Users/odiadev/callwaitingai.dev 2025"

# Backup original
cp public/animations/ai-demo.mp4 public/animations/ai-demo-original.mp4

# Compress (target ~3-5MB)
ffmpeg -i public/animations/ai-demo.mp4 \
  -vcodec h264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1280:-2" \
  -movflags +faststart \
  -an \
  public/animations/ai-demo-compressed.mp4

# Replace original
mv public/animations/ai-demo-compressed.mp4 public/animations/ai-demo.mp4
```

**FFmpeg Options Explained:**
- `-crf 28`: Quality (18-28 range, 28 = smaller file)
- `-preset slow`: Better compression (takes longer)
- `-vf "scale=1280:-2"`: Resize to 720p width
- `-movflags +faststart`: Optimize for web streaming
- `-an`: Remove audio (not needed for hero video)

## Option 3: Use Modern Video Formats

### Convert to WebM (Better compression):
```bash
ffmpeg -i public/animations/ai-demo.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -an \
  public/animations/ai-demo.webm
```

Then update `page.tsx`:
```tsx
<video>
  <source src="/animations/ai-demo.webm" type="video/webm" />
  <source src="/animations/ai-demo.mp4" type="video/mp4" />
</video>
```

## Recommended Settings for Hero Videos

| Setting | Value | Why |
|---------|-------|-----|
| Resolution | 1280x720 | Good quality, reasonable size |
| Bitrate | 1000-1500 kbps | Balance quality/size |
| Frame Rate | 24-30 fps | Smooth without bloat |
| Audio | Remove | Not needed for autoplay videos |
| Format | MP4 (H.264) | Best browser support |
| Target Size | 3-5MB | Loads in 1-2 seconds |

## After Compression

### Verify the file:
```bash
# Check file size
ls -lh public/animations/ai-demo.mp4

# If you have ffmpeg, check video info
ffmpeg -i public/animations/ai-demo.mp4
```

### Test the site:
```bash
npm run build
npm run dev
```

Visit http://localhost:3000 and check:
- ✅ Video loads quickly
- ✅ Video plays smoothly
- ✅ Quality is acceptable
- ✅ No buffering issues

## Performance Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| File Size | 47MB | 3-5MB | ⚠️ Needs optimization |
| Load Time (3G) | ~15s | <2s | ⚠️ Too slow |
| Resolution | Unknown | 720p | ℹ️ Check original |
| Has Audio | Unknown | No | ℹ️ Remove if present |

## Next Steps

1. **Choose one method above** (Online tool is easiest)
2. **Compress the video** to 3-5MB
3. **Replace** the file in `public/animations/ai-demo.mp4`
4. **Test** with `npm run dev`
5. **Deploy** to Vercel

## Additional Performance Tips

1. **Consider a poster image** (shows while video loads):
   ```tsx
   <video poster="/animations/poster.jpg">
   ```

2. **Use CDN hosting** (for very large videos):
   - Upload to Cloudflare Stream, Mux, or YouTube
   - Embed using their optimized player

3. **Lazy load** (load video only when in viewport):
   - Use Intersection Observer API
   - Only load when user scrolls near it

Would you like me to help with any of these options?

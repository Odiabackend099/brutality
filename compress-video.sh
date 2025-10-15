#!/bin/bash

# Video Compression Helper Script
# This script guides you through compressing your video file

echo "============================================"
echo "Video Compression Helper"
echo "============================================"
echo ""
echo "Current video size:"
ls -lh public/animations/ai-demo.mp4
echo ""

# Check for ffmpeg
if command -v ffmpeg &> /dev/null; then
    echo "✅ ffmpeg found! Proceeding with compression..."
    echo ""

    # Backup original
    if [ ! -f "public/animations/ai-demo-original.mp4" ]; then
        echo "📦 Creating backup..."
        cp public/animations/ai-demo.mp4 public/animations/ai-demo-original.mp4
        echo "✅ Backup saved to: public/animations/ai-demo-original.mp4"
    else
        echo "ℹ️  Backup already exists"
    fi

    echo ""
    echo "🎬 Compressing video..."
    echo "This may take 1-2 minutes..."
    echo ""

    # Compress the video
    ffmpeg -i public/animations/ai-demo.mp4 \
      -vcodec h264 \
      -crf 28 \
      -preset slow \
      -vf "scale=1280:-2" \
      -movflags +faststart \
      -an \
      -y \
      public/animations/ai-demo-compressed.mp4

    # Replace original
    mv public/animations/ai-demo-compressed.mp4 public/animations/ai-demo.mp4

    echo ""
    echo "✅ Compression complete!"
    echo ""
    echo "New video size:"
    ls -lh public/animations/ai-demo.mp4
    echo ""
    echo "Original backup: public/animations/ai-demo-original.mp4"
    echo ""

else
    echo "❌ ffmpeg not found!"
    echo ""
    echo "Please follow these steps to compress your video:"
    echo ""
    echo "OPTION 1: Install ffmpeg (Recommended)"
    echo "----------------------------------------"
    echo "1. Install Homebrew (if not installed):"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "2. Install ffmpeg:"
    echo "   brew install ffmpeg"
    echo ""
    echo "3. Run this script again:"
    echo "   bash compress-video.sh"
    echo ""
    echo "OPTION 2: Use Online Tool (Easiest)"
    echo "----------------------------------------"
    echo "1. Go to: https://www.freeconvert.com/video-compressor"
    echo "2. Upload: public/animations/ai-demo.mp4"
    echo "3. Set compression to 'Strong'"
    echo "4. Download and replace the file"
    echo ""
    echo "OPTION 3: Use CloudConvert"
    echo "----------------------------------------"
    echo "1. Go to: https://cloudconvert.com/mp4-converter"
    echo "2. Upload: public/animations/ai-demo.mp4"
    echo "3. Settings:"
    echo "   - Resolution: 1280x720"
    echo "   - Quality: 28"
    echo "   - Bitrate: 1500 kbps"
    echo "4. Download and replace the file"
    echo ""
fi

echo "============================================"
echo "Next steps after compression:"
echo "============================================"
echo "1. Test the video: npm run dev"
echo "2. Check quality at: http://localhost:3000"
echo "3. Build for production: npm run build"
echo "4. Deploy: git push"
echo ""

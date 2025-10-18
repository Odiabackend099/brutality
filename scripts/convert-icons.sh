#!/bin/bash

echo "🎨 Converting SVG Icons to PNG"
echo "=============================="

# Check if we have the required tools
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found - using convert command"
    CONVERT_CMD="convert"
elif command -v magick &> /dev/null; then
    echo "✅ ImageMagick found - using magick command"
    CONVERT_CMD="magick"
else
    echo "❌ ImageMagick not found"
    echo "Please install ImageMagick or use online converter:"
    echo "https://convertio.co/svg-png/"
    exit 1
fi

# Convert each SVG to PNG
echo ""
echo "Converting icons..."

# Icon 192x192
if [ -f "public/icon-192.svg" ]; then
    $CONVERT_CMD "public/icon-192.svg" -resize 192x192 "public/icon-192.png"
    echo "✅ Converted icon-192.svg → icon-192.png"
else
    echo "❌ icon-192.svg not found"
fi

# Icon 512x512
if [ -f "public/icon-512.svg" ]; then
    $CONVERT_CMD "public/icon-512.svg" -resize 512x512 "public/icon-512.png"
    echo "✅ Converted icon-512.svg → icon-512.png"
else
    echo "❌ icon-512.svg not found"
fi

# Apple touch icon 180x180
if [ -f "public/apple-touch-icon.svg" ]; then
    $CONVERT_CMD "public/apple-touch-icon.svg" -resize 180x180 "public/apple-touch-icon.png"
    echo "✅ Converted apple-touch-icon.svg → apple-touch-icon.png"
else
    echo "❌ apple-touch-icon.svg not found"
fi

# Favicon 32x32
if [ -f "public/favicon-32x32.svg" ]; then
    $CONVERT_CMD "public/favicon-32x32.svg" -resize 32x32 "public/favicon-32x32.png"
    echo "✅ Converted favicon-32x32.svg → favicon-32x32.png"
else
    echo "❌ favicon-32x32.svg not found"
fi

# Favicon 16x16
if [ -f "public/favicon-16x16.svg" ]; then
    $CONVERT_CMD "public/favicon-16x16.svg" -resize 16x16 "public/favicon-16x16.png"
    echo "✅ Converted favicon-16x16.svg → favicon-16x16.png"
else
    echo "❌ favicon-16x16.svg not found"
fi

# Create favicon.ico from 32x32
if [ -f "public/favicon-32x32.png" ]; then
    $CONVERT_CMD "public/favicon-32x32.png" "public/favicon.ico"
    echo "✅ Created favicon.ico from favicon-32x32.png"
else
    echo "❌ favicon-32x32.png not found"
fi

echo ""
echo "🎉 Icon conversion complete!"
echo ""
echo "📱 Next steps:"
echo "1. Test PWA installation on mobile devices"
echo "2. Deploy to production"
echo "3. Verify offline functionality"

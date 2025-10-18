#!/usr/bin/env node

/**
 * Create simple PNG icons for PWA
 * This script creates basic PNG icons without external dependencies
 */

const fs = require('fs');
const path = require('path');

// Simple PNG header for a 32x32 icon
function createSimplePNG(size) {
  // This is a minimal PNG structure - in production you'd want proper PNG encoding
  // For now, we'll create a simple base64 encoded PNG
  const canvas = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#10B981;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size*15/32}" fill="#1E293B" stroke="#334155" stroke-width="2"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*6/32}" fill="url(#grad)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*3/32}" fill="#1E293B"/>
</svg>`;
  
  return Buffer.from(canvas);
}

console.log('🎨 Creating Simple PWA Icons');
console.log('============================');

// Icon sizes needed for PWA
const iconSizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create SVG versions first (which work as icons)
iconSizes.forEach(({ size, name }) => {
  const svgContent = createSimplePNG(size);
  const svgPath = path.join(publicDir, name.replace('.png', '.svg'));
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Generated ${name.replace('.png', '.svg')} (${size}x${size})`);
});

// Create a simple favicon
const faviconSvg = createSimplePNG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
console.log('✅ Generated favicon.svg (32x32)');

console.log('');
console.log('📝 Manual PNG Conversion Required:');
console.log('1. Use online converter: https://convertio.co/svg-png/');
console.log('2. Upload the generated SVG files');
console.log('3. Download as PNG and replace the .svg files');
console.log('');
console.log('🔗 Quick conversion links:');
console.log('- icon-192.svg → icon-192.png');
console.log('- icon-512.svg → icon-512.png');
console.log('- apple-touch-icon.svg → apple-touch-icon.png');
console.log('- favicon-32x32.svg → favicon-32x32.png');
console.log('- favicon-16x16.svg → favicon-16x16.png');

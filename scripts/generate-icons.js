#!/usr/bin/env node

/**
 * Generate PWA icons from SVG logo
 * This script creates PNG icons in various sizes for PWA compliance
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

// SVG template for generating icons
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#10B981;stop-opacity:1" />
    </linearGradient>
    <pattern id="circuitPattern" x="0" y="0" width="${size/8}" height="${size/8}" patternUnits="userSpaceOnUse">
      <circle cx="${size/16}" cy="${size/16}" r="${size/64}" fill="#60A5FA" opacity="0.6"/>
      <path d="M${size/16},${size/32} L${size*3/32},${size/16} M${size/16},${size*3/32} L${size/32},${size/16} M${size*3/32},${size/16} L${size/8},${size/16} M${size/32},${size/16} L0,${size/16}" stroke="#60A5FA" stroke-width="${size/128}" fill="none"/>
    </pattern>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*15/32}" fill="#1E293B" stroke="#334155" stroke-width="${size/32}"/>
  
  <!-- Phone Receiver/C Letter -->
  <path d="M${size*5/16},${size*5/16} Q${size*5/16},${size*3/16} ${size*7/16},${size*3/16} Q${size*9/16},${size*3/16} ${size*9/16},${size*5/16} Q${size*9/16},${size*7/16} ${size*7/16},${size*7/16} Q${size*5/16},${size*7/16} ${size*5/16},${size*5/16} Z M${size*3/8},${size*1/4} Q${size*7/16},${size*1/4} ${size*7/16},${size*5/16} Q${size*7/16},${size*3/8} ${size*3/8},${size*3/8} Q${size*5/16},${size*3/8} ${size*5/16},${size*5/16} Q${size*5/16},${size*1/4} ${size*3/8},${size*1/4} Z" 
        fill="url(#phoneGradient)" 
        stroke="none"/>
  
  <!-- Circuit Board Pattern Overlay -->
  <path d="M${size*3/8},${size*1/4} Q${size*7/16},${size*1/4} ${size*7/16},${size*5/16} Q${size*7/16},${size*3/8} ${size*3/8},${size*3/8} Q${size*5/16},${size*3/8} ${size*5/16},${size*5/16} Q${size*5/16},${size*1/4} ${size*3/8},${size*1/4} Z" 
        fill="url(#circuitPattern)" 
        opacity="0.8"/>
  
  <!-- Radiating Data Lines -->
  <g stroke="#60A5FA" stroke-width="${size/32}" fill="none" opacity="0.7">
    <line x1="${size*9/16}" y1="${size*5/16}" x2="${size*11/16}" y2="${size*1/4}"/>
    <line x1="${size*9/16}" y1="${size*3/8}" x2="${size*11/16}" y2="${size*7/16}"/>
    <circle cx="${size*11/16}" cy="${size*1/4}" r="${size/32}" fill="#60A5FA"/>
    <circle cx="${size*11/16}" cy="${size*7/16}" r="${size/32}" fill="#60A5FA"/>
    <line x1="${size*11/16}" y1="${size*1/4}" x2="${size*3/4}" y2="${size*7/32}"/>
    <line x1="${size*11/16}" y1="${size*7/16}" x2="${size*3/4}" y2="${size*9/32}"/>
  </g>
</svg>`;

console.log('🎨 Generating PWA Icons from CallWaiting AI Logo');
console.log('================================================');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG files for each icon size
iconSizes.forEach(({ size, name }) => {
  const svgContent = createIconSVG(size);
  const filePath = path.join(publicDir, name.replace('.png', '.svg'));
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Generated ${name.replace('.png', '.svg')} (${size}x${size})`);
});

// Create a simple favicon.ico placeholder
const faviconContent = createIconSVG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconContent);
console.log('✅ Generated favicon.svg (32x32)');

console.log('');
console.log('📝 Next Steps:');
console.log('1. Convert SVG files to PNG using online tools or ImageMagick');
console.log('2. Replace placeholder files with actual PNG versions');
console.log('3. Test PWA installation on mobile devices');
console.log('');
console.log('🔗 Recommended online converters:');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://www.freeconvert.com/svg-to-png');

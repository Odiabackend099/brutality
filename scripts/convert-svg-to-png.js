#!/usr/bin/env node

/**
 * Convert SVG icons to PNG using canvas
 * This script converts the generated SVG icons to PNG format for PWA
 */

const fs = require('fs');
const path = require('path');

// Check if we can use canvas
let canvas;
try {
  canvas = require('canvas');
} catch (err) {
  console.log('❌ Canvas module not available. Installing...');
  console.log('Run: npm install canvas');
  process.exit(1);
}

const { createCanvas, loadImage } = canvas;

// Icon sizes needed for PWA
const iconSizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

// Create a simple icon using canvas
function createIconCanvas(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background circle
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 15/32, 0, 2 * Math.PI);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = size/32;
  ctx.stroke();
  
  // Phone receiver shape
  const centerX = size/2;
  const centerY = size/2;
  const phoneSize = size * 0.4;
  
  // Create gradient
  const gradient = ctx.createLinearGradient(
    centerX - phoneSize/2, centerY - phoneSize/2,
    centerX + phoneSize/2, centerY + phoneSize/2
  );
  gradient.addColorStop(0, '#8B5CF6');
  gradient.addColorStop(0.5, '#3B82F6');
  gradient.addColorStop(1, '#10B981');
  
  // Draw phone receiver
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, phoneSize/2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Inner circle
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(centerX, centerY, phoneSize/3, 0, 2 * Math.PI);
  ctx.fill();
  
  // Circuit pattern dots
  ctx.fillStyle = '#60A5FA';
  const dotSize = size/32;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const x = centerX + Math.cos(angle) * phoneSize/4;
    const y = centerY + Math.sin(angle) * phoneSize/4;
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Radiating lines
  ctx.strokeStyle = '#60A5FA';
  ctx.lineWidth = size/64;
  ctx.globalAlpha = 0.7;
  
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4;
    const startX = centerX + Math.cos(angle) * phoneSize/2;
    const startY = centerY + Math.sin(angle) * phoneSize/2;
    const endX = centerX + Math.cos(angle) * phoneSize * 0.8;
    const endY = centerY + Math.sin(angle) * phoneSize * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  
  return canvas;
}

console.log('🎨 Converting SVG Icons to PNG');
console.log('==============================');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Convert each icon size
iconSizes.forEach(({ size, name }) => {
  try {
    const canvas = createIconCanvas(size);
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(publicDir, name);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${name}:`, error.message);
  }
});

// Create favicon.ico (simplified version)
try {
  const faviconCanvas = createIconCanvas(32);
  const faviconBuffer = faviconCanvas.toBuffer('image/png');
  const faviconPath = path.join(publicDir, 'favicon.ico');
  
  // For now, just copy the PNG as favicon
  fs.writeFileSync(faviconPath, faviconBuffer);
  console.log('✅ Generated favicon.ico (32x32)');
} catch (error) {
  console.error('❌ Failed to generate favicon.ico:', error.message);
}

console.log('');
console.log('🎉 Icon conversion complete!');
console.log('');
console.log('📱 Next steps:');
console.log('1. Test PWA installation on mobile devices');
console.log('2. Deploy to production');
console.log('3. Verify offline functionality');

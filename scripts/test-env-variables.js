// Test script to verify environment variables
console.log('Testing Environment Variables...');

// Check if required environment variables are set
const requiredEnvVars = [
  'GROQ_API_KEY',
  'NEXT_PUBLIC_DEEPGRAM_API_KEY',
  'NEXT_PUBLIC_API_URL'
];

console.log('\n=== Environment Variables Check ===');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: SET (length: ${value.length})`);
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
  }
});

// Check ODIADEV TTS variables
const ttsEnvVars = [
  'ODIADEV_TTS_API_KEY',
  'ODIADEV_TTS_BASE_URL'
];

console.log('\n=== ODIADEV TTS Variables Check ===');
ttsEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: SET`);
  } else {
    console.log(`⚠️  ${envVar}: NOT SET (may use fallback)`);
  }
});

console.log('\n=== Test Completed ===');
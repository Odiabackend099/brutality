// Comprehensive test script for the Voice AI system
console.log('=== Voice AI System Test ===');

// Test environment variables
console.log('\n1. Environment Variables Check:');
const requiredEnvVars = [
  'MINIMAX_API_KEY',
  'MINIMAX_GROUP_ID',
  'GROQ_API_KEY',
  'NEXT_PUBLIC_DEEPGRAM_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: SET`);
  } else {
    console.log(`❌ ${envVar}: NOT SET`);
  }
});

// Test ODIADEV TTS configuration
console.log('\n2. ODIADEV TTS Configuration:');
const ttsEnvVars = [
  'ODIADEV_TTS_API_KEY',
  'ODIADEV_TTS_GROUP_ID',
  'ODIADEV_TTS_BASE_URL',
  'DEFAULT_VOICE'
];

ttsEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: SET`);
  } else {
    console.log(`⚠️  ${envVar}: NOT SET`);
  }
});

console.log('\n=== Test Summary ===');
console.log('To fully test the Voice AI system:');
console.log('1. Start the development server: npm run dev');
console.log('2. Navigate to http://localhost:3000/voice-ai');
console.log('3. Click "Start Conversation"');
console.log('4. Allow microphone permissions');
console.log('5. Speak and verify AI response');

console.log('\nFor debugging TTS issues:');
console.log('- Check server logs for TTS API calls');
console.log('- Verify API keys are valid');
console.log('- Test TTS endpoint directly: curl -X POST http://localhost:3000/api/test-tts');
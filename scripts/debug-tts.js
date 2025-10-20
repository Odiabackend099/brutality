// Debug script for ODIADEV TTS service
const { OdiaDevTTS } = require('../lib/services/tts/odiadev.ts');

async function debugTTS() {
  console.log('=== Debugging ODIADEV TTS Service ===');
  
  try {
    const tts = new OdiaDevTTS();
    
    // Check if API key is set
    console.log('API Key set:', !!process.env.ODIADEV_TTS_API_KEY);
    console.log('Base URL:', process.env.ODIADEV_TTS_BASE_URL || 'Using default');
    
    // Test voices
    console.log('\n--- Testing Voices ---');
    try {
      const voices = await tts.voices();
      console.log('Voices retrieved successfully:', voices.length);
      console.log('First voice:', voices[0]);
    } catch (error) {
      console.error('Error getting voices:', error.message);
    }
    
    // Test synthesis
    console.log('\n--- Testing Synthesis ---');
    try {
      const result = await tts.synthesize({
        text: 'Hello, this is a test of the text to speech system.',
        voiceId: 'marcus'
      });
      console.log('Synthesis result:', result);
    } catch (error) {
      console.error('Error in synthesis:', error.message);
      console.error('Error stack:', error.stack);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
  
  console.log('\n=== Debug Complete ===');
}

debugTTS().catch(console.error);
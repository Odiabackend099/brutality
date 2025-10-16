#!/usr/bin/env node

/**
 * Direct MiniMax TTS API Test
 *
 * This script tests the MiniMax TTS API directly with your JWT token
 * to generate a 30-second "calling hour" audio message.
 */

const https = require('https');

// Your MiniMax JWT token (Updated: 2025-10-16)
const MINIMAX_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJPRElBIGJhY2tlbmQiLCJVc2VyTmFtZSI6Ik9ESUEgYmFja2VuZCIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTMzNTEwOTg4MDAzMjgzNzUxIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkzMzUxMDk4Nzk5NDg5NTE0MyIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im9kaWFiYWNrZW5kQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTEwLTE2IDA0OjE2OjE4IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.S0kZ7gf6QVL0kXC2z0bil95E0DTzvDRHY9zi_qehWa0ojG4ESeEVxcNkXWacKC5XjWud-X4Qt9K0tfNZdfbBi_LyPwZJEEnug6E_dsKNykaQecSNTyJHKmmHYR_vMJNujLGH2Lv6UsfNHGUVB4AotCx1O2tcNZU_jT0jM3KdhHjds6m2oQ20GlxhtATTf0_SNzh_pX0l-TXEnWj-EVsMmmNmzP9-HP99W6mXqonQv-u3iLMm95gEOhtnVFB_nk-YZ7se_Om9z3wOKVLNotwm_GQJDx2wV9hD0zciJppm2vK8WSJ-St0Hdt412jzcx_aO2j6wRgrM1vbwG6BU5x2LEQ';

// 30-second message about calling hour
const MESSAGE = `Calling hour notification. This is your scheduled calling hour.
Please be ready to receive important calls during this designated time period.
The calling hour has now officially begun. Please ensure your phone line is available
and you are prepared to handle incoming business calls. Your calling hour is now active
and will continue as scheduled. Thank you for your attention to this notification.`;

console.log('🎙️  MiniMax TTS Direct API Test\n');
console.log('📝 Message:', MESSAGE);
console.log('🔊 Generating audio...\n');

const payload = JSON.stringify({
  text: MESSAGE,
  model: "speech-01",
  voice_id: "female-shaonv",
  speed: 1.0,
  vol: 1.0,
  pitch: 0,
  audio_sample_rate: 32000,
  bitrate: 128000,
  format: "mp3"
});

const options = {
  hostname: 'api.minimax.chat',
  port: 443,
  path: '/v1/t2a_v2',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MINIMAX_JWT}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log('✅ Response received');
  console.log('📊 Status Code:', res.statusCode);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📦 Raw Response:');
    console.log(data);
    console.log('');

    try {
      const json = JSON.parse(data);
      console.log('✅ Parsed JSON Response:');
      console.log(JSON.stringify(json, null, 2));
      console.log('');

      if (json.base_resp?.status_code === 0) {
        console.log('🎉 SUCCESS! Audio generated successfully!');
        if (json.data?.audio_file) {
          console.log('🔗 Audio URL:', json.data.audio_file);
          console.log('\n✅ You can download and play this audio file.');
        }
        if (json.extra_info) {
          console.log('📊 Extra info:', JSON.stringify(json.extra_info, null, 2));
        }
      } else {
        console.error('❌ ERROR:', json.base_resp?.status_msg || 'Unknown error');
        console.error('   Status code:', json.base_resp?.status_code);
      }
    } catch (err) {
      console.error('❌ ERROR: Invalid JSON response');
      console.error('   Response:', data);
      console.error('   Error:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ ERROR: Request failed');
  console.error('   Message:', err.message);
  console.error('   Code:', err.code);
});

req.on('timeout', () => {
  console.error('❌ ERROR: Request timed out');
  req.destroy();
});

req.setTimeout(60000); // 60 second timeout
req.write(payload);
req.end();

#!/usr/bin/env node

/**
 * MiniMax TTS API Test with Group ID
 * Testing different authentication methods
 */

const https = require('https');

const GROUP_ID = '1933510987994895143';
const MINIMAX_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJPRElBIGJhY2tlbmQiLCJVc2VyTmFtZSI6Ik9ESUEgYmFja2VuZCIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxOTMzNTEwOTg4MDAzMjgzNzUxIiwiUGhvbmUiOiIiLCJHcm91cElEIjoiMTkzMzUxMDk4Nzk5NDg5NTE0MyIsIlBhZ2VOYW1lIjoiIiwiTWFpbCI6Im9kaWFiYWNrZW5kQGdtYWlsLmNvbSIsIkNyZWF0ZVRpbWUiOiIyMDI1LTEwLTE2IDA0OjE2OjE4IiwiVG9rZW5UeXBlIjoxLCJpc3MiOiJtaW5pbWF4In0.S0kZ7gf6QVL0kXC2z0bil95E0DTzvDRHY9zi_qehWa0ojG4ESeEVxcNkXWacKC5XjWud-X4Qt9K0tfNZdfbBi_LyPwZJEEnug6E_dsKNykaQecSNTyJHKmmHYR_vMJNujLGH2Lv6UsfNHGUVB4AotCx1O2tcNZU_jT0jM3KdhHjds6m2oQ20GlxhtATTf0_SNzh_pX0l-TXEnWj-EVsMmmNmzP9-HP99W6mXqonQv-u3iLMm95gEOhtnVFB_nk-YZ7se_Om9z3wOKVLNotwm_GQJDx2wV9hD0zciJppm2vK8WSJ-St0Hdt412jzcx_aO2j6wRgrM1vbwG6BU5x2LEQ';

const MESSAGE = 'Calling hour notification. This is a test.';

console.log('🧪 Testing MiniMax TTS API with Group ID\n');
console.log('Group ID:', GROUP_ID);
console.log('Message:', MESSAGE);
console.log('\n--- Test 1: Using Group ID in URL ---\n');

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

// Test 1: With Group ID in URL
const options1 = {
  hostname: 'api.minimax.chat',
  port: 443,
  path: `/v1/t2a_v2?GroupId=${GROUP_ID}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MINIMAX_JWT}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req1 = https.request(options1, (res) => {
  console.log('Status Code:', res.statusCode);

  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const json = JSON.parse(data);
      if (json.base_resp?.status_code === 0) {
        console.log('✅ SUCCESS with Group ID in URL!');
        if (json.data?.audio_file) {
          console.log('🔗 Audio URL:', json.data.audio_file);
        }
      } else {
        console.log('❌ Failed with Group ID in URL');
        console.log('\n--- Test 2: Using Group ID in Header ---\n');
        testWithGroupHeader();
      }
    } catch (err) {
      console.log('Error parsing response:', err.message);
      testWithGroupHeader();
    }
  });
});

req1.on('error', (err) => {
  console.error('Request error:', err.message);
});

req1.setTimeout(30000);
req1.write(payload);
req1.end();

// Test 2: With Group ID in header
function testWithGroupHeader() {
  const options2 = {
    hostname: 'api.minimax.chat',
    port: 443,
    path: '/v1/t2a_v2',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_JWT}`,
      'GroupId': GROUP_ID,
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req2 = https.request(options2, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Response:', data);
      try {
        const json = JSON.parse(data);
        if (json.base_resp?.status_code === 0) {
          console.log('✅ SUCCESS with Group ID in Header!');
          if (json.data?.audio_file) {
            console.log('🔗 Audio URL:', json.data.audio_file);
          }
        } else {
          console.log('❌ Failed with Group ID in Header');
          console.log('\nℹ️  The token may need additional configuration in MiniMax dashboard.');
          console.log('   Please check:');
          console.log('   1. Token is activated');
          console.log('   2. Account has credits/balance');
          console.log('   3. TTS API is enabled for your account');
        }
      } catch (err) {
        console.log('Error parsing response:', err.message);
      }
    });
  });

  req2.on('error', (err) => {
    console.error('Request error:', err.message);
  });

  req2.setTimeout(30000);
  req2.write(payload);
  req2.end();
}

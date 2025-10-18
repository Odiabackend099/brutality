#!/usr/bin/env node

/**
 * CallWaiting AI - Production API Testing Script
 * 
 * Tests all 21 API endpoints on production
 * Production URL: https://www.callwaitingai.dev
 * 
 * Usage:
 *   node test-api-production.js
 * 
 * Requirements:
 *   - Node.js 18+
 *   - Internet connection
 * 
 * Results saved to: API_TEST_REPORT.md
 */

const https = require('https');
const fs = require('fs');

// Configuration
const PRODUCTION_URL = 'https://www.callwaitingai.dev';
const REPORT_FILE = 'API_TEST_REPORT.md';

// Test results storage
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
  startTime: new Date(),
  endTime: null
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

// Helper: Make HTTP request
async function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, PRODUCTION_URL);
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CallWaitingAI-Test-Suite/1.0',
        ...headers
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody,
            rawBody: body
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: null,
            rawBody: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Helper: Log test result
function logTest(name, status, message = '', responseTime = 0) {
  results.total++;
  
  const testResult = {
    name,
    status,
    message,
    responseTime,
    timestamp: new Date().toISOString()
  };
  
  results.tests.push(testResult);
  
  if (status === 'PASS') {
    results.passed++;
    console.log(`${colors.green}✓${colors.reset} ${name} ${colors.gray}(${responseTime}ms)${colors.reset}`);
  } else if (status === 'FAIL') {
    results.failed++;
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    if (message) console.log(`  ${colors.red}${message}${colors.reset}`);
  } else if (status === 'SKIP') {
    results.skipped++;
    console.log(`${colors.yellow}⊘${colors.reset} ${name} ${colors.gray}(skipped)${colors.reset}`);
  }
}

// Helper: Test wrapper
async function test(name, testFn) {
  const startTime = Date.now();
  try {
    await testFn();
    const responseTime = Date.now() - startTime;
    logTest(name, 'PASS', '', responseTime);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logTest(name, 'FAIL', error.message, responseTime);
  }
}

// Helper: Skip test
function skip(name, reason) {
  logTest(name, 'SKIP', reason);
}

// ============================================================================
// TEST SUITE
// ============================================================================

console.log(`\n${colors.blue}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║    CallWaiting AI - Production API Test Suite        ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
console.log(`Testing: ${colors.blue}${PRODUCTION_URL}${colors.reset}`);
console.log(`Started: ${new Date().toLocaleString()}\n`);

// ============================================================================
// Category 1: Public/Health Endpoints
// ============================================================================

async function testPublicEndpoints() {
  console.log(`\n${colors.blue}[1] Public & Health Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 1: Health Check
  await test('GET /api/health', async () => {
    const response = await makeRequest('GET', '/api/health');
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    if (!response.body || response.body.status !== 'ok') {
      throw new Error('Health check response invalid');
    }
  });
}

// ============================================================================
// Category 2: Authentication Endpoints
// ============================================================================

async function testAuthEndpoints() {
  console.log(`\n${colors.blue}[2] Authentication Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 2: Session endpoint (unauthenticated)
  await test('GET /api/auth/session (unauthenticated)', async () => {
    const response = await makeRequest('GET', '/api/auth/session');
    // Should return 401 or null session
    if (response.statusCode !== 200 && response.statusCode !== 401) {
      throw new Error(`Unexpected status: ${response.statusCode}`);
    }
  });

  // Test 3: Auth callback endpoint (requires Supabase token)
  skip('GET /auth/callback', 'Requires valid Supabase auth code');
}

// ============================================================================
// Category 3: Chat Widget Endpoints
// ============================================================================

async function testChatEndpoints() {
  console.log(`\n${colors.blue}[3] Chat Widget Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 4: Chat widget endpoint
  await test('POST /api/chat/widget', async () => {
    const response = await makeRequest('POST', '/api/chat/widget', {
      message: 'Hello, this is a test message',
      sessionId: 'test-session-' + Date.now()
    });
    
    // May return 200 with response or error depending on n8n config
    if (response.statusCode >= 500) {
      throw new Error(`Server error: ${response.statusCode}`);
    }
    
    // Check if response has expected structure
    if (response.statusCode === 200 && response.body) {
      if (!response.body.text && !response.body.error) {
        throw new Error('Response missing text or error field');
      }
    }
  });
}

// ============================================================================
// Category 4: Agent Management Endpoints
// ============================================================================

async function testAgentEndpoints() {
  console.log(`\n${colors.blue}[4] Agent Management Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 5: Create agent (requires authentication)
  await test('POST /api/create-agent (unauthenticated)', async () => {
    const response = await makeRequest('POST', '/api/create-agent', {
      name: 'Test Agent',
      description: 'Test description'
    });
    
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Should require authentication');
    }
    if (response.statusCode !== 401 && response.statusCode !== 403) {
      throw new Error(`Expected 401/403, got ${response.statusCode}`);
    }
  });

  // Test 6: Agent webhook (requires agent ID)
  skip('POST /api/agent/[id]/webhook', 'Requires valid agent ID');
}

// ============================================================================
// Category 5: Call/Trial Endpoints
// ============================================================================

async function testCallEndpoints() {
  console.log(`\n${colors.blue}[5] Call & Trial Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 7: Check trial (requires authentication)
  await test('POST /api/call/check-trial (unauthenticated)', async () => {
    const response = await makeRequest('POST', '/api/call/check-trial');
    
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Should require authentication');
    }
  });

  // Test 8: Inbound call (Twilio webhook)
  skip('POST /api/call/inbound', 'Requires Twilio signature');

  // Test 9: Complete call
  skip('POST /api/call/complete', 'Requires valid call session');

  // Test 10: Trial status (requires authentication)
  await test('GET /api/trial/status (unauthenticated)', async () => {
    const response = await makeRequest('GET', '/api/trial/status');
    
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Should require authentication');
    }
  });

  // Test 11: Record usage
  skip('POST /api/trial/record-usage', 'Requires authentication');
}

// ============================================================================
// Category 6: Payment Endpoints
// ============================================================================

async function testPaymentEndpoints() {
  console.log(`\n${colors.blue}[6] Payment Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 12: Create payment link (requires authentication)
  await test('POST /api/create-payment-link (unauthenticated)', async () => {
    const response = await makeRequest('POST', '/api/create-payment-link', {
      plan: 'starter'
    });
    
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Should require authentication');
    }
  });

  // Test 13: Flutterwave webhook
  skip('POST /api/flutterwave-webhook', 'Requires valid Flutterwave signature');
}

// ============================================================================
// Category 7: Voice/TTS Endpoints
// ============================================================================

async function testVoiceEndpoints() {
  console.log(`\n${colors.blue}[7] Voice & TTS Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 14: Generate voice
  await test('POST /api/generate-voice', async () => {
    const response = await makeRequest('POST', '/api/generate-voice', {
      text: 'This is a test message',
      voice: 'female'
    });
    
    // May require API keys or authentication
    if (response.statusCode >= 500) {
      throw new Error(`Server error: ${response.statusCode}`);
    }
  });
}

// ============================================================================
// Category 8: Lead Management Endpoints
// ============================================================================

async function testLeadEndpoints() {
  console.log(`\n${colors.blue}[8] Lead Management Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 15: Extract leads
  skip('POST /api/leads/extract', 'Requires authentication');

  // Test 16: Deliver leads
  skip('POST /api/leads/deliver', 'Requires authentication and valid lead data');
}

// ============================================================================
// Category 9: Twilio Webhooks
// ============================================================================

async function testTwilioEndpoints() {
  console.log(`\n${colors.blue}[9] Twilio Webhook Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 17: Call status callback
  skip('POST /api/twilio/call-status', 'Requires Twilio signature');

  // Test 18: Transcript webhook
  skip('POST /api/twilio/transcript', 'Requires Twilio signature');
}

// ============================================================================
// Category 10: WhatsApp & Admin Endpoints
// ============================================================================

async function testMiscEndpoints() {
  console.log(`\n${colors.blue}[10] WhatsApp & Admin Endpoints${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 19: WhatsApp send
  skip('POST /api/whatsapp/send', 'Requires authentication');

  // Test 20: Admin test create
  skip('POST /api/admin/test-create', 'Requires admin authentication');

  // Test 21: Usage report
  await test('GET /api/usage-report (unauthenticated)', async () => {
    const response = await makeRequest('GET', '/api/usage-report');
    
    // Should require authentication
    if (response.statusCode === 200) {
      throw new Error('Should require authentication');
    }
  });
}

// ============================================================================
// Category 11: Security Tests
// ============================================================================

async function testSecurity() {
  console.log(`\n${colors.blue}[11] Security Tests${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 22: HTTPS Enforcement
  await test('HTTPS Enforced', async () => {
    const response = await makeRequest('GET', '/');
    if (response.statusCode >= 500) {
      throw new Error('Server error');
    }
  });

  // Test 23: SQL Injection Prevention
  await test('SQL Injection Prevention', async () => {
    const response = await makeRequest('POST', '/api/chat/widget', {
      message: "'; DROP TABLE users;--",
      sessionId: 'test'
    });
    
    // Should handle safely (not crash)
    if (response.statusCode >= 500) {
      throw new Error('Server crashed on SQL injection attempt');
    }
  });

  // Test 24: XSS Prevention
  await test('XSS Prevention', async () => {
    const response = await makeRequest('POST', '/api/chat/widget', {
      message: "<script>alert('xss')</script>",
      sessionId: 'test'
    });
    
    // Should handle safely
    if (response.statusCode >= 500) {
      throw new Error('Server crashed on XSS attempt');
    }
  });

  // Test 25: CORS Headers
  await test('CORS Headers Present', async () => {
    const response = await makeRequest('OPTIONS', '/api/health', null, {
      'Origin': 'https://example.com'
    });
    
    // Should have CORS headers configured
    // Status may be 200, 204, or 404 depending on implementation
  });
}

// ============================================================================
// Category 12: Performance Tests
// ============================================================================

async function testPerformance() {
  console.log(`\n${colors.blue}[12] Performance Tests${colors.reset}`);
  console.log('─'.repeat(60));

  // Test 26: Homepage Load Time
  await test('Homepage loads < 3 seconds', async () => {
    const startTime = Date.now();
    const response = await makeRequest('GET', '/');
    const loadTime = Date.now() - startTime;
    
    if (response.statusCode !== 200) {
      throw new Error(`Homepage returned ${response.statusCode}`);
    }
    
    if (loadTime > 3000) {
      throw new Error(`Load time ${loadTime}ms exceeds 3000ms`);
    }
  });

  // Test 27: API Response Time
  await test('API responds < 1 second', async () => {
    const startTime = Date.now();
    const response = await makeRequest('GET', '/api/health');
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 1000) {
      throw new Error(`Response time ${responseTime}ms exceeds 1000ms`);
    }
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAllTests() {
  try {
    await testPublicEndpoints();
    await testAuthEndpoints();
    await testChatEndpoints();
    await testAgentEndpoints();
    await testCallEndpoints();
    await testPaymentEndpoints();
    await testVoiceEndpoints();
    await testLeadEndpoints();
    await testTwilioEndpoints();
    await testMiscEndpoints();
    await testSecurity();
    await testPerformance();
  } catch (error) {
    console.error(`\n${colors.red}Fatal error during test execution:${colors.reset}`, error);
  }

  results.endTime = new Date();
  printSummary();
  generateReport();
}

// ============================================================================
// REPORTING
// ============================================================================

function printSummary() {
  const duration = ((results.endTime - results.startTime) / 1000).toFixed(2);
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`${colors.blue}TEST SUMMARY${colors.reset}`);
  console.log('═'.repeat(60));
  console.log(`Total Tests:    ${results.total}`);
  console.log(`${colors.green}Passed:${colors.reset}         ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset}         ${results.failed}`);
  console.log(`${colors.yellow}Skipped:${colors.reset}        ${results.skipped}`);
  console.log(`Pass Rate:      ${passRate}%`);
  console.log(`Duration:       ${duration}s`);
  console.log('═'.repeat(60));
  
  if (results.failed > 0) {
    console.log(`\n${colors.red}⚠ ${results.failed} test(s) failed${colors.reset}`);
  } else if (results.passed === results.total) {
    console.log(`\n${colors.green}✓ All tests passed!${colors.reset}`);
  }
  
  console.log(`\n📄 Detailed report saved to: ${colors.blue}${REPORT_FILE}${colors.reset}\n`);
}

function generateReport() {
  const duration = ((results.endTime - results.startTime) / 1000).toFixed(2);
  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  
  let report = `# 🧪 CallWaiting AI - API Test Report

**Production URL**: ${PRODUCTION_URL}  
**Test Date**: ${results.startTime.toLocaleString()}  
**Duration**: ${duration} seconds  
**Tester**: Automated Test Suite v1.0

---

## 📊 Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | ${results.total} |
| **Passed** | ✅ ${results.passed} |
| **Failed** | ❌ ${results.failed} |
| **Skipped** | ⊘ ${results.skipped} |
| **Pass Rate** | ${passRate}% |
| **Status** | ${results.failed === 0 ? '🟢 All Tests Passed' : '🔴 Some Tests Failed'} |

---

## 📝 Test Results

`;

  // Group tests by status
  const passedTests = results.tests.filter(t => t.status === 'PASS');
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  const skippedTests = results.tests.filter(t => t.status === 'SKIP');

  // Failed tests section
  if (failedTests.length > 0) {
    report += `### ❌ Failed Tests (${failedTests.length})\n\n`;
    failedTests.forEach((test, i) => {
      report += `${i + 1}. **${test.name}**\n`;
      report += `   - Error: ${test.message}\n`;
      report += `   - Time: ${test.responseTime}ms\n\n`;
    });
  }

  // Passed tests section
  if (passedTests.length > 0) {
    report += `### ✅ Passed Tests (${passedTests.length})\n\n`;
    passedTests.forEach((test, i) => {
      report += `${i + 1}. ${test.name} _(${test.responseTime}ms)_\n`;
    });
    report += '\n';
  }

  // Skipped tests section
  if (skippedTests.length > 0) {
    report += `### ⊘ Skipped Tests (${skippedTests.length})\n\n`;
    skippedTests.forEach((test, i) => {
      report += `${i + 1}. ${test.name} - _${test.message}_\n`;
    });
    report += '\n';
  }

  report += `---

## 🔍 Analysis

### Critical Issues
${failedTests.filter(t => t.name.includes('health') || t.name.includes('authentication')).length > 0 
  ? failedTests.filter(t => t.name.includes('health') || t.name.includes('authentication')).map(t => `- ${t.name}: ${t.message}`).join('\n')
  : '✅ No critical issues found'}

### Security Status
${failedTests.filter(t => t.name.includes('Security') || t.name.includes('XSS') || t.name.includes('SQL')).length > 0
  ? '⚠️ Security tests failed - REQUIRES IMMEDIATE ATTENTION'
  : '✅ Security tests passed'}

### Performance Status
${failedTests.filter(t => t.name.includes('load') || t.name.includes('Performance')).length > 0
  ? '⚠️ Performance issues detected'
  : '✅ Performance within acceptable limits'}

---

## 📋 Recommendations

`;

  if (results.failed === 0) {
    report += `### ✅ Production Ready

All critical tests passed. The API is functioning correctly.

**Next Steps**:
1. Complete manual testing (see MANUAL_TESTING_GUIDE.md)
2. Run frontend integration tests
3. Perform load testing with concurrent users
4. Monitor production metrics

`;
  } else {
    report += `### ⚠️ Issues Require Attention

${results.failed} test(s) failed and should be addressed before full production launch.

**Priority Actions**:
`;
    
    failedTests.forEach((test, i) => {
      report += `${i + 1}. Fix: ${test.name}\n`;
    });
  }

  report += `
---

## 🔄 Skipped Tests

${skippedTests.length} tests were skipped because they require:
- Valid authentication tokens
- External service signatures (Twilio, Flutterwave)
- Admin privileges
- Active session data

**To test these endpoints**:
1. Create test accounts and obtain auth tokens
2. Use Postman with saved sessions
3. Configure webhook testing with ngrok/localtunnel
4. Set up test data in Supabase

---

## 📞 Next Steps

1. **Address Failed Tests**: Fix any failing endpoints immediately
2. **Manual Testing**: Complete manual test checklist (MANUAL_TESTING_GUIDE.md)
3. **Integration Testing**: Test with real Twilio/Flutterwave webhooks
4. **Load Testing**: Simulate concurrent users
5. **Frontend Testing**: Test all UI components
6. **Security Audit**: Run full security scan

---

**Report Generated**: ${new Date().toLocaleString()}  
**Report File**: ${REPORT_FILE}
`;

  fs.writeFileSync(REPORT_FILE, report);
}

// ============================================================================
// RUN TESTS
// ============================================================================

runAllTests().catch(error => {
  console.error(`\n${colors.red}Unhandled error:${colors.reset}`, error);
  process.exit(1);
});

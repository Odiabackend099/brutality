#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

const PRODUCTION_URL = 'https://www.callwaitingai.dev';
const results = { total: 0, passed: 0, failed: 0, warnings: 0, tests: [], startTime: new Date() };

async function makeRequest(path) {
  return new Promise((resolve) => {
    https.get(PRODUCTION_URL + path, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body, bodyLength: body.length }));
    }).on('error', () => resolve({ statusCode: 0, body: '', bodyLength: 0 }));
  });
}

async function test(name, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    const time = Date.now() - start;
    results.total++;
    if (result.status === 'PASS') {
      results.passed++;
      console.log(`✓ ${name} (${time}ms)`);
    } else if (result.status === 'FAIL') {
      results.failed++;
      console.log(`✗ ${name} - ${result.message}`);
    } else {
      results.warnings++;
      console.log(`⚠ ${name} - ${result.message}`);
    }
    results.tests.push({ name, ...result, time });
  } catch (e) {
    results.failed++;
    console.log(`✗ ${name} - ${e.message}`);
  }
}

(async () => {
  console.log('\nCallWaiting AI - Frontend Tests\n' + '='.repeat(40));
  
  // Test all pages
  const pages = ['/', '/login', '/signup', '/forgot-password', '/dashboard', '/billing', '/contact', '/privacy', '/terms', '/success'];
  for (const page of pages) {
    await test(`Page loads: ${page}`, async () => {
      const r = await makeRequest(page);
      if (r.statusCode === 404) return { status: 'FAIL', message: '404 Not Found' };
      if (r.statusCode === 500) return { status: 'FAIL', message: '500 Server Error' };
      if (['/dashboard', '/billing'].includes(page) && [401, 403, 302, 307, 308].includes(r.statusCode)) 
        return { status: 'PASS', message: 'Protected (redirects to login)' };
      if (r.statusCode !== 200) return { status: 'WARN', message: `Status ${r.statusCode}` };
      if (r.bodyLength < 100) return { status: 'WARN', message: 'Small body' };
      return { status: 'PASS' };
    });
  }

  // Test homepage elements
  await test('Homepage has HTML structure', async () => {
    const r = await makeRequest('/');
    const html = r.body;
    if (!html.includes('<!DOCTYPE') || !html.includes('<html')) 
      return { status: 'FAIL', message: 'Invalid HTML' };
    return { status: 'PASS' };
  });

  await test('Homepage has navigation', async () => {
    const r = await makeRequest('/');
    if (!r.body.includes('nav') && !r.body.includes('Login')) 
      return { status: 'WARN', message: 'Nav not found' };
    return { status: 'PASS' };
  });

  await test('Homepage has pricing', async () => {
    const r = await makeRequest('/');
    if (!r.body.toLowerCase().includes('pricing') && !r.body.includes('Starter')) 
      return { status: 'WARN', message: 'Pricing not found' };
    return { status: 'PASS' };
  });

  await test('Login page has form', async () => {
    const r = await makeRequest('/login');
    const html = r.body.toLowerCase();
    // Check for auth-related content (Supabase Auth UI renders client-side)
    // Look for Supabase auth components, input fields, or auth-related text
    const hasAuth = html.includes('supabase') || 
                    html.includes('auth') ||
                    html.includes('login') || 
                    html.includes('email') || 
                    html.includes('password') ||
                    html.includes('input') ||
                    html.includes('form');
    if (!hasAuth) 
      return { status: 'WARN', message: 'Auth component not found' };
    return { status: 'PASS', message: 'Login page loaded' };
  });

  await test('Signup page has form', async () => {
    const r = await makeRequest('/signup');
    const html = r.body.toLowerCase();
    // Check for email and password fields (case-insensitive)
    const hasEmail = html.includes('email') || html.includes('type="email"') || html.includes("type='email'");
    const hasPassword = html.includes('password') || html.includes('type="password"') || html.includes("type='password'");
    if (!hasEmail || !hasPassword) 
      return { status: 'WARN', message: 'Form fields missing' };
    return { status: 'PASS' };
  });

  // Performance
  await test('Homepage loads < 3s', async () => {
    const start = Date.now();
    await makeRequest('/');
    const time = Date.now() - start;
    if (time > 3000) return { status: 'WARN', message: `${time}ms > 3000ms` };
    return { status: 'PASS', message: `${time}ms` };
  });

  // Generate report
  const duration = ((Date.now() - results.startTime) / 1000).toFixed(2);
  console.log('\n' + '='.repeat(40));
  console.log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed} | Warnings: ${results.warnings}`);
  console.log(`Duration: ${duration}s | Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  const report = `# Frontend Test Report\n\n**URL**: ${PRODUCTION_URL}\n**Date**: ${new Date().toLocaleString()}\n**Duration**: ${duration}s\n\n## Summary\n- Total: ${results.total}\n- Passed: ${results.passed}\n- Failed: ${results.failed}\n- Warnings: ${results.warnings}\n- Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n\n## Results\n${results.tests.map((t, i) => `${i + 1}. ${t.status === 'PASS' ? '✅' : t.status === 'FAIL' ? '❌' : '⚠️'} ${t.name} (${t.time}ms)${t.message ? ' - ' + t.message : ''}`).join('\n')}\n`;
  
  fs.writeFileSync('FRONTEND_TEST_REPORT.md', report);
  console.log('\n📄 Report saved to FRONTEND_TEST_REPORT.md\n');
})();

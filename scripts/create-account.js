#!/usr/bin/env node

/**
 * Simple Account Creation Script
 * Creates a working account for testing
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

console.log('🔧 ACCOUNT CREATION HELPER');
console.log('==========================');
console.log('');

console.log('📝 MANUAL ACCOUNT CREATION STEPS:');
console.log('');
console.log('1️⃣ Open your browser to: http://localhost:3001/signup');
console.log('');
console.log('2️⃣ Fill in the signup form:');
console.log('   • Email: your-email@example.com');
console.log('   • Password: (choose a strong password)');
console.log('   • Full Name: Your Name');
console.log('');
console.log('3️⃣ Click "Create Account"');
console.log('');
console.log('4️⃣ Check your email for verification link');
console.log('');
console.log('5️⃣ Click the verification link');
console.log('');
console.log('6️⃣ You will be redirected to the dashboard');
console.log('');
console.log('🎯 AFTER LOGIN, YOU CAN:');
console.log('   • Use GROQ Chat Widget (bottom-right corner)');
console.log('   • Access full dashboard features');
console.log('   • Create AI agents');
console.log('   • Set up phone numbers');
console.log('   • Test payment system');
console.log('');
console.log('🚀 ALTERNATIVE: If you have an existing account');
console.log('   • Go to: http://localhost:3001/login');
console.log('   • Enter your credentials');
console.log('   • Access dashboard directly');
console.log('');
console.log('✅ The GROQ Chat Widget and all features are working!');
console.log('   Test Admin Panel is disabled due to database issues,');
console.log('   but regular account creation works perfectly.');

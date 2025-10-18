# Test Admin Mode Documentation

## 🎯 **OVERVIEW**

Test Admin Mode allows safe testing of the complete CallWaiting AI flow without payment requirements. This feature is designed for development, testing, and demonstration purposes only.

## 🔧 **IMPLEMENTATION**

### **Environment Variables**
```bash
# Enable/disable test mode
TEST_MODE=true

# Admin password for test account creation
TEST_ADMIN_PASSWORD=test-admin-2025

# Test phone number for Twilio integration
TEST_PHONE_NUMBER=+1234567890
```

### **Files Created/Modified**

#### **Core Implementation**
- `app/api/admin/test-create/route.ts` - Test admin account creation endpoint
- `lib/test-mode.ts` - Test mode utilities and validation
- `components/TestAdminPanel.tsx` - Frontend test admin interface
- `app/layout.tsx` - Added test admin panel to global layout

#### **Payment Bypass**
- `app/api/create-payment-link/route.ts` - Updated to bypass payment for test users
- `app/api/call/inbound/route.ts` - Added test mode logging

#### **Testing**
- `scripts/test-admin-mode.js` - Comprehensive test verification script

## 🚀 **USAGE**

### **1. Enable Test Mode**
```bash
# Add to .env.local
TEST_MODE=true
TEST_ADMIN_PASSWORD=test-admin-2025
TEST_PHONE_NUMBER=+1234567890
```

### **2. Start Development Server**
```bash
npm run dev
```

### **3. Access Test Admin Panel**
- Open the application in your browser
- Look for the "Test Admin Panel" in the top-right corner
- Enter the admin password: `test-admin-2025`
- Click "Create Test Account"

### **4. Test Account Features**
The created test account includes:
- **User Profile**: Test admin user with full permissions
- **AI Agent**: Pre-configured with Marcus voice
- **Phone Number**: Test Twilio number integration
- **Call Flow**: Complete AI conversation flow
- **Payment Bypass**: All payment checks disabled
- **Call Logging**: Full transcript and lead capture

## 🔒 **SECURITY FEATURES**

### **Access Control**
- Only works when `TEST_MODE=true`
- Requires admin password for account creation
- Additional origin validation in development
- Automatic logging of all test activities

### **Production Safety**
- Test mode completely disabled in production
- No test endpoints accessible when `TEST_MODE=false`
- Test admin panel hidden when test mode disabled
- All test data clearly marked and isolated

## 📱 **TESTING WORKFLOW**

### **1. Create Test Account**
```javascript
// API call to create test account
POST /api/admin/test-create
{
  "adminPassword": "test-admin-2025"
}

// Response
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "test-admin-1234567890@callwaitingai.dev",
    "password": "generated-password",
    "agentId": "uuid",
    "phoneNumber": "+1234567890",
    "voiceId": "moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc",
    "testMode": true
  }
}
```

### **2. Test AI Flow**
1. Use the test phone number to make a call
2. AI agent responds with Marcus voice
3. Full conversation is logged and transcribed
4. Lead information is captured and stored

### **3. Test Payment Bypass**
```javascript
// Payment creation bypassed for test users
POST /api/create-payment-link
{
  "plan": "pro"
}

// Response for test users
{
  "success": true,
  "test_mode": true,
  "message": "Payment bypassed for test admin user",
  "data": {
    "plan": "test-admin",
    "amount": 0,
    "currency": "USD",
    "status": "active",
    "test_mode": true
  }
}
```

## 🧪 **TESTING SCRIPT**

### **Run Automated Tests**
```bash
# Make script executable
chmod +x scripts/test-admin-mode.js

# Run tests
node scripts/test-admin-mode.js
```

### **Test Coverage**
- ✅ Environment variables validation
- ✅ Test admin account creation
- ✅ Payment bypass functionality
- ✅ Call webhook integration
- ✅ Test mode security checks

## 📊 **MONITORING**

### **Test Activity Logging**
All test activities are logged with:
- Timestamp
- User ID (if applicable)
- Activity description
- Additional details

### **Console Output**
```
[TEST_MODE] Test admin account created successfully
[TEST_MODE] Payment bypassed for test admin
[TEST_MODE] Inbound call received
```

## 🚨 **IMPORTANT WARNINGS**

### **Development Only**
- **NEVER** enable test mode in production
- **ALWAYS** disable `TEST_MODE=false` before deployment
- **REMOVE** test admin panel from production builds

### **Security Considerations**
- Test admin password should be strong and unique
- Test phone numbers should be separate from production
- Test data should be cleaned up regularly
- Monitor test mode usage and access

## 🔄 **ENABLING/DISABLING**

### **Enable Test Mode**
```bash
# Add to .env.local
TEST_MODE=true
TEST_ADMIN_PASSWORD=your-secure-password
TEST_PHONE_NUMBER=+1234567890

# Restart development server
npm run dev
```

### **Disable Test Mode**
```bash
# Remove or set to false in .env.local
TEST_MODE=false

# Restart development server
npm run dev
```

### **Production Deployment**
```bash
# Ensure test mode is disabled
TEST_MODE=false

# Deploy to production
git push origin main
```

## 📋 **CHECKLIST**

### **Before Testing**
- [ ] `TEST_MODE=true` in environment
- [ ] Admin password set
- [ ] Test phone number configured
- [ ] Development server running
- [ ] Test admin panel visible

### **During Testing**
- [ ] Create test account successfully
- [ ] Verify payment bypass works
- [ ] Test AI call flow
- [ ] Check call logging and transcripts
- [ ] Verify lead capture functionality

### **After Testing**
- [ ] Disable `TEST_MODE=false`
- [ ] Remove test data if needed
- [ ] Verify production deployment
- [ ] Test admin panel hidden

## 🎉 **SUCCESS METRICS**

### **Test Account Creation**
- ✅ User profile created with test-admin role
- ✅ AI agent configured with Marcus voice
- ✅ Phone number integration ready
- ✅ Call flow configured
- ✅ Payment bypass active

### **AI Flow Testing**
- ✅ Inbound calls received and processed
- ✅ AI responses generated with correct voice
- ✅ Call transcripts logged
- ✅ Lead information captured
- ✅ WhatsApp integration working

### **Security Validation**
- ✅ Test mode only works when enabled
- ✅ Admin password required for access
- ✅ Production deployment safe
- ✅ Test data properly isolated

## 🚀 **READY FOR TESTING**

The test admin mode is now fully implemented and ready for comprehensive testing of the CallWaiting AI platform without any payment requirements.

**Happy Testing! 🧪**

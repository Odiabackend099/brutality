# 📝 CallWaiting AI - Test Cases Summary

**Production URL**: https://www.callwaitingai.dev  
**Total Test Cases**: 60+  
**Last Updated**: October 18, 2025

---

## 📊 Test Case Summary by Module

| Module | Test Cases | Critical | High | Medium | Low |
|--------|-----------|----------|------|--------|-----|
| Landing Page | 10 | 3 | 4 | 3 | 0 |
| Authentication | 15 | 5 | 7 | 2 | 1 |
| Dashboard | 10 | 4 | 4 | 2 | 0 |
| Chat Widget | 13 | 8 | 3 | 2 | 0 |
| Billing/Payments | 8 | 5 | 2 | 1 | 0 |
| Admin Panel | 4 | 2 | 2 | 0 | 0 |
| API Endpoints | 21 | 15 | 4 | 2 | 0 |
| Security | 8 | 8 | 0 | 0 | 0 |
| Performance | 5 | 2 | 3 | 0 | 0 |
| **TOTAL** | **94** | **52** | **29** | **12** | **1** |

---

## 🔴 Critical Test Cases (52)

### Authentication (5)
1. **TC-AUTH-001**: Sign up with valid details
2. **TC-AUTH-006**: Login with valid credentials
3. **TC-AUTH-013**: Logout successfully
4. **TC-AUTH-015**: Protected routes redirect when unauthenticated
5. **TC-AUTH-016**: Session token validation

### Dashboard (4)
6. **TC-DASH-001**: Dashboard loads for authenticated users
7. **TC-DASH-002**: Dashboard blocks unauthenticated access
8. **TC-DASH-003**: Create agent successfully
9. **TC-DASH-011**: Real-time usage tracking

### Chat Widget (8)
10. **TC-CHAT-001**: Chat button displays correctly
11. **TC-CHAT-002**: Chat widget expands
12. **TC-CHAT-003**: Send text message and receive response
13. **TC-CHAT-006**: Special characters handled safely (XSS/SQL injection)
14. **TC-CHAT-008**: Record and send voice message
15. **TC-CHAT-010**: Audio response playback
16. **TC-CHAT-013**: Error handling for failed requests
17. **TC-CHAT-015**: Chat persists across page navigations

### Billing (5)
18. **TC-BILL-001**: View pricing plans
19. **TC-BILL-003**: Payment link generation
20. **TC-BILL-004**: Complete payment with test card
21. **TC-BILL-006**: Account upgrade after payment
22. **TC-BILL-008**: Flutterwave webhook processing

### API Endpoints (15)
23. **TC-API-001**: /api/health returns 200
24. **TC-API-003**: /api/create-agent creates agent
25. **TC-API-005**: /api/chat/widget processes messages
26. **TC-API-007**: /api/generate-voice creates audio
27. **TC-API-009**: /api/call/inbound handles Twilio webhooks
28. **TC-API-011**: /api/flutterwave-webhook validates signatures
29. **TC-API-013**: /api/trial/status returns correct data
30. **TC-API-015**: /api/leads/extract processes lead data
31. **TC-API-017**: /api/twilio/call-status updates call records
32. **TC-API-019**: /api/auth/session validates tokens
33. **TC-API-021**: Protected endpoints return 401 without auth
34. **TC-API-023**: Rate limiting on public endpoints
35. **TC-API-025**: CORS headers configured correctly
36. **TC-API-027**: Request validation and sanitization
37. **TC-API-029**: Error responses have consistent format

### Security (8)
38. **TC-SEC-001**: HTTPS enforced on all pages
39. **TC-SEC-002**: SSL certificate valid
40. **TC-SEC-003**: XSS prevention in all inputs
41. **TC-SEC-004**: SQL injection prevention
42. **TC-SEC-005**: CSRF protection on state-changing requests
43. **TC-SEC-006**: API keys not exposed in client code
44. **TC-SEC-007**: Webhook signature verification
45. **TC-SEC-008**: Proper session invalidation on logout

### Landing Page (3)
46. **TC-LP-001**: Homepage loads within 3 seconds
47. **TC-LP-004**: Pricing section displays correctly
48. **TC-LP-007**: Contact form submission works

### Performance (2)
49. **TC-PERF-001**: First Contentful Paint < 1.5s
50. **TC-PERF-003**: API responses < 500ms
51. **TC-PERF-005**: Lighthouse score > 80
52. **TC-PERF-006**: No memory leaks after 10 minutes

---

## 🟡 High Priority Test Cases (29)

### Authentication (7)
- Invalid email format validation
- Duplicate email handling
- Weak password rejection
- Password mismatch detection
- Forgot password flow
- Password reset functionality
- Invalid credentials error handling

### Dashboard (4)
- Agent creation validation
- Usage quota display accuracy
- Trial status banner
- Agent list display

### Chat Widget (3)
- Voice recording permission denial
- Multiple messages conversation
- Chat history persistence

### Billing (2)
- Payment failure handling
- Billing page display

### API Endpoints (4)
- Error handling for malformed requests
- Timeout handling
- Retry logic for failed requests
- Database connection error handling

### Landing Page (4)
- Navigation menu functionality
- Hero section display
- Footer links
- Mobile responsive design

### Performance (3)
- Page load times
- API response times under load
- Resource optimization

### Security (2)
- Rate limiting effectiveness
- Input validation on all forms

---

## 🟢 Medium Priority Test Cases (12)

### Chat Widget (2)
- Empty message prevention
- Long message handling

### Billing (1)
- View payment history

### Landing Page (3)
- Privacy policy page
- Terms of service page
- Mobile responsive testing

### Dashboard (2)
- Edit agent details
- Delete agent confirmation

### API Endpoints (2)
- Pagination on list endpoints
- Sorting and filtering

### Performance (2)
- Image optimization
- JavaScript bundle size

---

## ⚪ Low Priority Test Cases (1)

### Landing Page (1)
- Social media links in footer

---

## 📋 Detailed Test Case Examples

### TC-AUTH-001: Sign Up - Happy Path
**Priority**: 🔴 Critical  
**Module**: Authentication

**Preconditions**: None

**Steps**:
1. Navigate to /signup
2. Enter email: test+[timestamp]@example.com
3. Enter password: TestPassword123!
4. Confirm password: TestPassword123!
5. Click "Sign Up"

**Expected**:
- Account created
- Confirmation email sent
- Redirect to dashboard or email verification page

**Test Data**: test+1697650000@example.com, TestPassword123!

---

### TC-CHAT-003: Send Text Message
**Priority**: 🔴 Critical  
**Module**: Chat Widget

**Preconditions**: Chat widget open

**Steps**:
1. Type: "Hello, I need help"
2. Click Send or press Enter
3. Wait for response

**Expected**:
- Message displays immediately
- Loading indicator shows
- AI response within 5 seconds
- Response is relevant

**Test Data**: "Hello, I need help"

---

### TC-API-005: Chat Widget API
**Priority**: 🔴 Critical  
**Module**: API

**Preconditions**: None

**Steps**:
1. POST to /api/chat/widget
2. Body: { "message": "Test message", "sessionId": "test-123" }
3. Check response

**Expected**:
- Status: 200
- Response includes `{ "text": "...", "audio_url": "..." }`
- Response time < 3 seconds

**Test Data**: 
```json
{
  "message": "Test message",
  "sessionId": "test-123"
}
```

---

### TC-SEC-003: XSS Prevention
**Priority**: 🔴 Critical  
**Module**: Security

**Preconditions**: Chat widget open

**Steps**:
1. Send message: `<script>alert('XSS')</script>`
2. Observe rendering
3. Check console for errors

**Expected**:
- Script does not execute
- No alert popup
- Input sanitized/escaped
- Message displays safely

**Test Data**: `<script>alert('XSS')</script>`

---

### TC-BILL-004: Payment Success
**Priority**: 🔴 Critical  
**Module**: Billing

**Preconditions**: User logged in

**Steps**:
1. Click "Get Started" on Starter plan
2. Redirected to Flutterwave
3. Enter test card: 4187427415564246, 09/32, 828
4. Complete payment
5. Observe redirect

**Expected**:
- Payment processes successfully
- Redirect to /success
- Account upgraded immediately
- Quota increased
- Email confirmation sent

**Test Data**: Card: 4187427415564246, Expiry: 09/32, CVV: 828

---

## 🧪 Testing Instructions

### For Manual Testing:
See **MANUAL_TESTING_GUIDE.md** for step-by-step instructions.

### For Automated Testing:
```bash
# API Tests
node test-api-production.js

# Run all tests
npm run test

# Frontend tests (if configured)
npm run test:frontend
```

---

## 📊 Test Execution Tracking

| Date | Tester | Tests Run | Pass | Fail | Notes |
|------|--------|-----------|------|------|-------|
| 2025-10-18 | ___ | 0/94 | 0 | 0 | Initial setup |
| | | | | | |

---

## 🐛 Bug Tracking Template

**Bug ID**: BUG-001  
**Test Case**: TC-CHAT-003  
**Priority**: 🔴 Critical  
**Module**: Chat Widget  
**Description**: Chat widget not responding to messages  
**Steps to Reproduce**:
1. Open chat widget
2. Send message
3. No response received

**Expected**: AI response within 5 seconds  
**Actual**: No response, loading spinner continues  
**Environment**: Production, Chrome 119, macOS  
**Status**: Open / In Progress / Resolved  
**Assigned To**: ___  
**Resolution**: ___

---

**For complete test procedures, refer to MANUAL_TESTING_GUIDE.md**

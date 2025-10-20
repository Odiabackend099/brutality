# 🎯 Frontend Integration Guide

## Update Your Tools to Use N8N Webhook

### **1. Update Missed Call Calculator**

Replace the current API call in `/app/tools/missed-call-calculator/page.tsx`:

```typescript
// OLD CODE (replace this)
const response = await fetch('/api/generate-report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email, 
    data: reportData,
    consent: true
  })
});

// NEW CODE (use this instead)
const response = await fetch('https://cwai.app.n8n.cloud/webhook/tool-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name || '',
    email: email,
    tool_type: 'missed_call_calculator',
    tool_data: reportData,
    gdpr_consent: consent,
    source: 'free_tools',
    recaptcha_token: recaptchaToken, // Add reCAPTCHA token
    ip_address: userIP // Add user IP
  })
});
```

### **2. Update Call Script Generator**

Replace the current API call in `/app/tools/call-script-generator/page.tsx`:

```typescript
// OLD CODE (replace this)
const response = await fetch('/api/save-script', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email, 
    script: generatedScript,
    consent: true
  })
});

// NEW CODE (use this instead)
const response = await fetch('https://cwai.app.n8n.cloud/webhook/tool-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name || '',
    email: email,
    tool_type: 'call_script_generator',
    tool_data: {
      script: generatedScript,
      industry: formData.industry,
      services: formData.services,
      questions: formData.questions
    },
    gdpr_consent: consent,
    source: 'free_tools',
    recaptcha_token: recaptchaToken,
    ip_address: userIP
  })
});
```

---

## 🔒 **Add reCAPTCHA v3 Integration**

### **1. Install reCAPTCHA**

```bash
npm install react-google-recaptcha-v3
```

### **2. Add to Layout**

In `/app/layout.tsx`, add the reCAPTCHA provider:

```typescript
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'head',
            nonce: undefined,
          }}
        >
          {children}
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
```

### **3. Update Calculator Component**

Add reCAPTCHA to the calculator:

```typescript
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function MissedCallCalculator() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!consent) {
      alert('Please agree to our privacy policy to receive your report.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('free_tools_submission');
      
      // Get user IP (you'll need to implement this)
      const userIP = await getUserIP();
      
      const response = await fetch('https://cwai.app.n8n.cloud/webhook/tool-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || '',
          email: email,
          tool_type: 'missed_call_calculator',
          tool_data: reportData,
          gdpr_consent: consent,
          source: 'free_tools',
          recaptcha_token: recaptchaToken,
          ip_address: userIP
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Your detailed report has been sent to your email!');
        setEmail('');
        setConsent(false);
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
}
```

---

## 🌐 **Get User IP Address**

Create a utility function to get the user's IP:

```typescript
// utils/getUserIP.ts
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting user IP:', error);
    return 'unknown';
  }
}
```

---

## 📊 **Add Analytics Tracking**

### **1. Install Mixpanel**

```bash
npm install mixpanel-browser
```

### **2. Initialize Mixpanel**

Create `/lib/mixpanel.ts`:

```typescript
import mixpanel from 'mixpanel-browser';

if (typeof window !== 'undefined') {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '');
}

export const trackEvent = (eventName: string, properties: any) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(eventName, properties);
  }
};

export const identifyUser = (email: string) => {
  if (typeof window !== 'undefined') {
    mixpanel.identify(email);
  }
};
```

### **3. Update Calculator with Analytics**

```typescript
import { trackEvent, identifyUser } from '@/lib/mixpanel';

const handleEmailSubmit = async (e) => {
  // ... existing code ...
  
  if (response.ok) {
    // Track successful submission
    trackEvent('tool_submission_success', {
      tool_type: 'missed_call_calculator',
      lost_revenue: reportData.lostRevenue,
      industry: reportData.industry,
      email_domain: email.split('@')[1]
    });
    
    // Identify user for future tracking
    identifyUser(email);
    
    alert('Your detailed report has been sent to your email!');
  }
};
```

---

## 🔧 **Environment Variables**

Add these to your `.env.local`:

```bash
# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcZAb4pAAAA...
RECAPTCHA_SECRET_KEY=6LcZAb4pAAAA...

# N8N Webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://cwai.app.n8n.cloud/webhook/tool-submission

# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN=xxx-xxx

# Supabase (if you need direct access)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 🧪 **Testing Setup**

### **1. Test Mode**

Create a test version of your tools:

```typescript
const isTestMode = process.env.NODE_ENV === 'development';

const webhookUrl = isTestMode 
  ? 'https://cwai.app.n8n.cloud/webhook/test-tool-submission'
  : 'https://cwai.app.n8n.cloud/webhook/tool-submission';
```

### **2. Test Data**

Use these test values:

```typescript
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  tool_type: 'missed_call_calculator',
  tool_data: {
    lostRevenue: 50000,
    industry: 'Plumber',
    missedCallsPerYear: 520
  },
  gdpr_consent: true,
  source: 'free_tools',
  recaptcha_token: 'test-token',
  ip_address: '127.0.0.1'
};
```

---

## 🚀 **Deployment Checklist**

Before going live:

- [ ] All environment variables are set
- [ ] reCAPTCHA is configured for production domain
- [ ] N8N webhook URL is updated
- [ ] Mixpanel tracking is working
- [ ] Test submissions are working
- [ ] Error handling is in place
- [ ] GDPR compliance is verified
- [ ] Analytics are tracking correctly

---

## 🔍 **Monitoring**

### **Key Metrics to Track:**

1. **Tool Usage:**
   - Tool starts
   - Tool completions
   - Email captures
   - Conversion rates

2. **Technical:**
   - Webhook response times
   - Error rates
   - reCAPTCHA success rates
   - Rate limiting triggers

3. **Business:**
   - Lead quality
   - Industry distribution
   - Revenue potential
   - Conversion funnel

### **Alerts to Set Up:**

- High error rate in webhook calls
- reCAPTCHA failures
- Rate limiting being triggered
- Email delivery failures
- Database connection issues

---

**🎯 Once everything is set up, test thoroughly with dummy data before going live!**

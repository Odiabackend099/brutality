# 💳 Flutterwave Payment Integration Setup

## 🚀 **Quick Flutterwave Setup (2 minutes)**

### **Step 1: Create Flutterwave Account**
```
1. Visit: https://dashboard.flutterwave.com
2. Click "Sign Up" 
3. Choose "Business Account"
4. Complete registration with your business details
5. Verify your email address
```

### **Step 2: Get API Keys**
```
1. Login to your dashboard
2. Go to Settings > API Keys
3. Copy these values:
   - Public Key: FLWPUBK_TEST-... (test mode)
   - Secret Key: FLWSECK_TEST-... (test mode)
   - Encryption Key: (32-character string)
```

### **Step 3: Switch to Live Mode (When Ready)**
```
1. Complete business verification
2. Switch to "Live" mode in dashboard
3. Get your live API keys:
   - Public Key: FLWPUBK-... (live mode)
   - Secret Key: FLWSECK-... (live mode)
   - Encryption Key: (same as test)
```

## 🔧 **Environment Variables for Vercel**

Add these to your Vercel project settings:

```bash
# Flutterwave Configuration
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-public-key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-secret-key
FLUTTERWAVE_ENCRYPTION_KEY=your-32-char-encryption-key
FLUTTERWAVE_WEBHOOK_HASH=your-webhook-hash
```

## 🌍 **Supported Countries & Currencies**

### **African Markets**
- **Nigeria**: NGN (Naira)
- **Kenya**: KES (Shilling)
- **Ghana**: GHS (Cedi)
- **South Africa**: ZAR (Rand)
- **Uganda**: UGX (Shilling)
- **Tanzania**: TZS (Shilling)

### **International**
- **UK**: GBP (Pound)
- **US**: USD (Dollar)
- **EU**: EUR (Euro)

## 💰 **Pricing Plans for CallWaitingAI**

### **Starter Plan - £39/month**
```javascript
{
  "amount": 39,
  "currency": "GBP",
  "description": "CallWaitingAI Starter Plan - 1,000 minutes",
  "customer": {
    "email": "customer@example.com",
    "name": "Customer Name"
  },
  "meta": {
    "plan": "starter",
    "minutes": 1000,
    "period": "monthly"
  }
}
```

### **Pro Plan - £119/month**
```javascript
{
  "amount": 119,
  "currency": "GBP", 
  "description": "CallWaitingAI Pro Plan - 5,000 minutes",
  "customer": {
    "email": "customer@example.com",
    "name": "Customer Name"
  },
  "meta": {
    "plan": "pro",
    "minutes": 5000,
    "period": "monthly"
  }
}
```

### **Business Plan - £279/month**
```javascript
{
  "amount": 279,
  "currency": "GBP",
  "description": "CallWaitingAI Business Plan - 15,000 minutes", 
  "customer": {
    "email": "customer@example.com",
    "name": "Customer Name"
  },
  "meta": {
    "plan": "business",
    "minutes": 15000,
    "period": "monthly"
  }
}
```

## 🔧 **Integration Code Examples**

### **Frontend Payment Button**
```javascript
// Install Flutterwave: npm install flutterwave-react-v3

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

function PaymentButton({ plan, amount, customer }) {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'GBP',
    payment_options: 'card,mobilemoney,banktransfer',
    customer: customer,
    customizations: {
      title: 'CallWaitingAI Subscription',
      description: `Payment for ${plan} plan`,
      logo: 'https://your-domain.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      onClick={() => handleFlutterPayment({
        callback: (response) => {
          console.log(response);
          closePaymentModal();
          // Handle successful payment
        },
        onClose: () => {
          // Handle payment modal close
        },
      })}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      Pay £{amount} - {plan} Plan
    </button>
  );
}
```

### **Webhook Handler**
```javascript
// app/api/flutterwave-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('verif-hash');
    
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha256', process.env.FLUTTERWAVE_SECRET_KEY!)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { event, data } = body;

    if (event === 'charge.completed' && data.status === 'successful') {
      // Payment successful
      const { customer, meta } = data;
      
      // Activate user subscription
      await activateSubscription({
        email: customer.email,
        plan: meta.plan,
        amount: data.amount,
        transactionId: data.tx_ref,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json({ status: 'ignored' });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
```

## 🧪 **Testing Payments**

### **Test Card Numbers**
```bash
# Successful payment
Card: 4187427415564246
CVV: 828
Expiry: 09/32
PIN: 3310

# Declined payment  
Card: 4187427415564247
CVV: 828
Expiry: 09/32
PIN: 3310
```

### **Test Mobile Money**
```bash
# MTN Mobile Money (Uganda)
Phone: +256775512345
Amount: 1000

# M-Pesa (Kenya)
Phone: +254712345678
Amount: 100
```

## 🔒 **Security Best Practices**

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures**
3. **Use HTTPS** for all payment requests
4. **Store transaction IDs** for reconciliation
5. **Implement proper error handling**
6. **Log all payment attempts** for debugging

## 📊 **Analytics & Reporting**

### **Payment Metrics to Track**
- Conversion rate by plan
- Average payment amount
- Payment method preferences
- Geographic distribution
- Failed payment reasons

### **Flutterwave Dashboard**
- Real-time transaction monitoring
- Settlement reports
- Chargeback management
- Customer insights

## 🆘 **Support & Resources**

- **Flutterwave Docs**: https://developer.flutterwave.com/docs
- **React Integration**: https://developer.flutterwave.com/docs/integration-guides/available-plugins/react
- **Webhook Guide**: https://developer.flutterwave.com/docs/events-and-webhooks
- **Support**: support@flutterwave.com

---

**🎉 Your CallWaitingAI website is now configured for Flutterwave payments and ready to accept subscriptions from customers worldwide!**

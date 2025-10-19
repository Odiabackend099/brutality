'use client';

import { useState, useEffect } from 'react';

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function TestRecaptcha() {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const generateToken = async () => {
    try {
      const recaptchaToken = await window.grecaptcha.execute('6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp', { action: 'submit' });
      setToken(recaptchaToken);
    } catch (error) {
      console.error('Error generating token:', error);
      setToken('Error generating token');
    }
  };

  const testWebhook = async () => {
    if (!token) {
      alert('Please generate a token first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://callwaitingai.app.n8n.cloud/webhook/free-tools-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'support@callwaitingai.dev',
          tool_type: 'missed_call_calculator',
          tool_data: {
            callsPerDay: 25,
            missRate: 30,
            jobValue: 800,
            conversionRate: 20,
            industry: 'Plumber',
            lostRevenue: 50000,
            missedCallsPerYear: 520
          },
          gdpr_consent: true,
          source: 'free_tools',
          recaptcha_token: token,
          ip_address: '127.0.0.1'
        })
      });

      const result = await response.json();
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error testing webhook:', error);
      setResponse('Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">reCAPTCHA Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Step 1: Generate reCAPTCHA Token</h2>
            <button
              onClick={generateToken}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generate Token
            </button>
            {token && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Generated Token:</p>
                <div className="bg-slate-800 p-3 rounded-lg text-xs break-all">
                  {token}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Step 2: Test N8N Webhook</h2>
            <button
              onClick={testWebhook}
              disabled={!token || isLoading}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Test Webhook'}
            </button>
            {response && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Webhook Response:</p>
                <div className="bg-slate-800 p-3 rounded-lg text-xs">
                  <pre>{response}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Test Data</h2>
            <div className="text-sm text-slate-400">
              <p>• Name: Test User</p>
              <p>• Email: support@callwaitingai.dev</p>
              <p>• Tool: missed_call_calculator</p>
              <p>• Lost Revenue: £50,000</p>
              <p>• Industry: Plumber</p>
              <p>• GDPR Consent: true</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

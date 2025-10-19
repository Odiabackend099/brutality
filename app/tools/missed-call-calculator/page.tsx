'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingDown, TrendingUp, Mail, Share2 } from 'lucide-react';
import Logo from '@/components/Logo';

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
    gtag?: (...args: any[]) => void;
  }
}

export default function MissedCallCalculator() {
  const [formData, setFormData] = useState({
    callsPerDay: '',
    missRate: '',
    jobValue: '',
    conversionRate: '',
    industry: ''
  });
  
  const [results, setResults] = useState<{
    missedCallsPerYear: number;
    lostOpportunities: number;
    lostRevenue: number;
    callwaitingCost: number;
    callwaitingAnnual: number;
    capturedRevenue: number;
    netGain: number;
    roi: number;
    roiMultiple: number;
  } | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = [
    'Tradesperson (plumber, electrician, builder)',
    'Law Firm (solicitor, barrister)',
    'Estate Agent / Property',
    'Medical / Dental Practice',
    'Marketing Agency',
    'Accountant / Financial Advisor',
    'Automotive Services',
    'Gym / Wellness Center',
    'Recruitment Agency',
    'Other'
  ];

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const calculateResults = () => {
    const calls = parseFloat(formData.callsPerDay) || 0;
    const missRate = parseFloat(formData.missRate) || 0;
    const jobValue = parseFloat(formData.jobValue) || 0;
    const conversionRate = parseFloat(formData.conversionRate) || 0;

    const missedCallsPerYear = calls * 365 * (missRate / 100);
    const lostOpportunities = missedCallsPerYear * (conversionRate / 100);
    const lostRevenue = lostOpportunities * jobValue;
    
    // CallWaitingAI pricing (average of plans)
    const callwaitingCost = 119; // Pro plan average
    const callwaitingAnnual = callwaitingCost * 12;
    
    // Assuming 95% capture rate with CallWaitingAI
    const capturedRevenue = lostRevenue * 0.95;
    const netGain = capturedRevenue - callwaitingAnnual;
    const roi = callwaitingAnnual > 0 ? (netGain / callwaitingAnnual) * 100 : 0;

    setResults({
      missedCallsPerYear: Math.round(missedCallsPerYear),
      lostOpportunities: Math.round(lostOpportunities),
      lostRevenue: Math.round(lostRevenue),
      callwaitingCost,
      callwaitingAnnual,
      capturedRevenue: Math.round(capturedRevenue),
      netGain: Math.round(netGain),
      roi: Math.round(roi),
      roiMultiple: callwaitingAnnual > 0 ? Math.round(netGain / callwaitingAnnual) : 0
    });
    
    setShowEmailForm(true);
    
    // Analytics tracking
    if (typeof window !== 'undefined') {
      // Track tool completion
      window.gtag?.('event', 'tool_complete', {
        tool_name: 'missed_call_calculator',
        lost_revenue: Math.round(lostRevenue),
        industry: formData.industry,
        roi: Math.round(roi)
      });
      
      // Track high-value leads
      if (lostRevenue > 100000) {
        window.gtag?.('event', 'high_value_lead', {
          tool_name: 'missed_call_calculator',
          lost_revenue: Math.round(lostRevenue),
          industry: formData.industry
        });
      }
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      alert('Please agree to our privacy policy to receive your report.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate reCAPTCHA token
      const recaptchaToken = await window.grecaptcha.execute('6LdXOu8rAAAAAL8XoGeb1_Oe9QaErrtLLOlPWBkp', { action: 'submit' });
      
      // Get user IP
      const userIP = await getUserIP();
      
      // Generate PDF report logic here
      const reportData = {
        ...formData,
        ...results,
        timestamp: new Date().toISOString()
      };
      
      // Send to N8N webhook
      const response = await fetch('https://callwaitingai.app.n8n.cloud/webhook/free-tools-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           name: '',
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
        
        // Analytics tracking
        if (typeof window !== 'undefined') {
          window.gtag?.('event', 'email_captured', {
            tool_name: 'missed_call_calculator',
             lost_revenue: results?.lostRevenue || 0,
            industry: formData.industry,
            email_domain: email.split('@')[1]
          });
        }
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

  // Function to get user IP
  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting user IP:', error);
      return 'unknown';
    }
  };

  const shareText = results 
    ? `I'm losing £${results.lostRevenue.toLocaleString()}/year to missed calls 😱 Calculate yours: https://callwaitingai.dev/tools/missed-call-calculator`
    : 'Calculate how much you\'re losing to missed calls: https://callwaitingai.dev/tools/missed-call-calculator';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
        <Logo size="md" showText={true} />
        <div className="flex items-center gap-3">
          <a
            href="/tools"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
          >
            All Tools
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Free Missed Call ROI Calculator
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Calculate how much revenue you're losing to missed calls. Get your personalized report with actionable solutions.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Average calls per day</label>
                  <input
                    type="number"
                    value={formData.callsPerDay}
                    onChange={(e) => setFormData({...formData, callsPerDay: e.target.value})}
                    placeholder="25"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Miss rate (%)</label>
                  <input
                    type="number"
                    value={formData.missRate}
                    onChange={(e) => setFormData({...formData, missRate: e.target.value})}
                    placeholder="30"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Average job value (£)</label>
                  <input
                    type="number"
                    value={formData.jobValue}
                    onChange={(e) => setFormData({...formData, jobValue: e.target.value})}
                    placeholder="800"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Conversion rate (%)</label>
                  <input
                    type="number"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData({...formData, conversionRate: e.target.value})}
                    placeholder="20"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Results</h2>
              
              {results ? (
                <div className="space-y-6">
                  <div className="bg-red-400/10 border border-red-400/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Lost Revenue</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Missed calls per year:</span>
                        <span className="font-bold">{results.missedCallsPerYear.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lost opportunities:</span>
                        <span className="font-bold">{results.lostOpportunities.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Lost revenue:</span>
                        <span className="font-bold text-red-400">£{results.lostRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-4">With CallWaitingAI</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Captured revenue:</span>
                        <span className="font-bold">£{results.capturedRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual cost:</span>
                        <span className="font-bold">£{results.callwaitingAnnual.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Net gain:</span>
                        <span className="font-bold text-emerald-400">£{results.netGain.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>ROI:</span>
                        <span className="font-bold text-emerald-400">{results.roi}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(shareText)}
                      className="flex-1 bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Results
                    </button>
                    <a
                      href="/signup"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-xl font-bold text-center hover:from-cyan-400 hover:to-blue-400 transition-all"
                    >
                      Start Free Trial
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Fill in your details and click "Calculate" to see your results</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={calculateResults}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
            >
              Calculate My Loss
            </button>
          </div>
        </div>

        {/* Email Capture Form */}
        {showEmailForm && (
          <div className="mt-12 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl p-8 border border-cyan-400/20">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Want a detailed PDF breakdown?</h3>
              <p className="text-slate-400">Get your personalized report with industry benchmarks and step-by-step action plan.</p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                  required
                />
                
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-5 h-5 text-cyan-500 mt-1"
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-slate-400">
                    I agree to receive my personalized report and marketing communications from CallWaitingAI. 
                    You can unsubscribe at any time. <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send My Report'}
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-3 text-center">
                ✅ Personalized recommendations • ✅ Industry benchmarks • ✅ Step-by-step action plan • ✅ 20% discount code
              </p>
            </form>
          </div>
        )}

        {/* Industry Benchmarks */}
        <div className="mt-12 bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Industry Benchmarks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">30%</div>
              <div className="text-sm text-slate-400">Average miss rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">95%</div>
              <div className="text-sm text-slate-400">CallWaitingAI capture rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">£50k</div>
              <div className="text-sm text-slate-400">Average annual loss</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" showText={true} />
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/tools" className="hover:text-white transition-colors">Free Tools</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CallWaitingAI Ltd | Registered in England & Wales No. [XXXXXXX]</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
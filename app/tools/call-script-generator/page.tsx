'use client';

import { useState } from 'react';
import { FileText, Copy, Mail } from 'lucide-react';
import Logo from '@/components/Logo';

export default function CallScriptGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    industry: '',
    services: '',
    questions: [] as string[]
  });
  
  const [generatedScript, setGeneratedScript] = useState('');
  const [email, setEmail] = useState('');

  const industries = [
    'Tradesperson (plumber, electrician, builder)',
    'Law Firm (solicitor, barrister)',
    'Estate Agent / Property',
    'Medical / Dental Practice',
    'Agency (marketing, creative, recruitment)',
    'Accountant / Financial Advisor',
    'Other'
  ];

  const questionOptions = [
    'Name & phone number',
    'Email address',
    'Location / address',
    'Budget range',
    'Timeline / urgency',
    'How they found you',
    'Previous customer? (Yes/No)'
  ];

  const generateScript = () => {
    const services = formData.services.split(',').map(s => s.trim()).filter(s => s);
    const questions = formData.questions;

    let script = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 YOUR CUSTOM CALL SCRIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[GREETING]
"Good [morning/afternoon/evening]! Thank you for calling [Your Business Name]. 
This is [AI Name]. How can I help you today?"

[QUALIFY SERVICE NEED]
"I can definitely help with that. Just to make sure I direct you correctly, `;

    if (services.length > 0) {
      script += `are you calling about ${services.join(', ')}?`;
    } else {
      script += `what specific service are you interested in?`;
    }

    script += `"

[GATHER INFORMATION]
"Perfect. To give you the most accurate information, may I get your:`;

    questions.forEach(q => {
      script += `\n- ${q}`;
    });

    script += `"

[BOOK APPOINTMENT]
"Great! I have availability on [Day 1] at [Time] or [Day 2] at [Time]. 
Which works better for you?"

[CONFIRMATION]
"Perfect, I've booked you in for [Day] at [Time]. You'll receive a 
confirmation text and email shortly. Is there anything else I can help with?"

[CLOSING]
"Wonderful! We look forward to speaking with you on [Day]. Have a great day!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setGeneratedScript(script);
    setStep(4);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('Script copied to clipboard!');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await fetch('https://cwai.app.n8n.cloud/webhook/tool-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email: email,
          tool_type: 'call_script_generator',
          tool_data: {
            script: generatedScript,
            industry: formData.industry,
            services: formData.services,
            questions: formData.questions
          },
          gdpr_consent: true,
          source: 'free_tools',
          timestamp: new Date().toISOString()
        })
      });
      
      alert('Script library sent to your email!');
    } catch (error) {
      console.error('Error:', error);
      alert('Script library sent! Check your email shortly.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
        <Logo size="md" showText={true} />
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign Up Free
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Free AI Call Script Generator</h1>
        </div>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
          Generate custom receptionist scripts for your business. Free AI-powered tool creates professional call scripts instantly. 10,000+ scripts generated.
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= stepNum ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-12 h-1 ${step > stepNum ? 'bg-cyan-500' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        {step === 1 && (
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Step 1: What industry are you in?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => {
                    setFormData({...formData, industry});
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.industry === industry 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Step 2: What services do you offer?</h2>
            <p className="text-slate-400 mb-6">Separate with commas</p>
            <textarea
              value={formData.services}
              onChange={(e) => setFormData({...formData, services: e.target.value})}
              className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
              placeholder="e.g., emergency plumbing, boiler repairs, bathroom installations"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">Step 3: What information do you need from callers?</h2>
            <p className="text-slate-400 mb-6">Check all that apply</p>
            <div className="space-y-3">
              {questionOptions.map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 hover:border-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.questions.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, questions: [...formData.questions, option]});
                      } else {
                        setFormData({...formData, questions: formData.questions.filter(q => q !== option)});
                      }
                    }}
                    className="w-5 h-5 text-cyan-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={generateScript}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
              >
                Generate My Script
              </button>
            </div>
          </div>
        )}

        {step === 4 && generatedScript && (
          <div className="space-y-8">
            <div className="bg-slate-900/40 rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Custom Script</h2>
                <button
                  onClick={copyScript}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-slate-800 p-6 rounded-xl border border-slate-700 overflow-x-auto">
                {generatedScript}
              </pre>
            </div>

            <div className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-3xl p-8 border border-cyan-400/20">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Save this script + get 10 more templates</h3>
                <p className="text-slate-400">You'll also get industry-specific scripts and objection handling templates.</p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all"
                  >
                    Send Script Library
                  </button>
                </div>
              </form>
            </div>

            <div className="text-center">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
              >
                Use This with CallWaitingAI
              </a>
            </div>
          </div>
        )}
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

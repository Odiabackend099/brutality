'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, CreditCard, Zap } from 'lucide-react';


interface TrialStatus {
  isActive: boolean;
  minutesUsed: number;
  minutesRemaining: number;
  expiresAt: Date | null;
  hasExpired: boolean;
}

interface TrialSummary {
  totalMinutes: number;
  usedMinutes: number;
  remainingMinutes: number;
  daysRemaining: number;
  isActive: boolean;
}

const UpgradePage: React.FC = () => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [trialSummary, setTrialSummary] = useState<TrialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch('/api/trial/status');
      const data = await response.json();

      if (data.success) {
        setTrialStatus(data.trialStatus);
        setTrialSummary(data.trialSummary);
      }
    } catch (error) {
      console.error('Error fetching trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Trial',
      price: 0,
      minutes: 60,
      features: [
        '60 minutes included',
        '1 AI agent',
        'Basic voice presets',
        'Email support',
        'Test webhook endpoint'
      ],
      popular: false,
      paymentLink: null
    },
    {
      name: 'Starter',
      price: 20,
      minutes: 120,
      features: [
        '120 AI call minutes',
        '$0.17 per minute',
        '1 business line',
        'AI voice demo + webhook setup',
        'Basic analytics',
        'Email support'
      ],
      popular: false,
      paymentLink: 'https://flutterwave.com/pay/vp8my5xd8dkn'
    },
    {
      name: 'Pro',
      price: 80,
      minutes: 600,
      features: [
        '600 AI call minutes',
        '$0.14 per minute',
        'Multi-channel support',
        'Custom voice tone',
        'Priority support',
        'Advanced analytics',
        'Call recordings'
      ],
      popular: true,
      paymentLink: 'https://flutterwave.com/pay/gickbfzxhjyt'
    },
    {
      name: 'Enterprise',
      price: 180,
      minutes: 2000,
      features: [
        '2,000+ AI call minutes',
        '$0.11 per minute',
        'Custom integrations & branding',
        'Dedicated voice model',
        'API access',
        'Dedicated account manager',
        'SLA guarantees'
      ],
      popular: false,
      paymentLink: 'https://flutterwave.com/pay/fw9btqrzmeq8'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Upgrade Your CallWaiting AI
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Get unlimited AI receptionist capabilities and never miss another important call.
        </p>
      </div>

      {/* Trial Status */}
      {trialStatus && trialSummary && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Your Free Trial Status
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{trialStatus.minutesUsed.toFixed(1)} / {(trialStatus.minutesUsed + trialStatus.minutesRemaining).toFixed(1)} minutes used</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{trialSummary.daysRemaining} days remaining</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {trialStatus.minutesRemaining.toFixed(1)} min left
              </div>
              <div className="text-sm text-slate-400">in your trial</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (trialStatus.minutesUsed / trialSummary.totalMinutes) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative bg-slate-800 rounded-lg border p-8 ${
              plan.popular 
                ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
                : 'border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-cyan-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-cyan-400 mb-1">
                ${plan.price}
                <span className="text-lg text-slate-400">/month</span>
              </div>
              <div className="text-slate-400">{plan.minutes} minutes included</div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {plan.name === 'Trial' ? (
              <div className="w-full py-3 px-6 rounded-lg font-semibold bg-slate-600 text-slate-400 text-center">
                Current Plan
              </div>
            ) : (
              <a
                href={plan.paymentLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors inline-block text-center ${
                  plan.popular
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                Choose {plan.name}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Why Upgrade from Free Trial?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Unlimited Minutes</h3>
                <p className="text-slate-400 text-sm">
                  No more worrying about running out of trial minutes. Handle unlimited calls.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Multiple Phone Numbers</h3>
                <p className="text-slate-400 text-sm">
                  Add multiple business lines and route calls to different AI agents.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Advanced Features</h3>
                <p className="text-slate-400 text-sm">
                  Access WhatsApp integration, custom call flows, and lead management.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Priority Support</h3>
                <p className="text-slate-400 text-sm">
                  Get faster response times and dedicated support for your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-white mb-2">
              What happens when my free trial expires?
            </h3>
            <p className="text-slate-400 text-sm">
              Your AI agents will stop answering calls until you upgrade to a paid plan. 
              You can upgrade at any time to continue using the service.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-2">
              Can I change my plan later?
            </h3>
            <p className="text-slate-400 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. 
              Changes take effect immediately and billing is prorated.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-slate-400 text-sm">
              We accept all major credit cards, PayPal, and bank transfers. 
              All payments are processed securely through our payment partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
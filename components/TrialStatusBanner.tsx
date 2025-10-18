'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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

interface CallEligibility {
  canCall: boolean;
  reason?: string;
  trialStatus?: TrialStatus;
}

const TrialStatusBanner: React.FC = () => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [trialSummary, setTrialSummary] = useState<TrialSummary | null>(null);
  const [callEligibility, setCallEligibility] = useState<CallEligibility | null>(null);
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
        setCallEligibility(data.callEligibility);
      }
    } catch (error) {
      console.error('Error fetching trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!trialStatus || !trialSummary) {
    return null;
  }

  // Don't show banner if user has active paid subscription
  if (callEligibility?.canCall && callEligibility.reason === 'paid_subscription') {
    return null;
  }

  const getBannerType = () => {
    if (trialStatus.hasExpired) return 'expired';
    if (trialStatus.minutesRemaining === 0) return 'exhausted';
    if (trialStatus.minutesRemaining <= 1) return 'warning';
    return 'active';
  };

  const bannerType = getBannerType();

  const getBannerContent = () => {
    switch (bannerType) {
      case 'expired':
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          title: 'Free Trial Expired',
          message: 'Your 5-minute free trial has expired. Upgrade to continue using CallWaiting AI.',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-700',
          textColor: 'text-red-300'
        };
      case 'exhausted':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          title: 'Free Trial Complete',
          message: 'You\'ve used all 5 minutes of your free trial. Upgrade to continue making calls.',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-700',
          textColor: 'text-yellow-300'
        };
      case 'warning':
        return {
          icon: <Clock className="w-5 h-5 text-orange-400" />,
          title: 'Free Trial Almost Complete',
          message: `Only ${trialStatus.minutesRemaining.toFixed(1)} minutes remaining in your free trial.`,
          bgColor: 'bg-orange-900/20',
          borderColor: 'border-orange-700',
          textColor: 'text-orange-300'
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          title: 'Free Trial Active',
          message: `You have ${trialStatus.minutesRemaining.toFixed(1)} minutes remaining in your free trial.`,
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-700',
          textColor: 'text-green-300'
        };
    }
  };

  const banner = getBannerContent();

  return (
    <div className={`rounded-lg border p-4 mb-6 ${banner.bgColor} ${banner.borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {banner.icon}
          <div>
            <h3 className={`font-semibold ${banner.textColor}`}>
              {banner.title}
            </h3>
            <p className={`text-sm mt-1 ${banner.textColor}`}>
              {banner.message}
            </p>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Used: {trialStatus.minutesUsed.toFixed(1)} min</span>
                <span>Remaining: {trialStatus.minutesRemaining.toFixed(1)} min</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    bannerType === 'expired' || bannerType === 'exhausted' 
                      ? 'bg-red-500' 
                      : bannerType === 'warning' 
                        ? 'bg-orange-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (trialStatus.minutesUsed / trialSummary.totalMinutes) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Days remaining */}
            {trialSummary.daysRemaining > 0 && (
              <p className={`text-xs mt-2 ${banner.textColor}`}>
                {trialSummary.daysRemaining} days remaining to use your trial
              </p>
            )}
          </div>
        </div>

        {/* Upgrade button */}
        <div className="flex-shrink-0 ml-4">
          <Link
            href="/dashboard/upgrade"
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              bannerType === 'expired' || bannerType === 'exhausted'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : bannerType === 'warning'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrialStatusBanner;

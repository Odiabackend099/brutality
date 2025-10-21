// Free Trial Management System
// 5 minutes free for every user before upgrade prompt

import { getAdminService } from '@/lib/services/admin-service'

export interface FreeTrialStatus {
  isActive: boolean;
  minutesUsed: number;
  minutesRemaining: number;
  expiresAt: Date | null;
  hasExpired: boolean;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  minutes_used: number;
  call_duration: number;
  created_at: Date;
  trial_usage: boolean;
}

const FREE_TRIAL_MINUTES = 5; // 5 minutes free trial (as requested)
const TRIAL_DURATION_DAYS = 30; // 30 days to use the trial

export class FreeTrialManager {
  /**
   * Check if user is eligible for free trial
   */
  static async isEligibleForTrial(userId: string): Promise<boolean> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Check if user has ever used the service
      const { data: usage } = await supabase
        .from('usage_logs')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      // If no usage records, they're eligible
      return !usage || usage.length === 0;
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      return false;
    }
  }

  /**
   * Get user's free trial status
   */
  static async getTrialStatus(userId: string): Promise<FreeTrialStatus> {
    try {
      const adminService = getAdminService();
      return await adminService.getTrialStatus(userId);
    } catch (error) {
      console.error('Error getting trial status:', error);
      return {
        isActive: false,
        minutesUsed: 0,
        minutesRemaining: 0,
        expiresAt: null,
        hasExpired: true
      };
    }
  }

  /**
   * Record trial usage
   */
  static async recordTrialUsage(userId: string, callDurationSeconds: number): Promise<boolean> {
    try {
      const adminService = getAdminService();
      return await adminService.recordTrialUsage(userId, callDurationSeconds);
    } catch (error) {
      console.error('Error recording trial usage:', error);
      return false;
    }
  }

  /**
   * Initialize trial for new user
   */
  static async initializeTrial(userId: string): Promise<boolean> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const expiresAt = new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from('trial_usage')
        .insert({
          user_id: userId,
          minutes_used: 0,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        console.error('Error initializing trial:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error initializing trial:', error);
      return false;
    }
  }

  /**
   * Check if user can make a call (trial or paid)
   */
  static async canMakeCall(userId: string): Promise<{ canCall: boolean; reason?: string; trialStatus?: FreeTrialStatus }> {
    try {
      const adminService = getAdminService();
      const result = await adminService.canUserMakeCall(userId);
      
      if (result.canCall) {
        return { canCall: true };
      } else {
        // Get trial status for additional context
        const trialStatus = await this.getTrialStatus(userId);
        return { 
          canCall: false, 
          reason: result.reason || 'No active subscription. Please upgrade to continue.',
          trialStatus 
        };
      }
    } catch (error) {
      console.error('Error checking call eligibility:', error);
      return { canCall: false, reason: 'Error checking eligibility. Please try again.' };
    }
  }

  /**
   * Get trial usage summary for dashboard
   */
  static async getTrialSummary(userId: string): Promise<{
    totalMinutes: number;
    usedMinutes: number;
    remainingMinutes: number;
    daysRemaining: number;
    isActive: boolean;
  }> {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('minutes_quota, minutes_used, plan, created_at')
        .eq('id', userId)
        .single();

      if (!profile) {
        return {
          totalMinutes: 0,
          usedMinutes: 0,
          remainingMinutes: 0,
          daysRemaining: 0,
          isActive: false
        };
      }

      // For paid users, use their plan minutes
      if (profile.plan && profile.plan !== 'trial') {
        const totalMinutes = profile.minutes_quota || 0;
        const usedMinutes = profile.minutes_used || 0;
        const remainingMinutes = Math.max(0, totalMinutes - usedMinutes);
        
        return {
          totalMinutes,
          usedMinutes,
          remainingMinutes,
          daysRemaining: 30, // Assume monthly plans
          isActive: true
        };
      }

      // For trial users, use 5-minute free trial
      const trialStatus = await this.getTrialStatus(userId);
      const daysRemaining = trialStatus.expiresAt 
        ? Math.max(0, Math.ceil((trialStatus.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        totalMinutes: FREE_TRIAL_MINUTES,
        usedMinutes: trialStatus.minutesUsed,
        remainingMinutes: trialStatus.minutesRemaining,
        daysRemaining,
        isActive: trialStatus.isActive
      };
    } catch (error) {
      console.error('Error getting trial summary:', error);
      return {
        totalMinutes: 0,
        usedMinutes: 0,
        remainingMinutes: 0,
        daysRemaining: 0,
        isActive: false
      };
    }
  }
}

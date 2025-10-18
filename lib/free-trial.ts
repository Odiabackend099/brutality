// Free Trial Management System
// 5 minutes free for every user before upgrade prompt

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
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Get user's profile to check existing minutes
      const { data: profile } = await supabase
        .from('profiles')
        .select('minutes_quota, minutes_used, plan, created_at')
        .eq('id', userId)
        .single();

      if (!profile) {
        return {
          isActive: false,
          minutesUsed: 0,
          minutesRemaining: 0,
          expiresAt: null,
          hasExpired: true
        };
      }

      // Check if user has a paid plan
      if (profile.plan && profile.plan !== 'trial') {
        return {
          isActive: true,
          minutesUsed: profile.minutes_used || 0,
          minutesRemaining: (profile.minutes_quota || 0) - (profile.minutes_used || 0),
          expiresAt: null,
          hasExpired: false
        };
      }

      // For trial users, check if they're within the 5-minute free trial
      const minutesUsed = profile.minutes_used || 0;
      const isWithinFreeTrial = minutesUsed < FREE_TRIAL_MINUTES;
      const trialExpiresAt = new Date(profile.created_at);
      trialExpiresAt.setDate(trialExpiresAt.getDate() + TRIAL_DURATION_DAYS);
      const hasExpired = new Date() > trialExpiresAt;

      return {
        isActive: isWithinFreeTrial && !hasExpired,
        minutesUsed,
        minutesRemaining: Math.max(0, FREE_TRIAL_MINUTES - minutesUsed),
        expiresAt: trialExpiresAt,
        hasExpired
      };
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
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const callDurationMinutes = callDurationSeconds / 60;

      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('minutes_used, plan')
        .eq('id', userId)
        .single();

      if (!profile) {
        return false;
      }

      // Check if user has paid plan (unlimited usage)
      if (profile.plan && profile.plan !== 'trial') {
        // Update minutes used for paid users
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            minutes_used: (profile.minutes_used || 0) + callDurationMinutes
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating profile usage:', updateError);
          return false;
        }

        return true;
      }

      // For trial users, check if they're within the 5-minute limit
      const currentMinutesUsed = profile.minutes_used || 0;
      if (currentMinutesUsed + callDurationMinutes > FREE_TRIAL_MINUTES) {
        return false; // Would exceed trial limit
      }

      // Update minutes used in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          minutes_used: currentMinutesUsed + callDurationMinutes
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating trial usage:', updateError);
        return false;
      }

      // Record in usage_logs for detailed tracking
      const { error: usageError } = await supabase
        .from('usage_logs')
        .insert({
          user_id: userId,
          agent_id: userId, // Use user_id as agent_id for trial users
          kind: 'inference',
          seconds: callDurationSeconds,
          cost_cents: 0, // Free trial
          meta: { trial_usage: true }
        });

      if (usageError) {
        console.error('Error recording usage log:', usageError);
      }

      return true;
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
        return { canCall: false, reason: 'User profile not found.' };
      }

      // Check if user has paid plan
      if (profile.plan && profile.plan !== 'trial') {
        // Check if they have minutes remaining
        const minutesRemaining = (profile.minutes_quota || 0) - (profile.minutes_used || 0);
        if (minutesRemaining > 0) {
          return { canCall: true };
        } else {
          return { canCall: false, reason: 'No minutes remaining in your plan. Please upgrade to continue.' };
        }
      }

      // For trial users, check 5-minute limit
      const trialStatus = await this.getTrialStatus(userId);
      
      if (trialStatus.isActive) {
        return { canCall: true, trialStatus };
      }

      if (trialStatus.hasExpired) {
        return { canCall: false, reason: 'Free trial has expired. Please upgrade to continue.', trialStatus };
      }

      if (trialStatus.minutesUsed >= FREE_TRIAL_MINUTES) {
        return { canCall: false, reason: 'Free trial minutes exhausted. Please upgrade to continue.', trialStatus };
      }

      return { canCall: false, reason: 'No active subscription. Please upgrade to continue.', trialStatus };
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

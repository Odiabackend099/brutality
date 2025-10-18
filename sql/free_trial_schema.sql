-- Free Trial System Schema
-- 5 minutes free for every user before upgrade prompt

-- Trial usage tracking table
CREATE TABLE IF NOT EXISTS trial_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  minutes_used DECIMAL(10,2) DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage logs table for detailed tracking
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  minutes_used DECIMAL(10,2) NOT NULL,
  call_duration INTEGER NOT NULL, -- in seconds
  trial_usage BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trial_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trial_usage
CREATE POLICY "Users can view own trial usage" ON trial_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own trial usage" ON trial_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own trial usage" ON trial_usage
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for usage_logs
CREATE POLICY "Users can view own usage logs" ON usage_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage logs" ON usage_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trial_usage_user_id ON trial_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_usage_expires_at ON trial_usage(expires_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_trial_usage ON usage_logs(trial_usage);

-- Function to automatically initialize trial for new users
CREATE OR REPLACE FUNCTION initialize_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert trial usage record for new user
  INSERT INTO trial_usage (user_id, minutes_used, expires_at)
  VALUES (
    NEW.id,
    0,
    NOW() + INTERVAL '30 days'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-initialize trial for new users
DROP TRIGGER IF EXISTS trigger_initialize_user_trial ON auth.users;
CREATE TRIGGER trigger_initialize_user_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_trial();

-- Function to check if user can make a call
CREATE OR REPLACE FUNCTION can_user_make_call(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  trial_record RECORD;
  subscription_record RECORD;
  result JSON;
BEGIN
  -- Get trial usage
  SELECT * INTO trial_record
  FROM trial_usage
  WHERE user_id = user_uuid;
  
  -- Check if trial is active and has minutes remaining
  IF trial_record IS NOT NULL AND 
     trial_record.expires_at > NOW() AND 
     trial_record.minutes_used < 5 THEN
    result := json_build_object(
      'can_call', true,
      'reason', 'free_trial',
      'minutes_remaining', 5 - trial_record.minutes_used
    );
    RETURN result;
  END IF;
  
  -- Check for active subscription
  SELECT * INTO subscription_record
  FROM subscriptions
  WHERE user_id = user_uuid AND status = 'active';
  
  IF subscription_record IS NOT NULL THEN
    result := json_build_object(
      'can_call', true,
      'reason', 'paid_subscription'
    );
    RETURN result;
  END IF;
  
  -- No trial or subscription
  result := json_build_object(
    'can_call', false,
    'reason', 'no_trial_or_subscription'
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record trial usage
CREATE OR REPLACE FUNCTION record_trial_usage(
  user_uuid UUID,
  call_duration_seconds INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  call_duration_minutes DECIMAL(10,2);
  current_usage DECIMAL(10,2);
BEGIN
  call_duration_minutes := call_duration_seconds / 60.0;
  
  -- Get current usage
  SELECT minutes_used INTO current_usage
  FROM trial_usage
  WHERE user_id = user_uuid;
  
  -- Check if trial is still active and has minutes remaining
  IF current_usage IS NULL OR 
     current_usage + call_duration_minutes > 5 OR
     (SELECT expires_at FROM trial_usage WHERE user_id = user_uuid) <= NOW() THEN
    RETURN false;
  END IF;
  
  -- Update trial usage
  UPDATE trial_usage
  SET minutes_used = minutes_used + call_duration_minutes,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Record in usage logs
  INSERT INTO usage_logs (user_id, minutes_used, call_duration, trial_usage)
  VALUES (user_uuid, call_duration_minutes, call_duration_seconds, true);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Free trial system created successfully!' as result;

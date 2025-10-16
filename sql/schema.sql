-- CallWaiting AI MDP Backend Schema
-- Run this in your Supabase SQL editor

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  minutes_quota integer NOT NULL DEFAULT 60,
  minutes_used integer NOT NULL DEFAULT 0,
  plan text NOT NULL DEFAULT 'trial',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  system_prompt text NOT NULL,
  voice_id text NOT NULL,
  api_key text NOT NULL UNIQUE,
  webhook_secret text NOT NULL,
  webhook_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Usage logs table
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('tts', 'inference')),
  seconds integer NOT NULL DEFAULT 0,
  cost_cents integer NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flutterwave_customer_id text,
  flutterwave_transaction_id text,
  flutterwave_tx_ref text,
  plan text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'inactive',
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_api_key ON public.agents(api_key);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_agent_id ON public.usage_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_flutterwave_tx_ref ON public.subscriptions(flutterwave_tx_ref);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS p_profiles_select ON public.profiles;
CREATE POLICY p_profiles_select ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS p_profiles_update ON public.profiles;
CREATE POLICY p_profiles_update ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Agents policies
DROP POLICY IF EXISTS p_agents_select ON public.agents;
CREATE POLICY p_agents_select ON public.agents 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS p_agents_insert ON public.agents;
CREATE POLICY p_agents_insert ON public.agents 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS p_agents_update ON public.agents;
CREATE POLICY p_agents_update ON public.agents 
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS p_agents_delete ON public.agents;
CREATE POLICY p_agents_delete ON public.agents 
  FOR DELETE USING (auth.uid() = user_id);

-- Usage logs policies
DROP POLICY IF EXISTS p_usage_select ON public.usage_logs;
CREATE POLICY p_usage_select ON public.usage_logs 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS p_usage_insert ON public.usage_logs;
CREATE POLICY p_usage_insert ON public.usage_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
DROP POLICY IF EXISTS p_subs_select ON public.subscriptions;
CREATE POLICY p_subs_select ON public.subscriptions 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS p_subs_update ON public.subscriptions;
CREATE POLICY p_subs_update ON public.subscriptions 
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to increment minutes
CREATE OR REPLACE FUNCTION public.increment_minutes_used(user_id uuid, minutes_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET minutes_used = minutes_used + minutes_to_add,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


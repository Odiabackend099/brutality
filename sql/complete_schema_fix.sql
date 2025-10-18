-- Complete Database Schema Fix
-- Run this in Supabase SQL Editor to create all tables and fix all issues

-- First, create the agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  system_prompt TEXT,
  voice_id TEXT,
  api_key TEXT UNIQUE,
  webhook_secret TEXT,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  twilio_sid TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create call_flows table
CREATE TABLE IF NOT EXISTS call_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  flow_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  twilio_call_sid TEXT UNIQUE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  transcript TEXT,
  lead_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_number TEXT NOT NULL,
  message TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT DEFAULT 'sent',
  lead_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own agents" ON agents;
DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
DROP POLICY IF EXISTS "Users can update own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete own agents" ON agents;

DROP POLICY IF EXISTS "Users can view own phone numbers" ON phone_numbers;
DROP POLICY IF EXISTS "Users can insert own phone numbers" ON phone_numbers;
DROP POLICY IF EXISTS "Users can update own phone numbers" ON phone_numbers;
DROP POLICY IF EXISTS "Users can delete own phone numbers" ON phone_numbers;

DROP POLICY IF EXISTS "Users can view own call flows" ON call_flows;
DROP POLICY IF EXISTS "Users can insert own call flows" ON call_flows;
DROP POLICY IF EXISTS "Users can update own call flows" ON call_flows;
DROP POLICY IF EXISTS "Users can delete own call flows" ON call_flows;

DROP POLICY IF EXISTS "Users can view own call logs" ON call_logs;
DROP POLICY IF EXISTS "Users can insert own call logs" ON call_logs;
DROP POLICY IF EXISTS "Users can update own call logs" ON call_logs;

DROP POLICY IF EXISTS "Users can view own whatsapp messages" ON whatsapp_messages;
DROP POLICY IF EXISTS "Users can insert own whatsapp messages" ON whatsapp_messages;

-- Create RLS Policies for agents
CREATE POLICY "Users can view own agents" ON agents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own agents" ON agents
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own agents" ON agents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own agents" ON agents
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS Policies for phone_numbers
CREATE POLICY "Users can view own phone numbers" ON phone_numbers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own phone numbers" ON phone_numbers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own phone numbers" ON phone_numbers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own phone numbers" ON phone_numbers
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS Policies for call_flows
CREATE POLICY "Users can view own call flows" ON call_flows
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call flows" ON call_flows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call flows" ON call_flows
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own call flows" ON call_flows
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS Policies for call_logs
CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call logs" ON call_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call logs" ON call_logs
  FOR UPDATE USING (user_id = auth.uid());

-- Create RLS Policies for whatsapp_messages
CREATE POLICY "Users can view own whatsapp messages" ON whatsapp_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own whatsapp messages" ON whatsapp_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_api_key ON agents(api_key);

CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id ON phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_agent_id ON phone_numbers(agent_id);

CREATE INDEX IF NOT EXISTS idx_call_flows_user_id ON call_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_agent_id ON call_flows(agent_id);

CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON call_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_twilio_sid ON call_logs(twilio_call_sid);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);

-- Verify all tables were created successfully
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('agents', 'phone_numbers', 'call_flows', 'call_logs', 'whatsapp_messages')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Show table creation summary
SELECT 
  'Database schema created successfully!' as status,
  COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_name IN ('agents', 'phone_numbers', 'call_flows', 'call_logs', 'whatsapp_messages')
  AND table_schema = 'public';

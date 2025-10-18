-- Simple Database Schema Fix
-- Run this in Supabase SQL Editor to create all tables

-- Create agents table
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

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can manage own agents" ON agents
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own phone numbers" ON phone_numbers
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own call flows" ON call_flows
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own call logs" ON call_logs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own whatsapp messages" ON whatsapp_messages
  FOR ALL USING (user_id = auth.uid());

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id ON phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_user_id ON call_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);

-- Success message
SELECT 'Database schema created successfully!' as result;

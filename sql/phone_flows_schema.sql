-- Phone Numbers, Call Flows, and WhatsApp Integration Schema
-- Run this in Supabase SQL Editor

-- Phone Numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  twilio_sid TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call Flows table
CREATE TABLE IF NOT EXISTS call_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  flow_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call Logs table
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

-- WhatsApp Messages table
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

-- RLS Policies for phone_numbers
CREATE POLICY "Users can view own phone numbers" ON phone_numbers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own phone numbers" ON phone_numbers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own phone numbers" ON phone_numbers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own phone numbers" ON phone_numbers
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for call_flows
CREATE POLICY "Users can view own call flows" ON call_flows
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call flows" ON call_flows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call flows" ON call_flows
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own call flows" ON call_flows
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for call_logs
CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call logs" ON call_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call logs" ON call_logs
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for whatsapp_messages
CREATE POLICY "Users can view own whatsapp messages" ON whatsapp_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own whatsapp messages" ON whatsapp_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id ON phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_agent_id ON phone_numbers(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_user_id ON call_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_agent_id ON call_flows(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON call_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);

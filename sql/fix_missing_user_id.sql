-- Fix missing user_id columns in existing tables
-- Run this in Supabase SQL Editor

-- Check if tables exist and add user_id column if missing
DO $$
BEGIN
    -- Add user_id to phone_numbers if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'phone_numbers') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'phone_numbers' AND column_name = 'user_id') THEN
            ALTER TABLE phone_numbers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Add user_id to call_flows if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_flows') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_flows' AND column_name = 'user_id') THEN
            ALTER TABLE call_flows ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Add user_id to call_logs if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_logs') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'user_id') THEN
            ALTER TABLE call_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    -- Add user_id to whatsapp_messages if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'whatsapp_messages') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'whatsapp_messages' AND column_name = 'user_id') THEN
            ALTER TABLE whatsapp_messages ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  twilio_sid TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  flow_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Drop existing policies if they exist
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

-- Create RLS Policies
CREATE POLICY "Users can view own phone numbers" ON phone_numbers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own phone numbers" ON phone_numbers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own phone numbers" ON phone_numbers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own phone numbers" ON phone_numbers
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own call flows" ON call_flows
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call flows" ON call_flows
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call flows" ON call_flows
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own call flows" ON call_flows
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own call logs" ON call_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own call logs" ON call_logs
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own whatsapp messages" ON whatsapp_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own whatsapp messages" ON whatsapp_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id ON phone_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_agent_id ON phone_numbers(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_user_id ON call_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_call_flows_agent_id ON call_flows(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_agent_id ON call_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);

-- Enable RLS on all tables
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

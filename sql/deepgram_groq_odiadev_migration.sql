-- Migration to add Deepgram + Groq + ODIADEV TTS support
-- Run this after applying the main schema

-- Add TTS and LLM configuration columns to agents table
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS tts_provider text DEFAULT 'odiadev',
  ADD COLUMN IF NOT EXISTS tts_voice_id text,
  ADD COLUMN IF NOT EXISTS greeting_message text,
  ADD COLUMN IF NOT EXISTS llm_provider text DEFAULT 'groq',
  ADD COLUMN IF NOT EXISTS llm_model text DEFAULT 'llama-3.1-70b-versatile',
  ADD COLUMN IF NOT EXISTS llm_temperature double precision DEFAULT 0.6,
  ADD COLUMN IF NOT EXISTS llm_max_tokens int DEFAULT 400;

-- Create conversation sessions table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  call_sid text UNIQUE,
  phone_number text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'ended', 'paused')),
  context jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create conversation messages table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES conversation_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  content text NOT NULL,
  audio_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_agent_id ON conversation_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_call_sid ON conversation_sessions(call_sid);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_status ON conversation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_session_id ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_role ON conversation_messages(role);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);

-- Update existing agents with default values
UPDATE agents 
SET 
  tts_provider = 'odiadev',
  tts_voice_id = COALESCE(tts_voice_id, 'marcus'),
  llm_provider = 'groq',
  llm_model = 'llama-3.1-70b-versatile',
  llm_temperature = 0.6,
  llm_max_tokens = 400
WHERE tts_provider IS NULL OR llm_provider IS NULL;

-- Add RLS policies for conversation tables
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own conversation sessions
CREATE POLICY "Users can access their own conversation sessions" ON conversation_sessions
  FOR ALL USING (
    agent_id IN (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can only access messages from their own sessions
CREATE POLICY "Users can access their own conversation messages" ON conversation_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM conversation_sessions 
      WHERE agent_id IN (
        SELECT id FROM agents WHERE user_id = auth.uid()
      )
    )
  );

-- Grant necessary permissions
GRANT ALL ON conversation_sessions TO authenticated;
GRANT ALL ON conversation_messages TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- CallWaiting AI - Lead Capture & Call Transcripts Schema
-- Run this in your Supabase SQL editor

-- ============================================================================
-- CALL TRANSCRIPTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  twilio_call_sid text UNIQUE NOT NULL,
  caller_number text,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of {role, content, timestamp}
  duration_seconds integer DEFAULT 0,
  lead_extracted jsonb, -- {name, phone, email, company, need}
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  lead_quality text CHECK (lead_quality IN ('hot', 'warm', 'cold')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- ENHANCE LEADS TABLE
-- ============================================================================

-- Add new columns to existing leads_callwaiting table
ALTER TABLE public.leads_callwaiting
  ADD COLUMN IF NOT EXISTS call_transcript_id uuid REFERENCES call_transcripts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS quality text CHECK (quality IN ('hot', 'warm', 'cold')),
  ADD COLUMN IF NOT EXISTS whatsapp_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS airtable_synced boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS airtable_record_id text;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_call_transcripts_twilio
  ON public.call_transcripts(twilio_call_sid);

CREATE INDEX IF NOT EXISTS idx_call_transcripts_user
  ON public.call_transcripts(user_id);

CREATE INDEX IF NOT EXISTS idx_call_transcripts_agent
  ON public.call_transcripts(agent_id) WHERE agent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_call_transcripts_created
  ON public.call_transcripts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_call_transcripts_quality
  ON public.call_transcripts(lead_quality) WHERE lead_quality IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_quality
  ON public.leads_callwaiting(quality) WHERE quality IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_call_transcript
  ON public.leads_callwaiting(call_transcript_id) WHERE call_transcript_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.call_transcripts ENABLE ROW LEVEL SECURITY;

-- Users can only view their own call transcripts
DROP POLICY IF EXISTS p_transcripts_select ON public.call_transcripts;
CREATE POLICY p_transcripts_select ON public.call_transcripts
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert transcripts (from webhook)
DROP POLICY IF EXISTS p_transcripts_insert ON public.call_transcripts;
CREATE POLICY p_transcripts_insert ON public.call_transcripts
  FOR INSERT WITH CHECK (true); -- Service role bypasses this anyway

-- Users can update their own transcripts
DROP POLICY IF EXISTS p_transcripts_update ON public.call_transcripts;
CREATE POLICY p_transcripts_update ON public.call_transcripts
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_call_transcripts_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_call_transcripts_updated_at
  ON public.call_transcripts;

CREATE TRIGGER trigger_update_call_transcripts_updated_at
  BEFORE UPDATE ON public.call_transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_call_transcripts_updated_at();

-- ============================================================================
-- HELPFUL VIEWS (OPTIONAL)
-- ============================================================================

-- View for hot leads with call transcripts
CREATE OR REPLACE VIEW hot_leads_with_calls AS
SELECT
  l.*,
  ct.transcript,
  ct.sentiment,
  ct.duration_seconds,
  ct.caller_number
FROM public.leads_callwaiting l
LEFT JOIN public.call_transcripts ct ON l.call_transcript_id = ct.id
WHERE l.quality = 'hot'
ORDER BY l.created_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON hot_leads_with_calls TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Lead capture schema created successfully!';
  RAISE NOTICE 'Tables: call_transcripts (new), leads_callwaiting (enhanced)';
  RAISE NOTICE 'Indexes: 7 performance indexes added';
  RAISE NOTICE 'RLS Policies: Active for user data protection';
END $$;

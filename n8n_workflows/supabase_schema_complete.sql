-- CallWaiting AI - Complete Supabase Database Schema
-- Run this in your Supabase SQL Editor

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business TEXT,
  message TEXT,
  source TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'paid', 'onboarding', 'setup_in_progress', 'active', 'churned')),
  plan TEXT CHECK (plan IN ('starter', 'pro')),
  paid_amount DECIMAL(10, 2),
  paid_at TIMESTAMPTZ,
  onboarding_sent BOOLEAN DEFAULT FALSE,
  onboarding_sent_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- ============================================
-- 2. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT NOT NULL UNIQUE,
  flw_ref TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'successful', 'failed', 'cancelled')),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  plan TEXT CHECK (plan IN ('starter', 'pro', 'unknown')),
  plan_name TEXT,
  payment_type TEXT,
  verified BOOLEAN DEFAULT FALSE,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- ============================================
-- 3. CUSTOMER_ONBOARDING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.customer_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email TEXT NOT NULL,
  business_overview TEXT,
  common_questions TEXT,
  booking_info TEXT,
  voice_tone TEXT,
  integration_channels TEXT,
  additional_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ
);

-- Index for customer_onboarding
CREATE INDEX IF NOT EXISTS idx_onboarding_email ON public.customer_onboarding(customer_email);
CREATE INDEX IF NOT EXISTS idx_onboarding_submitted ON public.customer_onboarding(submitted_at DESC);

-- ============================================
-- 4. CUSTOMERS TABLE (Active AI Users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  name TEXT,
  channel TEXT CHECK (channel IN ('whatsapp', 'tiktok', 'phone', 'instagram')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  first_contact TIMESTAMPTZ,
  last_contact TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  ai_config JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);

-- ============================================
-- 5. CONVERSATIONS TABLE (AI Chat Logs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_phone TEXT,
  customer_email TEXT,
  channel TEXT CHECK (channel IN ('whatsapp', 'tiktok', 'phone', 'instagram')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  message_in TEXT,
  message_out TEXT,
  ai_model TEXT,
  message_id TEXT,
  sentiment TEXT,
  tags TEXT[],
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_customer_phone ON public.conversations(customer_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON public.conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON public.conversations(channel);

-- ============================================
-- 6. ANALYTICS_EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL DEFAULT 'unknown',
  actor_email TEXT,
  actor_id UUID,
  payload JSONB,
  payload_hash TEXT GENERATED ALWAYS AS (md5(COALESCE(payload::TEXT, ''))) STORED,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON public.analytics_events(event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_actor ON public.analytics_events(actor_id, occurred_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for n8n)
CREATE POLICY IF NOT EXISTS "Service role full access - leads" ON public.leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access - payments" ON public.payments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access - onboarding" ON public.customer_onboarding
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access - customers" ON public.customers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access - conversations" ON public.conversations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role full access - analytics" ON public.analytics_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log analytics events
CREATE OR REPLACE FUNCTION log_analytics_event(
  event_name TEXT,
  source TEXT DEFAULT 'unknown',
  actor_email TEXT DEFAULT NULL,
  actor_id UUID DEFAULT NULL,
  payload JSONB DEFAULT '{}'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.analytics_events(event_name, source, actor_email, actor_id, payload, metadata)
  VALUES (event_name, source, actor_email, actor_id, payload, metadata)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- ============================================
-- SAMPLE DATA (Optional - Comment out for production)
-- ============================================

-- Insert sample lead (for testing)
-- INSERT INTO public.leads (name, email, phone, business, source, status)
-- VALUES ('Test User', 'test@example.com', '+1234567890', 'Test Business', 'landing_page', 'new')
-- ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT * FROM public.leads LIMIT 5;
-- SELECT * FROM public.payments LIMIT 5;

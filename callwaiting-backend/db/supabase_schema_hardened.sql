-- CallWaiting AI - Hardened Supabase Schema
-- CRITICAL: This fixes the original plan's security and reliability issues

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Payments table with SINGLE unique constraint for idempotency
create table if not exists public.payments_callwaiting (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  email text,
  amount numeric,
  currency text,  -- NEVER default this; read from Flutterwave
  plan text check (plan in ('starter', 'pro')),
  transaction_ref text,  -- NOT unique (Payment Links may not provide custom ref)
  flutterwave_id text not null unique,  -- AUTHORITATIVE idempotency key
  payment_link_id text,  -- NEW: store link ID for plan detection
  status text,
  verified boolean default false,
  payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table
create table if not exists public.leads_callwaiting (
  id uuid primary key default uuid_generate_v4(),
  name text,
  business text,
  contact text,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.payments_callwaiting enable row level security;
alter table public.leads_callwaiting enable row level security;

-- Service role policies (n8n uses service_role key)
-- NOTE: service_role BYPASSES RLS by design - keep key server-side only
create policy "payments_service_all"
  on public.payments_callwaiting
  for all
  to service_role
  using (true)
  with check (true);

create policy "leads_service_all"
  on public.leads_callwaiting
  for all
  to service_role
  using (true)
  with check (true);

-- Indexes for performance
create index idx_payments_email on public.payments_callwaiting(email);
create index idx_payments_status on public.payments_callwaiting(status);
create index idx_payments_txref on public.payments_callwaiting(transaction_ref) where transaction_ref is not null;
create index idx_payments_link on public.payments_callwaiting(payment_link_id) where payment_link_id is not null;
create index idx_payments_created on public.payments_callwaiting(created_at desc);
create index idx_leads_created on public.leads_callwaiting(created_at desc);

-- Trigger to update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_payments_updated_at
  before update on public.payments_callwaiting
  for each row
  execute function update_updated_at_column();

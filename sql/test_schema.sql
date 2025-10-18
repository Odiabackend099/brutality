-- Test database schema
-- Run this in Supabase SQL Editor to verify all tables exist with correct columns

-- Check if all tables exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('phone_numbers', 'call_flows', 'call_logs', 'whatsapp_messages')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('phone_numbers', 'call_flows', 'call_logs', 'whatsapp_messages')
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('phone_numbers', 'call_flows', 'call_logs', 'whatsapp_messages')
ORDER BY tablename, indexname;

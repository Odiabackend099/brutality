-- SUPABASE QUOTA CLEANUP SCRIPT
-- Run this in Supabase SQL Editor to free up space

-- 1. Delete old test users (keep only recent ones)
DELETE FROM auth.users 
WHERE created_at < NOW() - INTERVAL '7 days'
AND email LIKE '%test%';

-- 2. Delete old profiles
DELETE FROM public.profiles 
WHERE created_at < NOW() - INTERVAL '7 days'
AND email LIKE '%test%';

-- 3. Delete old test agents
DELETE FROM public.agents 
WHERE created_at < NOW() - INTERVAL '7 days'
AND name LIKE '%test%';

-- 4. Delete old call transcripts
DELETE FROM public.call_transcripts 
WHERE created_at < NOW() - INTERVAL '30 days';

-- 5. Delete old leads
DELETE FROM public.leads_callwaiting 
WHERE created_at < NOW() - INTERVAL '30 days';

-- 6. Delete old payments
DELETE FROM public.payments 
WHERE created_at < NOW() - INTERVAL '30 days'
AND status = 'failed';

-- 7. Delete old TTS usage records
DELETE FROM public.tts_usage 
WHERE created_at < NOW() - INTERVAL '30 days';

-- 8. Check current usage (VACUUM runs automatically in Supabase)
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

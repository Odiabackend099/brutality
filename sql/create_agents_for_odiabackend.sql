-- CREATE AGENTS FOR ODIABACKEND@GMAIL.COM
-- Run this in Supabase SQL Editor

-- First, get the user ID for odiabackend@gmail.com
-- (This will be used to create agents for the existing user)

-- Create agents for the existing user
INSERT INTO public.agents (
  id,
  user_id,
  name,
  system_prompt,
  voice_id,
  api_key,
  webhook_secret,
  webhook_url,
  is_active,
  created_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'odiabackend@gmail.com' LIMIT 1),
  'CallWaiting AI - Marcus Voice',
  'You are Marcus, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, and provide information about our services. Always be friendly, professional, and helpful.',
  'moss_audio_a59cd561-ab87-11f0-a74c-2a7a0b4baedc',
  'cw_marcus_' || substr(md5(random()::text), 1, 16),
  'webhook_secret_' || substr(md5(random()::text), 1, 16),
  'https://callwaitingai.dev/api/agent/webhook',
  true,
  now()
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'odiabackend@gmail.com' LIMIT 1),
  'CallWaiting AI - Marcy Voice',
  'You are Marcy, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, and provide information about our services. Always be friendly, professional, and helpful.',
  'moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a',
  'cw_marcy_' || substr(md5(random()::text), 1, 16),
  'webhook_secret_' || substr(md5(random()::text), 1, 16),
  'https://callwaitingai.dev/api/agent/webhook',
  true,
  now()
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'odiabackend@gmail.com' LIMIT 1),
  'CallWaiting AI - Austyn Voice',
  'You are Austyn, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, and provide information about our services. Always be friendly, professional, and helpful.',
  'moss_audio_4e6eb029-ab89-11f0-a74c-2a7a0b4baedc',
  'cw_austyn_' || substr(md5(random()::text), 1, 16),
  'webhook_secret_' || substr(md5(random()::text), 1, 16),
  'https://callwaitingai.dev/api/agent/webhook',
  true,
  now()
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'odiabackend@gmail.com' LIMIT 1),
  'CallWaiting AI - Joslyn Voice',
  'You are Joslyn, a professional AI receptionist for CallWaiting AI. You help customers with inquiries, take messages, and provide information about our services. Always be friendly, professional, and helpful.',
  'moss_audio_141d8c4c-a6f8-11f0-84c1-0ec6fa858d82',
  'cw_joslyn_' || substr(md5(random()::text), 1, 16),
  'webhook_secret_' || substr(md5(random()::text), 1, 16),
  'https://callwaitingai.dev/api/agent/webhook',
  true,
  now()
);

-- Note: Phone numbers and call flows can be configured through the dashboard

-- Verify the agents were created
SELECT 
  a.name,
  a.voice_id,
  a.api_key,
  a.is_active,
  a.created_at
FROM public.agents a
WHERE a.user_id = (SELECT id FROM auth.users WHERE email = 'odiabackend@gmail.com' LIMIT 1)
ORDER BY a.created_at;

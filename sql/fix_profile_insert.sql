-- Fix: Add missing INSERT policy for profiles table
-- This allows the trigger to create profile records when users sign up

-- Add INSERT policy for profiles (allows users to create their own profile)
DROP POLICY IF EXISTS p_profiles_insert ON public.profiles;
CREATE POLICY p_profiles_insert ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify all policies are in place
-- Run this to check:
-- SELECT schemaname, tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'profiles';

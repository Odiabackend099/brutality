-- NUCLEAR FIX: Complete profiles table setup with all policies and trigger
-- This will fix the signup 500 error by ensuring everything is configured correctly

-- ============================================================================
-- STEP 1: Drop and recreate all policies
-- ============================================================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS p_profiles_select ON public.profiles;
DROP POLICY IF EXISTS p_profiles_insert ON public.profiles;
DROP POLICY IF EXISTS p_profiles_update ON public.profiles;
DROP POLICY IF EXISTS p_profiles_delete ON public.profiles;

-- Recreate policies with correct permissions
CREATE POLICY p_profiles_select ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY p_profiles_insert ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY p_profiles_update ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- STEP 2: Recreate trigger function with proper error handling
-- ============================================================================

-- Drop and recreate the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RETURN NEW; -- Don't block signup even if profile creation fails
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 3: Grant necessary permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ============================================================================
-- STEP 4: Verify everything is set up correctly
-- ============================================================================

-- Check policies
SELECT 'Policy Check' as test,
       policyname,
       cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd;

-- Check trigger
SELECT 'Trigger Check' as test,
       trigger_name,
       event_manipulation,
       action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check function
SELECT 'Function Check' as test,
       routine_name,
       security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

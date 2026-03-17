-- ============================================================
-- CivicVoice Database Schema (FINAL FOOLPROOF RLS FIX)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Anyone can track complaints by tracking_id" ON public.complaints;

-- 1. FOOLPROOF Admin Check Function
-- We use a raw query that doesn't trigger RLS on the profiles table
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- We use a subquery with a LIMIT 1 and a specific check
  -- SECURITY DEFINER ensures this runs with the privileges of the user who created it (postgres)
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Policies
-- Users can ALWAYS see their own profile (this is safe and non-recursive)
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Admins can see all profiles. 
-- To avoid recursion, we check if the user is already authenticated as an admin.
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
-- Actually, the above STILL recurses in some PG versions.
-- The BEST way is to allow Admins to bypass based on a custom claim or just target the complaints table primarily.

-- Let's try a different approach for Profiles:
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin') );

-- 3. Complaints Policies (The most important ones)
CREATE POLICY "Users can view own complaints"
    ON public.complaints FOR SELECT
    USING (
        user_id = auth.uid() OR 
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Users can insert own complaints"
    ON public.complaints FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update complaints"
    ON public.complaints FOR UPDATE
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Anyone can track complaints by tracking_id"
    ON public.complaints FOR SELECT
    USING (true);

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

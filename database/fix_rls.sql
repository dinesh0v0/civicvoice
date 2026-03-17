-- ============================================================
-- CivicVoice Database Schema (FIXED RLS RECURSION)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Anyone can track complaints by tracking_id" ON public.complaints;

-- 1. Helper function to check if user is admin WITHOUT causing recursion
-- SECURITY DEFINER makes it run with creator privileges (bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  SELECT role = 'admin' INTO is_admin_user
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin_user, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. RLS Policies for profiles (Fixed)
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. RLS Policies for complaints (Fixed)
CREATE POLICY "Users can view own complaints"
    ON public.complaints FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own complaints"
    ON public.complaints FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update complaints"
    ON public.complaints FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Anyone can track complaints by tracking_id"
    ON public.complaints FOR SELECT
    USING (true);

-- 4. Auto-update Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_complaints_updated_at ON public.complaints;
CREATE TRIGGER update_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

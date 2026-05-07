-- Run this in Supabase SQL Editor to fix "permission denied for table parts"

-- Ensure table permissions exist in addition to RLS policies
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.parts TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

-- Remove conflicting/old policies
DROP POLICY IF EXISTS parts_select ON public.parts;
DROP POLICY IF EXISTS parts_update_manager ON public.parts;
DROP POLICY IF EXISTS parts_read_authenticated ON public.parts;
DROP POLICY IF EXISTS parts_update_authenticated ON public.parts;

-- Allow signed-in users to read parts
CREATE POLICY parts_read_authenticated
ON public.parts
FOR SELECT
TO authenticated
USING (true);

-- Allow signed-in users to update parts
-- (Use manager-only policy later once profile/auth is fully wired)
CREATE POLICY parts_update_authenticated
ON public.parts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS parts_insert_authenticated ON public.parts;
DROP POLICY IF EXISTS parts_delete_authenticated ON public.parts;

-- Allow signed-in users to insert parts
CREATE POLICY parts_insert_authenticated
ON public.parts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow signed-in users to delete parts
CREATE POLICY parts_delete_authenticated
ON public.parts
FOR DELETE
TO authenticated
USING (true);

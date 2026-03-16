-- Fix RLS Policies for Public Reviews (No Auth Required)
-- This allows users to insert and update reviews using only their email as identification, as requested.

-- 1. Drop old policies that required auth.jwt()
DROP POLICY IF EXISTS "Allow users to insert their own reviews" ON darkfeminine_reviews;
DROP POLICY IF EXISTS "Allow users to update their own reviews" ON darkfeminine_reviews;

-- 2. Create new public policies for anon/public users
-- Allow everyone to insert
CREATE POLICY "Allow public insert access to reviews" ON public.darkfeminine_reviews
  FOR INSERT TO public
  WITH CHECK (true);

-- Allow everyone to update (logic is handled by email matching in the app)
CREATE POLICY "Allow public update access to reviews" ON public.darkfeminine_reviews
  FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

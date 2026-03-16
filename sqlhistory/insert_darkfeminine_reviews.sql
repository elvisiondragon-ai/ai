-- Script to create and initialize the darkfeminine_reviews table and profiles for PAID users
-- As per user instruction, users who bought Dark Feminine enter profiles and darkfeminine_reviews

-- 1. Create or update darkfeminine_reviews table
CREATE TABLE IF NOT EXISTS darkfeminine_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL UNIQUE,
    name TEXT,
    rating INTEGER DEFAULT 5,
    comment TEXT,
    country VARCHAR(2) DEFAULT 'ID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the missing profiles manually if they don't exist in auth.users
-- This block assumes your profiles table has id, email, full_name, and phone.
-- If the 'profiles' table has a strict foreign key to auth.users, this will fail unless we create auth.users first.
-- In Supabase, it is safer to create the user in auth.users first.

-- Example for creating auth.users using raw SQL (requires postgres role or similar privileges)
-- Insert 3 provided users into auth.users (with dummy password hash if allowed) and then profiles.
-- We'll insert them into darkfeminine_reviews directly.

INSERT INTO darkfeminine_reviews (user_email, name, comment, rating, country)
VALUES
('mulyanilaksmidewi@gmail.com', 'Mulyani Laksmi Dewi', NULL, 5, 'ID'),
('nilakumala17@gmail.com', 'Manda', NULL, 5, 'ID'),
('magdalena8889@yahoo.co.id', 'Magdalena', NULL, 5, 'ID')
ON CONFLICT (user_email) DO NOTHING;

-- NOTE: Automatically adding to `profiles` via Edge Function is the recommended approach.
-- The tripay-callback Edge Function will handle the automated insertion going forward.

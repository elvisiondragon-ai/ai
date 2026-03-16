-- Migration: Add is_verified column to darkfeminine_reviews
-- Date: 2026-03-14

ALTER TABLE public.darkfeminine_reviews 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Update existing records that have a null comment (purchased but no review yet) to be verified
UPDATE public.darkfeminine_reviews 
SET is_verified = TRUE 
WHERE comment IS NULL;

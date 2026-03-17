-- Migration: Create darkfeminine_free lead table and cleanup logic
-- Date: 2026-03-17

CREATE TABLE IF NOT EXISTS public.darkfeminine_free (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.darkfeminine_free ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the landing page)
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.darkfeminine_free;
CREATE POLICY "Allow anonymous insert" ON public.darkfeminine_free 
FOR INSERT WITH CHECK (true);

-- Allow public select (optional, for verification)
DROP POLICY IF EXISTS "Allow public select" ON public.darkfeminine_free;
CREATE POLICY "Allow public select" ON public.darkfeminine_free 
FOR SELECT USING (true);

-- Cleanup Function: Removes lead if user becomes PAID
CREATE OR REPLACE FUNCTION public.fn_cleanup_darkfeminine_leads()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the status has changed to PAID
    IF NEW.status = 'PAID' THEN
        DELETE FROM public.darkfeminine_free 
        WHERE LOWER(user_email) = LOWER(NEW.email);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: When global_product status is updated to PAID
DROP TRIGGER IF EXISTS tr_cleanup_darkfeminine_leads ON public.global_product;
CREATE TRIGGER tr_cleanup_darkfeminine_leads
AFTER INSERT OR UPDATE OF status ON public.global_product
FOR EACH ROW
EXECUTE FUNCTION public.fn_cleanup_darkfeminine_leads();

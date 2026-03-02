CREATE TABLE IF NOT EXISTS public.darkfeminine_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    name TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.darkfeminine_reviews ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Enable read access for all users"
    ON public.darkfeminine_reviews FOR SELECT
    USING (true);

-- Allow insert access
CREATE POLICY "Enable insert for users based on email"
    ON public.darkfeminine_reviews FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        (SELECT email FROM auth.users WHERE id = auth.uid()) = user_email
    );

-- Allow update access
CREATE POLICY "Enable update for users based on email"
    ON public.darkfeminine_reviews FOR UPDATE
    USING (
        auth.role() = 'authenticated' AND
        (SELECT email FROM auth.users WHERE id = auth.uid()) = user_email
    );

-- Allow delete access
CREATE POLICY "Enable delete for users based on email"
    ON public.darkfeminine_reviews FOR DELETE
    USING (
        auth.role() = 'authenticated' AND
        (SELECT email FROM auth.users WHERE id = auth.uid()) = user_email
    );

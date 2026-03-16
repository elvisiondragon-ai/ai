
-- 1. Sync existing data: Mark all buyers who have PAID as verified
UPDATE public.darkfeminine_reviews r
SET is_verified = TRUE
FROM public.global_product p
WHERE r.user_email = p.email 
  AND p.status = 'PAID'
  AND (p.product_name ILIKE '%Dark Feminine%');

-- 2. CREATE a function to handle automated verification on future purchases
CREATE OR REPLACE FUNCTION public.sync_darkfeminine_verification()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the product is Dark Feminine and status is PAID
    IF (NEW.status = 'PAID' AND NEW.product_name ILIKE '%Dark Feminine%') THEN
        -- Update or Insert into darkfeminine_reviews
        INSERT INTO public.darkfeminine_reviews (user_email, name, rating, is_verified, country)
        VALUES (NEW.email, NEW.name, 5, TRUE, 'ID')
        ON CONFLICT (user_email) DO UPDATE 
        SET is_verified = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CREATE the trigger on global_product
DROP TRIGGER IF EXISTS tr_sync_darkfeminine_verification ON public.global_product;
CREATE TRIGGER tr_sync_darkfeminine_verification
AFTER UPDATE ON public.global_product
FOR EACH ROW
EXECUTE FUNCTION public.sync_darkfeminine_verification();

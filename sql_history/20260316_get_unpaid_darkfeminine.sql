-- SQL: Get all phone numbers and emails for UNPAID Dark Feminine orders
-- Purpose: Lead follow-up / CRM
-- Date: 2026-03-16

SELECT 
    created_at,
    name,
    phone,
    email,
    amount,
    tripay_reference,
    product_name
FROM public.global_product
WHERE status = 'UNPAID'
  AND (product_name ILIKE '%Dark Feminine%')
ORDER BY created_at DESC;

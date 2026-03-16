-- SQL to extract name and phone of "Feminine Magnetism" buyers
-- Created at: 2026-03-16
-- Table: global_product

-- VERSION 1: All buyers who purchased Feminine Magnetism
SELECT 
    name, 
    phone, 
    product_name, 
    created_at
FROM 
    global_product
WHERE 
    status = 'PAID'
    AND product_name ILIKE '%Feminine Magnetism%'
ORDER BY 
    created_at DESC;

-- VERSION 2: ONLY buyers who purchased Feminine Magnetism (no other products in the same record)
-- Based on the structure 'Feminine Magnetism (x1)', this handles exact matches.
SELECT 
    name, 
    phone, 
    product_name, 
    created_at
FROM 
    global_product
WHERE 
    status = 'PAID'
    AND product_name = 'Feminine Magnetism (x1)'
ORDER BY 
    created_at DESC;

# Report: USA Webinar Migration & Tracking Optimization
**Date:** 03/02/26 (Tuesday, February 3, 2026)
**Topic:** USA Webinar Setup, Migration, and CAPI Event Filtering

## Context
The goal was to migrate all USA-related landing pages from `elvisiongroup/` to the `ai/` project, implement a unified PayPal payment flow for new webinar products, and strictly optimize the Facebook Conversion API (CAPI) to prevent unauthorized event tracking.

## Issues Resolved
1. **Migration & Routing:** Moved all files from `elvisiongroup/src/pages/usa/` to `ai/src/usa/`. Fixed nested route patterns (e.g., `/usa/usa_paypal_finish`) to flat routes (e.g., `/usa_paypal_finish`) for better UX.
2. **Payment Integration:** 
   - Updated `tripay-create-payment` to include `usa_webinarhealth`, `usa_webinarfinance`, and `usa_webinarrelationship` in the product catalog.
   - Configured PayPal logic to handle these products at a $20.00 price point.
3. **Email Delivery:** Added new templates to `send-ebooks-email` for each webinar, including the WhatsApp group link and confirmation instructions.
4. **CAPI Bloat:** Discovered that sending unallowed events (PageView, ViewContent) to CAPI was causing Meta to count them anyway. Restricted `capi-universal` to only accept `Purchase`, `AddToCart`, and `AddPaymentInfo`.
5. **Deduplication:** Ensured `Purchase` events for USA products are triggered **only from the backend** (`tripay-callback`) to match the browser-side event ID perfectly without double-firing.
6. **Build Failures:** Resolved multiple TypeScript and syntax errors in the migrated files (unused imports, missing variables, broken component syntax).

## Changes Made

### Frontend (`ai/`)
- **`src/main.tsx`**: Added lazy imports, prefetching, and routes for all migrated USA pages.
- **`src/usa/usa_webhealth.tsx`**: Integrated PayPal flow, English interview videos, vertical YouTube Shorts testimonials, centered hero section, and real-time payment toast.
- **`src/usa/usa_webfinance.tsx`**: Added YouTube Shorts testimonials and fixed style prop syntax errors.
- **`src/usa/usa_webrelationship.tsx`**: Fully integrated with the new payment and tracking rules.
- **`src/utils/fbpixel.tsx`**: Updated `testcode_usa` mapping to `TEST84659`.
- **`assist_code/usa_setup_guide.md`**: Created a permanent reference for routes and tracking rules.

### Backend (`elvisiongroup/supabase/functions/`)
- **`tripay-create-payment`**: Expanded product catalog and PayPal amount logic.
- **`tripay-callback`**: Added CAPI support for new USA webinar products.
- **`send-ebooks-email`**: Added templates for Health, Finance, and Relationship webinars with specific instructions and group links.
- **`capi-universal`**: Added a strict filter to `allowedEvents` list.

## Verification Result
- **Build:** `npm run build` in `ai/` directory passed successfully (1904 modules transformed).
- **Routes:** Verified that all USA routes are flat and accessible.
- **Tracking:** Confirmed that `PageView` and `ViewContent` are browser-only, while `AddPaymentInfo` and `Purchase` use the optimized CAPI flow.

## 03/02/26-UsaWebinarSetup
Task successfully ended.

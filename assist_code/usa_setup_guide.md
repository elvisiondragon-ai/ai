# USA Routes & Tracking Guide

## Routes
The USA pages have been migrated to the `ai/` project and use flattened routes:
- `/usa_webhealth` -> Health Webinar LP
- `/usa_webfinance` -> Finance Webinar LP
- `/usa_webrelationship` -> Relationship Webinar LP
- `/usa_ebookslim` -> Slim Ebook LP
- `/usa_3000` -> VIP Coaching LP
- `/usa_pay3000` -> VIP Checkout
- `/usa_3000survey` -> VIP Survey
- `/usa_paypal` -> PayPal Installment
- `/usa_ebookhealth` -> Health Ebook LP
- `/usa_ebookfeminine` -> Feminine Ebook LP
- `/usa_paypal_finish` -> PayPal Callback/Finish Page

## Tracking Rules
1. **Browser Pixel (fbpixel.tsx):**
   - Use for `PageView` and `ViewContent`.
   - `testcode_usa` is mapped to `TEST84659`.
2. **Server-Side (CAPI):**
   - `capi-universal` Edge Function ONLY accepts: `Purchase`, `AddToCart`, `AddPaymentInfo`.
   - `Purchase` events MUST be triggered from the backend (`tripay-callback`) to ensure perfect deduplication.
   - Frontend should only call CAPI for `AddPaymentInfo` and `AddToCart`.

## Payment Integration
- All products use the unified `tripay-create-payment` and `tripay-callback` functions.
- PayPal is integrated for all USA products at a fixed $20.00 price point (except VIP products).
- Confirmation emails are handled by `send-ebooks-email` with templates for each webinar type.

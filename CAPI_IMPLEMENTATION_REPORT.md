# Facebook Pixel & Conversions API (CAPI) Integration Report

**Date:** January 27, 2026
**Objective:** Increase Event Match Quality by ensuring `external_id` (User ID) and `phone` parameters are sent with 100% of event instances (or as close as possible) via Server-Side tracking.

---

## 1. Implementation in `ebook_langsing.tsx` (Diet Program)
The Diet Program checkout page was previously missing server-side tracking logic. I have upgraded it to match the high-quality standards of your other products:
*   **Added `sendCapiEvent` Helper:** This function now sends events to your `capi-universal` Supabase Edge Function.
*   **Automatic Data Extraction:** The system now automatically pulls the `external_id` (Supabase UID) and `phone` number from two sources:
    1.  **Form Inputs:** Captured immediately when the user types their details.
    2.  **Auth Metadata:** Captured if the user is already logged in.
*   **Full Funnel Tracking:** 
    *   `PageView` & `ViewContent`: Fired on load with CAPI support.
    *   `AddPaymentInfo`: Fired when the user clicks "Bayar Sekarang," sending the hashed phone and external ID.
    *   `Purchase`: Fired via a Realtime listener once the payment status changes to `PAID`. It includes deduplication logic to prevent double-firing if the backend already sent the event.

## 2. Optimization in `vip_15jt.tsx` (VIP Coaching)
I identified and fixed several critical issues on the high-ticket landing page:
*   **Fixed Initialization Bug:** Found a hardcoded access token being passed as a Pixel ID; replaced it with the correct Pixel ID (`3319324491540889`) and used the standard `initFacebookPixelWithLogging` utility.
*   **Added Lead Tracking:** Implemented a `Contact` event trigger on the "BOOK SEKARANG" (WhatsApp) button. This sends the user's `external_id` (if logged in) to Facebook via CAPI, marking them as a high-value lead.
*   **Standardized PageView:** Updated the page to use the central tracking utility, ensuring `fbc` and `fbp` cookies are captured and sent server-side.

## 3. Technical Enhancements & Hashing
*   **Hashed Parameters:** All PII (Personally Identifiable Information) like Phone and Email are SHA-256 hashed in the frontend using `src/utils/fbpixel.tsx` before being sent to the Meta Pixel, while the CAPI function receives raw data to be processed securely in the Edge Function.
*   **Deduplication:** Ensured all client-side events include an `eventID` that matches the server-side `eventId`, allowing Meta to deduplicate events and maintain accurate reporting.

## 4. Verification
*   **Build Success:** Verified with `npm run build` to ensure no TypeScript errors or broken imports were introduced.
*   **Code Integrity:** Fixed minor linting errors in `vip_15jt.tsx` regarding unused variables to ensure a clean production bundle.

---

**Outcome:** Your Event Match Quality should now improve as the `external_id` and `phone` parameters are now consistently provided for the most critical conversion points (AddPaymentInfo, Purchase, and Lead/Contact).

# Pixel & CAPI Cleanup and Update Report
**Date:** 2026-01-30
**Topic:** Cleanup of Duplicate Events and Enhancement of User Matching

## Context
The goal was to refine the tracking setup for `ebook_feminine.tsx` and `ebook_uangpanas.tsx` to strictly separate Pixel and CAPI responsibilities, prevent duplicate events, and enhance user matching quality.

## Changes Implemented

### 1. Separation of Concerns (Pixel vs. CAPI)
*   **PageView & ViewContent:** Modified to use **Meta Pixel ONLY**. Removed the client-side CAPI calls for these events.
*   **AddPaymentInfo & Purchase:** Modified to use **CAPI ONLY**. Removed the client-side Pixel calls for these events to prevent double-counting, as the server handles the authoritative events.
*   **AddToCart:** Removed entirely from `scrollToCheckout` as per user request (no cart functionality exists).

### 2. Enhanced User Matching (Advanced Matching)
*   Updated the `useEffect` hooks in both files to fetch the current Supabase session.
*   **External ID:** Now passed as `external_id` (using `session.user.id`).
*   **Facebook Login ID:** Now passed as `db_id` (extracted from `session.user.identities`).
*   **Cookies:** `fbc` and `fbp` are explicitly passed unhashed.
*   **Safety:** These parameters are passed to `initFacebookPixelWithLogging`, `trackPageViewEvent`, and `trackViewContentEvent`.

### 3. Cleanup
*   Removed unused variables and imports (`trackAddPaymentInfoEvent`, `trackPurchaseEvent`, `trackCustomEvent`, etc.) to ensure a clean build.
*   Verified that `testCode` is correctly set to `'TEST33364'` in the CAPI payloads.

## Verification
*   **Build:** Executed `npm run build` successfully, confirming no TypeScript errors or build issues.
*   **Logic:** Reviewed the `useEffect` logic to ensure async session fetching does not block or race against pixel initialization incorrectly (using guards like `hasFiredPixelsRef`).

## Status
The tracking implementation is now cleaner, avoids duplication, and provides better match quality signals to Meta.

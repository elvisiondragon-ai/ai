# Pixel & CAPI Implementation Report
**Date:** 2026-01-27
**Topic:** Pixel & CAPI Adjustments for Deduplication and Server-Side Tracking

## Context
The goal was to optimize the Facebook Pixel and Conversion API (CAPI) implementation to ensure accurate event tracking, prevent duplication, and leverage server-side tracking for purchase events.

## Issues Identified
1. **Duplicate Events:** Potential for duplicate events if both Browser (Pixel) and Server (CAPI) events are fired without proper deduplication or logic.
2. **Double Triggering:** React components re-rendering or user interaction (like multiple clicks) could trigger events like `AddPaymentInfo` or `Purchase` multiple times.
3. **Server-Side Shift:** The purchase event logic was moved to be handled by the server (backend), requiring the removal of the frontend CAPI call for `Purchase` to avoid conflicts or double counting, while keeping the Browser Pixel for client-side feedback and matching.
4. **Suspicious Cookies:** A test cookie `TEST_CLICK_123` was causing warnings in the console.
5. **Blocked Events:** The backend `capi-universal` function had a whitelist that blocked `PageView` and `ViewContent` events.

## Solutions Implemented

### 1. Ref-based Event Guarding
Implemented `useRef` to track if an event has already been fired during the component's lifecycle.
*   **Files Modified:** `src/id_ebook/ebook_feminine.tsx`, `src/id_ebook/ebook_uangpanas.tsx`, `src/id_ebook/ebook_elvision.tsx`
*   **Mechanism:**
    ```typescript
    const addPaymentInfoFiredRef = useRef(false);
    // ...
    if (!addPaymentInfoFiredRef.current) {
        addPaymentInfoFiredRef.current = true;
        // Fire Pixel & CAPI
    }
    ```
*   **Applied to:** `AddPaymentInfo`, `Purchase`, `PageView`, `ViewContent` (via `hasFiredPixelsRef`).

### 2. Shared Event ID Strategy for PageView/ViewContent
Restored Frontend CAPI for `PageView` and `ViewContent` using the **Shared Event ID** strategy to ensure safe deduplication.
*   **Logic:** A single `eventId` is generated (e.g., `viewcontent-timestamp-random`) and passed to *both* `trackViewContentEvent` (Pixel) and `sendCapiEvent` (CAPI).
*   **Benefit:** Meta receives two signals but merges them into **one unique event**, providing 100% reliability even if the browser pixel is blocked.

### 3. Purchase Event Handling
*   **Frontend:** Only fires Browser Pixel (for immediate UI feedback) and strictly **no** CAPI call.
*   **Backend:** Handles the authoritative CAPI event upon payment confirmation.
*   **Deduplication:** Relies on the shared `tripay_reference` as the `event_id` to deduplicate the Frontend Pixel event against the Backend CAPI event.

### 4. Backend Allow-List Update
Updated `src/capi-universal/index.ts` to include `PageView` and `ViewContent` in the `allowedEvents` list, ensuring these events are not rejected by the server.

### 5. Test Code Update
Updated the `testCode` parameter in the CAPI payload to isolate and verify specific test batches in the Events Manager.
*   **New Code:** `TEST90028`

## Current Status (Per File)

### `src/id_ebook/ebook_feminine.tsx`, `src/id_ebook/ebook_uangpanas.tsx`, `src/id_ebook/ebook_elvision.tsx`
*   **PageView:** Pixel + CAPI (Shared ID). Guarded by `hasFiredPixelsRef`.
*   **ViewContent:** Pixel + CAPI (Shared ID). Guarded by `hasFiredPixelsRef`.
*   **AddPaymentInfo:** Pixel + CAPI (Shared ID). Guarded by `addPaymentInfoFiredRef`.
*   **Purchase:** Browser Pixel ONLY. Guarded by `purchaseFiredRef`. (CAPI handled by Backend).

### `src/capi-universal/index.ts`
*   **Hashing:** Safely hashes `em`, `ph`, `fn`, `ln`, `ct`, `st`, `zp`, `country` using SHA-256.
*   **Parameters:** Correctly maps `fbc`, `fbp`, `client_ip_address`, `client_user_agent`.
*   **Permissions:** Now allows `PageView`, `ViewContent`, `AddPaymentInfo`, `AddToCart`, `Purchase`.

## Next Steps
*   Monitor Events Manager to confirm `TEST90028` events are arriving correctly.
*   Verify deduplication between Backend Purchase CAPI and Frontend Purchase Pixel (using `event_id` / `tripay_reference`).
*   Clear browser cookies/localStorage to remove the old `TEST_CLICK_123` value.
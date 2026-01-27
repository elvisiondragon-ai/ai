# Pixel & CAPI Implementation Report
**Date:** 2026-01-27
**Topic:** Pixel & CAPI Adjustments for Deduplication and Server-Side Tracking

## Context
The goal was to optimize the Facebook Pixel and Conversion API (CAPI) implementation to ensure accurate event tracking, prevent duplication, and leverage server-side tracking for purchase events.

## Issues Identified
1. **Duplicate Events:** Potential for duplicate events if both Browser (Pixel) and Server (CAPI) events are fired without proper deduplication or logic.
2. **Double Triggering:** React components re-rendering or user interaction (like multiple clicks) could trigger events like `AddPaymentInfo` or `Purchase` multiple times.
### 3. Server-Side Shift & Deduplication Cleanup
*   **Removal of Frontend Purchase CAPI:** The Purchase CAPI call was removed from the frontend.
*   **Deduplication Change:** Removed the **"First-Win Deduplication"** logic (where the frontend would check `capi_purchase_sent` and attempt to send CAPI if the backend hadn't yet). 
*   **Reasoning:** To avoid race conditions and ensure the server remains the single source of truth for conversions. Deduplication is now handled naturally by Meta using the `event_id` (matching the `tripay_reference`) between the Frontend Pixel and Backend CAPI.


## Solutions Implemented

### 1. Ref-based Event Guarding
Implemented `useRef` to track if an event has already been fired during the component's lifecycle.
*   **Files Modified:** `src/id_ebook/ebook_feminine.tsx`, `src/id_ebook/ebook_uangpanas.tsx`
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

### 2. CAPI Event Removal for Server-Handled Events
Removed frontend `sendCapiEvent` calls for events that are better handled by the server or to reduce noise, while keeping the Browser Pixel `track...Event` calls active.
*   **Events Affected:** `PageView`, `ViewContent`, `Purchase`.
*   **Reasoning:**
    *   `Purchase`: Now handled by the backend (Supabase/Tripay webhook) to ensure 100% accuracy upon confirmed payment. Frontend only fires Pixel for immediate UI feedback (Toast) and browser-side signal.
    *   `PageView` / `ViewContent`: Reduced to Pixel-only to simplify the implementation, as these are high-volume, low-criticality events compared to Purchase.

### 3. Test Code Update
Updated the `testCode` parameter in the CAPI payload to isolate and verify specific test batches in the Events Manager.
*   **New Code:** `TEST90028`

## Current Status (Per File)

### `src/id_ebook/ebook_feminine.tsx` & `src/id_ebook/ebook_uangpanas.tsx`
*   **PageView:** Browser Pixel ONLY.
*   **ViewContent:** Browser Pixel ONLY.
*   **AddPaymentInfo:** Browser Pixel + CAPI (Frontend). Guarded by `addPaymentInfoFiredRef`.
*   **Purchase:** Browser Pixel ONLY. Guarded by `purchaseFiredRef`. (CAPI handled by Backend).

## Next Steps
*   Monitor Events Manager to confirm `TEST90028` events are arriving correctly.
*   Verify deduplication between Backend Purchase CAPI and Frontend Purchase Pixel (using `event_id` / `tripay_reference`).

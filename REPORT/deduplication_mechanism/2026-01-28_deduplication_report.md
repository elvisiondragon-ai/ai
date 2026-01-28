# Report on Deduplication Mechanism

## Context
The user inquired about the protection mechanisms in place to avoid double-firing of events, particularly concerning payment information and CAPI.

## Solution
The primary protection mechanism against double-firing of events, especially for critical conversions like `Purchase` and `AddPaymentInfo`, is **Meta's Deduplication logic**, which relies on a consistent `eventID` across both client-side and server-side event transmissions.

Here's how it works based on the reviewed files:

1.  **Consistent `eventID` Generation:**
    *   For each unique event (e.g., a specific purchase or adding payment info), a unique `eventID` is generated.
    *   This `eventID` is then passed with the event data whether it's sent from the client-side (via Facebook Pixel) or the server-side (via Conversions API).

2.  **Client-Side Implementation (`src/utils/fbpixel.tsx`):**
    *   The `trackEvent` helper function (used by `trackPurchaseEvent`, `trackAddPaymentInfoEvent`, etc.) accepts an `eventID` within its `options` parameter.
    *   When an `eventID` is provided, it's included in the `fbq('track', ...)` or `fbq('trackSingle', ...)` call, ensuring the client-side event carries this unique identifier.

3.  **Server-Side Implementation (`CAPI_IMPLEMENTATION_REPORT.md`):**
    *   The `CAPI_IMPLEMENTATION_REPORT.md` explicitly states: "Deduplication: Ensured all client-side events include an `eventID` that matches the server-side `eventId`, allowing Meta to deduplicate events and maintain accurate reporting."
    *   This implies that the `sendCapiEvent` helper (which sends data to the Supabase Edge Function) also includes the same `eventID` for the corresponding server-side event.
    *   The report also mentions "deduplication logic to prevent double-firing if the backend already sent the event" for `Purchase` events, reinforcing this mechanism.

**In summary:**
By generating a unique `eventID` for each conversion instance and consistently sending this same `eventID` with both the client-side (browser) and server-side (CAPI) events, Meta's systems can identify and discard duplicate events, thus preventing them from being counted multiple times. This ensures accurate reporting and attribution.

## Timestamp
January 28, 2026, 10:20 AM (approx.)
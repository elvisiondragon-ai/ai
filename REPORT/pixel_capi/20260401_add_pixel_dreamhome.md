# Pixel Addition for DreamHome

**Context:**
The user requested to add a Facebook Pixel ID `3319324491540889`, a test event `TEST80304`, and a persistent iOS cache-busting mechanism to the `dreamhome` project located at `/Users/eldragon/git/outsorce/dreamhome/`.

**Changes:**
1. **[dreamhome/index.html](file:///Users/eldragon/git/outsorce/dreamhome/index.html):**
   - Added standard Facebook Pixel script with ID `3319324491540889` in the `<head>`.
   - Added `fbq('set', 'testEvent', 'TEST80304');` for event testing.
   - Implemented a persistent iOS cache-busting mechanism:
     - Forces a hard redirect with a `?v=` parameter if the `APP_VERSION` is outdated or if the URL parameter is missing/mismatched.
     - The `?v=` parameter is now preserved in the URL to ensure 100% effectiveness against "sticky" caches.
   - Updated `APP_VERSION` to `2026.04.01.04`.
2. **[src/main.tsx](file:///Users/eldragon/git/el/ai/src/main.tsx):**
   - Incremented `APP_VERSION` to `"15"` to follow global project rules.

**Build Status:**
- Ran `npm run build` in the `ai` project; it completed successfully.

**Timestamp:** 2026-04-01 19:55:00 (Local Time)

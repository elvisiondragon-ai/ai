# ⚠️ READ ME FIRST - AI FOLDER ARCHITECTURE ⚠️

## 🚀 OVERVIEW
The `ai/` folder is designed to be a **VERY LIGHTWEIGHT** part of the ecosystem. It is intended for end-users to have a fast, minimal-dependency experience (e.g., landing pages, quick checkouts, webinar access).

## 🚫 RESTRICTIONS (DO NOT DO THIS)
1.  **NO HEAVY CONTEXTS:** Do not copy or create heavy state management contexts like `AuthContext.tsx` or complex providers from `elvisiongroup/`.
2.  **NO HEAVY HOOKS:** Avoid complex hooks that bring in massive dependencies or side-effects.
3.  **KEEP IT LIGHT:** The `ai/` project must remain extremely fast to load and simple to maintain.

## ✅ ARCHITECTURAL RULES
1.  **DIRECT SUPABASE TRIGGERS:** All actions should trigger directly to Supabase via Edge Functions or direct table updates.
2.  **MINIMAL AUTH:** If authentication info is needed, use `supabase.auth.getSession()` directly within the component. Do not wrap the entire app in a heavy Auth Provider.
3.  **HEAVY LOGIC LIVES IN `elvisiongroup/`:** If a feature requires complex state, massive libraries, or deep architectural nesting, it **MUST** stay in the `elvisiongroup/` folder. The `elvisiongroup` project is the "Heavy" core; `ai` is the "Light" satellite.
4.  **TRIGGER WITHOUT AUTH:** Design triggers and flows to work without requiring a persistent auth context in the React tree where possible.

## 🛠️ MAINTENANCE
Before adding any new library or context to `ai/`, ask: *"Can this be done with a direct Supabase call?"* If yes, do it that way. If no, it probably belongs in `elvisiongroup/`.

**Failure to follow these rules will lead to build errors and performance degradation. See previous deployment history for examples of "corrupted" builds caused by violating these principles.**

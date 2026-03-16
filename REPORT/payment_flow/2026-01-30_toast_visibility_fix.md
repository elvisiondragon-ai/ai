# Toast Visibility Fix in Payment Flow

**Date:** 2026-01-30
**Topic:** Payment Flow UI / Toast Notification Visibility

## Issue Description
Users were unable to see "Toast" notifications (e.g., "Pembayaran Berhasil", "LUNAS! Akses Dikirim") when viewing the Payment Instruction screen. This was critical because the "PAID" confirmation arrives via a realtime listener while the user is staring at the payment instructions, and the toast is the primary feedback mechanism.

## Root Cause Analysis ("Why")
The issue was caused by **Conditional Rendering that unmounted the `Toaster` component**.

In the React component structure (specifically in `webinar_bapak.tsx` and 9 other webinar files), the return statement was structured like this:

```tsx
// ❌ PROBLEMATIC PATTERN
if (showPaymentInstructions && paymentData) {
    return (
        <div className="payment-screen">
            {/* ... Payment UI ... */}
            {/* MISSING <Toaster /> HERE! */}
        </div>
    );
}

return (
    <div className="main-screen">
        <Toaster /> {/* Toaster only existed here */}
        {/* ... Main Landing Page UI ... */}
    </div>
);
```

When the state changed to `showPaymentInstructions = true`, React completely removed the "main-screen" DOM tree (including the `<Toaster />`) and replaced it with the "payment-screen" DOM tree.

Since `useToast()` triggers a state update in the `Toaster` component, if that component is not mounted in the current render tree, the toast notification cannot appear.

## The Solution ("How")
The fix involved refactoring the component to ensure the `<Toaster />` is **always mounted** in a shared parent container, regardless of which "screen" is being displayed.

We moved the conditional logic *inside* the JSX return, rather than having multiple return statements.

```tsx
// ✅ FIXED PATTERN
return (
    <div className="relative">
        <Toaster /> {/* ALWAYS MOUNTED */}
        
        {showPaymentInstructions && paymentData ? (
            // Payment Screen
            <div className="payment-screen">
                {/* ... Payment UI ... */}
            </div>
        ) : (
            // Main Screen
            <div className="main-screen">
                 {/* ... Main Landing Page UI ... */}
            </div>
        )}
    </div>
);
```

## Impact Scope
This issue was identified in `webinar_bapak.tsx` and verified to exist in **10 other webinar files** in `src/web/`:
1. `webinar_ibuistri.tsx`
2. `webinar_burnout.tsx`
3. `webinar_ortuanak.tsx`
4. `webinar_ibu.tsx`
5. `webinar_ibujodoh.tsx`
6. `webinar_ortusakit.tsx`
7. `webinar_anakmandiri.tsx`
8. `webinar_priasingle.tsx`
9. `webinar_sopanmandiri.tsx`
10. `webinar_priasusis.tsx`

## Status
- [x] Fixed in `webinar_bapak.tsx`
- [ ] Pending fix in other 9 files (Systematic fix recommended).

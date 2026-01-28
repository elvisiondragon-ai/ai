# Fix: Ebook Feminine AddPaymentInfo Multiple Trigger

## Issue
The user reported that `AddPaymentInfo` was triggering 3x on `ebook_feminine.tsx` but only once on `ebook_uangpanas.tsx`.

## Investigation
- Compared `ebook_uangpanas.tsx` and `ebook_feminine.tsx`.
- Found slight differences in React imports and `useRef` usage (`import React from 'react'; React.useRef` vs `import { useRef } from 'react';`).
- Found extra console logs in `ebook_feminine.tsx`.

## Solution
- Standardized `ebook_feminine.tsx` to use `import React, { useState, useEffect } from 'react'` and `React.useRef`, matching `ebook_uangpanas.tsx` exactly.
- Removed extra console logs in `handleCreatePayment`.
- This ensures the `addPaymentInfoFiredRef` persists correctly across potential re-renders or strict mode lifecycles in the same way the working file does.

## File Changed
- `src/id_ebook/ebook_feminine.tsx`

## Baseline (before)
- Lighthouse mobile (`/widget`): Performance 100, Accessibility 100, Best Practices 100, SEO 100
- WAVE (`/widget`): 0 errors, 0 contrast errors, 1 alert (redundant link, logo + "Home" text both linking to `/`)
- Keyboard pass: primary flow (input -> send -> stream -> stop) reachable and operable; tool confirm/deny buttons reachable

## Changes made
- Merged the logo icon and "Home" nav text into a single `<a>` element, eliminating the redundant-link alert (screen readers previously announced "Home" twice in a row)
- Added `aria-live="polite"` (with `aria-atomic="false"`) to the chat message list container, so streamed assistant text is announced incrementally to screen reader users as it arrives, rather than silently or all at once

## After
- Lighthouse mobile (`/widget`): Performance 100, Accessibility 100, Best Practices 100, SEO 100
- WAVE (`/widget`): 0 errors, 0 alerts, 0 contrast errors - AIM score 10/10
- Keyboard pass: unchanged, still fully completable, including mid-stream Stop and tool confirmation buttons
- `aria-live="polite"` confirmed present on the message container (was previously absent, verified via search, not assumed)

## Scope note
Screen reader testing was verified by code inspection rather than a live screen reader session, noting this honestly rather than claiming full manual verification.
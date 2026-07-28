# Hand-built vs shadcn/ui comparison

## What shadcn handled

1. **Dialog: no Portal** shadcn's Dialog wraps content in DialogPortal, rendering it 
outside the normal component tree. My Modal renders inline, which means it could get visually clipped by an ancestor with overflow: hidden or certain CSS transforms a real bug a portal-based dialog avoids by construction.

2. **Dialog: no accessible description** My Modal only wires aria-labelledby. shadcn provides DialogDescription, linked via aria-describedby automatically by Radix, a second, distinct accessibility property.

3. **Tabs: no vertical orientation** shadcn's Tabs accepts an orientation prop and remaps 
keyboard interaction accordingly, vertical tablists should use arrowUp/arrowDown per the 
ARIA spec, not left/right. My implementation only supports the horizontal case.

## Observation

Reading shadcn's generated files doesn't actually expose the core accessibility logic I 
built by hand, focus trapping, roving tabindex, keyboard event handling. Both dialog.tsx and tabs.tsx are thin, styled wrappers around radix-ui's Dialog and Tabs primitives, 
the real interaction logic lives inside that package, not in the file the CLI generates. 

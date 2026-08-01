# Project Stack & Conventions

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Package manager: npm

## Conventions
- Components go in /components, one file per component
- Use functional components + hooks, no class components
- Prefer server components unless interactivity is needed (then "use client")
- Commit messages follow Conventional Commits (feat:, fix:, docs:, chore:)
- Backend: Firebase (Firestore for data, Admin SDK for server-only reads)
- Firebase Admin credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) 
must never use the NEXT_PUBLIC_ prefix — server-only, used exclusively in Server Components
- Client Firebase config uses NEXT_PUBLIC_ prefix as normal (safe to expose)

## Forms & Validation
- Forms use react-hook-form + zod. Never plain useState with manual validation logic.
- Cross-field rules (e.g. "at least one of X must be true") go in zod's superRefine on the parent object, not as separate per-field checks per-field checks can't see sibling state.

## Verification
- After any config change (tsconfig.json, vitest.config.ts), run `npm run build` AND `npm run test` in the same pass before considering the change done. Passing one does not imply the other.

## Git hygiene
- Commit and push before switching branches, even mid-task. Uncommitted/untracked files persist across `git checkout` and will leak into the next branch's context.
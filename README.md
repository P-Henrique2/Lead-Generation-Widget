# Lead Generation Widget

Front-end AI Engineering track assignment. A lead capture widget app built with Next.js, 
using Firebase/Firestore for data storage, developed with AI-assisted tooling (GitHub Copilot).

**Live preview:** [LeadGenWidget](https://lead-geneapp.vercel.app/)

## About

This repo documents both the built application and the AI-assisted development workflow 
used to build it — including prompts used, manual corrections made to AI-generated code, 
and architectural decisions.

## Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Package manager: npm
- Backend: Firebase (Firestore + Admin SDK for server-side reads)

## Screens

- `/` — Home
- `/widget` — Lead capture form
- `/leads` — Leads dashboard
- `/leads/[id]` — Lead detail
- `/settings` — Widget configuration
- `/health` — Health check (live Firestore read via server-only Admin SDK)

See `SPEC.md` for the full spec and `claude.md` for project conventions.
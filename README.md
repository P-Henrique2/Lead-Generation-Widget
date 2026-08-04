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

## Tool: scoreLead

**Purpose:** Scores lead fit during the qualification chat.

**Input schema:**
- `teamSize`: "1-5" | "6-20" | "21-50" | "50+"
- `timeline`: "this month" | "this quarter" | "exploring"
- `isDecisionMaker`: boolean

**Returns:** `{ score: number (0-100), tier: "hot" | "warm" | "cold", reasoning: string }`

**Side effect:** writes the scored lead to Firestore. If this write fails, the tool
throws, surfacing as the tool's `output-error` state in the UI.

**To trigger the error state for review:** disconnect network, or temporarily
revoke Firestore write access, then continue the qualifying conversation.

## Tool: saveLead

**Purpose:** Human-in-the-loop confirmation before a scored lead is persisted
for follow-up. No server `execute` is required; the client confirms or denies via
`addToolResult`.

**Input schema:**
- `reason`: optional string describing why the lead should be saved

**Return shape:**
- `confirmed: boolean`
- The tool becomes an `output-available` part once the client responds with a
  confirm or deny action.
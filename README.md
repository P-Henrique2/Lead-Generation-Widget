# Lead Generation Widget

Front-end AI Engineering track assignment. A lead capture widget app built with Next.js, 
using Firebase/Firestore for data storage, developed with AI-assisted tooling (GitHub Copilot).

**Live preview:** [LeadGenWidget](https://lead-geneapp.vercel.app/)

## About

This repo documents both the built application and the AI-assisted development workflow 
used to build it, including prompts used, manual corrections made to AI-generated code, 
and architectural decisions.

## Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Package manager: npm
- Backend: Firebase (Firestore + Admin SDK for server-side reads)

## Screens

- `/` - Home
- `/widget` - Lead capture form
- `/leads` - Leads dashboard
- `/leads/[id]` - Lead detail
- `/settings` - Widget configuration
- `/health` - Health check (live Firestore read via server-only Admin SDK)

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

## AI Tools

### scoreLead

**Purpose:** Scores lead fit during the qualification chat and persists the result to Firestore.

**Input schema:**
- `teamSize`: `"1-5"` | `"6-20"` | `"21-50"` | `"50+"`
- `timeline`: `"this month"` | `"this quarter"` | `"exploring"`
- `isDecisionMaker`: `boolean`

**Returns:**
```ts
{
  score: number;      // 0-100
  tier: "hot" | "warm" | "cold";
  reasoning: string;
}
```

**Side effect:** writes the scored lead to the `leads` Firestore collection. If this write fails, the tool throws, surfacing as the `output-error` state in the chat UI.

**To trigger the error state for review:** temporarily add `throw new Error(...)` as the first line of `execute()` in `route.ts`, or break the Firestore write path.

### saveLead

**Purpose:** Human-in-the-loop confirmation before a scored lead is saved for follow-up. No server `execute` function , the model proposes the save, and the client renders Confirm/Deny controls that call `addToolResult` to supply the outcome.

**Input schema:**
- `reason`: `string` (optional), why the assistant is proposing to save this lead

**Returns:**
```ts
{
  confirmed: boolean;
}
```

## Notes on Gemini free-tier quota

The `generate_content_free_tier_requests` quota (20 requests/day) appears to be pooled at the Google account level, not per API key or per project. Creating a new API key under the same account does not reset it, only a different account, or waiting for the daily reset, does.
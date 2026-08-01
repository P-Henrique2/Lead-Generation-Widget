# WORKFLOW.md

## Setup

Both rounds started from the same base commit (`750b1fe`, shared tooling: `zod`,
`react-hook-form`, Vitest, React Testing Library already installed). Round 1 used a
single vague prompt in a fresh session with no context. Round 2 used a structured
prompt with file references, explicit constraints, example behavior, and a required
test-and-verify step, run in a separate fresh session with an explore→plan→code loop.

## Correctness

Round 1 has no validation. `handleSubmit` calls `preventDefault()` and marks the form
saved unconditionally — an empty title submits without error. Its accent color field
is a fixed 4-option radio set (cyan/purple/emerald/amber), which technically can't be
"invalid," but only because it sidesteps the actual requirement: representing an
arbitrary brand color. Its capture-field control is a single generic
`enableLeadCapture` boolean, not the three named toggles (name/email/message) the
product actually needed.

Round 2 implements a `zod` schema: required non-empty title (max 60 chars), a hex
regex on accent color, and a cross-field rule via `superRefine` requiring at least one
capture toggle to stay enabled. This edge case — validating the toggles as a set,
not individually — is exactly what a vague prompt fails to produce, since it requires
reasoning about relationships between fields rather than per-field constraints.

## Accessibility

Round 1: zero accessibility attributes. No `aria-invalid`, no `aria-describedby`, no
`role="alert"` — there's nothing to report since there's no validation. Round 2 wires
all three on every field, with error text linked to its input.

## Scope

Round 1 invented unrequested fields — `description`, `primaryAction`,
`welcomeMessage`, plus a live-preview pane — none of which were asked for. Round 2
delivered exactly the two specified sections (branding, capture fields), nothing more.

## Review effort

Round 1 took ~2 minutes to generate and needed no fixes — but delivered a
non-functional form, so its real cost is deferred, not avoided. Round 2 took longer
upfront (structured prompt, plan approval, test-writing) and surfaced two real bugs
during verification:

1. `titleInputRef.current = element` — a read-only property assignment. This passed
   `npm run test` but failed `npm run build`, proving tests alone are not sufficient
   verification; both must be run.
2. Fixing bug #1 silently reverted `tsconfig.json`'s `jsx` setting from `"react-jsx"`
   back to `"preserve"`, which re-broke Vitest's JSX parsing — a fix for one tool
   broke the other. Only caught by running build and test in the same pass.

Total time including review and fixes: round 1 was fast to generate but produces a
form that would fail code review outright. Round 2 was slower end-to-end but shipped
something that actually passes both `npm run build` and `npm run test` together —
confirming the mentor note that round two often feels slower but is faster once real
verification is counted.

## Known limitation: test execution environment

The test suite (`page.test.tsx`, 4 tests) was written to satisfy round 2's
verification requirement and is logically correct, it was confirmed passing
against a temporary local Vitest config during development. However, a
permanent, CI-safe test configuration was not reached within this drill's scope:

- Next.js requires `tsconfig.json`'s `jsx` field to stay `"preserve"`, and
  actively rewrites it back if changed.
- Vitest's JSX parser (on this project's Rolldown-based Vite engine) requires
  `"react-jsx"` or an equivalent transform to parse `.tsx` test files, and
  fails with `Unexpected JSX expression` under `"preserve"`.
- The standard fix, `@vitejs/plugin-react`, has a peer-dependency conflict
  with this project's existing Babel 7 toolchain (pulled in via `shadcn`),
  and forcing it with `--legacy-peer-deps` silently removed `vite` itself
  from `node_modules`, breaking the project entirely until reverted.

`npm run build` passes reliably. `npm run test` requires a dependency
resolution (likely pinning compatible `@vitejs/plugin-react` and `shadcn`
versions, or migrating off Rolldown-based Vitest) that is outside this
assignment's scope.
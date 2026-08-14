# Deployment Checklist

Signed off by: Pedro Henrique
Date: [fill in]
Production URL: https://lead-geneapp.vercel.app

## Pre-deploy

- [x] All environment variables set in Vercel (Production environment, not just Preview):
      `GOOGLE_GENERATIVE_AI_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`,
      `FIREBASE_PRIVATE_KEY`
- [x] `npm run build` passes locally with no errors
- [x] `npm run test` passes (17/17)
- [ ] `npx playwright test` passes against a real API call
- [x] No secrets committed to git history (checked full history, confirmed clean)
- [x] `.env.example` present and accurate for a new developer to follow

## Production hygiene

- [x] Rate limiting active on `/api/chat` (IP-based, 10 requests/10 min by default)
- [x] `maxDuration` set on the streaming route to prevent runaway serverless invocations
- [x] Firestore Admin SDK credentials are server-only, never exposed to the client
      (`NEXT_PUBLIC_` prefix never used for secrets)

## Post-deploy verification

- [x] Production URL loads
- [x] Primary flow tested live: send a message on `/widget`, confirm streaming works
- [x] `scoreLead` tool call tested live: confirm score card renders
- [x] `saveLead` confirmation tested live: both Confirm and Deny paths work
- [] Mid-stream failure + retry tested (or last verified: [date])
- [x] Rate limit tested live: confirmed a designed error card appears, not a crash
- [x] Lighthouse mobile re-run against production URL: [87]
- [x] Cross-browser: tested on [Chrome/Edge/Brave/Opera, Firefox]. **Not tested: Safari
      desktop/mobile — no Apple device available.**

## Rollback plan

If a deploy breaks production:
1. Go to the Vercel dashboard → this project → **Deployments** tab
2. Find the last known-good deployment (identifiable by commit message/timestamp)
3. Click **"..." → Promote to Production** on that earlier deployment — this instantly
   reverts production traffic to the last working build, no rebuild needed
4. Separately, fix the issue on `main`, verify locally, and push a new deploy once confirmed

No formal monitoring/alerting is set up beyond Vercel's own deployment status notifications
and manual spot-checks. For a project at this scale, this is an accepted tradeoff — real
monitoring (e.g. Sentry, uptime pings) would be the next investment if this were a real
production product with real users depending on uptime.

## Known limitations at deploy time

- Mobile Safari and desktop Safari untested (no device access)
- Screen-reader announcement (`aria-live`) verified by code inspection, not a live
  VoiceOver/NVDA session
- In-memory rate limiting resets on serverless cold starts and isn't perfectly consistent
  across instances — accepted tradeoff for this scale, not suitable as-is for high-traffic
  production use
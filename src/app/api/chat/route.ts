import { streamText, convertToModelMessages, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

import { MODEL_CONFIG, SYSTEM_PROMPT } from "../../../lib/ai/config";
import { scoreLead, scoreLeadInputSchema } from "../../../lib/ai/lead-scoring";
import { getAdminFirestore } from "../../../lib/firebase-admin";

// Simple in-memory IP-based rate limiting (suitable for small, free-tier apps).
// Note: this in-memory approach resets on serverless cold starts and is
// not perfectly consistent across multiple instances — it's a low-cost
// deterrent to reduce accidental or malicious quota exhaustion.
const RATE_LIMIT_MAP = new Map<string, number[]>();
// IP request limit per IP window — production default for a small demo app.
const RATE_LIMIT_MAX = 10; // max requests
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

function getIpFromRequest(req: Request) {
  // Prefer X-Forwarded-For (may contain a comma list), then X-Real-IP.
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  // Fallback to a safe local identifier for dev environments.
  return "unknown";
}

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // IP-based rate limiting
    const ip = getIpFromRequest(request);
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const previous = RATE_LIMIT_MAP.get(ip) ?? [];
    const recent = previous.filter((ts) => ts > windowStart);
    if (recent.length >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ status: 429, statusCode: 429, code: "rate_limit_exceeded", message: "Rate limit exceeded. Try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    recent.push(now);
    RATE_LIMIT_MAP.set(ip, recent);

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return new Response("Missing Google Generative AI API key", { status: 500 });
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const body = (await request.json()) as { messages?: unknown };

    if (!Array.isArray(body.messages)) {
      return new Response("Expected a messages array in the request body", {
        status: 400,
      });
    }

    const result = streamText({
      model: google(MODEL_CONFIG.model),
      system: SYSTEM_PROMPT,
      temperature: MODEL_CONFIG.temperature,
      maxOutputTokens: MODEL_CONFIG.maxTokens,
      messages: await convertToModelMessages(body.messages as never),
      tools: {
        scoreLead: tool({
          description: "Score a lead based on team size, timeline, and decision-maker status.",
          inputSchema: scoreLeadInputSchema,
          execute: async (input) => {

            const scoredLead = scoreLead(input);
            const firestore = getAdminFirestore();

            await firestore.collection("leads").add({
              ...scoredLead,
              teamSize: input.teamSize,
              timeline: input.timeline,
              isDecisionMaker: input.isDecisionMaker,
              createdAt: new Date().toISOString(),
            });

            return scoredLead;
          },
        }),
        saveLead: tool({
          description: "Ask the user to confirm before saving a qualified lead for follow-up.",
          inputSchema: z.object({
            reason: z.string().optional().describe("Optional reason for saving the lead."),
          }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat route failed", error);
    return new Response("Failed to generate a response from Gemini", { status: 500 });
  }
}
import { streamText, convertToModelMessages, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

import { MODEL_CONFIG, SYSTEM_PROMPT } from "../../../lib/ai/config";
import { scoreLead, scoreLeadInputSchema } from "../../../lib/ai/lead-scoring";
import { getAdminFirestore } from "../../../lib/firebase-admin";

export async function POST(request: Request) {
  try {
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
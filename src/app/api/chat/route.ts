import { streamText, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { MODEL_CONFIG, SYSTEM_PROMPT } from "../../../lib/ai/config";

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
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat route failed", error);
    return new Response("Failed to generate a response from Gemini", { status: 500 });
  }
}
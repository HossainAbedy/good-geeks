//src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type ChatRequestBody = {
  prompt?: string;
  messages?: { role: "user" | "system" | "assistant"; content: string }[];
  max_tokens?: number;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS || 500);

// Warn if missing key
if (!OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. /api/chat will fail until configured.");
}

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = (await req.json().catch(() => ({}))) || {};

    // Initialize correct message type
    let messages: ChatCompletionMessageParam[] = [];

    // Use full chat history if provided
    if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
      messages = body.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
    }
    // Or use simple prompt
    else if (body.prompt && typeof body.prompt === "string") {
      messages = [
        {
          role: "user",
          content: body.prompt,
        },
      ];
    } else {
      return NextResponse.json({ error: "No prompt or messages provided" }, { status: 400 });
    }

    // Call OpenAI Chat Completion
    const resp = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      max_tokens: body.max_tokens ?? OPENAI_MAX_TOKENS,
      temperature: 0.2,
    });

    const reply = resp.choices?.[0]?.message?.content || "";

    return NextResponse.json({ ok: true, reply }, { status: 200 });
  } catch (err: any) {
    console.error("❌ /api/chat error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}

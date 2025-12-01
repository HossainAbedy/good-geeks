//src/app/api/chat/route.ts
// /src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

type ChatRequestBody = {
  prompt?: string;
  messages?: { role: "user" | "system" | "assistant"; content: string }[];
  max_tokens?: number;
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";
const MAX_TOKENS = Number(process.env.GROQ_MAX_TOKENS || 500);

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set.");
}

const client = new Groq({
  apiKey: GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json().catch(() => ({}));

    let messages: { role: "user" | "assistant" | "system"; content: string }[] = [];

    if (body.messages && body.messages.length > 0) {
      messages = body.messages;
    } else if (body.prompt) {
      messages = [{ role: "user", content: body.prompt }];
    } else {
      return NextResponse.json(
        { error: "No prompt or messages provided" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: messages,
      max_tokens: body.max_tokens ?? MAX_TOKENS,
      temperature: 0.2,
    });

    const reply = response?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ OK: true, reply });
  } catch (err: any) {
    console.error("Groq /api/chat error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


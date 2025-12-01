//src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

type ChatRequestBody = {
  prompt?: string;
  messages?: { role: "user" | "assistant" | "system"; content: string }[];
  max_tokens?: number;
};

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const MODEL = process.env.GROQ_MODEL || "llama3-70b-8192";
const MAX_TOKENS = Number(process.env.GROQ_MAX_TOKENS || 500);

export async function POST(req: Request) {
  try {
    const body: ChatRequestBody = await req.json();

    let messages = [];

    if (body.messages?.length) {
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
      messages,
      max_tokens: body.max_tokens ?? MAX_TOKENS,
      temperature: 0.2,
    });

    const aiMessage = response.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ ok: true, reply: aiMessage });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

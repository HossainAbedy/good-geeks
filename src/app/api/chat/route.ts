//src/app/api/chat/route.ts
import { NextResponse } from "next/server";
type ChatRequestBody = {
  prompt?: string;
  messages?: { role: "user" | "assistant" | "system"; content: string }[];
  max_tokens?: number;
  temperature?: number;
};

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ENV_MODEL = process.env.GROQ_MODEL || ""; // optional preferred model
const MAX_TOKENS = Number(process.env.GROQ_MAX_TOKENS || 512);
const MODELS_ENDPOINT = "https://api.groq.com/openai/v1/models";
const CHAT_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY not set. /api/chat will fail until configured.");
}

/**
 * Helper: call Groq chat completions with given model and messages.
 * Returns { ok: true, reply } or { ok: false, error, raw? }.
 */
async function tryModel(model: string, messages: { role: string; content: string }[], opts?: { max_tokens?: number; temperature?: number }) {
  try {
    const body = {
      model,
      messages,
      max_tokens: opts?.max_tokens ?? MAX_TOKENS,
      temperature: opts?.temperature ?? 0.2,
    };

    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      // return full info so caller can inspect error.code/message
      return { ok: false, status: res.status, error: json?.error || json || { message: `HTTP ${res.status}` }, raw: json };
    }

    // success - extract reply
    const reply = (json?.choices?.[0]?.message?.content) ?? "";
    return { ok: true, reply, raw: json };
  } catch (err: any) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Discover candidate models from Groq models endpoint.
 * Prioritize Llama 3.1 family and production models.
 */
async function discoverModels(): Promise<string[]> {
  try {
    const res = await fetch(MODELS_ENDPOINT, {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    });
    if (!res.ok) {
      console.warn("Could not fetch Groq models list:", res.status);
      return [];
    }
    const json = await res.json();
    // json should be an array of model descriptors; fallback if shape differs
    const models: string[] = Array.isArray(json)
      ? json.map((m: any) => (m?.id || m?.model || "").toString()).filter(Boolean)
      : (Array.isArray(json?.data) ? json.data.map((m: any) => m.id).filter(Boolean) : []);

    // prefer order: Llama 3.1, Llama 3.3, mixtral, gemma, fallback others
    const preferPatterns = ["llama-3.1", "llama-3.3", "mixtral", "gemma", "llama"];
    // remove duplicates and decommissioned-looking names
    const cleaned = Array.from(new Set(models)).filter((id) => !/decommissioned|deprecated|preview/i.test(id));

    // reorder by preference
    const ordered: string[] = [];
    for (const pat of preferPatterns) {
      for (const m of cleaned) {
        if (m.toLowerCase().includes(pat) && !ordered.includes(m)) ordered.push(m);
      }
    }
    // append remainder
    for (const m of cleaned) if (!ordered.includes(m)) ordered.push(m);

    return ordered;
  } catch (err) {
    console.error("discoverModels error:", err);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured on server" }, { status: 500 });
    }

    const body = (await req.json().catch(() => ({}))) as ChatRequestBody;

    // build messages array in OpenAI-compatible shape
    let messages: { role: string; content: string }[] = [];

    if (Array.isArray(body.messages) && body.messages.length) {
      messages = body.messages.map((m) => ({ role: m.role, content: m.content }));
    } else if (body.prompt && typeof body.prompt === "string") {
      messages = [{ role: "user", content: body.prompt }];
    } else {
      return NextResponse.json({ error: "No prompt or messages provided" }, { status: 400 });
    }

    // Try the env-specified model first (if present), then fallback to discovery list
    const triedModels: string[] = [];
    const candidateModels: string[] = [];

    if (ENV_MODEL) candidateModels.push(ENV_MODEL);
    // add a fallback safe default that is likely available on many Groq accounts (but we'll still verify)
    candidateModels.push("llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768");

    // Remove duplicates while preserving order
    const uniqueCandidates = Array.from(new Set(candidateModels));

    // First round: try each candidate until success or a model_decommissioned error
    for (const model of uniqueCandidates) {
      triedModels.push(model);
      const attempt = await tryModel(model, messages, { max_tokens: body.max_tokens, temperature: body.temperature });
      if (attempt.ok) {
        return NextResponse.json({ ok: true, model_used: model, reply: attempt.reply });
      }

      // If model specifically decommissioned, continue to discovery step
      const errObj = attempt.error || attempt.raw;
      const errMessage = typeof errObj === "string" ? errObj : JSON.stringify(errObj || {});
      if (errMessage && /decommissioned|deprecated|not supported/i.test(errMessage)) {
        // continue loop to try next candidate
        continue;
      } else {
        // Non-decommission error (rate limit, auth, etc.) — return that to the client for clarity
        return NextResponse.json({ error: errObj || "Unknown error", model_tried: model }, { status: 502 });
      }
    }

    // If we reached here, initial candidates were decommissioned or failed; try discovery
    const discovered = await discoverModels();
    if (!discovered.length) {
      return NextResponse.json({
        error: "No candidate models available and discovery failed. Check GROQ API key and models on your Groq console.",
        tried: triedModels,
      }, { status: 502 });
    }

    // Try the top discovered models (limit to first 6)
    const toTry = discovered.slice(0, 6);
    for (const model of toTry) {
      triedModels.push(model);
      const attempt = await tryModel(model, messages, { max_tokens: body.max_tokens, temperature: body.temperature });
      if (attempt.ok) {
        return NextResponse.json({ ok: true, model_used: model, reply: attempt.reply, tried: triedModels });
      }
      const errObj = attempt.error || attempt.raw;
      const errMessage = typeof errObj === "string" ? errObj : JSON.stringify(errObj || {});
      if (errMessage && /decommissioned|deprecated|not supported/i.test(errMessage)) {
        // try next discovered model
        continue;
      } else {
        // other error -> return it
        return NextResponse.json({ error: errObj || "Unknown error", tried: triedModels }, { status: 502 });
      }
    }

    return NextResponse.json({
      error: "All tried models failed. Check your Groq API key, quota, or model availability in Groq console.",
      tried: triedModels,
    }, { status: 502 });
  } catch (err: any) {
    console.error("/api/chat unexpected error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

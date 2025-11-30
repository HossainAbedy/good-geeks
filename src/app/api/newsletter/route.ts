// src/app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// SendGrid helper (optional confirmation mail)
async function sendEmail(subject: string, html: string, to: string) {
  const key = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!key || !from || !to) return { ok: false, reason: "sendgrid not configured" };

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from },
    subject,
    content: [{ type: "text/html", value: html }],
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return { ok: res.ok, status: res.status };
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const e = (email || "").trim().toLowerCase();
    if (!e || !e.includes("@")) return NextResponse.json({ message: "Invalid email" }, { status: 400 });

    // Insert (ignore duplicates)
    const { data, error } = await supabase.from("newsletter").insert([{ email: e }]).select().single();
    if (error) {
      // if duplicate constraint or other error, still return OK for UX
      console.error("Newsletter insert error:", error);
      // If it is a duplicate, try fetching existing row
      const { data: existing } = await supabase.from("newsletter").select("*").eq("email", e).single();
      if (existing) return NextResponse.json({ ok: true, existing });
      return NextResponse.json({ message: "DB error" }, { status: 500 });
    }

    // Optional: send confirmation email
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      try {
        await sendEmail("Thanks for subscribing", `<p>Thanks for subscribing to GoodGeeks updates.</p>`, e);
      } catch (err) {
        console.error("SendGrid confirmation error:", err);
      }
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("Unexpected POST /api/newsletter error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

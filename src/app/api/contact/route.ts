// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helpers: SendGrid email
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

  return { ok: res.ok, status: res.status, body: await res.text().catch(() => "") };
}

// Helpers: WhatsApp notification (tries Twilio first, then fallback to WhatsApp Cloud API)
async function sendWhatsAppMessage(text: string) {
  // Twilio Path
  const twAccount = process.env.TWILIO_ACCOUNT_SID;
  const twAuth = process.env.TWILIO_AUTH_TOKEN;
  const twFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+1415xxxxxxx"
  const adminTo = process.env.ADMIN_WHATSAPP_TO;   // e.g. "whatsapp:+61426542214"

  if (twAccount && twAuth && twFrom && adminTo) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${twAccount}/Messages.json`;
    const body = new URLSearchParams({
      From: twFrom,
      To: adminTo,
      Body: text,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${twAccount}:${twAuth}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    return { ok: res.ok, provider: "twilio", status: res.status, text: await res.text().catch(() => "") };
  }

  // WhatsApp Cloud API fallback (Meta)
  const waToken = process.env.WA_ACCESS_TOKEN;
  const waPhoneId = process.env.WA_PHONE_ID; // your WhatsApp Business Phone ID
  const waTo = process.env.ADMIN_WHATSAPP_TO_NUMBER; // digits only e.g. 61426542214
  if (waToken && waPhoneId && waTo) {
    const url = `https://graph.facebook.com/v17.0/${waPhoneId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: waTo,
      type: "text",
      text: { body: text },
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${waToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, provider: "whatsapp_cloud", status: res.status, text: await res.text().catch(() => "") };
  }

  return { ok: false, reason: "no whatsapp configured" };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const suburb = (body.suburb || "").trim();
    const message = (body.message || "").trim();

    if (!name || !phone) {
      return NextResponse.json({ message: "Name and phone are required" }, { status: 400 });
    }

    // Insert into Supabase contacts table
    const record = {
      name,
      phone,
      email: email || null,
      suburb: suburb || null,
      message: message || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("contacts").insert([record]).select().single();
    if (error) {
      console.error("Supabase insert error (contacts):", error);
      return NextResponse.json({ message: "Failed to save contact" }, { status: 500 });
    }

    // Send email notification (if configured)
    const contactReceiver = process.env.CONTACT_RECEIVER_EMAIL;
    if (contactReceiver && process.env.SENDGRID_API_KEY) {
      const subject = `New contact from ${name} — GoodGeeks`;
      const html = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "-"}</p>
        <p><strong>Suburb:</strong> ${suburb || "-"}</p>
        <p><strong>Message:</strong><br/>${message || "-"}</p>
        <p>Submitted: ${new Date().toLocaleString()}</p>
      `;
      try {
        await sendEmail(subject, html, contactReceiver);
      } catch (e) {
        console.error("SendGrid error:", e);
      }
    }

    // Send WhatsApp notification (if configured)
    const waText = `New contact: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nSuburb: ${suburb || "-"}\nMessage: ${message ? message.slice(0, 200) : "-"}`;
    try {
      await sendWhatsAppMessage(waText);
    } catch (e) {
      console.error("WhatsApp send error:", e);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected POST /api/contact error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

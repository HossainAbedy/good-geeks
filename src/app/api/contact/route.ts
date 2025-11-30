// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* -----------------------------
   VALIDATION HELPERS
------------------------------ */
function validateName(name: string) {
  const v = name.trim();
  if (!v) return "Full name is required";
  if (v.length < 2) return "Name is too short";
  return "";
}

function validatePhone(phone: string) {
  const raw = phone.trim();
  if (!raw) return "Phone number is required";

  const normalized = raw.replace(/[\s-()]/g, "");

  // Australian mobile pattern +61 or 04
  const auMobileRE = /^(?:\+61|0)4\d{8}$/;

  if (auMobileRE.test(normalized)) return "";

  // fallback: minimum digits
  const digits = normalized.replace(/\D/g, "");
  if (digits.length >= 8) return "";

  return "Invalid phone number";
}

function validateEmail(email: string) {
  const v = email.trim();
  if (!v) return ""; // Optional
  const re = /^\S+@\S+\.\S+$/;
  return re.test(v) ? "" : "Invalid email address";
}

function validateMessage(msg: string) {
  if (!msg) return ""; // Optional
  if (msg.trim().length < 6) return "Message is too short";
  return "";
}

/* -----------------------------
   HTML ESCAPE (for emails)
------------------------------ */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* -----------------------------
   SEND EMAIL (SendGrid)
------------------------------ */
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

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    console.error("sendEmail error:", err);
    return { ok: false, error: String(err) };
  }
}

/* -----------------------------
   SEND WHATSAPP (Twilio first)
------------------------------ */
async function sendWhatsAppMessage(text: string) {
  // Twilio
  const twAccount = process.env.TWILIO_ACCOUNT_SID;
  const twAuth = process.env.TWILIO_AUTH_TOKEN;
  const twFrom = process.env.TWILIO_WHATSAPP_FROM;
  const adminTo = process.env.ADMIN_WHATSAPP_TO;

  if (twAccount && twAuth && twFrom && adminTo) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twAccount}/Messages.json`;
      const params = new URLSearchParams({ From: twFrom, To: adminTo, Body: text });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${twAccount}:${twAuth}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const t = await res.text().catch(() => "");
      return { ok: res.ok, provider: "twilio", status: res.status, body: t };
    } catch (err) {
      console.error("Twilio WA error:", err);
    }
  }

  // WhatsApp Cloud API (fallback)
  const waToken = process.env.WA_ACCESS_TOKEN;
  const waPhoneId = process.env.WA_PHONE_ID;
  const waTo = process.env.ADMIN_WHATSAPP_TO_NUMBER; // digits only

  if (waToken && waPhoneId && waTo) {
    try {
      const url = `https://graph.facebook.com/v17.0/${waPhoneId}/messages`;
      const payload = {
        messaging_product: "whatsapp",
        to: waTo,
        type: "text",
        text: { body: text },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${waToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const t = await res.text().catch(() => "");
      return { ok: res.ok, provider: "whatsapp_cloud", status: res.status, body: t };
    } catch (err) {
      console.error("WhatsApp Cloud error:", err);
    }
  }

  return { ok: false, reason: "no WhatsApp provider configured" };
}

/* -----------------------------
   MAIN POST HANDLER
------------------------------ */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const suburb = (body.suburb || "").trim();
    const message = (body.message || "").trim();

    /* -----------------------------
       FULL SERVER-SIDE VALIDATION
    ------------------------------ */
    const errors: Record<string, string> = {};

    const nameErr = validateName(name);
    if (nameErr) errors.name = nameErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.phone = phoneErr;

    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;

    const msgErr = validateMessage(message);
    if (msgErr) errors.message = msgErr;

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 422 }
      );
    }

    /* -----------------------------
       SAVE TO SUPABASE
    ------------------------------ */
    const record = {
      name,
      phone,
      email: email || null,
      suburb: suburb || null,
      message: message || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "Failed to save contact" },
        { status: 500 }
      );
    }

    /* -----------------------------
       SEND EMAIL & WHATSAPP
    ------------------------------ */
    const subject = `New contact from ${escapeHtml(name)} — Good Geeks`;
    const html = `
      <h3>New Contact Submission</h3>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || "-")}</p>
      <p><strong>Suburb:</strong> ${escapeHtml(suburb || "-")}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message || "-")}</p>
      <p style="font-size:0.85rem;color:#666">Submitted: ${escapeHtml(new Date().toLocaleString())}</p>
    `;

    let emailResult = { ok: false, reason: "not attempted" as any };
    if (process.env.CONTACT_RECEIVER_EMAIL && process.env.SENDGRID_API_KEY) {
      emailResult = await sendEmail(subject, html, process.env.CONTACT_RECEIVER_EMAIL);
    }

    const waText = `New Contact\nName: ${name}\nPhone: ${phone}\nEmail: ${email || "-"}\nSuburb: ${suburb || "-"}\nMessage: ${
      message ? message.slice(0, 200) : "-"
    }`;

    const waResult = await sendWhatsAppMessage(waText);

    /* -----------------------------
       SUCCESS RESPONSE
    ------------------------------ */
    return NextResponse.json(
      {
        ok: true,
        data,
        notifications: { email: emailResult, whatsapp: waResult },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected /api/contact error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

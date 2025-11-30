// src/lib/mail.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type MailParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: MailParams) {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("SendGrid error:", err);
    throw err;
  }
}

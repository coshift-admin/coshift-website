import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(120).optional(),
  email: z.string().email().max(200),
  projectType: z.enum(["erp", "web", "email", "other"]),
  message: z.string().max(8000).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, reason: "validation", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO ?? "contact@coshift.agency";
  const from = process.env.CONTACT_EMAIL_FROM ?? "Coshift <noreply@coshift.agency>";

  // No key in this environment → log and return success so the user gets
  // immediate feedback in local dev. Production must have RESEND_API_KEY set.
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY missing — message logged but not delivered",
      { ...data, ts: new Date().toISOString() },
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const subject = `Brief: ${data.name}${data.company ? ` · ${data.company}` : ""}`;
    const html = [
      `<h2>New brief from ${escape(data.name)}</h2>`,
      `<p><strong>Email:</strong> ${escape(data.email)}</p>`,
      data.company ? `<p><strong>Company:</strong> ${escape(data.company)}</p>` : "",
      `<p><strong>Project type:</strong> ${escape(data.projectType)}</p>`,
      data.message
        ? `<p><strong>Message:</strong></p><pre style="white-space:pre-wrap;font-family:inherit">${escape(data.message)}</pre>`
        : "",
    ].join("\n");

    await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] resend failed", err);
    return NextResponse.json({ ok: false, reason: "send-failed" }, { status: 500 });
  }
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

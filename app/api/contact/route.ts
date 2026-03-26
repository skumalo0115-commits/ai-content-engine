import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/app/lib/site";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;

    const name = cleanValue(payload.name);
    const email = cleanValue(payload.email);
    const subject = cleanValue(payload.subject);
    const message = cleanValue(payload.message);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please complete every field before sending your message." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const contactToEmail = process.env.CONTACT_TO_EMAIL || siteConfig.email;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser || contactToEmail;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Contact email is not configured yet. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to send messages from the website." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"AI Content Engine Contact" <${contactFromEmail}>`,
      to: contactToEmail,
      replyTo: email,
      subject: `[AI Content Engine] ${subject}`,
      text: `New website contact message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#181614">
          <h2 style="margin-bottom:16px;">New website contact message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-line;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Your message has been sent successfully." });
  } catch {
    return NextResponse.json({ error: "Your message could not be sent right now. Please try again in a moment." }, { status: 500 });
  }
}

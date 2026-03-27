import nodemailer from "nodemailer";
import { siteConfig } from "@/app/lib/site";

type SendMailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function getMailConfig() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser || siteConfig.email;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
    fromEmail,
  };
}

export async function sendTransactionalEmail(options: SendMailOptions) {
  const config = getMailConfig();

  if (!config) {
    throw new Error("SMTP is not configured for transactional email.");
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"${siteConfig.name}" <${config.fromEmail}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

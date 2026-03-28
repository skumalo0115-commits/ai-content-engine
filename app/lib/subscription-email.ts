import { getBaseUrl, PRO_MONTHLY_PRICE_USD, siteConfig } from "@/app/lib/site";
import { sendTransactionalEmail } from "@/app/lib/mailer";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendProSubscriptionConfirmationEmail(input: {
  email: string;
  customerName?: string;
}) {
  const email = input.email.trim();
  if (!email) {
    return;
  }

  const customerName = input.customerName?.trim() || "there";
  const dashboardUrl = `${getBaseUrl()}/dashboard`;
  const pricingUrl = `${getBaseUrl()}/pricing`;
  const subject = `Your ${siteConfig.name} Pro subscription is active`;
  const text = [
    `Hi ${customerName},`,
    "",
    `Your ${siteConfig.name} Pro subscription is now active at $${PRO_MONTHLY_PRICE_USD}/month through Paystack.`,
    "",
    "You can now use:",
    "- unlimited content generations",
    "- saved strategy workflows",
    "- the 14-day AI content calendar",
    "",
    `Open your dashboard: ${dashboardUrl}`,
    `Manage your subscription: ${pricingUrl}`,
    "",
    "Cancellation stops future renewals only. Previous successful payments are non-refundable.",
    "",
    `Need help? Reply to ${siteConfig.email}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#181614;background:#f6f2eb;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid rgba(0,0,0,0.06);">
        <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#6f685f;">${escapeHtml(siteConfig.name)} Pro</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#181614;">Your Pro subscription is active</h1>
        <p style="margin:0 0 16px;font-size:16px;color:#433d36;">Hi ${escapeHtml(customerName)}, your Pro plan is now active at <strong>$${PRO_MONTHLY_PRICE_USD}/month</strong> through Paystack.</p>
        <div style="margin:24px 0;padding:20px;border-radius:18px;background:#f8fbfa;border:1px solid rgba(32,88,79,0.12);">
          <p style="margin:0 0 10px;font-weight:700;color:#20584f;">You now have access to:</p>
          <ul style="margin:0;padding-left:20px;color:#433d36;">
            <li>Unlimited content generations</li>
            <li>Saved strategy workflows</li>
            <li>14-day AI content calendars</li>
          </ul>
        </div>
        <div style="margin-top:24px;">
          <a href="${dashboardUrl}" style="display:inline-block;background:#181614;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;margin-right:10px;">Open Dashboard</a>
          <a href="${pricingUrl}" style="display:inline-block;background:#f4e5e1;color:#7c5645;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">Manage Subscription</a>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#6f685f;">Cancellation stops future renewals only. Previous successful payments are non-refundable.</p>
        <p style="margin:12px 0 0;font-size:13px;color:#6f685f;">Need help? Contact <a href="mailto:${siteConfig.email}" style="color:#20584f;">${siteConfig.email}</a>.</p>
      </div>
    </div>
  `;

  await sendTransactionalEmail({
    to: email,
    subject,
    text,
    html,
    replyTo: siteConfig.email,
  });
}

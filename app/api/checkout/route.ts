import { NextResponse } from "next/server";
import { getBaseUrl } from "@/app/lib/site";
import { getStripeServer } from "@/app/lib/stripe";

export async function POST() {
  const stripe = getStripeServer();
  const priceId = process.env.STRIPE_PRO_PRICE_ID;

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        error: "Stripe checkout is not configured yet. Add your Stripe keys and price ID to enable Pro upgrades.",
      },
      { status: 503 },
    );
  }

  try {
    const siteUrl = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      success_url: `${siteUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      metadata: {
        source: "ai-content-engine-launch",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      {
        error: "Checkout could not be created right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}

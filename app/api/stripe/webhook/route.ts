import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/app/lib/stripe";
import { sendProSubscriptionConfirmationEmail } from "@/app/lib/subscription-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured yet. Add STRIPE_WEBHOOK_SECRET to enable subscription sync." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const incomingSession = event.data.object as Stripe.Checkout.Session;

      if (incomingSession.mode === "subscription") {
        const session = await stripe.checkout.sessions.retrieve(incomingSession.id, {
          expand: ["subscription"],
        });

        await sendProSubscriptionConfirmationEmail(stripe, session);
      }
    }
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return NextResponse.json({ error: "Stripe webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

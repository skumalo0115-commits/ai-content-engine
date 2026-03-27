import { NextResponse } from "next/server";
import { getStripeServer } from "@/app/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeServer();

  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { subscriptionId?: string };
    const subscriptionId = body.subscriptionId?.trim();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing subscription id." }, { status: 400 });
    }

    await stripe.subscriptions.cancel(subscriptionId, {
      prorate: false,
    });

    return NextResponse.json({ cancelled: true });
  } catch {
    return NextResponse.json({ error: "The subscription could not be cancelled right now." }, { status: 500 });
  }
}

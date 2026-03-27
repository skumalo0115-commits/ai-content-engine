import { NextResponse } from "next/server";
import { getStripeServer } from "@/app/lib/stripe";

export async function GET(request: Request) {
  const stripe = getStripeServer();

  if (!stripe) {
    return NextResponse.json({ active: false }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ active: false, error: "Missing session id." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
    const isActive =
      session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
    const subscription = typeof session.subscription === "object" && session.subscription ? session.subscription : null;

    return NextResponse.json({
      active: isActive,
      customerId: typeof session.customer === "string" ? session.customer : null,
      subscriptionId: subscription?.id || (typeof session.subscription === "string" ? session.subscription : null),
      status: subscription?.status || null,
    });
  } catch {
    return NextResponse.json(
      {
        active: false,
        error: "We could not verify your checkout session yet.",
      },
      { status: 400 },
    );
  }
}

import { NextResponse } from "next/server";
import { getPaystackPlan, getPaystackPlanCode, isPaystackConfigured, verifyPaystackTransaction } from "@/app/lib/paystack";
import { sendProSubscriptionConfirmationEmail } from "@/app/lib/subscription-email";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ active: false }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ active: false, error: "Missing transaction reference." }, { status: 400 });
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);
    const plan = await getPaystackPlan();
    const expectedPlanCode = getPaystackPlanCode();
    const expectedAmount = plan.amount || 0;
    const customerId = transaction.customer?.id;
    const customerCode = transaction.customer?.customer_code;
    const email = transaction.customer?.email;
    const customerName = [transaction.customer?.first_name, transaction.customer?.last_name].filter(Boolean).join(" ").trim();
    const matchedPlanCode = transaction.plan_object?.plan_code || transaction.plan || "";
    const isActive =
      transaction.status === "success" &&
      Boolean(transaction.paid_at) &&
      reference.startsWith("ace_") &&
      (matchedPlanCode === expectedPlanCode || transaction.amount === expectedAmount);

    if (isActive && email) {
      try {
        await sendProSubscriptionConfirmationEmail({
          email,
          customerName,
        });
      } catch (emailError) {
        console.error("Pro confirmation email failed during Paystack verification:", emailError);
      }
    }

    return NextResponse.json({
      active: isActive,
      customerId: customerId ? String(customerId) : null,
      customerCode: customerCode || null,
      subscriptionCode: null,
      status: transaction.status || null,
      customerEmail: email || null,
      reference: transaction.reference || reference,
    });
  } catch (error) {
    console.error("Paystack checkout verification failed:", error);
    return NextResponse.json(
      {
        active: false,
        error: "We could not verify your Paystack transaction yet.",
      },
      { status: 400 },
    );
  }
}

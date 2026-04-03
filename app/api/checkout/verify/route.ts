import { NextResponse } from "next/server";
import { getPaystackPlan, getPaystackPlanCode, isPaystackConfigured, listPaystackSubscriptions, verifyPaystackTransaction } from "@/app/lib/paystack";
import { sendProSubscriptionConfirmationEmail } from "@/app/lib/subscription-email";

export const runtime = "nodejs";

function normalizeStatus(status: unknown) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}

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
    const accountUid = typeof transaction.metadata?.uid === "string" ? transaction.metadata.uid : null;
    const isSuccessfulCharge = transaction.status === "success" && Boolean(transaction.paid_at);
    const looksLikeExpectedCheckout =
      reference.startsWith("ace_") &&
      (matchedPlanCode === expectedPlanCode || transaction.amount === expectedAmount);
    const subscriptions =
      isSuccessfulCharge && looksLikeExpectedCheckout && customerId
        ? await listPaystackSubscriptions(String(customerId))
        : [];
    const matchingSubscriptions = subscriptions.filter((item) => item.plan?.plan_code === expectedPlanCode);
    const activeSubscription = matchingSubscriptions.find((item) => normalizeStatus(item.status) === "active") || null;
    const latestSubscription = activeSubscription || matchingSubscriptions[0] || null;
    const subscriptionCustomer =
      latestSubscription?.customer && typeof latestSubscription.customer === "object" ? latestSubscription.customer : null;
    const subscriptionStatus = normalizeStatus(activeSubscription?.status || latestSubscription?.status || transaction.status);
    const isActive = isSuccessfulCharge && looksLikeExpectedCheckout && Boolean(activeSubscription);
    const isPending = looksLikeExpectedCheckout && !isActive;

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
      pending: isPending && !isActive,
      customerId: customerId ? String(customerId) : null,
      customerCode:
        (subscriptionCustomer &&
        "customer_code" in subscriptionCustomer &&
        typeof subscriptionCustomer.customer_code === "string"
          ? subscriptionCustomer.customer_code
          : customerCode) || null,
      subscriptionCode: typeof activeSubscription?.subscription_code === "string" ? activeSubscription.subscription_code : null,
      status: subscriptionStatus || transaction.status || null,
      customerEmail: email || null,
      reference: transaction.reference || reference,
      accountUid,
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

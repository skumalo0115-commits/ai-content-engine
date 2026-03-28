import { NextResponse } from "next/server";
import { getPaystackPlanCode, isPaystackConfigured, listPaystackSubscriptions } from "@/app/lib/paystack";

export const runtime = "nodejs";

function normalizeStatus(status: unknown) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}

export async function GET(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ active: false }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId")?.trim();

  if (!customerId) {
    return NextResponse.json({ active: false, error: "Missing Paystack customer id." }, { status: 400 });
  }

  try {
    const expectedPlanCode = getPaystackPlanCode();
    const subscriptions = await listPaystackSubscriptions(customerId);
    const matchingSubscriptions = subscriptions.filter((item) => item.plan?.plan_code === expectedPlanCode);
    const activeSubscription = matchingSubscriptions.find((item) => normalizeStatus(item.status) === "active");
    const latestSubscription = activeSubscription || matchingSubscriptions[0] || subscriptions[0] || null;
    const customer =
      latestSubscription?.customer && typeof latestSubscription.customer === "object" ? latestSubscription.customer : null;
    const status = normalizeStatus(latestSubscription?.status);

    return NextResponse.json({
      active: status === "active",
      status: status || null,
      customerId,
      customerCode: customer && "customer_code" in customer && typeof customer.customer_code === "string" ? customer.customer_code : null,
      subscriptionCode: typeof latestSubscription?.subscription_code === "string" ? latestSubscription.subscription_code : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        active: false,
        error: error instanceof Error ? error.message : "The Paystack subscription status could not be checked right now.",
      },
      { status: 500 },
    );
  }
}

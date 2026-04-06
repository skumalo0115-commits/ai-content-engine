import { NextResponse } from "next/server";
import { getPaystackManageLink, getPaystackPlanCode, isPaystackConfigured, listPaystackSubscriptions } from "@/app/lib/paystack";

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: "Paystack is not configured yet." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { customerId?: string; subscriptionCode?: string };
    const customerId = body.customerId?.trim();
    const requestedSubscriptionCode = body.subscriptionCode?.trim();

    if (!customerId) {
      return NextResponse.json({ error: "Missing Paystack customer id." }, { status: 400 });
    }

    const expectedPlanCode = getPaystackPlanCode();
    const subscriptions = await listPaystackSubscriptions(customerId);
    const activeSubscription =
      subscriptions.find(
        (item) =>
          item.plan?.plan_code === expectedPlanCode &&
          item.subscription_code &&
          (!requestedSubscriptionCode || item.subscription_code === requestedSubscriptionCode),
      ) ||
      subscriptions.find((item) => item.subscription_code && item.subscription_code === requestedSubscriptionCode);

    if (!activeSubscription?.subscription_code) {
      return NextResponse.json({ error: "No Paystack subscription was found for this customer yet." }, { status: 404 });
    }

    const url = await getPaystackManageLink(activeSubscription.subscription_code);

    if (!url) {
      return NextResponse.json({ error: "Paystack did not return a manage-subscription link right now." }, { status: 500 });
    }

    return NextResponse.json({ cancelled: true, url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "The subscription could not be managed right now." }, { status: 500 });
  }
}

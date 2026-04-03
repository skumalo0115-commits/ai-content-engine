import { NextResponse } from "next/server";
import { getBaseUrl } from "@/app/lib/site";
import { getPaystackPlanCode, getPaystackSecretKeyMode, initializePaystackCheckout, isPaystackConfigured } from "@/app/lib/paystack";

export const runtime = "nodejs";

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      {
        error: "Paystack checkout is not configured yet. Add PAYSTACK_SECRET_KEY and PAYSTACK_PLAN_CODE to enable Pro upgrades.",
      },
      { status: 503 },
    );
  }

  try {
    const siteUrl = getBaseUrl();
    const payload = (await request.json().catch(() => ({}))) as {
      email?: unknown;
      firstName?: unknown;
      lastName?: unknown;
      uid?: unknown;
    };
    const email = cleanValue(payload.email);
    const firstName = cleanValue(payload.firstName);
    const lastName = cleanValue(payload.lastName);
    const uid = cleanValue(payload.uid);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid account email is required before starting Paystack checkout." }, { status: 400 });
    }

    const reference = `ace_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const session = await initializePaystackCheckout({
      email,
      callbackUrl: `${siteUrl}/dashboard?checkout=success`,
      reference,
      metadata: {
        source: "ai-content-engine-launch",
        uid,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({ url: session.authorization_url, reference: session.reference });
  } catch (error) {
    console.error("Paystack checkout initialization failed:", error);
    const planCode = getPaystackPlanCode();
    const paystackMode = getPaystackSecretKeyMode();
    const baseMessage = error instanceof Error ? error.message : "Checkout could not be created right now. Please try again in a moment.";
    const isInvalidPlanError = /plan id\/code specified is invalid/i.test(baseMessage);

    return NextResponse.json(
      {
        error: isInvalidPlanError
          ? `Paystack rejected plan code ${planCode} while using the ${paystackMode} secret key. Make sure the plan exists in that same Paystack mode and account.`
          : baseMessage,
      },
      { status: 500 },
    );
  }
}

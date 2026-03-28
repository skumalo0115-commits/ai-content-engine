import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

type PaystackWebhookPayload = {
  event?: string;
  data?: Record<string, unknown> | null;
};

function getWebhookSignature(request: Request) {
  return request.headers.get("x-paystack-signature")?.trim() || "";
}

function isValidPaystackSignature(rawBody: string, signature: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || "";

  if (!secretKey || !signature) {
    return false;
  }

  const expectedSignature = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  return signature === expectedSignature;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    const candidate = readString(value);

    if (candidate) {
      return candidate;
    }
  }

  return "";
}

async function findMatchingAccountRefs(input: {
  email?: string;
  customerCode?: string;
  subscriptionCode?: string;
}) {
  if (!adminDb) {
    return [];
  }

  const seen = new Map<string, FirebaseFirestore.DocumentReference>();
  const collection = adminDb.collection("accounts");
  const filters: Array<[string, string]> = [];

  if (input.subscriptionCode) {
    filters.push(["subscription.subscriptionCode", input.subscriptionCode]);
  }

  if (input.customerCode) {
    filters.push(["subscription.customerCode", input.customerCode]);
  }

  if (input.email) {
    filters.push(["profile.email", input.email.toLowerCase()]);
    filters.push(["profile.email", input.email]);
  }

  for (const [field, value] of filters) {
    const snapshot = await collection.where(field, "==", value).limit(10).get();

    snapshot.docs.forEach((doc) => {
      seen.set(doc.id, doc.ref);
    });
  }

  return [...seen.values()];
}

async function downgradeAccounts(refs: FirebaseFirestore.DocumentReference[]) {
  if (!refs.length) {
    return 0;
  }

  await Promise.all(
    refs.map((ref) =>
      ref.set(
        {
          plan: "free",
          subscription: null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      ),
    ),
  );

  return refs.length;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = getWebhookSignature(request);

  if (!isValidPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ received: false, error: "Invalid Paystack signature." }, { status: 401 });
  }

  if (!isFirebaseAdminConfigured() || !adminDb) {
    return NextResponse.json({ received: false, error: "Firebase admin is not configured." }, { status: 503 });
  }

  let payload: PaystackWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as PaystackWebhookPayload;
  } catch {
    return NextResponse.json({ received: false, error: "Invalid webhook payload." }, { status: 400 });
  }

  const event = readString(payload.event);

  if (event !== "subscription.not_renew" && event !== "subscription.disable") {
    return NextResponse.json({ received: true, ignored: true, event });
  }

  const data = payload.data || {};
  const customer = data.customer && typeof data.customer === "object" ? data.customer : null;
  const email = pickString(
    customer && "email" in customer ? customer.email : "",
    data.email,
    data.customer_email,
  );
  const customerCode = pickString(
    customer && "customer_code" in customer ? customer.customer_code : "",
    data.customer_code,
  );
  const subscriptionCode = pickString(data.subscription_code, data.subscriptionCode);
  const matchingRefs = await findMatchingAccountRefs({ email, customerCode, subscriptionCode });
  const updatedCount = await downgradeAccounts(matchingRefs);

  return NextResponse.json({
    received: true,
    event,
    updatedCount,
  });
}

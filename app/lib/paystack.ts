const PAYSTACK_API_BASE = "https://api.paystack.co";

type PaystackEnvelope<T> = {
  status: boolean;
  message?: string;
  data: T;
};

export type PaystackInitializeData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type PaystackCustomer = {
  id?: number | string;
  customer_code?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

export type PaystackPlanObject = {
  plan_code?: string;
  amount?: number;
  interval?: string;
};

export type PaystackVerifyData = {
  status?: string;
  amount?: number;
  reference?: string;
  paid_at?: string;
  metadata?: Record<string, unknown> | null;
  customer?: PaystackCustomer;
  plan?: string | null;
  plan_object?: PaystackPlanObject | null;
  authorization?: {
    reusable?: boolean;
    authorization_code?: string;
  } | null;
};

export type PaystackSubscriptionRecord = {
  subscription_code?: string;
  status?: string;
  customer?: number | string | PaystackCustomer | null;
  customer_token?: string | null;
  email_token?: string | null;
  plan?: {
    plan_code?: string;
  } | null;
};

export type PaystackPlan = {
  plan_code?: string;
  amount?: number;
  interval?: string;
  currency?: string;
  name?: string;
};

function getPaystackSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY || "";
}

export function isPaystackConfigured() {
  return Boolean(getPaystackSecretKey() && process.env.PAYSTACK_PLAN_CODE);
}

async function paystackRequest<T>(path: string, init?: RequestInit) {
  const secretKey = getPaystackSecretKey();

  if (!secretKey) {
    throw new Error("Paystack is not configured yet. Add PAYSTACK_SECRET_KEY to enable Pro upgrades.");
  }

  const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as PaystackEnvelope<T>;

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || "Paystack request failed.");
  }

  return payload.data;
}

export function getPaystackPlanCode() {
  return process.env.PAYSTACK_PLAN_CODE || "";
}

export async function getPaystackPlan(planCode = getPaystackPlanCode()) {
  if (!planCode) {
    throw new Error("Paystack is not configured yet. Add PAYSTACK_PLAN_CODE to enable Pro upgrades.");
  }

  return paystackRequest<PaystackPlan>(`/plan/${encodeURIComponent(planCode)}`, {
    method: "GET",
  });
}

export async function initializePaystackCheckout(input: {
  email: string;
  callbackUrl: string;
  reference: string;
  metadata?: Record<string, unknown>;
}) {
  const planCode = getPaystackPlanCode();

  if (!planCode) {
    throw new Error("Paystack is not configured yet. Add PAYSTACK_PLAN_CODE to enable Pro upgrades.");
  }

  const plan = await getPaystackPlan(planCode);

  if (!plan.amount || !Number.isFinite(plan.amount) || plan.amount <= 0) {
    throw new Error("Your Paystack plan does not have a valid recurring amount yet.");
  }

  return paystackRequest<PaystackInitializeData>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: plan.amount,
      plan: planCode,
      callback_url: input.callbackUrl,
      reference: input.reference,
      metadata: input.metadata || {},
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<PaystackVerifyData>(`/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
  });
}

export async function listPaystackSubscriptions(customerId: string) {
  return paystackRequest<PaystackSubscriptionRecord[]>(`/subscription?customer=${encodeURIComponent(customerId)}`, {
    method: "GET",
  });
}

export async function getPaystackManageLink(subscriptionCode: string) {
  const data = await paystackRequest<{ link?: string; manage_link?: string; url?: string }>(
    `/subscription/${encodeURIComponent(subscriptionCode)}/manage/link`,
    {
      method: "GET",
    },
  );

  return data.link || data.manage_link || data.url || "";
}

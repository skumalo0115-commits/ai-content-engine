"use client";

import type { PlanKey, StoredSubscription, UsageLimitState } from "./types";
import { FREE_DAILY_GENERATIONS } from "./site";

const usageKey = "ace-free-usage-v2";
const legacyUsageKey = "ace-free-usage-v1";
const planKey = "ace-launch-plan-v1";
const subscriptionKey = "ace-paystack-subscription-v1";
const usageScopeKey = "ace-auth-usage-scope-v1";
export const planChangeEventName = "ace-plan-change";

function getPlanStorageKey() {
  return `${planKey}:${getUsageScope()}`;
}

function getSubscriptionStorageKey() {
  return `${subscriptionKey}:${getUsageScope()}`;
}

function getUsageScope() {
  if (typeof window === "undefined") {
    return "guest";
  }

  return window.localStorage.getItem(usageScopeKey) || "guest";
}

export function getUsageAccountScope() {
  return getUsageScope();
}

function getUsageStorageKey() {
  return `${usageKey}:${getUsageScope()}`;
}

function getGuestUsageStorageKey() {
  return `${usageKey}:guest`;
}

function getScopedUsageStorageKey(scope: string) {
  return `${usageKey}:${scope}`;
}

function normalizeUsageCount(value: unknown) {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

function getUsageCountFromRaw(raw: string | null) {
  if (!raw) {
    return 0;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UsageLimitState>;
    return normalizeUsageCount(parsed.count);
  } catch {
    return 0;
  }
}

function getLegacyUsageCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  return getUsageCountFromRaw(window.localStorage.getItem(legacyUsageKey));
}

function getStoredUsageCount(storageKey: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  return getUsageCountFromRaw(window.localStorage.getItem(storageKey));
}

function getFreshUsageState(): UsageLimitState {
  return {
    count: getLegacyUsageCount(),
  };
}

export function getUsageState(): UsageLimitState {
  if (typeof window === "undefined") {
    return getFreshUsageState();
  }

  const raw = window.localStorage.getItem(getUsageStorageKey());

  if (!raw) {
    const fresh = getFreshUsageState();
    window.localStorage.setItem(getUsageStorageKey(), JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UsageLimitState>;
    const nextState: UsageLimitState = {
      count: normalizeUsageCount(parsed.count),
    };

    window.localStorage.setItem(getUsageStorageKey(), JSON.stringify(nextState));
    return nextState;
  } catch {
    const fresh = getFreshUsageState();
    window.localStorage.setItem(getUsageStorageKey(), JSON.stringify(fresh));
    return fresh;
  }
}

export function getRemainingFreeGenerations() {
  const state = getUsageState();
  return Math.max(0, FREE_DAILY_GENERATIONS - state.count);
}

export function getHighestStoredUsageCount(scope?: string | null) {
  if (typeof window === "undefined") {
    return 0;
  }

  const scopedCount = scope ? getStoredUsageCount(getScopedUsageStorageKey(scope)) : getStoredUsageCount(getUsageStorageKey());
  const guestCount = getStoredUsageCount(getGuestUsageStorageKey());
  const legacyCount = getLegacyUsageCount();

  return Math.max(scopedCount, guestCount, legacyCount);
}

export function incrementFreeGeneration() {
  const state = getUsageState();
  const nextState = {
    ...state,
    count: state.count + 1,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(getUsageStorageKey(), JSON.stringify(nextState));
  }

  return Math.max(0, FREE_DAILY_GENERATIONS - nextState.count);
}

export function setUsageStateCount(count: number) {
  if (typeof window === "undefined") {
    return;
  }

  const nextState: UsageLimitState = {
    count: Math.max(0, Number.isFinite(count) ? Number(count) : 0),
  };

  window.localStorage.setItem(getUsageStorageKey(), JSON.stringify(nextState));
}

export function clearLegacyUsageState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getGuestUsageStorageKey());
  window.localStorage.removeItem(legacyUsageKey);
}

export function setUsageAccountScope(uid: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (uid) {
    window.localStorage.setItem(usageScopeKey, uid);
  } else {
    window.localStorage.removeItem(usageScopeKey);
  }

  window.dispatchEvent(new CustomEvent(planChangeEventName, { detail: getStoredPlan() }));
}

export function getStoredPlan(): PlanKey {
  if (typeof window === "undefined") {
    return "free";
  }

  const scopedValue = window.localStorage.getItem(getPlanStorageKey());

  if (scopedValue === "pro") {
    const scopedSubscription = getStoredSubscription();

    if (scopedSubscription?.customerId) {
      return "pro";
    }

  return "free";
}

export function setStoredPlan(plan: PlanKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getPlanStorageKey(), plan);
  window.dispatchEvent(new CustomEvent(planChangeEventName, { detail: plan }));
}

export function getStoredSubscription(): StoredSubscription | null {
  if (typeof window === "undefined") {
    return null;
  }

  const scopedKey = getSubscriptionStorageKey();
  const raw = window.localStorage.getItem(scopedKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSubscription>;
    if (typeof parsed.customerId === "string" && typeof parsed.status === "string") {
      const nextSubscription = {
        provider: "paystack" as const,
        customerId: parsed.customerId,
        customerCode: typeof parsed.customerCode === "string" ? parsed.customerCode : undefined,
        subscriptionCode: typeof parsed.subscriptionCode === "string" ? parsed.subscriptionCode : undefined,
        email: typeof parsed.email === "string" ? parsed.email : undefined,
        reference: typeof parsed.reference === "string" ? parsed.reference : undefined,
        status: parsed.status,
      };

      window.localStorage.setItem(scopedKey, JSON.stringify(nextSubscription));
      return nextSubscription;
    }
  } catch {
    window.localStorage.removeItem(scopedKey);
  }

  return null;
}

export function setStoredSubscription(subscription: StoredSubscription) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getSubscriptionStorageKey(), JSON.stringify(subscription));
}

export function clearStoredSubscription() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getSubscriptionStorageKey());
}

export function clearAllStoredBillingState() {
  if (typeof window === "undefined") {
    return;
  }

  const keysToRemove: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key) {
      continue;
    }

    if (key === planKey || key === subscriptionKey || key.startsWith(`${planKey}:`) || key.startsWith(`${subscriptionKey}:`)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent(planChangeEventName, { detail: "free" }));
}

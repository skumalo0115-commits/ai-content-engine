"use client";

import type { PlanKey, StoredSubscription, UsageLimitState } from "./types";
import { FREE_DAILY_GENERATIONS } from "./site";

const usageKey = "ace-free-usage-v1";
const planKey = "ace-launch-plan-v1";
const subscriptionKey = "ace-stripe-subscription-v1";
export const planChangeEventName = "ace-plan-change";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getFreshUsageState(): UsageLimitState {
  return {
    dateKey: getTodayKey(),
    count: 0,
  };
}

export function getUsageState(): UsageLimitState {
  if (typeof window === "undefined") {
    return getFreshUsageState();
  }

  const raw = window.localStorage.getItem(usageKey);

  if (!raw) {
    const fresh = getFreshUsageState();
    window.localStorage.setItem(usageKey, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UsageLimitState>;
    if (parsed.dateKey !== getTodayKey()) {
      const fresh = getFreshUsageState();
      window.localStorage.setItem(usageKey, JSON.stringify(fresh));
      return fresh;
    }

    const nextState: UsageLimitState = {
      dateKey: parsed.dateKey || getTodayKey(),
      count: Number.isFinite(parsed.count) ? Math.max(0, Number(parsed.count)) : 0,
    };

    window.localStorage.setItem(usageKey, JSON.stringify(nextState));
    return nextState;
  } catch {
    const fresh = getFreshUsageState();
    window.localStorage.setItem(usageKey, JSON.stringify(fresh));
    return fresh;
  }
}

export function getRemainingFreeGenerations() {
  const state = getUsageState();
  return Math.max(0, FREE_DAILY_GENERATIONS - state.count);
}

export function incrementFreeGeneration() {
  const state = getUsageState();
  const nextState = {
    ...state,
    count: state.count + 1,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(usageKey, JSON.stringify(nextState));
  }

  return Math.max(0, FREE_DAILY_GENERATIONS - nextState.count);
}

export function getStoredPlan(): PlanKey {
  if (typeof window === "undefined") {
    return "free";
  }

  return window.localStorage.getItem(planKey) === "pro" ? "pro" : "free";
}

export function setStoredPlan(plan: PlanKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(planKey, plan);
  window.dispatchEvent(new CustomEvent(planChangeEventName, { detail: plan }));
}

export function getStoredSubscription(): StoredSubscription | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(subscriptionKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSubscription>;
    if (typeof parsed.customerId === "string" && typeof parsed.subscriptionId === "string" && typeof parsed.status === "string") {
      return {
        customerId: parsed.customerId,
        subscriptionId: parsed.subscriptionId,
        status: parsed.status,
      };
    }
  } catch {
    window.localStorage.removeItem(subscriptionKey);
  }

  return null;
}

export function setStoredSubscription(subscription: StoredSubscription) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(subscriptionKey, JSON.stringify(subscription));
}

export function clearStoredSubscription() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(subscriptionKey);
}

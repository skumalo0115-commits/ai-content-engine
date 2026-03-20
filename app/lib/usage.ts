"use client";

import type { PlanKey, UsageLimitState } from "./types";
import { FREE_DAILY_GENERATIONS } from "./site";

const usageKey = "ace-free-usage-v1";
const planKey = "ace-launch-plan-v1";

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
}

"use client";

import type { GeneratePayload, GeneratedStrategy } from "./types";
import { getUsageAccountScope } from "./usage";

type PinnedDashboardOutput = {
  brief: GeneratePayload;
  strategy: GeneratedStrategy;
  sourceLabel: string;
};

const pinnedOutputKey = "ace-pinned-output-v1";

function getPinnedOutputStorageKey() {
  return `${pinnedOutputKey}:${getUsageAccountScope()}`;
}

function isGeneratedStrategy(value: unknown): value is GeneratedStrategy {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeneratedStrategy>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.overview === "string" &&
    typeof candidate.instagramPlan === "string" &&
    typeof candidate.tiktokPlan === "string" &&
    typeof candidate.facebookLinkedInPlan === "string" &&
    typeof candidate.hashtagPlan === "string" &&
    Array.isArray(candidate.fiveDayPlan) &&
    Array.isArray(candidate.videoRecommendations)
  );
}

function isGeneratePayload(value: unknown): value is GeneratePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeneratePayload>;
  return typeof candidate.businessType === "string" && typeof candidate.targetAudience === "string" && typeof candidate.goal === "string";
}

function normalizePinnedOutput(value: unknown): PinnedDashboardOutput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<PinnedDashboardOutput>;

  if (!isGeneratePayload(candidate.brief) || !isGeneratedStrategy(candidate.strategy) || typeof candidate.sourceLabel !== "string") {
    return null;
  }

  return {
    brief: candidate.brief,
    strategy: candidate.strategy,
    sourceLabel: candidate.sourceLabel,
  };
}

export function getPinnedDashboardOutput() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getPinnedOutputStorageKey());

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const normalized = normalizePinnedOutput(parsed);

    if (!normalized) {
      window.localStorage.removeItem(getPinnedOutputStorageKey());
      return null;
    }

    return normalized;
  } catch {
    window.localStorage.removeItem(getPinnedOutputStorageKey());
    return null;
  }
}

export function setPinnedDashboardOutput(value: PinnedDashboardOutput) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getPinnedOutputStorageKey(), JSON.stringify(value));
}

export function clearPinnedDashboardOutput() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getPinnedOutputStorageKey());
}

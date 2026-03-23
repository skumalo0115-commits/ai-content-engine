"use client";

import type { GeneratePayload, GeneratedStrategy, SavedStrategy } from "./types";

const savedContentKey = "ace-saved-content-v1";

function getStrategySignature(entry: { brief: GeneratePayload; strategy: GeneratedStrategy }) {
  return JSON.stringify({
    businessType: entry.brief.businessType.trim().toLowerCase(),
    targetAudience: entry.brief.targetAudience.trim().toLowerCase(),
    goal: entry.brief.goal.trim().toLowerCase(),
    title: entry.strategy.title.trim(),
    overview: entry.strategy.overview.trim(),
    instagramPlan: entry.strategy.instagramPlan.trim(),
    tiktokPlan: entry.strategy.tiktokPlan.trim(),
    facebookLinkedInPlan: entry.strategy.facebookLinkedInPlan.trim(),
    hashtagPlan: entry.strategy.hashtagPlan.trim(),
    fiveDayPlan: entry.strategy.fiveDayPlan,
    videoRecommendations: entry.strategy.videoRecommendations,
  });
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

function getSavedContentFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(savedContentKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is SavedStrategy => {
      if (!entry || typeof entry !== "object") {
        return false;
      }

      const candidate = entry as Partial<SavedStrategy>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.createdAt === "string" &&
        isGeneratePayload(candidate.brief) &&
        isGeneratedStrategy(candidate.strategy)
      );
    });
  } catch {
    return [];
  }
}

function setSavedContent(entries: SavedStrategy[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(savedContentKey, JSON.stringify(entries));
}

export function getSavedStrategies() {
  return getSavedContentFromStorage().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function hasSavedStrategy(entry: { brief: GeneratePayload; strategy: GeneratedStrategy }) {
  const signature = getStrategySignature(entry);
  return getSavedStrategies().some((savedEntry) => getStrategySignature(savedEntry) === signature);
}

export function saveGeneratedStrategy(entry: { brief: GeneratePayload; strategy: GeneratedStrategy }) {
  const savedEntries = getSavedStrategies();
  const signature = getStrategySignature(entry);
  const existingEntry = savedEntries.find((savedEntry) => getStrategySignature(savedEntry) === signature);

  if (existingEntry) {
    return { nextEntry: existingEntry, nextEntries: savedEntries, isDuplicate: true };
  }

  const nextEntry: SavedStrategy = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    brief: entry.brief,
    strategy: entry.strategy,
  };

  const nextEntries = [nextEntry, ...savedEntries];
  setSavedContent(nextEntries);
  return { nextEntry, nextEntries, isDuplicate: false };
}

export function deleteSavedStrategy(id: string) {
  const nextEntries = getSavedStrategies().filter((entry) => entry.id !== id);
  setSavedContent(nextEntries);
  return nextEntries;
}

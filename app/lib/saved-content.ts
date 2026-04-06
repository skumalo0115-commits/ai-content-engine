"use client";

import { firebaseAuth } from "./firebase";
import { updateAccountSavedContent } from "./account-store";
import { syncAccountStateToServer } from "./account-sync";
import type { GeneratePayload, GeneratedCalendar, GeneratedStrategy, SavedStrategy } from "./types";
import { getUsageAccountScope } from "./usage";

const savedContentKey = "ace-saved-content-v1";
const deletedSavedContentKey = "ace-deleted-saved-content-v1";

function getSavedContentStorageKey() {
  return `${savedContentKey}:${getUsageAccountScope()}`;
}

function getDeletedSavedContentStorageKey() {
  return `${deletedSavedContentKey}:${getUsageAccountScope()}`;
}

function hasScopedSavedContentStorage() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(getSavedContentStorageKey()) !== null;
}

function getGuestSavedContentStorageKey() {
  return `${savedContentKey}:guest`;
}

function getLegacySavedContentStorageKey() {
  return savedContentKey;
}

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

function isGeneratedCalendar(value: unknown): value is GeneratedCalendar {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeneratedCalendar>;
  return typeof candidate.title === "string" && typeof candidate.summary === "string" && Array.isArray(candidate.entries);
}

function isGeneratePayload(value: unknown): value is GeneratePayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GeneratePayload>;
  return typeof candidate.businessType === "string" && typeof candidate.targetAudience === "string" && typeof candidate.goal === "string";
}

function normalizeSavedContent(value: unknown): SavedStrategy[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is SavedStrategy => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    const candidate = entry as Partial<SavedStrategy>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.createdAt === "string" &&
      isGeneratePayload(candidate.brief) &&
      isGeneratedStrategy(candidate.strategy) &&
      (candidate.calendar == null || isGeneratedCalendar(candidate.calendar))
    );
  });
}

function getSavedContentFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getSavedContentStorageKey());
  if (!raw) {
    return [];
  }

  try {
    return normalizeSavedContent(JSON.parse(raw) as unknown[]);
  } catch {
    window.localStorage.removeItem(getSavedContentStorageKey());
    return [];
  }
}

function getLegacySavedContentFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getLegacySavedContentStorageKey());
  if (!raw) {
    return [];
  }

  try {
    return normalizeSavedContent(JSON.parse(raw) as unknown[]);
  } catch {
    window.localStorage.removeItem(getLegacySavedContentStorageKey());
    return [];
  }
}

function getGuestSavedContentFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getGuestSavedContentStorageKey());
  if (!raw) {
    return [];
  }

  try {
    return normalizeSavedContent(JSON.parse(raw) as unknown[]);
  } catch {
    window.localStorage.removeItem(getGuestSavedContentStorageKey());
    return [];
  }
}

function getDeletedSavedContentIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getDeletedSavedContentStorageKey());
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
  } catch {
    window.localStorage.removeItem(getDeletedSavedContentStorageKey());
    return [];
  }
}

function setDeletedSavedContentIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  window.localStorage.setItem(getDeletedSavedContentStorageKey(), JSON.stringify(uniqueIds));
}

function setSavedContent(entries: SavedStrategy[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getSavedContentStorageKey(), JSON.stringify(entries));
}

function clearLegacySavedContentSources() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getGuestSavedContentStorageKey());
  window.localStorage.removeItem(getLegacySavedContentStorageKey());
}

function getCurrentAccountUid() {
  const activeUid = firebaseAuth?.currentUser?.uid;

  if (activeUid) {
    return activeUid;
  }

  const scopedUid = getUsageAccountScope();
  return scopedUid && scopedUid !== "guest" ? scopedUid : null;
}

async function persistSavedContent(entries: SavedStrategy[]) {
  setSavedContent(entries);

  const currentAccountUid = getCurrentAccountUid();
  if (!currentAccountUid) {
    return;
  }

  clearLegacySavedContentSources();

  try {
    await syncAccountStateToServer({ savedContent: entries });
  } catch {
    await updateAccountSavedContent(currentAccountUid, entries);
  }
}

export function getSavedStrategies() {
  const scopedEntries = getSavedContentFromStorage();
  const guestEntries = getGuestSavedContentFromStorage();
  const legacyEntries = getLegacySavedContentFromStorage();
  const entries = hasScopedSavedContentStorage() ? scopedEntries : guestEntries.length > 0 ? guestEntries : legacyEntries;
  const deletedIds = new Set(getDeletedSavedContentIds());
  return entries.filter((entry) => !deletedIds.has(entry.id)).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function hasSavedStrategy(entry: { brief: GeneratePayload; strategy: GeneratedStrategy }) {
  const signature = getStrategySignature(entry);
  return getSavedStrategies().some((savedEntry) => getStrategySignature(savedEntry) === signature);
}

function mergeSavedContent(primaryEntries: SavedStrategy[], secondaryEntries: SavedStrategy[]) {
  const mergedEntries: SavedStrategy[] = [];
  const seenIds = new Set<string>();
  const seenSignatures = new Set<string>();

  for (const entry of [...primaryEntries, ...secondaryEntries]) {
    const signature = getStrategySignature(entry);

    if (seenIds.has(entry.id) || seenSignatures.has(signature)) {
      continue;
    }

    seenIds.add(entry.id);
    seenSignatures.add(signature);
    mergedEntries.push(entry);
  }

  return mergedEntries.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function hydrateSavedStrategies(entries: SavedStrategy[]) {
  const normalizedEntries = normalizeSavedContent(entries).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const localEntries = mergeSavedContent(getSavedContentFromStorage(), [...getGuestSavedContentFromStorage(), ...getLegacySavedContentFromStorage()]);
  const deletedIds = new Set(getDeletedSavedContentIds());
  const currentAccountUid = getCurrentAccountUid();

  if (currentAccountUid) {
    const mergedEntries = mergeSavedContent(localEntries, normalizedEntries).filter((entry) => !deletedIds.has(entry.id));
    const hasRemoteChanges = JSON.stringify(normalizedEntries) !== JSON.stringify(mergedEntries);
    setSavedContent(mergedEntries);
    clearLegacySavedContentSources();

    if (hasRemoteChanges) {
      try {
        await syncAccountStateToServer({ savedContent: mergedEntries });
      } catch {
        await updateAccountSavedContent(currentAccountUid, mergedEntries);
      }
    }

    return mergedEntries;
  }

  const mergedGuestEntries = mergeSavedContent(normalizedEntries, localEntries).filter((entry) => !deletedIds.has(entry.id));
  setSavedContent(mergedGuestEntries);
  return mergedGuestEntries;
}

export function markSavedStrategyDeleted(id: string) {
  if (!id) {
    return;
  }

  const nextIds = [...getDeletedSavedContentIds(), id];
  setDeletedSavedContentIds(nextIds);
}

export function restoreDeletedSavedStrategy(id: string) {
  if (!id) {
    return;
  }

  const nextIds = getDeletedSavedContentIds().filter((entryId) => entryId !== id);
  setDeletedSavedContentIds(nextIds);
}

export async function saveGeneratedStrategy(entry: { brief: GeneratePayload; strategy: GeneratedStrategy }) {
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
  await persistSavedContent(nextEntries);
  return { nextEntry, nextEntries, isDuplicate: false };
}

export async function replaceSavedStrategies(entries: SavedStrategy[]) {
  const normalizedEntries = normalizeSavedContent(entries).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  await persistSavedContent(normalizedEntries);
  return normalizedEntries;
}

export async function deleteSavedStrategy(id: string) {
  const nextEntries = getSavedStrategies().filter((entry) => entry.id !== id);
  await persistSavedContent(nextEntries);
  return nextEntries;
}

export async function saveGeneratedCalendar(id: string, calendar: GeneratedCalendar) {
  const nextEntries = getSavedStrategies().map((entry) => (entry.id === id ? { ...entry, calendar } : entry));
  await persistSavedContent(nextEntries);
  return nextEntries;
}

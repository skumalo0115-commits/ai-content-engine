"use client";

import { firebaseAuth } from "./firebase";
import type { AccountRecord, SavedStrategy } from "./types";

type SyncPayload = {
  savedContent?: SavedStrategy[];
  usageCount?: number;
};

type TokenCapableUser = {
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
};

export async function syncAccountStateToServer(payload: SyncPayload) {
  const idToken = await getCurrentIdToken();

  if (!idToken) {
    return null;
  }

  const response = await fetch("/api/account/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Could not sync your account state.");
  }

  return (await response.json()) as { ok: true; usageCount?: number; savedCount?: number | null };
}

export async function fetchAccountStateFromServer() {
  const idToken = await getCurrentIdToken();

  if (!idToken) {
    return null;
  }

  const response = await fetch("/api/account/sync", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Could not load your account state.");
  }

  return (await response.json()) as { ok: true; record: AccountRecord };
}

async function getCurrentIdToken() {
  const currentUser = firebaseAuth?.currentUser;

  if (!currentUser) {
    return null;
  }

  return (currentUser as unknown as TokenCapableUser).getIdToken();
}

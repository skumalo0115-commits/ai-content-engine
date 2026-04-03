"use client";

import { firebaseAuth } from "./firebase";
import type { SavedStrategy } from "./types";

type SyncPayload = {
  savedContent?: SavedStrategy[];
  usageCount?: number;
};

type TokenCapableUser = {
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
};

export async function syncAccountStateToServer(payload: SyncPayload) {
  const currentUser = firebaseAuth?.currentUser;

  if (!currentUser) {
    return null;
  }

  const idToken = await (currentUser as unknown as TokenCapableUser).getIdToken();
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

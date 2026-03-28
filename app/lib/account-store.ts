"use client";

import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { AccountProfile, AccountRecord, PlanKey, StoredSubscription } from "./types";

function getAccountDoc(uid: string) {
  if (!firebaseDb) {
    return null;
  }

  return doc(firebaseDb, "accounts", uid);
}

function normalizePlan(value: unknown): PlanKey {
  return value === "pro" ? "pro" : "free";
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSubscription(value: unknown): StoredSubscription | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<StoredSubscription>;

  if (candidate.provider !== "paystack" || typeof candidate.customerId !== "string" || typeof candidate.status !== "string") {
    return null;
  }

  return {
    provider: "paystack",
    customerId: candidate.customerId,
    customerCode: typeof candidate.customerCode === "string" ? candidate.customerCode : undefined,
    subscriptionCode: typeof candidate.subscriptionCode === "string" ? candidate.subscriptionCode : undefined,
    email: typeof candidate.email === "string" ? candidate.email : undefined,
    reference: typeof candidate.reference === "string" ? candidate.reference : undefined,
    status: candidate.status,
  };
}

function normalizeProfile(value: unknown, fallbackProfile: AccountProfile): AccountProfile {
  if (!value || typeof value !== "object") {
    return fallbackProfile;
  }

  const candidate = value as Partial<AccountProfile>;

  return {
    firstName: normalizeString(candidate.firstName) || fallbackProfile.firstName,
    lastName: normalizeString(candidate.lastName) || fallbackProfile.lastName,
    email: normalizeString(candidate.email) || fallbackProfile.email,
    company: normalizeString(candidate.company) || fallbackProfile.company,
    role: normalizeString(candidate.role) || fallbackProfile.role,
  };
}

function normalizeAccountRecord(value: unknown, fallbackProfile: AccountProfile): AccountRecord {
  if (!value || typeof value !== "object") {
    return {
      plan: "free",
      profile: fallbackProfile,
      subscription: null,
      updatedAt: new Date().toISOString(),
    };
  }

  const candidate = value as Partial<AccountRecord>;

  return {
    plan: normalizePlan(candidate.plan),
    profile: normalizeProfile(candidate.profile, fallbackProfile),
    subscription: normalizeSubscription(candidate.subscription),
    updatedAt: normalizeString(candidate.updatedAt) || new Date().toISOString(),
  };
}

function buildPatch(partial: Partial<AccountRecord>) {
  return {
    ...partial,
    updatedAt: new Date().toISOString(),
  };
}

export async function ensureAccountRecord(uid: string, fallbackProfile: AccountProfile) {
  const ref = getAccountDoc(uid);

  if (!ref) {
    return null;
  }

  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    return normalizeAccountRecord(snapshot.data(), fallbackProfile);
  }

  const nextRecord: AccountRecord = {
    plan: "free",
    profile: fallbackProfile,
    subscription: null,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(ref, nextRecord, { merge: true });
  return nextRecord;
}

export function subscribeToAccountRecord(
  uid: string,
  fallbackProfile: AccountProfile,
  onRecord: (record: AccountRecord | null) => void,
) {
  const ref = getAccountDoc(uid);

  if (!ref) {
    onRecord(null);
    return () => {};
  }

  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      void ensureAccountRecord(uid, fallbackProfile)
        .then((record) => onRecord(record))
        .catch(() => onRecord(null));
      return;
    }

    onRecord(normalizeAccountRecord(snapshot.data(), fallbackProfile));
  });
}

export async function updateAccountProfile(uid: string, profile: AccountProfile) {
  const ref = getAccountDoc(uid);

  if (!ref) {
    return;
  }

  await setDoc(ref, buildPatch({ profile }), { merge: true });
}

export async function activateAccountSubscription(uid: string, input: { profile: AccountProfile; subscription: StoredSubscription }) {
  const ref = getAccountDoc(uid);

  if (!ref) {
    return;
  }

  await setDoc(
    ref,
    buildPatch({
      plan: "pro",
      profile: input.profile,
      subscription: input.subscription,
    }),
    { merge: true },
  );
}

export async function setAccountPlan(uid: string, plan: PlanKey) {
  const ref = getAccountDoc(uid);

  if (!ref) {
    return;
  }

  await setDoc(ref, buildPatch({ plan }), { merge: true });
}

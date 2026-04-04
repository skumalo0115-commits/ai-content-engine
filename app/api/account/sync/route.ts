import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/app/lib/firebase-admin";
import type { AccountProfile, AccountRecord, GeneratedCalendar, GeneratePayload, GeneratedStrategy, SavedStrategy, StoredSubscription } from "@/app/lib/types";

export const runtime = "nodejs";

const ACCOUNT_STATE_COLLECTION = "account_state";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: unknown) {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

function normalizePlan(value: unknown) {
  return value === "pro" ? "pro" : "free";
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

function getStrategySignature(entry: SavedStrategy) {
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

function buildFallbackProfile(decodedToken: { name?: string; email?: string }) {
  const nameParts = normalizeString(decodedToken.name).split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "Jonny";
  const lastName = nameParts.slice(1).join(" ");

  const fallbackProfile: AccountProfile = {
    firstName,
    lastName,
    email: normalizeString(decodedToken.email),
    company: "",
    role: "",
  };

  return fallbackProfile;
}

function getAccountStateKey(email: string | null | undefined, uid: string) {
  const normalizedEmail = normalizeString(email).toLowerCase();
  return normalizedEmail || `uid:${uid}`;
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

function normalizeAccountRecord(value: unknown, fallbackProfile: AccountProfile): AccountRecord {
  if (!value || typeof value !== "object") {
    return {
      plan: "free",
      profile: fallbackProfile,
      subscription: null,
      savedContent: [],
      usageCount: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  const candidate = value as Partial<AccountRecord>;

  return {
    plan: normalizePlan(candidate.plan),
    profile: normalizeProfile(candidate.profile, fallbackProfile),
    subscription: normalizeSubscription(candidate.subscription),
    savedContent: normalizeSavedContent(candidate.savedContent),
    usageCount: normalizeCount(candidate.usageCount),
    updatedAt: normalizeString(candidate.updatedAt) || new Date().toISOString(),
  };
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured() || !adminDb || !adminAuth) {
    return NextResponse.json({ ok: false, error: "Firebase admin is not configured." }, { status: 503 });
  }

  const idToken = getBearerToken(request);

  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Missing auth token." }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const fallbackProfile = buildFallbackProfile({ name: decodedToken.name, email: decodedToken.email });
    const payload = (await request.json()) as Partial<{ savedContent: unknown; usageCount: unknown }>;
    const accountRef = adminDb.collection("accounts").doc(decodedToken.uid);
    const accountStateRef = adminDb.collection(ACCOUNT_STATE_COLLECTION).doc(getAccountStateKey(decodedToken.email, decodedToken.uid));
    const [accountSnapshot, accountStateSnapshot] = await Promise.all([accountRef.get(), accountStateRef.get()]);
    const uidRecord = normalizeAccountRecord(accountSnapshot.data(), fallbackProfile);
    const canonicalRecord = normalizeAccountRecord(accountStateSnapshot.data(), fallbackProfile);
    const nextSavedContentInput = "savedContent" in payload ? normalizeSavedContent(payload.savedContent) : undefined;
    const nextUsageCount = "usageCount" in payload ? normalizeCount(payload.usageCount) : undefined;
    const mergedSavedContent = typeof nextSavedContentInput !== "undefined"
      ? mergeSavedContent(mergeSavedContent(canonicalRecord.savedContent, uidRecord.savedContent), nextSavedContentInput)
      : mergeSavedContent(canonicalRecord.savedContent, uidRecord.savedContent);
    const mergedUsageCount = typeof nextUsageCount === "number"
      ? Math.max(canonicalRecord.usageCount, uidRecord.usageCount, nextUsageCount)
      : Math.max(canonicalRecord.usageCount, uidRecord.usageCount);
    const mergedRecord: AccountRecord = {
      plan: uidRecord.plan === "pro" || canonicalRecord.plan === "pro" ? "pro" : "free",
      profile: normalizeProfile(uidRecord.profile, canonicalRecord.profile),
      subscription: uidRecord.subscription || canonicalRecord.subscription,
      savedContent: mergedSavedContent,
      usageCount: mergedUsageCount,
      updatedAt: new Date().toISOString(),
    };
    const canonicalPatch = {
      ...mergedRecord,
      email: normalizeString(decodedToken.email).toLowerCase(),
      uid: decodedToken.uid,
      lastSyncedAt: FieldValue.serverTimestamp(),
    };

    await Promise.all([
      accountStateRef.set(canonicalPatch, { merge: true }),
      accountRef.set(
        {
          ...mergedRecord,
          lastSyncedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ]);

    return NextResponse.json({
      ok: true,
      usageCount: mergedRecord.usageCount,
      savedCount: mergedRecord.savedContent.length,
    });
  } catch (error) {
    console.error("Account sync failed:", error);
    return NextResponse.json({ ok: false, error: "Account sync failed." }, { status: 401 });
  }
}

export async function GET(request: Request) {
  if (!isFirebaseAdminConfigured() || !adminDb || !adminAuth) {
    return NextResponse.json({ ok: false, error: "Firebase admin is not configured." }, { status: 503 });
  }

  const idToken = getBearerToken(request);

  if (!idToken) {
    return NextResponse.json({ ok: false, error: "Missing auth token." }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const fallbackProfile = buildFallbackProfile({ name: decodedToken.name, email: decodedToken.email });
    const accountRef = adminDb.collection("accounts").doc(decodedToken.uid);
    const accountStateRef = adminDb.collection(ACCOUNT_STATE_COLLECTION).doc(getAccountStateKey(decodedToken.email, decodedToken.uid));
    const [accountSnapshot, accountStateSnapshot] = await Promise.all([accountRef.get(), accountStateRef.get()]);
    const uidRecord = normalizeAccountRecord(accountSnapshot.data(), fallbackProfile);
    const canonicalRecord = normalizeAccountRecord(accountStateSnapshot.data(), fallbackProfile);
    const record: AccountRecord = {
      plan: uidRecord.plan === "pro" || canonicalRecord.plan === "pro" ? "pro" : "free",
      profile: normalizeProfile(uidRecord.profile, canonicalRecord.profile),
      subscription: uidRecord.subscription || canonicalRecord.subscription,
      savedContent: mergeSavedContent(canonicalRecord.savedContent, uidRecord.savedContent),
      usageCount: Math.max(canonicalRecord.usageCount, uidRecord.usageCount),
      updatedAt: new Date().toISOString(),
    };

    await Promise.all([
      accountStateRef.set(
        {
          ...record,
          email: normalizeString(decodedToken.email).toLowerCase(),
          uid: decodedToken.uid,
          lastSyncedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
      accountRef.set(
        {
          ...record,
          lastSyncedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ]);

    return NextResponse.json({
      ok: true,
      record,
    });
  } catch (error) {
    console.error("Account fetch failed:", error);
    return NextResponse.json({ ok: false, error: "Account fetch failed." }, { status: 401 });
  }
}

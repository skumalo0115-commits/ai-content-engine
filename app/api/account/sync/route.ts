import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@/app/lib/firebase-admin";
import type { AccountProfile, GeneratedCalendar, GeneratePayload, GeneratedStrategy, SavedStrategy } from "@/app/lib/types";

export const runtime = "nodejs";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCount(value: unknown) {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
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
    const payload = (await request.json()) as Partial<{ savedContent: unknown; usageCount: unknown }>;
    const accountRef = adminDb.collection("accounts").doc(decodedToken.uid);
    const accountSnapshot = await accountRef.get();
    const existingData = (accountSnapshot.data() || {}) as Partial<{ usageCount: number }>;
    const nextSavedContent = "savedContent" in payload ? normalizeSavedContent(payload.savedContent) : undefined;
    const nextUsageCount = "usageCount" in payload ? normalizeCount(payload.usageCount) : undefined;
    const patch: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (!accountSnapshot.exists) {
      patch.plan = "free";
      patch.profile = buildFallbackProfile({ name: decodedToken.name, email: decodedToken.email });
      patch.subscription = null;
    }

    if (nextSavedContent) {
      patch.savedContent = nextSavedContent;
    }

    if (typeof nextUsageCount === "number") {
      patch.usageCount = Math.max(normalizeCount(existingData.usageCount), nextUsageCount);
    }

    if (Object.keys(patch).length === 1) {
      patch.lastSyncedAt = FieldValue.serverTimestamp();
    }

    await accountRef.set(patch, { merge: true });

    return NextResponse.json({
      ok: true,
      usageCount: patch.usageCount ?? normalizeCount(existingData.usageCount),
      savedCount: Array.isArray(patch.savedContent) ? patch.savedContent.length : null,
    });
  } catch (error) {
    console.error("Account sync failed:", error);
    return NextResponse.json({ ok: false, error: "Account sync failed." }, { status: 401 });
  }
}

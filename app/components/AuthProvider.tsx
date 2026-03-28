"use client";

import { createContext, type FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { activateAccountSubscription, deactivateAccountSubscription, ensureAccountRecord, subscribeToAccountRecord, updateAccountProfile } from "@/app/lib/account-store";
import { ensureFirebaseAuthPersistence, firebaseAuth, googleAuthProvider, isFirebaseConfigured } from "@/app/lib/firebase";
import type { AccountProfile } from "@/app/lib/types";
import { clearStoredSubscription, getStoredSubscription, setStoredPlan, setStoredSubscription, setUsageAccountScope } from "@/app/lib/usage";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "./Icons";

export type AuthUser = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
};

type AuthMode = "signin" | "signup";

type AuthRequest = {
  mode?: AuthMode;
  redirectTo?: string;
  closeRedirectTo?: string;
  onSuccess?: () => void;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  openAuthModal: (request?: AuthRequest) => void;
  runAuthenticated: (request?: AuthRequest) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
};

type StoredProfileOverride = {
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: string;
};

type StoredProfileMap = Record<string, StoredProfileOverride>;

const PROFILE_STORAGE_KEY = "ace-auth-profile-overrides";

const AuthContext = createContext<AuthContextValue | null>(null);

function buildFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

function splitName(displayName: string | null, email: string | null) {
  const trimmedName = displayName?.trim();

  if (trimmedName) {
    const [firstName = "", ...rest] = trimmedName.split(/\s+/);
    return {
      firstName,
      lastName: rest.join(" "),
    };
  }

  const emailPrefix = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  const [firstName = "Jonny", ...rest] = (emailPrefix || "Jonny Bonny").split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" ") || "Bonny",
  };
}

function readStoredProfiles(): StoredProfileMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProfileMap) : {};
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return {};
  }
}

function saveStoredProfiles(nextProfiles: StoredProfileMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles));
}

function readStoredProfile(uid: string) {
  return readStoredProfiles()[uid] || {};
}

function saveStoredProfile(uid: string, updates: StoredProfileOverride) {
  const allProfiles = readStoredProfiles();
  const nextProfiles = {
    ...allProfiles,
    [uid]: {
      ...allProfiles[uid],
      ...updates,
    },
  };

  saveStoredProfiles(nextProfiles);
  return nextProfiles[uid];
}

function toAuthUser(firebaseUser: FirebaseUser, profileOverride?: StoredProfileOverride): AuthUser {
  const storedProfile = profileOverride || readStoredProfile(firebaseUser.uid);
  const baseName = splitName(firebaseUser.displayName, firebaseUser.email);

  return {
    uid: firebaseUser.uid,
    firstName: storedProfile.firstName || baseName.firstName,
    lastName: storedProfile.lastName || baseName.lastName,
    email: firebaseUser.email || "",
    company: storedProfile.company || "",
    role: storedProfile.role || "",
  };
}

function toAccountProfile(user: AuthUser): AccountProfile {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email.trim().toLowerCase(),
    company: user.company,
    role: user.role,
  };
}

function getInitialForm(mode: AuthMode, user?: AuthUser | null) {
  return {
    firstName: mode === "signup" ? user?.firstName || "" : "",
    lastName: mode === "signup" ? user?.lastName || "" : "",
    email: user?.email || "",
    company: mode === "signup" ? user?.company || "" : "",
    role: mode === "signup" ? user?.role || "" : "",
    password: "",
  };
}

function getAuthErrorMessage(error: unknown) {
  if (typeof error !== "object" || !error || !("code" in error) || typeof error.code !== "string") {
    return "Authentication could not be completed right now.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "That email already has an account. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address is not valid.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/invalid-credential":
      return "Your email or password is incorrect.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google popup. Allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled before it finished.";
    case "auth/too-many-requests":
      return "Too many sign-in attempts were made. Please wait a moment and try again.";
    default:
      return "Authentication could not be completed right now.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signup");
  const [error, setError] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => getInitialForm("signup"));
  const [showPassword, setShowPassword] = useState(false);
  const pendingRequestRef = useRef<AuthRequest | null>(null);
  const subscriptionSyncRef = useRef<string | null>(null);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const syncSubscriptionStatus = useCallback(async (nextUser: AuthUser, profile: AccountProfile) => {
    if (typeof window === "undefined") {
      return;
    }

    const currentSubscription = getStoredSubscription();
    const customerId = currentSubscription?.customerId;

    if (!customerId) {
      subscriptionSyncRef.current = null;
      return;
    }

    const syncKey = `${nextUser.uid}:${customerId}:${currentSubscription.status}`;

    if (subscriptionSyncRef.current === syncKey) {
      return;
    }

    subscriptionSyncRef.current = syncKey;

    try {
      const response = await fetch(`/api/checkout/subscription?customerId=${encodeURIComponent(customerId)}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        active?: boolean;
        status?: string | null;
        customerId?: string | null;
        customerCode?: string | null;
        subscriptionCode?: string | null;
      };

      if (!response.ok) {
        return;
      }

      if (!data.active) {
        clearStoredSubscription();
        setStoredPlan("free");
        subscriptionSyncRef.current = null;
        await deactivateAccountSubscription(nextUser.uid, profile).catch(() => undefined);
        return;
      }

      if (typeof data.status !== "string" || typeof data.customerId !== "string") {
        return;
      }

      const nextSubscription = {
        provider: "paystack" as const,
        customerId: data.customerId,
        customerCode: typeof data.customerCode === "string" ? data.customerCode : currentSubscription?.customerCode,
        subscriptionCode: typeof data.subscriptionCode === "string" ? data.subscriptionCode : currentSubscription?.subscriptionCode,
        email: currentSubscription?.email || nextUser.email,
        reference: currentSubscription?.reference,
        status: data.status,
      };

      setStoredPlan("pro");
      setStoredSubscription(nextSubscription);

      if (
        currentSubscription?.status !== nextSubscription.status ||
        currentSubscription.subscriptionCode !== nextSubscription.subscriptionCode ||
        currentSubscription.customerCode !== nextSubscription.customerCode
      ) {
        await activateAccountSubscription(nextUser.uid, { profile, subscription: nextSubscription }).catch(() => undefined);
      }
    } catch {
      // Keep the last known local/account state if Paystack status sync temporarily fails.
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let unsubscribe = () => {};
    let unsubscribeAccount = () => {};

    if (!isFirebaseConfigured || !firebaseAuth) {
      setIsAuthReady(true);
      return;
    }

    void ensureFirebaseAuthPersistence()
      .catch(() => undefined)
      .finally(() => {
        if (isCancelled || !firebaseAuth) {
          return;
        }

        unsubscribe = onAuthStateChanged(firebaseAuth, (nextFirebaseUser) => {
          if (isCancelled) {
            return;
          }

          unsubscribeAccount();
          setUsageAccountScope(nextFirebaseUser?.uid || null);

          if (!nextFirebaseUser) {
            clearStoredSubscription();
            setStoredPlan("free");
            subscriptionSyncRef.current = null;
            setUser(null);
            setIsAuthReady(true);
            return;
          }

          const fallbackUser = toAuthUser(nextFirebaseUser);
          setUser(fallbackUser);
          setIsAuthReady(true);

          unsubscribeAccount = subscribeToAccountRecord(nextFirebaseUser.uid, toAccountProfile(fallbackUser), (record) => {
            if (isCancelled) {
              return;
            }

            if (!record) {
              setUser(fallbackUser);
              return;
            }

            const nextOverride = {
              firstName: record.profile.firstName,
              lastName: record.profile.lastName,
              company: record.profile.company,
              role: record.profile.role,
            };

            const nextUserWithProfile = toAuthUser(nextFirebaseUser, nextOverride);

            setStoredPlan(record.plan);
            if (record.subscription) {
              setStoredSubscription(record.subscription);
              void syncSubscriptionStatus(nextUserWithProfile, record.profile);
            } else {
              subscriptionSyncRef.current = null;
              clearStoredSubscription();
            }
            setUser(nextUserWithProfile);
          });

          setIsAuthReady(true);
        });
      });

    return () => {
      isCancelled = true;
      unsubscribe();
      unsubscribeAccount();
    };
  }, [syncSubscriptionStatus]);

  const closeModal = useCallback(() => {
    const closeRedirectTo = pendingRequestRef.current?.closeRedirectTo;
    pendingRequestRef.current = null;
    setIsOpen(false);
    setError(null);
    setGoogleNotice(null);
    setShowPassword(false);
    setIsSubmitting(false);

    if (closeRedirectTo) {
      navigateTo(closeRedirectTo);
    }
  }, [navigateTo]);

  const continueAfterAuth = useCallback(
    (authenticatedFirebaseUser: FirebaseUser) => {
      const nextUser = toAuthUser(authenticatedFirebaseUser);
      setUser(nextUser);
      void ensureAccountRecord(authenticatedFirebaseUser.uid, toAccountProfile(nextUser)).catch(() => undefined);
      const pending = pendingRequestRef.current;
      pendingRequestRef.current = null;
      setIsOpen(false);
      setError(null);
      setGoogleNotice(null);
      setShowPassword(false);
      setIsSubmitting(false);

      if (pending?.onSuccess) {
        pending.onSuccess();
        return;
      }

      if (pending?.redirectTo) {
        navigateTo(pending.redirectTo);
      }
    },
    [navigateTo],
  );

  const openAuthModal = useCallback((request?: AuthRequest) => {
    const nextMode = request?.mode || "signup";
    pendingRequestRef.current = request || null;
    setMode(nextMode);
    setForm(getInitialForm(nextMode, user));
    setError(null);
    setGoogleNotice(null);
    setShowPassword(false);
    setIsSubmitting(false);
    setIsOpen(true);
  }, [user]);

  const runAuthenticated = useCallback((request?: AuthRequest) => {
    if (user) {
      if (request?.onSuccess) {
        request.onSuccess();
        return;
      }

      if (request?.redirectTo) {
        navigateTo(request.redirectTo);
      }

      return;
    }

    openAuthModal(request);
  }, [navigateTo, openAuthModal, user]);

  const logout = useCallback(async () => {
    try {
      if (firebaseAuth) {
        await signOut(firebaseAuth);
      }
    } finally {
      setUsageAccountScope(null);
      setUser(null);
      router.push("/");
    }
  }, [router]);

  const updateProfile = useCallback(
    async (updates: Partial<AuthUser>) => {
      if (!firebaseAuth?.currentUser || !user) {
        return;
      }

      const currentFirebaseUser = firebaseAuth.currentUser;
      const nextFirstName = updates.firstName?.trim() || user.firstName;
      const nextLastName = updates.lastName?.trim() || user.lastName;
      const nextProfileOverride = saveStoredProfile(currentFirebaseUser.uid, {
        firstName: nextFirstName,
        lastName: nextLastName,
        company: updates.company?.trim() || user.company,
        role: updates.role?.trim() || user.role,
      });
      const nextDisplayName = buildFullName(nextFirstName, nextLastName);
      const nextUser: AuthUser = {
        ...user,
        firstName: nextFirstName,
        lastName: nextLastName,
        company: updates.company?.trim() || user.company,
        role: updates.role?.trim() || user.role,
      };

      if (nextDisplayName && currentFirebaseUser.displayName !== nextDisplayName) {
        await updateFirebaseProfile(currentFirebaseUser, { displayName: nextDisplayName });
      }

      setUser(toAuthUser(currentFirebaseUser, nextProfileOverride));
      void updateAccountProfile(currentFirebaseUser.uid, toAccountProfile(nextUser)).catch(() => undefined);
    },
    [user],
  );

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setGoogleNotice(null);

    if (!isFirebaseConfigured || !firebaseAuth) {
      setError("Firebase is not connected yet. Add your NEXT_PUBLIC_FIREBASE_* values in .env.local first.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
          setError("Complete the required fields before creating your account.");
          setIsSubmitting(false);
          return;
        }

        const credential = await createUserWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password);
        const fullName = buildFullName(form.firstName.trim(), form.lastName.trim());

        if (fullName) {
          await updateFirebaseProfile(credential.user, { displayName: fullName });
        }

        saveStoredProfile(credential.user.uid, {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          company: form.company.trim(),
          role: form.role.trim(),
        });

        continueAfterAuth(credential.user);
        return;
      }

      const credential = await signInWithEmailAndPassword(firebaseAuth, form.email.trim(), form.password);
      continueAfterAuth(credential.user);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      setIsSubmitting(false);
    }
  }, [continueAfterAuth, form, mode]);

  const continueWithGoogle = useCallback(async () => {
    setError(null);
    setGoogleNotice(null);

    if (!isFirebaseConfigured || !firebaseAuth || !googleAuthProvider) {
      setError("Firebase is not connected yet. Add your NEXT_PUBLIC_FIREBASE_* values in .env.local first.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await signInWithPopup(firebaseAuth, googleAuthProvider);
      continueAfterAuth(credential.user);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
      setIsSubmitting(false);
    }
  }, [continueAfterAuth]);

  const switchMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setForm(getInitialForm(nextMode, user));
    setError(null);
    setGoogleNotice(null);
    setShowPassword(false);
    setIsSubmitting(false);
  }, [user]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthReady,
      openAuthModal,
      runAuthenticated,
      logout,
      updateProfile,
    }),
    [isAuthReady, logout, openAuthModal, runAuthenticated, updateProfile, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(7,10,18,0.58)] px-4 py-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-[28rem] rounded-[2rem] border border-black/8 bg-[#fbf8f3] p-6 shadow-[0_30px_90px_rgba(7,10,18,0.24)] sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#20584f]">Account Access</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#181614]">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
                <p className="mt-2 text-sm leading-6 text-[#645b51]">
                  {mode === "signup"
                    ? "Create a real Firebase account with email and password, or continue with Google."
                    : "Log in with your Firebase account to continue to the exact page you clicked."}
                </p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full border border-black/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#3d3935]">
                Close
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#f1ece5] p-1">
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-[#181614] shadow-[0_10px_22px_rgba(24,22,20,0.08)]" : "text-[#665e54]"}`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signin" ? "bg-white text-[#181614] shadow-[0_10px_22px_rgba(24,22,20,0.08)]" : "text-[#665e54]"}`}
              >
                Log in
              </button>
            </div>

            <button
              type="button"
              onClick={() => void continueWithGoogle()}
              disabled={isSubmitting}
              className="interactive-pop mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#181614] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon className="h-5 w-5" />
              {isSubmitting ? "Working..." : "Continue with Google"}
            </button>

            <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#8d8479]">
              <span className="h-px flex-1 bg-black/8" />
              Or use email
              <span className="h-px flex-1 bg-black/8" />
            </div>

            <form className="mt-5 space-y-4" onSubmit={(event) => void submit(event)}>
              {mode === "signup" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">First name</span>
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="Jonny"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">Last name</span>
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="Bonny"
                    />
                  </label>
                </div>
              ) : null}

              <label className="space-y-2">
                <span className="text-sm font-medium text-[#423c35]">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                  placeholder="you@example.com"
                />
              </label>

              {mode === "signup" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">Company</span>
                    <input
                      value={form.company}
                      onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="AI Content Engine"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">Role</span>
                    <input
                      value={form.role}
                      onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="Founder"
                    />
                  </label>
                </div>
              ) : null}

              <label className="space-y-2">
                <span className="text-sm font-medium text-[#423c35]">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 pr-12 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                    placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f685f]"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              {error ? <p className="text-sm text-[#9c5b43]">{error}</p> : null}
              {googleNotice ? <p className="text-sm text-[#20584f]">{googleNotice}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="interactive-pop w-full rounded-[1.2rem] bg-[#181614] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Working..." : mode === "signup" ? "Create account" : "Log in"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

"use client";

import { createContext, type FormEvent, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
};

type StoredAccount = AuthUser & {
  password: string;
};

type AuthMode = "signin" | "signup";

type AuthRequest = {
  mode?: AuthMode;
  redirectTo?: string;
  onSuccess?: () => void;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  openAuthModal: (request?: AuthRequest) => void;
  runAuthenticated: (request?: AuthRequest) => void;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
};

const ACCOUNT_STORAGE_KEY = "ace-auth-account";
const SESSION_STORAGE_KEY = "ace-auth-session";

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(account: StoredAccount): AuthUser {
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    company: account.company,
    role: account.role,
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedSessionRaw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      return storedSessionRaw ? (JSON.parse(storedSessionRaw) as AuthUser) : null;
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  });
  const [account, setAccount] = useState<StoredAccount | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const storedAccountRaw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
      return storedAccountRaw ? (JSON.parse(storedAccountRaw) as StoredAccount) : null;
    } catch {
      window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
      return null;
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signup");
  const [error, setError] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const [form, setForm] = useState(() => getInitialForm("signup"));
  const pendingRequestRef = useRef<AuthRequest | null>(null);

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
    setGoogleNotice(null);
  };

  const continueAfterAuth = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authenticatedUser));
    const pending = pendingRequestRef.current;
    pendingRequestRef.current = null;
    closeModal();

    if (pending?.onSuccess) {
      pending.onSuccess();
      return;
    }

    if (pending?.redirectTo) {
      router.push(pending.redirectTo);
    }
  };

  const openAuthModal = (request?: AuthRequest) => {
    const nextMode = request?.mode || "signup";
    pendingRequestRef.current = request || null;
    setMode(nextMode);
    setForm(getInitialForm(nextMode, user));
    setError(null);
    setGoogleNotice(null);
    setIsOpen(true);
  };

  const runAuthenticated = (request?: AuthRequest) => {
    if (user) {
      if (request?.onSuccess) {
        request.onSuccess();
        return;
      }

      if (request?.redirectTo) {
        router.push(request.redirectTo);
      }

      return;
    }

    openAuthModal(request);
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    router.push("/");
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = { ...currentUser, ...updates };
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));

      setAccount((currentAccount) => {
        if (!currentAccount) {
          return currentAccount;
        }

        const nextAccount = { ...currentAccount, ...updates };
        window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(nextAccount));
        return nextAccount;
      });

      return nextUser;
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setGoogleNotice(null);

    if (mode === "signup") {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
        setError("Complete the required fields before creating your account.");
        return;
      }

      if (account && account.email.toLowerCase() === form.email.trim().toLowerCase()) {
        setError("An account with this email already exists. Sign in instead.");
        return;
      }

      const nextAccount: StoredAccount = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        password: form.password,
      };

      setAccount(nextAccount);
      window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(nextAccount));
      continueAfterAuth(toUser(nextAccount));
      return;
    }

    if (!account) {
      setError("No local account was found yet. Sign up first.");
      return;
    }

    if (account.email.toLowerCase() !== form.email.trim().toLowerCase() || account.password !== form.password) {
      setError("Your email or password is incorrect.");
      return;
    }

    continueAfterAuth(toUser(account));
  };

  const continueWithGoogle = () => {
    setError(null);
    setGoogleNotice("Google sign-in is ready in the UI, but it still needs NEXT_PUBLIC_GOOGLE_CLIENT_ID before it can complete a live Google login.");
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setForm(getInitialForm(nextMode, user));
    setError(null);
    setGoogleNotice(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    openAuthModal,
    runAuthenticated,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {isOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(7,10,18,0.58)] px-4 py-10">
          <div className="w-full max-w-[28rem] rounded-[2rem] border border-black/8 bg-[#fbf8f3] p-6 shadow-[0_30px_90px_rgba(7,10,18,0.24)] sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#20584f]">Account Access</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#181614]">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
                <p className="mt-2 text-sm leading-6 text-[#645b51]">
                  {mode === "signup"
                    ? "Save your details, unlock protected pages, and keep your profile available across sessions on this browser."
                    : "Sign in to continue where you left off and access the page or action you clicked."}
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
              onClick={continueWithGoogle}
              className="interactive-pop mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#181614]"
            >
              <span className="text-base">G</span>
              Continue with Google
            </button>

            <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#8d8479]">
              <span className="h-px flex-1 bg-black/8" />
              Or use email
              <span className="h-px flex-1 bg-black/8" />
            </div>

            <form className="mt-5 space-y-4" onSubmit={submit}>
              {mode === "signup" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">First name</span>
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="Sbahle"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[#423c35]">Last name</span>
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                      className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                      placeholder="Kumalo"
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
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-sm text-[#181614] outline-none transition focus:border-[#20584f]/30"
                  placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                />
              </label>

              {error ? <p className="text-sm text-[#9c5b43]">{error}</p> : null}
              {googleNotice ? <p className="text-sm text-[#20584f]">{googleNotice}</p> : null}

              <button type="submit" className="interactive-pop w-full rounded-[1.2rem] bg-[#181614] px-4 py-3 text-sm font-semibold text-white">
                {mode === "signup" ? "Create account" : "Log in"}
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

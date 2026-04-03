"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { getStoredPlan, planChangeEventName } from "@/app/lib/usage";

type UpgradeButtonProps = {
  label: string;
  className?: string;
  compact?: boolean;
  instantUnlock?: boolean;
  redirectToPricing?: boolean;
  requireAuth?: boolean;
};

export function UpgradeButton({
  label,
  className,
  compact = false,
  instantUnlock = false,
  redirectToPricing = true,
  requireAuth = true,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const { runAuthenticated, user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const syncPlan = () => setPlan(getStoredPlan());
    syncPlan();

    window.addEventListener(planChangeEventName, syncPlan as EventListener);
    window.addEventListener("storage", syncPlan);

    return () => {
      window.removeEventListener(planChangeEventName, syncPlan as EventListener);
      window.removeEventListener("storage", syncPlan);
    };
  }, []);

  async function startCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      if (redirectToPricing) {
        router.push("/pricing");
        return;
      }

      if (instantUnlock) {
        router.push("/dashboard?upgrade=instant");
        return;
      }

      if (!user?.email) {
        throw new Error("Please sign in with a valid email address before starting Paystack checkout.");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          uid: user.uid,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout is not available yet.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout is not available yet.");
      setIsLoading(false);
    }
  }

  if (!isAuthReady || plan === "pro") {
    return null;
  }

  return (
    <div className={compact ? undefined : "space-y-2"}>
      <button
        type="button"
        onClick={() => {
          if (requireAuth) {
            runAuthenticated({ onSuccess: () => void startCheckout(), mode: "signup" });
            return;
          }

          void startCheckout();
        }}
        disabled={isLoading}
        className={className}
      >
        <span className="relative z-[1]">{label}</span>
      </button>
      {error && !compact ? <p className="text-xs text-[#8b5b4d]">{error}</p> : null}
    </div>
  );
}

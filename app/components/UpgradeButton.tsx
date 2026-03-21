"use client";

import { useState } from "react";

type UpgradeButtonProps = {
  label: string;
  className?: string;
  compact?: boolean;
};

export function UpgradeButton({ label, className, compact = false }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
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

  return (
    <div className={compact ? undefined : "space-y-2"}>
      <button type="button" onClick={startCheckout} disabled={isLoading} className={className}>
        <span className="relative z-[1]">{isLoading ? "Redirecting..." : label}</span>
      </button>
      {error && !compact ? <p className="text-xs text-[#8b5b4d]">{error}</p> : null}
    </div>
  );
}

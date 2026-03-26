"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PlanConfig } from "@/app/lib/types";
import { useAuth } from "./AuthProvider";
import { CheckIcon } from "./Icons";
import { UpgradeButton } from "./UpgradeButton";
import { getStoredPlan, planChangeEventName, setStoredPlan } from "@/app/lib/usage";

type PlanCardProps = {
  plan: PlanConfig;
  featured?: boolean;
};

export function PlanCard({ plan, featured = false }: PlanCardProps) {
  const { runAuthenticated } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    const syncPlan = () => setCurrentPlan(getStoredPlan());
    syncPlan();

    window.addEventListener(planChangeEventName, syncPlan as EventListener);
    window.addEventListener("storage", syncPlan);

    return () => {
      window.removeEventListener(planChangeEventName, syncPlan as EventListener);
      window.removeEventListener("storage", syncPlan);
    };
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`glass-panel interactive-pop relative overflow-hidden rounded-[28px] p-7 ${featured ? "border-[#20584f]/15 bg-[#f8fbfa]" : ""}`}
    >
      {featured ? <div className="accent-chip absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]">Recommended</div> : null}

      <div className="space-y-4">
        <div>
          <p className="editorial-label text-sm">{plan.name}</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#181614]">{plan.priceLabel}</h3>
          <p className="mt-3 text-sm leading-6 text-[#6f685f]">{plan.description}</p>
        </div>

        <div className="space-y-3">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 text-sm text-[#33302c]">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e6efeb] text-[#20584f]">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {plan.key === "free" ? (
          <button
            type="button"
            onClick={() => runAuthenticated({ redirectTo: "/dashboard" })}
            className="interactive-pop inline-flex w-full items-center justify-center rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#181614] hover:border-[#20584f]/20 hover:text-[#181614]"
          >
            <span className="relative z-[1]">{plan.ctaLabel}</span>
          </button>
        ) : currentPlan === "pro" ? (
          <div className="space-y-3">
            <div className="rounded-[1.3rem] border border-[#cfdccd] bg-[#edf5f0] p-4 text-sm text-[#20584f]">
              <p className="font-semibold">Subscription active</p>
              <p className="mt-2 leading-6">Pro is active on this browser. Unlimited generations and the 14-day AI calendar are ready to use.</p>
            </div>
            <button
              type="button"
              onClick={() => setStoredPlan("free")}
              className="interactive-pop inline-flex w-full items-center justify-center rounded-2xl border border-[#d7b3ac] bg-[#f4e5e1] px-4 py-3 text-sm font-semibold text-[#7c5645] hover:bg-[#efd9d3]"
            >
              Cancel Subscription
            </button>
            <p className="text-xs leading-5 text-[#8c8378]">Cancellation stops future charges in the live billing flow. Previous successful payments are not refundable.</p>
          </div>
        ) : (
          <UpgradeButton
            label={plan.ctaLabel}
            instantUnlock
            redirectToPricing={false}
            className="interactive-pop inline-flex w-full items-center justify-center rounded-2xl bg-[#181614] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]"
          />
        )}
      </div>
    </motion.article>
  );
}

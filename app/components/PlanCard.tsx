"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PlanConfig } from "@/app/lib/types";
import { CheckIcon } from "./Icons";
import { UpgradeButton } from "./UpgradeButton";

type PlanCardProps = {
  plan: PlanConfig;
  featured?: boolean;
};

export function PlanCard({ plan, featured = false }: PlanCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`glass-panel relative overflow-hidden rounded-[28px] p-7 ${featured ? "border-[#20584f]/15 bg-[#f8fbfa]" : ""}`}
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
          <Link href="/dashboard" className="inline-flex w-full items-center justify-center rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#181614] transition hover:border-[#20584f]/20 hover:text-[#20584f]">
            {plan.ctaLabel}
          </Link>
        ) : (
          <UpgradeButton label={plan.ctaLabel} className="inline-flex w-full items-center justify-center rounded-2xl bg-[#181614] px-4 py-3 text-sm font-semibold text-[#f8f4ee] transition hover:bg-[#2b2723]" />
        )}
      </div>
    </motion.article>
  );
}

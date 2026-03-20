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
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`glass-panel relative overflow-hidden rounded-[28px] p-7 ${featured ? "border-cyan-300/40 shadow-[0_0_45px_rgba(97,231,255,0.18)]" : ""}`}
    >
      {featured ? (
        <div className="absolute right-4 top-4 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100">
          Most Popular
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">{plan.name}</p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{plan.priceLabel}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{plan.description}</p>
        </div>

        <div className="space-y-3">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 text-sm text-slate-200">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-100">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {plan.key === "free" ? (
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            {plan.ctaLabel}
          </Link>
        ) : (
          <UpgradeButton
            label={plan.ctaLabel}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(97,231,255,0.24)] transition hover:translate-y-[-1px]"
          />
        )}
      </div>
    </motion.article>
  );
}

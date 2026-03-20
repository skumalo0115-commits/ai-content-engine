"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { primaryNavLinks, siteConfig } from "@/app/lib/site";
import { CrownIcon } from "./Icons";
import { UpgradeButton } from "./UpgradeButton";

type NavbarProps = {
  currentPlan?: string;
  usageLabel?: string;
};

export function Navbar({ currentPlan, usageLabel }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-cyan-100">
            {siteConfig.name.toUpperCase()}
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-cyan-100">
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" className="transition hover:text-cyan-100">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {usageLabel ? (
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:block">{usageLabel}</div>
          ) : null}
          {currentPlan ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100">
              <CrownIcon className="h-3.5 w-3.5" />
              {currentPlan}
            </div>
          ) : null}
          <Link href="/dashboard" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/35 hover:bg-cyan-400/10 sm:inline-flex">
            Start Free
          </Link>
          <UpgradeButton
            compact
            label="Upgrade"
            className="inline-flex rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(97,231,255,0.24)] transition hover:translate-y-[-1px]"
          />
        </div>
      </div>
    </motion.header>
  );
}

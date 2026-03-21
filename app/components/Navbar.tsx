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
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-black/6 bg-[rgba(247,244,238,0.88)] backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-[#20584f]">
            {siteConfig.name.toUpperCase()}
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-[#4d463f] md:flex">
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#181614]">
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" className="transition hover:text-[#181614]">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {usageLabel ? (
            <div className="hidden rounded-full border border-black/6 bg-white/80 px-3 py-1.5 text-xs text-[#585148] sm:block">{usageLabel}</div>
          ) : null}
          {currentPlan ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e6efeb] px-3 py-1.5 text-xs text-[#20584f]">
              <CrownIcon className="h-3.5 w-3.5" />
              {currentPlan}
            </div>
          ) : null}
          <Link href="/dashboard" className="hidden rounded-full border border-black/6 bg-white px-4 py-2 text-sm font-medium text-[#181614] transition hover:border-[#20584f]/30 hover:text-[#20584f] sm:inline-flex">
            Start Free
          </Link>
          <UpgradeButton
            compact
            label="Upgrade"
            className="inline-flex rounded-full bg-[#181614] px-4 py-2 text-sm font-semibold text-[#f8f4ee] transition hover:bg-[#2b2723]"
          />
        </div>
      </div>
    </motion.header>
  );
}

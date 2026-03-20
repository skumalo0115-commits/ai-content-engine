"use client";

import { motion } from "framer-motion";
import { BoltIcon, CrownIcon, GaugeIcon, LockIcon } from "./Icons";

type SidebarProps = {
  currentPlan: string;
  remainingFreeGenerations: number;
};

const sections = [
  { title: "Generate Content", status: "Live", icon: BoltIcon },
  { title: "Saved Content", status: "Beta", icon: CrownIcon },
  { title: "Analytics", status: "Soon", icon: GaugeIcon },
];

export function Sidebar({ currentPlan, remainingFreeGenerations }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel w-full rounded-[28px] p-5 md:w-72"
    >
      <div className="mb-5 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Launch Plan</p>
        <p className="mt-2 text-xl font-semibold text-white">{currentPlan}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {currentPlan === "Pro"
            ? "Unlimited generations unlocked on this browser."
            : `${remainingFreeGenerations} free generations left today on this browser.`}
        </p>
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Workspace</p>
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <motion.button
              key={section.title}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-100">
                  <Icon className="h-4 w-4" />
                </span>
                {section.title}
              </span>
              <span className="text-xs uppercase tracking-[0.22em] text-cyan-200">{section.status}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <div className="flex items-center gap-2 text-white">
          <LockIcon className="h-4 w-4 text-cyan-200" />
          Soft launch gating
        </div>
        <p className="mt-2 leading-6">Free limits are stored in browser storage for now. Full account sync comes in a later release.</p>
      </div>
    </motion.aside>
  );
}

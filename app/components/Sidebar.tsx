"use client";

import { motion } from "framer-motion";
import { BoltIcon, CrownIcon, GaugeIcon, LockIcon } from "./Icons";

type DashboardView = "generate" | "saved";

type SidebarProps = {
  currentPlan: string;
  remainingFreeGenerations: number;
  activeView: DashboardView;
  savedCount: number;
  onChangeView: (view: DashboardView) => void;
  isTestProMode?: boolean;
  onActivateTestPro?: () => void;
  onDeactivateTestPro?: () => void;
};

const sections = [
  { title: "Generate Content", status: "Live", icon: BoltIcon, view: "generate" as const },
  { title: "Saved Content", status: "Saved", icon: CrownIcon, view: "saved" as const },
  { title: "Analytics", status: "Soon", icon: GaugeIcon, view: null },
];

export function Sidebar({
  currentPlan,
  remainingFreeGenerations,
  activeView,
  savedCount,
  onChangeView,
  isTestProMode = false,
  onActivateTestPro,
  onDeactivateTestPro,
}: SidebarProps) {
  const isProPlan = currentPlan === "Pro";

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel sticky top-24 z-20 w-full self-start rounded-[28px] p-5 md:fixed md:top-24 md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:w-72"
    >
      <div className="mb-5 rounded-[1.5rem] bg-[#f6f2eb] p-4">
        <p className="editorial-label text-xs">Launch Plan</p>
        <p className="mt-2 text-xl font-semibold text-[#181614]">{currentPlan}</p>
        <p className="mt-2 text-sm leading-6 text-[#5f584f]">
          {currentPlan === "Pro" ? "Unlimited generations unlocked on this account." : `${remainingFreeGenerations} free generations left on this account.`}
        </p>
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#6f685f]">Workspace</p>
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = section.view === activeView;
          const isDisabled = !section.view;

          return (
            <motion.button
              key={section.title}
              type="button"
              whileHover={isDisabled ? undefined : { x: 3 }}
              whileTap={isDisabled ? undefined : { scale: 0.99 }}
              onClick={() => {
                if (section.view) {
                  onChangeView(section.view);
                }
              }}
              disabled={isDisabled}
              className={`flex w-full items-center justify-between rounded-[1.2rem] border px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "border-black/8 bg-[#f8f4ee] text-[#181614]"
                  : isDisabled
                    ? "cursor-not-allowed border-transparent text-[#8a8278] opacity-70"
                    : "border-transparent text-[#3d3935] hover:border-black/6 hover:bg-[#f8f4ee]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? "bg-[#181614] text-white" : "bg-[#e6efeb] text-[#20584f]"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex items-center gap-2">
                  <span>{section.title}</span>
                  {section.view === "saved" && savedCount > 0 ? (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#efe7dc] px-2 py-0.5 text-[11px] font-semibold text-[#6a6156]">
                      {savedCount}
                    </span>
                  ) : null}
                </span>
              </span>
              <span className={`text-xs uppercase tracking-[0.22em] ${isDisabled ? "text-[#8a8278]" : "text-[#20584f]"}`}>{section.status}</span>
            </motion.button>
          );
        })}
      </nav>

      {!isProPlan && onActivateTestPro ? (
        <button
          type="button"
          onClick={onActivateTestPro}
          className="mt-4 w-full rounded-[1.1rem] bg-[#181614] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2723]"
        >
          Test Pro Mode
        </button>
      ) : null}

      {isTestProMode && onDeactivateTestPro ? (
        <button
          type="button"
          onClick={onDeactivateTestPro}
          className="mt-3 w-full rounded-[1.1rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[#181614] transition hover:bg-[#f8f4ee]"
        >
          Back to Free Mode
        </button>
      ) : null}

      <div className="mt-5 rounded-[1.5rem] border border-black/6 bg-white p-4 text-sm text-[#5f584f]">
        <div className="flex items-center gap-2 text-[#181614]">
          <LockIcon className="h-4 w-4 text-[#20584f]" />
          {isProPlan ? "Pro plan active" : "Free plan active"}
        </div>
        <p className="mt-2 leading-6">
          {isProPlan
            ? "Unlimited generations and the 14-day calendar tools are unlocked on this signed-in account."
            : "Your free generations count down on this signed-in account. Upgrade whenever you want unlimited content and the Pro calendar tools."}
        </p>
      </div>
    </motion.aside>
  );
}

import type { ReactNode } from "react";
import { CanvasBackground } from "./CanvasBackground";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

type MarketingShellProps = {
  children: ReactNode;
  currentPlan?: string;
  usageLabel?: string;
};

export function MarketingShell({ children, currentPlan, usageLabel }: MarketingShellProps) {
  return (
    <div className="relative overflow-hidden text-white">
      <CanvasBackground />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-glow opacity-50" />
      <Navbar currentPlan={currentPlan} usageLabel={usageLabel} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">{children}</main>
      <Footer />
    </div>
  );
}

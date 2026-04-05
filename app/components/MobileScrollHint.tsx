"use client";

import { motion } from "framer-motion";
import { ChevronDownIcon } from "./Icons";

type MobileScrollHintProps = {
  label?: string;
  className?: string;
};

export function MobileScrollHint({ label = "Scroll down", className = "" }: MobileScrollHintProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:hidden ${className}`}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[rgba(24,22,20,0.88)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm">
        <span>{label}</span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.span>
      </div>
    </motion.div>
  );
}

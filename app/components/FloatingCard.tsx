"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FloatingCardProps = {
  title: string;
  content: string;
  icon?: ReactNode;
  delay?: number;
  eyebrow?: string;
  isLocked?: boolean;
};

export function FloatingCard({ title, content, icon, delay = 0, eyebrow, isLocked = false }: FloatingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className="group relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_35px_rgba(34,211,238,0.2)] backdrop-blur-xl"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay }}
        className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl"
      />
      <div className="relative space-y-3">
        {eyebrow ? <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200">{eyebrow}</p> : null}
        <div className="flex items-center gap-3 text-cyan-200">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-400/10">
            {icon ?? <span className="text-base">+</span>}
          </span>
          <h3 className="text-base font-semibold tracking-wide text-white">{title}</h3>
        </div>
        <p className={`text-sm leading-relaxed ${isLocked ? "text-slate-500 blur-[2px]" : "text-slate-300"}`}>{content}</p>
        {isLocked ? <div className="text-xs uppercase tracking-[0.22em] text-pink-300">Upgrade to reveal</div> : null}
      </div>
    </motion.article>
  );
}

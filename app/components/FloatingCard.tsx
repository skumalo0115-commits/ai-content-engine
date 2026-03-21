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
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.24 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="glass-panel interactive-pop relative overflow-hidden rounded-[28px] p-6"
    >
      <div className="relative space-y-3">
        {eyebrow ? <p className="editorial-label text-[11px]">{eyebrow}</p> : null}
        <div className="flex items-center gap-3 text-[#20584f]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6efeb]">
            {icon ?? <span className="text-base">+</span>}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-[#181614]">{title}</h3>
        </div>
        <p className={`text-sm leading-7 ${isLocked ? "text-[#8a8278] blur-[2px]" : "text-[#5f584f]"}`}>{content}</p>
        {isLocked ? <div className="text-xs uppercase tracking-[0.22em] text-[#20584f]">Upgrade to reveal</div> : null}
      </div>
    </motion.article>
  );
}

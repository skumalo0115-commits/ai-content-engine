"use client";

import { motion } from "framer-motion";

const sections = ["Generate Content", "Saved Content", "Analytics"];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl md:w-64"
    >
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Workspace</p>
      <nav className="space-y-2">
        {sections.map((section) => (
          <motion.button
            key={section}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10"
          >
            {section}
            <span className="text-cyan-300">↗</span>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}

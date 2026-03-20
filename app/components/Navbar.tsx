"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-cyan-200">AI CONTENT ENGINE</Link>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100">Pro Plan</button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-sm font-semibold text-slate-900">JD</div>
        </div>
      </div>
    </motion.header>
  );
}

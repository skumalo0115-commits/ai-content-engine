"use client";

import { motion } from "framer-motion";

export function CanvasBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -24, 0] }}
        transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(32,88,79,0.12),_transparent_68%)]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 22, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute right-[-8rem] top-[22%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(196,154,114,0.12),_transparent_68%)]"
      />
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-[-9rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(24,22,20,0.06),_transparent_68%)]"
      />
    </div>
  );
}

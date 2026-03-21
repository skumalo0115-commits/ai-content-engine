"use client";

import { motion } from "framer-motion";

export function SelfieHeroScene() {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#f3eee5_0%,#ede6db_100%)] shadow-[0_26px_70px_rgba(24,22,20,0.08)] sm:h-[32rem]">
      <motion.div
        animate={{ opacity: [0.5, 0.72, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(32,88,79,0.18),_transparent_70%)]"
      />
      <motion.div
        animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
        className="absolute right-10 top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(196,154,114,0.16),_transparent_70%)]"
      />

      <svg viewBox="0 0 720 720" className="absolute inset-0 h-full w-full">
        <motion.g animate={{ y: [0, -8, 0], x: [0, 6, 0] }} transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
          <motion.g animate={{ rotate: [-2, 3, -2] }} transition={{ duration: 6.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} style={{ transformOrigin: "380px 250px" }}>
            <ellipse cx="372" cy="190" rx="78" ry="88" fill="#1f1b18" />
            <ellipse cx="380" cy="208" rx="64" ry="72" fill="#e1b792" />
            <path d="M316 188c12-66 110-82 149-18 14 23 16 52 7 80-13-12-27-20-52-21-44-2-81 2-104 21-9-18-10-42 0-62Z" fill="#221d1a" />
            <circle cx="354" cy="206" r="4.5" fill="#2a231f" />
            <circle cx="403" cy="206" r="4.5" fill="#2a231f" />
            <path d="M360 233c12 9 28 10 41 0" stroke="#8b5f4e" strokeLinecap="round" strokeWidth="5" />
            <path d="M331 184c14-14 35-22 57-24" stroke="#221d1a" strokeLinecap="round" strokeWidth="9" />
          </motion.g>

          <motion.g animate={{ rotate: [-7, 5, -7] }} transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} style={{ transformOrigin: "500px 330px" }}>
            <path d="M440 286c68 19 117 77 122 144l-54 7c-4-46-37-87-85-100Z" fill="#d4c0ae" />
            <rect x="510" y="182" width="56" height="106" rx="18" fill="#111010" />
            <circle cx="538" cy="235" r="18" fill="#f1ede8" />
            <motion.circle
              cx="538"
              cy="235"
              r="26"
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
              animate={{ opacity: [0, 0.8, 0], scale: [0.75, 1.25, 1.55] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
              style={{ transformOrigin: "538px 235px" }}
            />
          </motion.g>

          <path d="M270 604c18-174 55-293 110-356 26-29 60-45 96-45 45 0 87 20 115 54 52 64 74 178 75 347H270Z" fill="#25211f" />
          <path d="M338 331c18 64 18 139 0 221l-40 52h130l-40-40 18-184-68-49Z" fill="#d3c0b0" />
          <path d="M380 250c-46 0-87 20-112 55-31 42-42 110-43 186" stroke="#cdb8a6" strokeLinecap="round" strokeWidth="34" />
          <motion.path
            d="M460 304c36 34 74 50 116 47"
            stroke="#d7c4b3"
            strokeLinecap="round"
            strokeWidth="32"
            animate={{ d: ["M460 304c36 34 74 50 116 47", "M460 304c42 18 82 24 120 18", "M460 304c36 34 74 50 116 47"] }}
            transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <path d="M329 308c22-10 45-15 69-15 31 0 61 9 88 27l-18 286H298l31-298Z" fill="#d9cec4" />
          <path d="M360 313c11 16 23 24 37 24 15 0 27-8 37-24" stroke="#b49172" strokeLinecap="round" strokeWidth="7" />
          <path d="M352 607h151c12 0 22 10 22 22v15H335v-15c0-12 10-22 22-22Z" fill="#181614" />
          <motion.path
            d="M229 439c17-4 33-15 44-32"
            stroke="#d7c4b3"
            strokeLinecap="round"
            strokeWidth="22"
            animate={{ d: ["M229 439c17-4 33-15 44-32", "M230 428c19 0 35-7 50-22", "M229 439c17-4 33-15 44-32"] }}
            transition={{ duration: 4.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.g>

        <motion.g animate={{ x: [0, 8, 0], y: [0, -10, 0], rotate: [-3, 3, -3] }} transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} style={{ transformOrigin: "585px 140px" }}>
          <rect x="528" y="70" width="115" height="148" rx="18" fill="#fffdf9" stroke="#1f1b18" strokeWidth="2" />
          <rect x="542" y="86" width="87" height="95" rx="12" fill="#dfd3c4" />
          <circle cx="584" cy="125" r="24" fill="#c3b4a2" />
          <rect x="555" y="192" width="58" height="6" rx="3" fill="#bfa997" />
          <rect x="555" y="204" width="42" height="6" rx="3" fill="#d6c8ba" />
        </motion.g>

        <motion.g animate={{ opacity: [0, 1, 0], x: [0, 16, 34], y: [0, -18, -34] }} transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 0.8 }}>
          <path d="M565 235h82" stroke="#ffffff" strokeLinecap="round" strokeWidth="9" />
          <path d="M606 194v82" stroke="#ffffff" strokeLinecap="round" strokeWidth="9" />
        </motion.g>
      </svg>

      <div className="absolute bottom-5 left-5 rounded-[1.35rem] border border-black/8 bg-white/85 px-4 py-3 shadow-[0_20px_45px_rgba(24,22,20,0.08)]">
        <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#20584f]">Live Campaign Mood</p>
        <p className="mt-1 text-sm font-medium text-[#181614]">Selfie-first creator motion with clean editorial framing.</p>
      </div>
    </div>
  );
}

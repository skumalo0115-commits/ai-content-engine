"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CanvasBackground } from "./components/CanvasBackground";
import { FloatingCard } from "./components/FloatingCard";
import { Footer } from "./components/Footer";

const features = [
  {
    title: "AI captions & ideas",
    content: "Create premium Instagram captions and TikTok hooks tailored to your brand in seconds.",
    icon: "✨",
  },
  {
    title: "Trending hashtags",
    content: "Get market-aware hashtag clusters designed to amplify visibility and organic reach.",
    icon: "#",
  },
  {
    title: "Content calendar",
    content: "Generate weekly campaign plans with publishing cadence, CTA suggestions, and post angles.",
    icon: "🗓️",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden text-white">
      <CanvasBackground />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <section className="relative flex min-h-[68vh] flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Futuristic AI SaaS</p>
            <h1 className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              Your AI Marketing Genius
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
              Generate viral social media content for your business instantly.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard" className="rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.4)] transition hover:translate-y-[-2px]">
                Get Started
              </Link>
              <button className="rounded-xl border border-cyan-300/30 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/70 hover:bg-cyan-400/10">
                See Demo
              </button>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-0">
            <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }} className="absolute left-[12%] top-[20%] h-20 w-20 rounded-full bg-cyan-400/15 blur-xl" />
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }} className="absolute right-[15%] top-[36%] h-24 w-24 rounded-full bg-fuchsia-500/20 blur-xl" />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <FloatingCard key={feature.title} title={feature.title} content={feature.content} icon={feature.icon} delay={index * 0.12} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

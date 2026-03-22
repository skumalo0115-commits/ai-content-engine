"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { heroSlides as slides } from "@/app/lib/hero-slides";

export function SelfieHeroScene() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3400);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-[35rem] overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#f6f0ea_0%,#efe7de_100%)] p-5 shadow-[0_28px_68px_rgba(24,22,20,0.1)] sm:h-[32rem] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_32%)]" />
      <div className="relative h-full overflow-hidden rounded-[1.55rem] border border-black/6 bg-[#fbf7f1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.src}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,238,230,0.94))] p-6 sm:p-8"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-black/5 bg-white/70">
              <Image src={activeSlide.src} alt={activeSlide.title} fill priority className="object-contain p-4 sm:p-5" sizes="(min-width: 1024px) 35rem, 100vw" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-4 bottom-4 rounded-[1.2rem] border border-black/8 bg-white/94 px-4 py-3 shadow-[0_16px_36px_rgba(24,22,20,0.08)] sm:inset-x-5 sm:bottom-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#20584f]">{activeSlide.title}</p>
              <p className="mt-1 text-sm font-medium leading-6 text-[#181614]">{activeSlide.caption}</p>
            </div>
            <div className="mt-1 flex gap-2">
              {slides.map((slide, index) => (
                <span key={slide.src} className={`h-2.5 w-2.5 rounded-full ${index === activeIndex ? "bg-[#20584f]" : "bg-black/12"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

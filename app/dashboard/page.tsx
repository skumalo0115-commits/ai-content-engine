"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CanvasBackground } from "../components/CanvasBackground";
import { FloatingCard } from "../components/FloatingCard";
import { InputForm } from "../components/InputForm";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

type GeneratedCard = {
  title: string;
  content: string;
};

const starterCards: GeneratedCard[] = [
  {
    title: "Instagram Caption",
    content: "✨ Your handcrafted latte moment deserves center stage. Tag your coffee crew and sip local this morning.",
  },
  {
    title: "TikTok Idea",
    content: "Film a 15s before/after customer morning energy boost challenge featuring your signature drink.",
  },
  {
    title: "Hashtag Stack",
    content: "#CoffeeTok #SmallBusinessLove #MorningFuel #LocalCafe #CityCoffeeGuide",
  },
];

export default function DashboardPage() {
  const [cards, setCards] = useState<GeneratedCard[]>(starterCards);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (payload: { businessType: string; targetAudience: string; goal: string }) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1300));

    setCards([
      {
        title: `${payload.businessType} Caption`,
        content: `Launch post concept for ${payload.targetAudience}: highlight your unique value and CTA focused on ${payload.goal}.`,
      },
      {
        title: "TikTok Hook",
        content: `Create a 12-second trend remix that shows how ${payload.businessType} solves a pain point for ${payload.targetAudience}.`,
      },
      {
        title: "Smart Hashtags",
        content: `#${payload.businessType.replace(/\s+/g, "")} #GrowthMode #AIMarketing #ContentEngine #SmallBusiness`,
      },
    ]);

    // Placeholder for future API integration:
    // await fetch('/api/generate-content', { method: 'POST', body: JSON.stringify(payload) })
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen text-white">
      <CanvasBackground />
      <Navbar />

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-[260px_1fr]">
        <Sidebar />

        <main className="space-y-5">
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-5"
            >
              <div className="flex items-center gap-3 text-sm text-cyan-200">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-cyan-300 border-t-transparent"
                />
                Generating AI content...
              </div>
            </motion.div>
          )}

          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <motion.div key={card.title + index} drag dragConstraints={{ top: -10, bottom: 10, left: -10, right: 10 }} dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}>
                <FloatingCard title={card.title} content={card.content} delay={index * 0.08} />
              </motion.div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

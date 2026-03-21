"use client";

import { motion } from "framer-motion";
import { Suspense, startTransition, useEffect, useEffectEvent, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CanvasBackground } from "@/app/components/CanvasBackground";
import { FloatingCard } from "@/app/components/FloatingCard";
import { InputForm } from "@/app/components/InputForm";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { UpgradeButton } from "@/app/components/UpgradeButton";
import { FREE_DAILY_GENERATIONS } from "@/app/lib/site";
import { getRemainingFreeGenerations, getStoredPlan, incrementFreeGeneration, setStoredPlan } from "@/app/lib/usage";
import type { GenerateContentResponse, GeneratedItem, GeneratedItemType, PlanKey } from "@/app/lib/types";
import { BoltIcon, CalendarIcon, CrownIcon, HashIcon, SparkIcon } from "../components/Icons";

const starterCards: GeneratedItem[] = [
  {
    type: "caption",
    title: "Instagram Caption",
    content: "Lead with a bold promise, make your audience feel understood, then invite them into the next step with a clear CTA.",
  },
  {
    type: "idea",
    title: "TikTok / Reel Idea",
    content: "Use a quick transformation hook that shows the problem first and your offer as the satisfying fix.",
  },
  {
    type: "hashtags",
    title: "Hashtag Stack",
    content: "#SmallBusinessMarketing #ContentEngine #GrowthContent #LaunchWithAI #SocialMediaSystem",
  },
  {
    type: "calendar",
    title: "Mini Content Plan",
    content: "Day 1 authority. Day 2 proof. Day 3 behind the scenes. Day 4 offer breakdown. Day 5 direct CTA.",
  },
];

const lockedPreviewCards: GeneratedItem[] = [
  {
    type: "caption",
    title: "Premium Caption Pack",
    content: "Upgrade to reveal extra premium caption options and higher-volume content output.",
  },
  {
    type: "calendar",
    title: "Extended Campaign Plan",
    content: "Unlock a deeper weekly content calendar and keep your posting cadence moving without the daily cap.",
  },
];

const iconMap: Record<GeneratedItemType, ReactNode> = {
  caption: <SparkIcon className="h-4 w-4" />,
  idea: <BoltIcon className="h-4 w-4" />,
  hashtags: <HashIcon className="h-4 w-4" />,
  calendar: <CalendarIcon className="h-4 w-4" />,
};

function DashboardPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<GeneratedItem[]>(starterCards);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [remainingFreeGenerations, setRemainingFreeGenerations] = useState(FREE_DAILY_GENERATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>("Live AI uses OpenRouter when configured. Demo fallback stays available during localhost setup.");
  const [sourceLabel, setSourceLabel] = useState<string>("Demo fallback ready");

  const syncClientState = useEffectEvent(() => {
    const nextPlan = getStoredPlan();
    setPlan(nextPlan);
    setRemainingFreeGenerations(nextPlan === "pro" ? FREE_DAILY_GENERATIONS : getRemainingFreeGenerations());
  });

  const verifyCheckout = useEffectEvent(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
      const data = (await response.json()) as { active?: boolean };

      if (response.ok && data.active) {
        setStoredPlan("pro");
        syncClientState();
        setNotice("Pro unlocked on this browser. Unlimited generations are now active.");
      }
    } finally {
      router.replace("/dashboard?checkout=success");
    }
  });

  useEffect(() => {
    syncClientState();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const checkoutState = searchParams.get("checkout");

    if (checkoutState === "success" && sessionId) {
      void verifyCheckout(sessionId);
      return;
    }

    if (checkoutState === "success" && !sessionId) {
      setNotice("Checkout completed. If your Pro badge does not appear yet, refresh this page once.");
    }
  }, [searchParams]);

  const isLocked = plan !== "pro" && remainingFreeGenerations <= 0;

  async function handleGenerate(payload: { businessType: string; targetAudience: string; goal: string }) {
    if (isLocked) {
      setError("You have reached today's free limit on this browser. Upgrade to Pro for unlimited generations.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as GenerateContentResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not generate content right now.");
      }

      if (plan !== "pro") {
        const nextRemaining = incrementFreeGeneration();
        setRemainingFreeGenerations(nextRemaining);
      }

      startTransition(() => {
        setCards(data.items);
        setSourceLabel(data.source === "openrouter" ? `Live AI: ${data.meta?.model || "OpenRouter"}` : "Demo fallback");
      });

      setNotice(
        data.source === "openrouter"
          ? "Live OpenRouter generation completed successfully."
          : "Demo fallback generated content because your live API key is not configured yet.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate content right now.");
    } finally {
      setIsLoading(false);
    }
  }

  const displayCards = isLocked ? [...cards, ...lockedPreviewCards] : cards;
  const usageLabel = plan === "pro" ? "Unlimited Pro generations" : `${remainingFreeGenerations} free generations left today`;

  return (
    <div className="relative min-h-screen text-[#181614]">
      <CanvasBackground />
      <div className="pointer-events-none fixed inset-0 -z-10 paper-grid opacity-45" />
      <Navbar currentPlan={plan === "pro" ? "Pro active" : "Free active"} usageLabel={usageLabel} />

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[288px_1fr]">
        <Sidebar currentPlan={plan === "pro" ? "Pro" : "Free"} remainingFreeGenerations={remainingFreeGenerations} />

        <main className="space-y-5">
          {isLocked ? (
            <div className="glass-panel rounded-[28px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="editorial-label text-xs">Daily free cap reached</p>
                  <h2 className="text-2xl font-semibold text-[#181614]">You used all 5 free generations for today.</h2>
                  <p className="max-w-2xl text-sm leading-6 text-[#5f584f]">
                    Upgrade to Pro to remove the browser-based limit and keep generating captions, TikTok hooks, hashtags, and content plans without waiting for tomorrow&apos;s reset.
                  </p>
                </div>
                <UpgradeButton
                  label="Upgrade to Pro for $29/month"
                  className="interactive-pop inline-flex items-center justify-center rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]"
                />
              </div>
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-2xl border border-black/6 bg-white/85 p-4 text-sm text-[#4f4942]">
              <span className="font-semibold">Status:</span> {notice}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-black/6 bg-[#f8ebe6] p-4 text-sm text-[#7c5645]">
              <span className="font-semibold">Error:</span> {error}
            </div>
          ) : null}

          <InputForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
            isDisabled={isLocked}
            currentPlan={plan}
            remainingFreeGenerations={remainingFreeGenerations}
            helperMessage={sourceLabel ? `Latest output source: ${sourceLabel}.` : null}
          />

          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-black/6 bg-white/85 p-5">
              <div className="flex items-center gap-3 text-sm text-[#20584f]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-[#20584f] border-t-transparent"
                />
                Generating your content pack...
              </div>
            </motion.div>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {displayCards.map((card, index) => {
              const isPreview = isLocked && index >= cards.length;

              return (
                <motion.div
                  key={`${card.title}-${index}`}
                  drag={!isPreview}
                  dragConstraints={{ top: -10, bottom: 10, left: -10, right: 10 }}
                  dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
                >
                  <FloatingCard
                    title={card.title}
                    content={card.content}
                    icon={iconMap[card.type]}
                    delay={index * 0.08}
                    eyebrow={isPreview ? "Pro preview" : sourceLabel}
                    isLocked={isPreview}
                  />
                </motion.div>
              );
            })}
          </section>

          <div className="glass-panel rounded-[28px] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="editorial-label text-xs">Launch beta notes</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#181614]">Pro access is unlocked per browser in this first launch version.</h2>
              </div>
              {plan === "pro" ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e6efeb] px-4 py-2 text-sm text-[#20584f]">
                  <CrownIcon className="h-4 w-4" />
                  Pro active here
                </div>
              ) : null}
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#5f584f]">
              Authentication and synced accounts are intentionally out of scope for this pass, so the free limit and Pro unlock are handled locally to keep the launch experience fast and testable on localhost.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-[#f4f0e8] text-[#181614]">
          <CanvasBackground />
          <div className="pointer-events-none fixed inset-0 -z-10 paper-grid opacity-45" />
          <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
            <div className="glass-panel rounded-[28px] p-6 text-center">
              <p className="text-sm text-[#5f584f]">Loading dashboard...</p>
            </div>
          </div>
        </div>
      }
    >
      <DashboardPageInner />
    </Suspense>
  );
}

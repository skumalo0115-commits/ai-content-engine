"use client";

import { motion } from "framer-motion";
import { Suspense, startTransition, useEffect, useEffectEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { GeneratedStrategyCard } from "@/app/components/GeneratedStrategyCard";
import { InputForm } from "@/app/components/InputForm";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { UpgradeButton } from "@/app/components/UpgradeButton";
import { ContentCalendarPanel } from "@/app/components/ContentCalendarPanel";
import { deleteSavedStrategy, getSavedStrategies, hasSavedStrategy, saveGeneratedStrategy } from "@/app/lib/saved-content";
import { saveGeneratedCalendar } from "@/app/lib/saved-content";
import { FREE_DAILY_GENERATIONS } from "@/app/lib/site";
import { getRemainingFreeGenerations, getStoredPlan, incrementFreeGeneration, setStoredPlan } from "@/app/lib/usage";
import { getDefaultVideoRecommendations } from "@/app/lib/video-library";
import type { GenerateCalendarResponse, GeneratedCalendar, GenerateContentResponse, GeneratedStrategy, GeneratePayload, PlanKey, SavedStrategy } from "@/app/lib/types";
import { CrownIcon } from "../components/Icons";

const starterStrategy: GeneratedStrategy = {
  title: "Your content strategy will land here",
  overview:
    "Enter your business type, target audience, and content goal to generate one focused action card with exact platform moves, a five-day plan, and learning links.",
  instagramPlan:
    "You will get a clear Instagram direction that tells you what to post, what angle to use in the caption, and what action to ask the audience to take next.",
  tiktokPlan:
    "You will get a TikTok plan with a specific video concept, the best opening angle, and what to say or show in the video to match your goal.",
  facebookLinkedInPlan:
    "You will also get a supporting platform plan so you know what to repurpose, what to announce, and how to keep the message consistent outside short-form video.",
  hashtagPlan:
    "The hashtag section will tell you how to use your tags more intentionally instead of dropping random broad hashtags under every post.",
  fiveDayPlan: [
    { day: "Day 1", platform: "Instagram", action: "Publish your core post or reel with the main campaign angle." },
    { day: "Day 2", platform: "TikTok", action: "Turn the same idea into a short video with a sharper hook and clearer payoff." },
    { day: "Day 3", platform: "Stories", action: "Run a story follow-up that answers one common customer question." },
    { day: "Day 4", platform: "Facebook / LinkedIn", action: "Repurpose the campaign into a trust-building text post or update." },
    { day: "Day 5", platform: "Community", action: "Review performance and create a follow-up post based on what got the best response." },
  ],
  videoRecommendations: [
    ...getDefaultVideoRecommendations().slice(0, 3),
  ],
};

const lockedPreviewStrategy: GeneratedStrategy = {
  title: "Your premium strategy is ready to unlock",
  overview: "Upgrade to reveal a full black-card strategy with platform-specific instructions, a day-by-day content plan, and video learning links.",
  instagramPlan: "Unlock a more detailed Instagram plan with exact post direction, caption angle, and call to action.",
  tiktokPlan: "Unlock a sharper TikTok content angle with a clearer video structure, hook, and filming direction.",
  facebookLinkedInPlan: "Unlock a supporting platform plan that helps you repurpose the campaign across more channels.",
  hashtagPlan: "Unlock a tighter hashtag strategy that matches the campaign instead of using generic reach tags.",
  fiveDayPlan: starterStrategy.fiveDayPlan,
  videoRecommendations: starterStrategy.videoRecommendations,
};

function DashboardPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthReady, openAuthModal } = useAuth();
  const [strategy, setStrategy] = useState<GeneratedStrategy>(starterStrategy);
  const [lastBrief, setLastBrief] = useState<GeneratePayload | null>(null);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [remainingFreeGenerations, setRemainingFreeGenerations] = useState(FREE_DAILY_GENERATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string>("Platform playbook");
  const [activeView, setActiveView] = useState<"generate" | "saved">("generate");
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [expandedSavedId, setExpandedSavedId] = useState<string | null>(null);
  const [calendarTargetId, setCalendarTargetId] = useState<string | null>(null);
  const [activeCalendar, setActiveCalendar] = useState<GeneratedCalendar | null>(null);
  const [activeCalendarBrief, setActiveCalendarBrief] = useState<GeneratePayload | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const syncClientState = useEffectEvent(() => {
    const nextPlan = getStoredPlan();
    setPlan(nextPlan);
    setRemainingFreeGenerations(nextPlan === "pro" ? FREE_DAILY_GENERATIONS : getRemainingFreeGenerations());
    const nextSaved = getSavedStrategies();
    setSavedStrategies(nextSaved);
    setExpandedSavedId((currentId) => {
      if (currentId && nextSaved.some((item) => item.id === currentId)) {
        return currentId;
      }

      return null;
    });
  });

  const verifyCheckout = useEffectEvent(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
      const data = (await response.json()) as { active?: boolean };

      if (response.ok && data.active) {
        setStoredPlan("pro");
        syncClientState();
      }
    } finally {
      router.replace("/dashboard?checkout=success");
    }
  });

  useEffect(() => {
    syncClientState();
  }, []);

  useEffect(() => {
    if (isAuthReady && !user) {
      openAuthModal({ mode: "signup", redirectTo: "/dashboard", closeRedirectTo: "/" });
    }
  }, [isAuthReady, openAuthModal, user]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const checkoutState = searchParams.get("checkout");

    if (checkoutState === "success" && sessionId) {
      void verifyCheckout(sessionId);
      return;
    }

    if (checkoutState === "success" && !sessionId) {
      setError(null);
    }
  }, [searchParams]);

  const isLocked = plan !== "pro" && remainingFreeGenerations <= 0;
  const canSaveCurrentStrategy = Boolean(lastBrief) && strategy.title !== starterStrategy.title && !isLocked;
  const currentStrategyAlreadySaved = lastBrief ? hasSavedStrategy({ brief: lastBrief, strategy }) : false;

  async function handleGenerate(payload: { businessType: string; targetAudience: string; goal: string }) {
    setLastBrief(payload);
    setActiveView("generate");

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
        setStrategy(data.strategy);
        setSourceLabel(`Live AI: ${data.meta?.model || "OpenRouter"}`);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate content right now.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSaveStrategy() {
    if (!lastBrief || !canSaveCurrentStrategy) {
      return;
    }

    const { nextEntries } = saveGeneratedStrategy({ brief: lastBrief, strategy });
    setSavedStrategies(nextEntries);
    setExpandedSavedId(null);
    setActiveView("saved");
  }

  function handleDeleteSavedStrategy(id: string) {
    const nextEntries = deleteSavedStrategy(id);
    setSavedStrategies(nextEntries);
    setExpandedSavedId((currentId) => (currentId === id ? null : currentId));
    setCalendarTargetId((currentId) => (currentId === id ? null : currentId));
    setActiveCalendar((currentCalendar) => (calendarTargetId === id ? null : currentCalendar));
  }

  async function handleOpenCalendar(item: SavedStrategy) {
    if (item.calendar) {
      setCalendarTargetId(item.id);
      setActiveCalendarBrief(item.brief);
      setActiveCalendar(item.calendar);
      setIsCalendarOpen(true);
      return;
    }

    if (plan !== "pro") {
      router.push("/pricing");
      return;
    }

    setCalendarTargetId(item.id);
    setActiveCalendarBrief(item.brief);
    setIsCalendarOpen(true);
    setIsCalendarLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief: item.brief,
          strategy: item.strategy,
        }),
      });

      const data = (await response.json()) as GenerateCalendarResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The AI calendar could not be generated right now.");
      }

      setActiveCalendar(data.calendar);
      const nextEntries = saveGeneratedCalendar(item.id, data.calendar);
      setSavedStrategies(nextEntries);
    } catch (calendarError) {
      setActiveCalendar(null);
      setError(calendarError instanceof Error ? calendarError.message : "The AI calendar could not be generated right now.");
    } finally {
      setIsCalendarLoading(false);
    }
  }

  const usageLabel = plan === "pro" ? "Unlimited Pro generations" : `${remainingFreeGenerations} free generations left today`;

  return (
    <div className="relative min-h-screen text-[#181614]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-slide-3.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[9] bg-[rgba(244,240,232,0.82)]" />
      <Navbar currentPlan={plan === "pro" ? "Pro active" : "Free active"} usageLabel={usageLabel} showStartFree={false} />

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[288px_1fr]">
        <Sidebar
          currentPlan={plan === "pro" ? "Pro" : "Free"}
          remainingFreeGenerations={remainingFreeGenerations}
          activeView={activeView}
          savedCount={savedStrategies.length}
          onChangeView={setActiveView}
        />

        <main className="space-y-5">
          {activeView === "generate" && isLocked ? (
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

          {activeView === "generate" && error ? (
            <div className="rounded-2xl border border-black/6 bg-[#f8ebe6] p-4 text-sm text-[#7c5645]">
              <span className="font-semibold">Error:</span> {error}
            </div>
          ) : null}

          {activeView === "generate" && lastBrief ? (
            <div className="rounded-2xl border border-black/6 bg-white/85 p-5">
              <p className="editorial-label text-xs">Latest brief captured on localhost</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Business Type</p>
                  <p className="mt-2 text-sm text-[#181614]">{lastBrief.businessType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Target Audience</p>
                  <p className="mt-2 text-sm text-[#181614]">{lastBrief.targetAudience}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Content Goal</p>
                  <p className="mt-2 text-sm text-[#181614]">{lastBrief.goal}</p>
                </div>
              </div>
            </div>
          ) : null}

          {activeView === "generate" ? (
            <>
              <InputForm
                onSubmit={handleGenerate}
                isLoading={isLoading}
                isDisabled={isLocked}
                currentPlan={plan}
                remainingFreeGenerations={remainingFreeGenerations}
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

              <section>
                <GeneratedStrategyCard
                  strategy={isLocked ? lockedPreviewStrategy : strategy}
                  eyebrow={isLocked ? "Pro preview" : sourceLabel}
                  isLocked={isLocked}
                  showSaveButton={canSaveCurrentStrategy}
                  onSave={handleSaveStrategy}
                  saveLabel={currentStrategyAlreadySaved ? "Already saved" : "Save to Saved Content"}
                  isSaveDisabled={currentStrategyAlreadySaved}
                />
              </section>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-black/6 bg-white/85 p-5">
                <p className="editorial-label text-xs">Saved Content</p>
                <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#181614]">Your saved content briefs</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f584f]">
                      Open any saved brief to expand it into the full generated strategy card, including platform actions, a five-day plan, video recommendations, and the Pro schedule builder for a 14-day calendar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView("generate")}
                    className="interactive-pop inline-flex items-center justify-center rounded-full border border-black/8 bg-[#181614] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2b2723]"
                  >
                    Generate Content
                  </button>
                </div>
              </div>

              {savedStrategies.length > 0 ? (
                <div className="space-y-4">
                  {savedStrategies.map((item) => {
                    const isExpanded = item.id === expandedSavedId;

                    if (isExpanded) {
                      return (
                        <div key={item.id} className="relative">
                          <div className="absolute right-4 top-4 z-10 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedSavedId(null)}
                              className="rounded-full border border-white/14 bg-black/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedStrategy(item.id)}
                              className="rounded-full border border-[#ff8e8e]/25 bg-[#3d1212]/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#551919]"
                            >
                              Delete
                            </button>
                          </div>
                          <GeneratedStrategyCard strategy={item.strategy} eyebrow="Saved strategy" />
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className="rounded-2xl border border-black/6 bg-white/88 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.05)] transition hover:border-black/12 hover:bg-white">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="editorial-label text-xs">Selected saved brief</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => void handleOpenCalendar(item)}
                                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                  plan === "pro"
                                    ? "border-[#20584f]/18 bg-[#e6efeb] text-[#20584f] hover:bg-[#dce9e4]"
                                    : "cursor-not-allowed border-[#ded6cc] bg-[#f3eee8] text-[#998f84]"
                                }`}
                              >
                                {plan === "pro" ? "Schedule" : "Schedule Pro"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedSavedId(item.id)}
                                className="interactive-pop inline-flex items-center justify-center rounded-full border border-black/8 bg-[#181614] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2b2723]"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSavedStrategy(item.id)}
                                className="inline-flex items-center justify-center rounded-full border border-[#d7b3ac] bg-[#f4e5e1] px-4 py-2 text-sm font-semibold text-[#7c5645] transition hover:bg-[#efd9d3]"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Business Type</p>
                              <p className="mt-2 text-sm text-[#181614]">{item.brief.businessType}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Target Audience</p>
                              <p className="mt-2 text-sm text-[#181614]">{item.brief.targetAudience}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Content Goal</p>
                              <p className="mt-2 text-sm text-[#181614]">{item.brief.goal}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-black/12 bg-white/75 p-10 text-center">
                  <p className="text-lg font-semibold text-[#181614]">No saved content yet</p>
                  <p className="mt-2 text-sm text-[#5f584f]">Generate a strategy, hit save on the black output card, and it will appear here.</p>
                </div>
              )}
            </>
          )}

          {activeView === "generate" ? (
            <div className="glass-panel rounded-[28px] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="editorial-label text-xs">How to use this workspace well</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#181614]">Generate a clear plan, save the best ones, and reuse what starts working.</h2>
              </div>
              {plan === "pro" ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e6efeb] px-4 py-2 text-sm text-[#20584f]">
                  <CrownIcon className="h-4 w-4" />
                  Pro active here
                </div>
              ) : null}
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[#5f584f]">
              Start with one focused brief, save the versions you like most, then compare them side by side in Saved Content. Use the five-day plan as your posting checklist, and keep refining your prompts until the strategy sounds like something you would actually post this week.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f584f]">
              A good brief usually includes the kind of business you run, exactly who you want to reach, and the one result you care about most right now, like more sales, more bookings, or more profile visits. When you move into Pro, those saved strategies can also turn into a styled 14-day calendar so you know what to post next without guessing.
            </p>
            </div>
          ) : null}
        </main>
      </div>

      <ContentCalendarPanel
        isOpen={isCalendarOpen}
        onClose={() => {
          setIsCalendarOpen(false);
          setIsCalendarLoading(false);
        }}
        calendar={activeCalendar}
        brief={activeCalendarBrief}
        isLoading={isCalendarLoading}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-[#f4f0e8] text-[#181614]">
          <div
            className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-slide-3.png')" }}
          />
          <div className="pointer-events-none fixed inset-0 -z-[9] bg-[rgba(244,240,232,0.82)]" />
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

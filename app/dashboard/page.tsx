"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Suspense, startTransition, useEffect, useEffectEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { activateAccountSubscription, subscribeToAccountRecord, updateAccountUsageCount } from "@/app/lib/account-store";
import { useAuth } from "@/app/components/AuthProvider";
import { GeneratedStrategyCard } from "@/app/components/GeneratedStrategyCard";
import { InputForm } from "@/app/components/InputForm";
import { MobileScrollHint } from "@/app/components/MobileScrollHint";
import { Navbar } from "@/app/components/Navbar";
import { Sidebar } from "@/app/components/Sidebar";
import { UpgradeButton } from "@/app/components/UpgradeButton";
import { ContentCalendarPanel } from "@/app/components/ContentCalendarPanel";
import {
  getSavedStrategies,
  hasSavedStrategy,
  hydrateSavedStrategies,
  markSavedStrategyDeleted,
  replaceSavedStrategies,
  restoreDeletedSavedStrategy,
  saveGeneratedCalendar,
  saveGeneratedStrategy,
} from "@/app/lib/saved-content";
import { fetchAccountStateFromServer, syncAccountStateToServer } from "@/app/lib/account-sync";
import { clearPinnedDashboardOutput, getPinnedDashboardOutput, setPinnedDashboardOutput } from "@/app/lib/pinned-output";
import { FREE_DAILY_GENERATIONS } from "@/app/lib/site";
import { clearAllStoredBillingState, clearLegacyUsageState, clearStoredSubscription, getHighestStoredUsageCount, getStoredPlan, getUsageState, setStoredPlan, setStoredSubscription, setUsageStateCount } from "@/app/lib/usage";
import { getDefaultVideoRecommendations } from "@/app/lib/video-library";
import type { GenerateCalendarResponse, GeneratedCalendar, GenerateContentResponse, GeneratedStrategy, GeneratePayload, PlanKey, SavedStrategy } from "@/app/lib/types";

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

function waitFor(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function DashboardPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthReady, openAuthModal } = useAuth();
  const [strategy, setStrategy] = useState<GeneratedStrategy>(starterStrategy);
  const [lastBrief, setLastBrief] = useState<GeneratePayload | null>(null);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [remainingFreeGenerations, setRemainingFreeGenerations] = useState(FREE_DAILY_GENERATIONS);
  const [accountUsageCount, setAccountUsageCount] = useState(() => getUsageState().count);
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
  const [scheduleNotice, setScheduleNotice] = useState<{ id: number; message: string } | null>(null);
  const [undoDeleteState, setUndoDeleteState] = useState<{ id: number; entry: SavedStrategy; previousEntries: SavedStrategy[] } | null>(null);
  const [hiddenSavedIds, setHiddenSavedIds] = useState<string[]>([]);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [hasPinnedOutput, setHasPinnedOutput] = useState(false);
  const [hasDismissedScrollHint, setHasDismissedScrollHint] = useState(false);

  const visibleSavedStrategies = savedStrategies.filter((item) => !hiddenSavedIds.includes(item.id));

  const syncClientState = useEffectEvent(() => {
    const nextPlan = getStoredPlan();
    setPlan(nextPlan);
    const nextSaved = getSavedStrategies();
    const nextPinnedOutput = getPinnedDashboardOutput();
    setSavedStrategies(nextSaved);
    if (nextPinnedOutput) {
      setStrategy(nextPinnedOutput.strategy);
      setLastBrief(nextPinnedOutput.brief);
      setSourceLabel(nextPinnedOutput.sourceLabel);
      setHasPinnedOutput(true);
    } else {
      setStrategy(starterStrategy);
      setLastBrief(null);
      setSourceLabel("Platform playbook");
      setHasPinnedOutput(false);
    }
    setExpandedSavedId((currentId) => {
      if (currentId && nextSaved.some((item) => item.id === currentId)) {
        return currentId;
      }

      return null;
    });
  });

  const verifyCheckout = useEffectEvent(async (sessionId: string) => {
    if (!user) {
      return;
    }

    let didActivate = false;
    let shouldShowPendingNotice = true;

    try {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const response = await fetch(`/api/checkout/verify?reference=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as {
          active?: boolean;
          pending?: boolean;
          customerId?: string | null;
          customerCode?: string | null;
          subscriptionCode?: string | null;
          status?: string | null;
          customerEmail?: string | null;
          reference?: string | null;
          accountUid?: string | null;
          error?: string;
        };

        if (
          response.ok &&
          data.active &&
          typeof data.customerId === "string" &&
          typeof data.status === "string" &&
          typeof data.accountUid === "string" &&
          data.accountUid === user.uid
        ) {
          const nextSubscription = {
            provider: "paystack" as const,
            customerId: data.customerId,
            customerCode: typeof data.customerCode === "string" ? data.customerCode : undefined,
            subscriptionCode: typeof data.subscriptionCode === "string" ? data.subscriptionCode : undefined,
            email: typeof data.customerEmail === "string" ? data.customerEmail : undefined,
            reference: typeof data.reference === "string" ? data.reference : sessionId,
            status: data.status,
          };

          setStoredPlan("pro");
          setStoredSubscription(nextSubscription);
          syncClientState();

          if (user && (!data.accountUid || data.accountUid === user.uid)) {
            await activateAccountSubscription(user.uid, {
              profile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                role: user.role,
              },
              subscription: nextSubscription,
            }).catch(() => undefined);
          }

          didActivate = true;
          setError(null);
          break;
        }

        if (response.ok && data.active && data.accountUid && data.accountUid !== user.uid) {
          clearAllStoredBillingState();
          setPlan("free");
          setError("This checkout belongs to a different account. Please sign in with the account that started the payment.");
          shouldShowPendingNotice = false;
          break;
        }

        if (!data.pending) {
          clearAllStoredBillingState();
          setPlan("free");
          throw new Error(data.error || "Your payment was approved, but Pro could not be unlocked yet.");
        }

        await waitFor(1200 * (attempt + 1));
      }

      if (!didActivate && shouldShowPendingNotice) {
        setError("Your payment is still syncing with Paystack. Please refresh the dashboard in a few seconds if Pro does not appear yet.");
      }
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Your payment could not be verified.");
    } finally {
      router.replace("/dashboard");
    }
  });

  useEffect(() => {
    syncClientState();
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      syncClientState();
    }
  }, [isAuthReady, user?.uid]);

  useEffect(() => {
    setRemainingFreeGenerations(plan === "pro" ? FREE_DAILY_GENERATIONS : Math.max(0, FREE_DAILY_GENERATIONS - accountUsageCount));
  }, [accountUsageCount, plan]);

  useEffect(() => {
    if (!scheduleNotice || typeof window === "undefined") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setScheduleNotice(null);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [scheduleNotice]);

  useEffect(() => {
    if (!undoDeleteState || typeof window === "undefined") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUndoDeleteState(null);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [undoDeleteState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setHasDismissedScrollHint(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateScrollHint = () => {
      const pageHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight,
      );
      const remainingScroll = pageHeight - window.innerHeight - window.scrollY;
      const canScrollDown = remainingScroll > 80;
      const nearTop = window.scrollY < 48;

      if (window.scrollY > 24) {
        setHasDismissedScrollHint(true);
      }

      setShowScrollHint(!isCalendarOpen && !hasDismissedScrollHint && canScrollDown && nearTop);
    };

    updateScrollHint();
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(updateScrollHint);
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
    };
  }, [activeView, expandedSavedId, hasDismissedScrollHint, isCalendarOpen, strategy.title, visibleSavedStrategies.length]);

  useEffect(() => {
    if (!user) {
      setSavedStrategies(getSavedStrategies());
      return;
    }

    let isCancelled = false;

    void fetchAccountStateFromServer()
      .then(async (initialResult) => {
        const localSavedStrategies = getSavedStrategies();
        const localUsageCount = getHighestStoredUsageCount(user.uid);

        if (localSavedStrategies.length > 0 || localUsageCount > 0) {
          const syncPayload: { savedContent?: SavedStrategy[]; usageCount?: number } = {};

          if (localSavedStrategies.length > 0) {
            syncPayload.savedContent = localSavedStrategies;
          }

          if (localUsageCount > 0) {
            syncPayload.usageCount = localUsageCount;
          }

          await syncAccountStateToServer(syncPayload).catch(() => undefined);
        }

        const result = localSavedStrategies.length > 0 || localUsageCount > 0 ? await fetchAccountStateFromServer().catch(() => initialResult) : initialResult;

        if (isCancelled || !result?.record) {
          return;
        }

        const remoteRecord = result.record;
        const nextUsageCount = Math.max(remoteRecord.usageCount, localUsageCount);

        setAccountUsageCount(nextUsageCount);
        setUsageStateCount(nextUsageCount);

        if (localUsageCount > remoteRecord.usageCount) {
          void syncAccountStateToServer({ usageCount: localUsageCount })
            .catch(() => updateAccountUsageCount(user.uid, localUsageCount))
            .then(() => clearLegacyUsageState())
            .catch(() => undefined);
        } else if (nextUsageCount > 0) {
          clearLegacyUsageState();
        }

        void hydrateSavedStrategies(remoteRecord.savedContent).then((entries) => {
          if (isCancelled) {
            return;
          }

          setSavedStrategies(entries);
          setExpandedSavedId((currentId) => (currentId && entries.some((item) => item.id === currentId) ? currentId : null));
        });
      })
      .catch(() => undefined);

    const unsubscribe = subscribeToAccountRecord(
      user.uid,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        role: user.role,
      },
      (record) => {
        if (!record) {
          setSavedStrategies(getSavedStrategies());
          return;
        }

        const localUsageCount = getHighestStoredUsageCount(user.uid);
        const nextUsageCount = Math.max(record.usageCount, localUsageCount);

        setAccountUsageCount(nextUsageCount);
        setUsageStateCount(nextUsageCount);

        if (localUsageCount > record.usageCount) {
          void syncAccountStateToServer({ usageCount: localUsageCount })
            .catch(() => updateAccountUsageCount(user.uid, localUsageCount))
            .then(() => clearLegacyUsageState())
            .catch(() => undefined);
        } else if (nextUsageCount > 0) {
          clearLegacyUsageState();
        }

        void hydrateSavedStrategies(record.savedContent).then((entries) => {
          setSavedStrategies(entries);
          setExpandedSavedId((currentId) => (currentId && entries.some((item) => item.id === currentId) ? currentId : null));
        });
      },
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (isAuthReady && !user) {
      if (typeof window !== "undefined" && window.sessionStorage.getItem("ace-skip-auth-modal-once") === "1") {
        window.sessionStorage.removeItem("ace-skip-auth-modal-once");
        return;
      }

      openAuthModal({ mode: "signup", redirectTo: "/dashboard", closeRedirectTo: "/" });
    }
  }, [isAuthReady, openAuthModal, user]);

  useEffect(() => {
    const sessionId = searchParams.get("reference") || searchParams.get("trxref");
    const checkoutState = searchParams.get("checkout");

    if (sessionId && isAuthReady && user) {
      void verifyCheckout(sessionId);
      return;
    }

    if (checkoutState === "success" && !sessionId) {
      setError(null);
    }

    if (checkoutState === "cancelled") {
      clearAllStoredBillingState();
      clearStoredSubscription();
      setStoredPlan("free");
      syncClientState();
    }
  }, [isAuthReady, searchParams, user]);

  const isLocked = plan !== "pro" && remainingFreeGenerations <= 0;
  const canSaveCurrentStrategy = Boolean(lastBrief) && strategy.title !== starterStrategy.title && !isLocked;
  const currentStrategyAlreadySaved = lastBrief ? hasSavedStrategy({ brief: lastBrief, strategy }) : false;

  function handleResetGeneratedOutput() {
    clearPinnedDashboardOutput();
    setStrategy(starterStrategy);
    setLastBrief(null);
    setSourceLabel("Platform playbook");
    setHasPinnedOutput(false);
    setError(null);
    setActiveView("generate");
  }

  async function handleGenerate(payload: { businessType: string; targetAudience: string; goal: string }) {
    setLastBrief(payload);
    setActiveView("generate");

    if (isLocked) {
      setError("You have used all 3 free generations on this account. Upgrade to Pro for unlimited generations.");
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

      const nextSourceLabel = `Live AI: ${data.meta?.model || "OpenRouter"}`;

      if (plan !== "pro" && user) {
        const nextUsageCount = accountUsageCount + 1;
        setAccountUsageCount(nextUsageCount);
        setUsageStateCount(nextUsageCount);
        void syncAccountStateToServer({ usageCount: nextUsageCount })
          .catch(() => updateAccountUsageCount(user.uid, nextUsageCount))
          .catch(() => undefined);
      }

      startTransition(() => {
        setStrategy(data.strategy);
        setSourceLabel(nextSourceLabel);
      });
      setPinnedDashboardOutput({
        brief: payload,
        strategy: data.strategy,
        sourceLabel: nextSourceLabel,
      });
      setHasPinnedOutput(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate content right now.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveStrategy() {
    if (!lastBrief || !canSaveCurrentStrategy) {
      return;
    }

    const { nextEntries } = await saveGeneratedStrategy({ brief: lastBrief, strategy });
    setSavedStrategies(nextEntries);
    setExpandedSavedId(null);
    setActiveView("saved");
  }

  async function handleDeleteSavedStrategy(entry: SavedStrategy) {
    const previousEntries = savedStrategies;
    const nextEntries = previousEntries.filter((savedEntry) => savedEntry.id !== entry.id);

    markSavedStrategyDeleted(entry.id);
    setHiddenSavedIds((currentIds) => (currentIds.includes(entry.id) ? currentIds : [...currentIds, entry.id]));
    setSavedStrategies(nextEntries);
    setExpandedSavedId((currentId) => (currentId === entry.id ? null : currentId));
    setCalendarTargetId((currentId) => (currentId === entry.id ? null : currentId));
    setActiveCalendar((currentCalendar) => (calendarTargetId === entry.id ? null : currentCalendar));
    setUndoDeleteState({ id: Date.now(), entry, previousEntries });

    try {
      await replaceSavedStrategies(nextEntries);
    } catch (deleteError) {
      restoreDeletedSavedStrategy(entry.id);
      setHiddenSavedIds((currentIds) => currentIds.filter((currentId) => currentId !== entry.id));
      setSavedStrategies(previousEntries);
      setUndoDeleteState(null);
      setError(deleteError instanceof Error ? deleteError.message : "The saved content could not be deleted right now.");
    }
  }

  async function handleUndoDelete() {
    if (!undoDeleteState) {
      return;
    }

    const restoredEntries = undoDeleteState.previousEntries;
    const restoredEntryId = undoDeleteState.entry.id;
    restoreDeletedSavedStrategy(restoredEntryId);
    setSavedStrategies(restoredEntries);
    setHiddenSavedIds((currentIds) => currentIds.filter((currentId) => currentId !== restoredEntryId));
    setUndoDeleteState(null);

    try {
      await replaceSavedStrategies(restoredEntries);
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : "The saved content could not be restored right now.");
    }
  }

  async function handleOpenCalendar(item: SavedStrategy) {
    if (plan !== "pro") {
      setScheduleNotice({
        id: Date.now(),
        message: "Upgrade to Pro to unlock the 14-day AI content calendar for saved strategies.",
      });
      setIsCalendarOpen(false);
      return;
    }

    if (item.calendar?.entries?.length) {
      setCalendarTargetId(item.id);
      setActiveCalendarBrief(item.brief);
      setActiveCalendar(item.calendar);
      setIsCalendarOpen(true);
      return;
    }

    setCalendarTargetId(item.id);
    setActiveCalendarBrief(item.brief);
    setActiveCalendar(null);
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
      const nextEntries = await saveGeneratedCalendar(item.id, data.calendar);
      setSavedStrategies(nextEntries);
    } catch (calendarError) {
      setActiveCalendar(null);
      setError(calendarError instanceof Error ? calendarError.message : "The AI calendar could not be generated right now.");
    } finally {
      setIsCalendarLoading(false);
    }
  }

  const usageLabel = plan === "pro" ? "Unlimited Pro generations" : `${remainingFreeGenerations} free generations left on this account`;

  return (
    <div className="relative min-h-screen text-[#181614]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-slide-3.png')" }}
      />
      <div className="pointer-events-none fixed inset-0 -z-[9] bg-[rgba(244,240,232,0.82)]" />
      <Navbar currentPlan={plan === "pro" ? "Pro active" : "Free active"} usageLabel={usageLabel} showStartFree={false} planState={plan} />

      <div className="mx-auto grid w-full max-w-7xl items-start gap-5 px-4 pb-6 pt-4 sm:px-6 md:grid-cols-[288px_minmax(0,1fr)]">
        <Sidebar
          currentPlan={plan === "pro" ? "Pro" : "Free"}
          remainingFreeGenerations={remainingFreeGenerations}
          activeView={activeView}
          savedCount={visibleSavedStrategies.length}
          onChangeView={setActiveView}
        />

        <main className="min-w-0 space-y-5">
          {activeView === "generate" && isLocked ? (
            <div className="glass-panel rounded-[28px] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="editorial-label text-xs">Daily free cap reached</p>
                  <h2 className="text-2xl font-semibold text-[#181614]">You used all 3 free generations on this account.</h2>
                  <p className="max-w-2xl text-sm leading-6 text-[#5f584f]">
                    Upgrade to Pro to remove the account limit and keep generating captions, TikTok hooks, hashtags, and content plans without interruption.
                  </p>
                </div>
                <UpgradeButton
                  label="Upgrade to Pro for $10/month"
                  className="interactive-pop inline-flex items-center justify-center rounded-full bg-[#181614] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2b2723]"
                />
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-black/6 bg-[#f8ebe6] p-4 text-sm text-[#7c5645]">
              <span className="font-semibold">Error:</span> {error}
            </div>
          ) : null}

          {activeView === "generate" && lastBrief ? (
            <div className="rounded-2xl border border-black/6 bg-white/85 p-5">
              <p className="editorial-label text-xs">Latest brief captured</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Business Type</p>
                  <p className="mt-2 break-words text-sm text-[#181614]">{lastBrief.businessType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Target Audience</p>
                  <p className="mt-2 break-words text-sm text-[#181614]">{lastBrief.targetAudience}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Content Goal</p>
                  <p className="mt-2 break-words text-sm text-[#181614]">{lastBrief.goal}</p>
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
                  showDetailSections={strategy.title !== starterStrategy.title && strategy.title !== lockedPreviewStrategy.title}
                  showSaveButton={canSaveCurrentStrategy}
                  onSave={() => void handleSaveStrategy()}
                  saveLabel={currentStrategyAlreadySaved ? "Already saved" : "Save to Saved Content"}
                  isSaveDisabled={currentStrategyAlreadySaved}
                  showPinnedBadge={!isLocked && hasPinnedOutput}
                  onReset={!isLocked && hasPinnedOutput ? handleResetGeneratedOutput : undefined}
                  resetLabel="Clear"
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

              {visibleSavedStrategies.length > 0 ? (
                <div className="space-y-4">
                  {visibleSavedStrategies.map((item) => {
                    const isExpanded = item.id === expandedSavedId;

                    if (isExpanded) {
                      return (
                        <div key={item.id} className="relative">
                          <div className="relative z-10 mb-4 flex flex-wrap justify-end gap-2 sm:absolute sm:right-4 sm:top-4 sm:mb-0">
                            <button
                              type="button"
                              onClick={() => setExpandedSavedId(null)}
                              className="w-full rounded-full border border-white/14 bg-black/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85 sm:w-auto"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteSavedStrategy(item)}
                              className="w-full rounded-full border border-[#ff8e8e]/25 bg-[#3d1212]/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#551919] sm:w-auto"
                            >
                              Delete
                            </button>
                          </div>
                          <GeneratedStrategyCard strategy={item.strategy} eyebrow="Saved strategy" />
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className="rounded-2xl border border-black/6 bg-white/88 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.05)] transition hover:border-black/12 hover:bg-white sm:p-5">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="editorial-label text-xs">Selected saved brief</p>
                            </div>
                            <div className="flex flex-row flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => void handleOpenCalendar(item)}
                                className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                                  plan === "pro"
                                    ? "border-[#20584f]/18 bg-[#e6efeb] text-[#20584f] hover:bg-[#dce9e4]"
                                    : "border-[#ded6cc] bg-[#f3eee8] text-[#998f84] hover:bg-[#eee7de]"
                                }`}
                              >
                                {plan === "pro" ? "Schedule" : "Schedule Pro"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedSavedId(item.id)}
                                className="interactive-pop inline-flex items-center justify-center rounded-full border border-black/8 bg-[#181614] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2b2723] sm:px-4 sm:text-sm"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteSavedStrategy(item)}
                                className="inline-flex items-center justify-center rounded-full border border-[#d7b3ac] bg-[#f4e5e1] px-3 py-2 text-xs font-semibold text-[#7c5645] transition hover:bg-[#efd9d3] sm:px-4 sm:text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Business Type</p>
                              <p className="mt-2 break-words text-sm text-[#181614]">{item.brief.businessType}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Target Audience</p>
                              <p className="mt-2 break-words text-sm text-[#181614]">{item.brief.targetAudience}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-[#7a7269]">Content Goal</p>
                              <p className="mt-2 break-words text-sm text-[#181614]">{item.brief.goal}</p>
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
      <AnimatePresence>
        {scheduleNotice ? (
          <motion.div
            key={scheduleNotice.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 top-20 z-40 flex justify-center px-4"
          >
            <div className="max-w-md rounded-[1.2rem] border border-[#d7b3ac] bg-[#fff5f1] px-4 py-3 text-center text-sm font-medium text-[#7c5645] shadow-[0_16px_40px_rgba(24,22,20,0.12)]">
              {scheduleNotice.message}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {undoDeleteState ? (
          <motion.div
            key={undoDeleteState.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4"
          >
            <div className="flex w-full max-w-lg flex-col gap-3 rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 shadow-[0_16px_40px_rgba(24,22,20,0.12)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[#181614]">Saved content removed.</p>
              <button
                type="button"
                onClick={() => void handleUndoDelete()}
                className="inline-flex items-center justify-center rounded-full bg-[#181614] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2b2723]"
              >
                Undo
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>{showScrollHint ? <MobileScrollHint /> : null}</AnimatePresence>
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

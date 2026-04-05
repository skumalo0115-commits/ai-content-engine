"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { GeneratedCalendar, GeneratePayload } from "@/app/lib/types";
import { MobileScrollHint } from "./MobileScrollHint";

type ContentCalendarPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  calendar: GeneratedCalendar | null;
  brief: GeneratePayload | null;
  isLoading?: boolean;
};

export function ContentCalendarPanel({ isOpen, onClose, calendar, brief, isLoading = false }: ContentCalendarPanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const updateHint = () => {
      const isMobile = window.innerWidth < 640;
      const target = scrollRef.current;

      if (!isMobile || !target) {
        setShowScrollHint(false);
        return;
      }

      const canScroll = target.scrollHeight - target.clientHeight > 24;
      const nearTop = target.scrollTop < 24;
      setShowScrollHint(canScroll && nearTop);
    };

    const frameId = window.requestAnimationFrame(updateHint);
    const target = scrollRef.current;
    target?.addEventListener("scroll", updateHint, { passive: true });
    window.addEventListener("resize", updateHint);

    return () => {
      window.cancelAnimationFrame(frameId);
      target?.removeEventListener("scroll", updateHint);
      window.removeEventListener("resize", updateHint);
    };
  }, [calendar, isLoading, isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 260, opacity: 0.6, scale: 0.96 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 260, opacity: 0.6, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] sm:rounded-[32px]"
          >
            <div className="border-b border-black/8 bg-[#f6f2eb] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="editorial-label text-xs">Pro Calendar</p>
                  <h2 className="mt-2 break-words text-xl font-semibold text-[#181614] sm:text-2xl">{calendar?.title || "14-day content calendar"}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f584f]">
                    {calendar?.summary || "Your AI-generated two-week schedule will appear here with daily guidance for what to post, film, and publish."}
                  </p>
                  {brief ? (
                    <div className="mt-4 grid gap-3 text-xs text-[#6f685f] md:grid-cols-3">
                      <div>
                        <span className="uppercase tracking-[0.18em] text-[#7a7269]">Business</span>
                        <p className="mt-2 break-words text-sm text-[#181614]">{brief.businessType}</p>
                      </div>
                      <div>
                        <span className="uppercase tracking-[0.18em] text-[#7a7269]">Audience</span>
                        <p className="mt-2 break-words text-sm text-[#181614]">{brief.targetAudience}</p>
                      </div>
                      <div>
                        <span className="uppercase tracking-[0.18em] text-[#7a7269]">Goal</span>
                        <p className="mt-2 break-words text-sm text-[#181614]">{brief.goal}</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-[#181614] transition hover:border-[#20584f]/20"
                >
                  Close
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-6 sm:px-6 sm:py-6 sm:pb-10">
              {isLoading ? (
                <div className="rounded-[28px] border border-black/8 bg-white/85 p-10 text-center">
                  <p className="text-lg font-semibold text-[#181614]">Building your 14-day calendar...</p>
                  <p className="mt-2 text-sm text-[#5f584f]">The AI is mapping two weeks of daily actions directly from this saved strategy.</p>
                </div>
              ) : calendar ? (
                <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {calendar.entries.map((entry) => (
                    <div
                      key={entry.date}
                      className="flex h-full min-h-[280px] min-w-0 flex-col rounded-[24px] border border-black/8 bg-white/92 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:min-h-[320px]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a7269]">{entry.dayLabel}</p>
                      <h3 className="mt-2 break-words text-base font-semibold leading-6 text-[#181614]">{entry.date}</h3>
                      <div className="mt-4 space-y-2.5 text-[13px] text-[#4d463f]">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8c8378]">Platform</p>
                          <p className="mt-1 break-words font-medium text-[#181614]">{entry.platform}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8c8378]">Format</p>
                          <p className="mt-1 break-words">{entry.contentType}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8c8378]">Task</p>
                          <p className="mt-1 break-words leading-5">{entry.task}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8c8378]">Hook</p>
                          <p className="mt-1 break-words leading-5">{entry.hook}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8c8378]">CTA</p>
                          <p className="mt-1 break-words leading-5">{entry.cta}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-black/12 bg-white/75 p-10 text-center">
                  <p className="text-lg font-semibold text-[#181614]">No calendar generated yet</p>
                  <p className="mt-2 text-sm text-[#5f584f]">Use the schedule button on a saved strategy to build a 14-day posting calendar.</p>
                </div>
              )}
            </div>
            {showScrollHint ? <MobileScrollHint label="Scroll calendar" className="bottom-6 z-[60]" /> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

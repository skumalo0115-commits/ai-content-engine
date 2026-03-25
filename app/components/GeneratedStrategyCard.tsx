"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookmarkIcon } from "@/app/components/Icons";
import type { GeneratedStrategy, VideoRecommendation } from "@/app/lib/types";

type GeneratedStrategyCardProps = {
  strategy: GeneratedStrategy;
  eyebrow?: string;
  isLocked?: boolean;
  showSaveButton?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  isSaveDisabled?: boolean;
};

function TypedText({ text, className }: { text: string; className?: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (!text) {
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 10);

    return () => window.clearInterval(interval);
  }, [text]);

  return <p className={["whitespace-pre-line", className].filter(Boolean).join(" ")}>{visibleText}</p>;
}

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "").trim();
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export function GeneratedStrategyCard({
  strategy,
  eyebrow,
  isLocked = false,
  showSaveButton = false,
  onSave,
  saveLabel = "Save",
  isSaveDisabled = false,
}: GeneratedStrategyCardProps) {
  const [activeVideo, setActiveVideo] = useState<VideoRecommendation | null>(null);

  function openVideo(video: VideoRecommendation) {
    setActiveVideo(video);
  }

  function closeVideo() {
    setActiveVideo(null);
  }

  const activeVideoId = activeVideo ? getYouTubeVideoId(activeVideo.url) : null;
  const activeVideoEmbedUrl = activeVideoId ? `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0` : null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] p-7 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className={`${isLocked ? "blur-[2px]" : ""}`}>
          <div className="space-y-4 border-b border-white/10 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                {eyebrow ? <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">{eyebrow}</p> : null}
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white">{strategy.title}</h2>
              </div>
              {showSaveButton && !isLocked ? (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaveDisabled}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSaveDisabled
                      ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/45"
                      : "border-white/16 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  }`}
                >
                  <BookmarkIcon className="h-4 w-4" />
                  {saveLabel}
                </button>
              ) : null}
            </div>
            <TypedText key={strategy.overview} text={strategy.overview} className="max-w-3xl text-sm leading-7 text-white/76" />
          </div>

          <div className="grid gap-5 border-b border-white/10 py-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-[24px] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/48">Instagram</p>
              <TypedText key={strategy.instagramPlan} text={strategy.instagramPlan} className="text-sm leading-7 text-white/82" />
            </div>
            <div className="space-y-3 rounded-[24px] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/48">TikTok</p>
              <TypedText key={strategy.tiktokPlan} text={strategy.tiktokPlan} className="text-sm leading-7 text-white/82" />
            </div>
          </div>

          <div className="grid gap-5 border-b border-white/10 py-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3 rounded-[24px] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/48">Facebook / LinkedIn</p>
              <TypedText key={strategy.facebookLinkedInPlan} text={strategy.facebookLinkedInPlan} className="text-sm leading-7 text-white/82" />
            </div>
            <div className="space-y-3 rounded-[24px] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/48">Hashtag Plan</p>
              <TypedText key={strategy.hashtagPlan} text={strategy.hashtagPlan} className="text-sm leading-7 text-white/82" />
            </div>
          </div>

          <div className="space-y-4 border-b border-white/10 py-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/48">Next 5 Days</p>
            <div className="grid gap-4 lg:grid-cols-5">
              {strategy.fiveDayPlan.map((item) => (
                <div key={`${item.day}-${item.platform}`} className="rounded-[22px] bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold text-white">{item.day}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/45">{item.platform}</p>
                  <TypedText key={`${item.day}-${item.action}`} text={item.action} className="mt-3 text-sm leading-6 text-white/78" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/48">Watch These Next</p>
            <div className="flex flex-col gap-3">
              {strategy.videoRecommendations.map((video) => (
                <button
                  key={video.url}
                  type="button"
                  onClick={() => openVideo(video)}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white transition hover:bg-white/[0.08]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{video.title}</p>
                    {video.channel ? <p className="mt-1 text-xs text-white/45">{video.channel}</p> : null}
                  </div>
                  {video.thumbnailUrl ? (
                    <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md border border-white/10">
                      <Image src={video.thumbnailUrl} alt={video.title} fill sizes="56px" className="object-cover" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLocked ? (
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <div className="rounded-full border border-white/12 bg-black/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/78">Upgrade to reveal full strategy</div>
          </div>
        ) : null}
      </motion.article>

      <AnimatePresence>
        {activeVideo && activeVideoEmbedUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ x: 260, opacity: 0.6, scale: 0.96 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 260, opacity: 0.6, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/12 bg-[#0d0d0d] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 text-white">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Video Player</p>
                  <h3 className="mt-2 truncate text-lg font-semibold text-white">{activeVideo.title}</h3>
                  {activeVideo.channel ? <p className="mt-1 text-sm text-white/55">{activeVideo.channel}</p> : null}
                </div>
                <div className="flex gap-2">
                  <a
                    href={activeVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-center text-sm text-white transition hover:bg-white/[0.1]"
                  >
                    Open on YouTube
                  </a>
                  <button
                    type="button"
                    onClick={closeVideo}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm text-white transition hover:bg-white/[0.1]"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-black">
                <iframe
                  src={activeVideoEmbedUrl}
                  title={activeVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

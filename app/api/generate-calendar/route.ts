import { NextResponse } from "next/server";
import type { CalendarEntry, GenerateCalendarResponse, GeneratePayload, GeneratedCalendar, GeneratedStrategy } from "@/app/lib/types";

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getFirstSentence(value: string, fallback: string) {
  const normalized = cleanText(value);

  if (!normalized) {
    return fallback;
  }

  const match = normalized.match(/.*?[.!?](?:\s|$)/);
  return cleanText(match?.[0] || normalized);
}

function getPlatformTrack(platform: string, dayIndex: number) {
  const normalized = platform.toLowerCase();

  if (normalized.includes("tiktok")) {
    return {
      platform: "TikTok",
      contentType: dayIndex % 2 === 0 ? "Short-form video" : "Talking-head clip",
      hookPrefix: "Open with a fast hook about",
      ctaPrefix: "Ask viewers to",
    };
  }

  if (normalized.includes("story")) {
    return {
      platform: "Instagram Stories",
      contentType: "Story sequence",
      hookPrefix: "Lead the first story with",
      ctaPrefix: "End the story set by asking viewers to",
    };
  }

  if (normalized.includes("facebook") || normalized.includes("linkedin")) {
    return {
      platform: normalized.includes("linkedin") ? "LinkedIn" : "Facebook",
      contentType: "Text-led post",
      hookPrefix: "Start the post with",
      ctaPrefix: "Close the post by asking readers to",
    };
  }

  if (normalized.includes("community")) {
    return {
      platform: "Community",
      contentType: "Community post",
      hookPrefix: "Open the post with",
      ctaPrefix: "Use the closing line to ask people to",
    };
  }

  return {
    platform: "Instagram",
    contentType: dayIndex % 3 === 0 ? "Reel" : dayIndex % 3 === 1 ? "Carousel" : "Feed post",
    hookPrefix: "Start the caption with",
    ctaPrefix: "Use the caption close to ask people to",
  };
}

function buildCalendarEntries(brief: GeneratePayload, strategy: GeneratedStrategy) {
  const today = new Date();
  const basePlan = strategy.fiveDayPlan.length > 0
    ? strategy.fiveDayPlan
    : [
        { day: "Day 1", platform: "Instagram", action: strategy.instagramPlan },
        { day: "Day 2", platform: "TikTok", action: strategy.tiktokPlan },
        { day: "Day 3", platform: "Instagram Stories", action: strategy.overview },
        { day: "Day 4", platform: "Facebook / LinkedIn", action: strategy.facebookLinkedInPlan },
        { day: "Day 5", platform: "Community", action: strategy.hashtagPlan },
      ];

  const hookSource = [
    strategy.instagramPlan,
    strategy.tiktokPlan,
    strategy.facebookLinkedInPlan,
    strategy.hashtagPlan,
    strategy.overview,
  ];

  const ctaLibrary = [
    `visit your profile and take the next step with ${brief.businessType}`,
    `message you today if they want help with ${brief.goal}`,
    `save this idea for later and share it with someone in ${brief.targetAudience}`,
    `book, buy, or enquire while the offer is still fresh`,
  ];

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const plan = basePlan[index % basePlan.length];
    const platformTrack = getPlatformTrack(plan.platform, index);
    const action = getFirstSentence(plan.action, strategy.overview);
    const hookText = getFirstSentence(hookSource[index % hookSource.length], strategy.overview).toLowerCase();
    const ctaText = ctaLibrary[index % ctaLibrary.length];

    const entry: CalendarEntry = {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dayLabel: date.toLocaleDateString("en-US", { weekday: "long" }),
      platform: platformTrack.platform,
      contentType: platformTrack.contentType,
      task: cleanText(action),
      hook: cleanText(`${platformTrack.hookPrefix} ${hookText}`),
      cta: cleanText(`${platformTrack.ctaPrefix} ${ctaText}.`),
    };

    return entry;
  });
}

function buildCalendar(brief: GeneratePayload, strategy: GeneratedStrategy): GeneratedCalendar {
  return {
    title: `14-day calendar for ${brief.businessType}`,
    summary: cleanText(
      `This two-week calendar turns your saved strategy into daily actions for ${brief.targetAudience}, with each day focused on helping you ${brief.goal.toLowerCase()}.`,
    ),
    entries: buildCalendarEntries(brief, strategy),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      brief?: GeneratePayload;
      strategy?: GeneratedStrategy;
    };

    const brief = body.brief;
    const strategy = body.strategy;

    if (!brief || !strategy) {
      return NextResponse.json({ error: "A saved brief and strategy are required to build the calendar." }, { status: 400 });
    }

    const result: GenerateCalendarResponse = {
      source: "openrouter",
      calendar: buildCalendar(brief, strategy),
      meta: { model: "saved-strategy-calendar" },
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The 14-day calendar could not be generated right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

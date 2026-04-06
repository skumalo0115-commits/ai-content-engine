import { NextResponse } from "next/server";
import { DEFAULT_OPENROUTER_MODEL, getBaseUrl, siteConfig } from "@/app/lib/site";
import type { CalendarEntry, GenerateCalendarResponse, GeneratePayload, GeneratedCalendar, GeneratedStrategy } from "@/app/lib/types";

const openRouterEndpoint = "https://openrouter.ai/api/v1/chat/completions";

function cleanText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  return "";
}

function isValidCalendarEntry(value: unknown): value is CalendarEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CalendarEntry>;
  return (
    typeof candidate.date === "string" &&
    typeof candidate.dayLabel === "string" &&
    typeof candidate.platform === "string" &&
    typeof candidate.contentType === "string" &&
    typeof candidate.task === "string" &&
    typeof candidate.hook === "string" &&
    typeof candidate.cta === "string"
  );
}

function parseCalendar(raw: string) {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1] || raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

  if (!jsonText) {
    throw new Error("The AI calendar response could not be parsed.");
  }

  const parsed = JSON.parse(jsonText) as {
    title?: unknown;
    summary?: unknown;
    entries?: unknown;
  };

  const entries = Array.isArray(parsed.entries) ? parsed.entries.filter(isValidCalendarEntry).slice(0, 14) : [];

  if (entries.length !== 14) {
    throw new Error("The AI calendar response was incomplete.");
  }

  return {
    title: cleanText(parsed.title || "14-day AI content calendar"),
    summary: cleanText(parsed.summary || ""),
    entries,
  } satisfies GeneratedCalendar;
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

function buildFallbackCalendar(brief: GeneratePayload, strategy: GeneratedStrategy): GeneratedCalendar {
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
    "book, buy, or enquire while the offer is still fresh",
  ];

  const entries = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const plan = basePlan[index % basePlan.length];
    const platformTrack = getPlatformTrack(plan.platform, index);
    const action = getFirstSentence(plan.action, strategy.overview);
    const hookText = getFirstSentence(hookSource[index % hookSource.length], strategy.overview).toLowerCase();
    const ctaText = ctaLibrary[index % ctaLibrary.length];

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dayLabel: date.toLocaleDateString("en-US", { weekday: "long" }),
      platform: platformTrack.platform,
      contentType: platformTrack.contentType,
      task: cleanText(action),
      hook: cleanText(`${platformTrack.hookPrefix} ${hookText}`),
      cta: cleanText(`${platformTrack.ctaPrefix} ${ctaText}.`),
    } satisfies CalendarEntry;
  });

  return {
    title: `14-day calendar for ${brief.businessType}`,
    summary: "",
    entries,
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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      const fallbackResult: GenerateCalendarResponse = {
        source: "openrouter",
        calendar: buildFallbackCalendar(brief, strategy),
        meta: { model: "fallback-calendar" },
      };

      return NextResponse.json(fallbackResult);
    }

    const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
    const today = new Date();
    const dates = Array.from({ length: 14 }, (_, index) => {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + index);
      return {
        date: nextDate.toISOString().slice(0, 10),
        dayLabel: nextDate.toLocaleDateString("en-US", { weekday: "long" }),
      };
    });

    try {
      const response = await fetch(openRouterEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": getBaseUrl(),
          "X-Title": siteConfig.name,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                "You are a senior content strategist. Return strict JSON only with keys: title, summary, entries. entries must be an array of exactly 14 objects with keys date, dayLabel, platform, contentType, task, hook, cta. Build a realistic two-week posting calendar from the provided saved strategy. Keep the advice specific, practical, and ready to execute. Write a short natural summary in plain language.",
            },
            {
              role: "user",
              content: `Business type: ${brief.businessType}
Target audience: ${brief.targetAudience}
Goal: ${brief.goal}

Saved strategy title: ${strategy.title}
Overview: ${strategy.overview}
Instagram: ${strategy.instagramPlan}
TikTok: ${strategy.tiktokPlan}
Facebook or LinkedIn: ${strategy.facebookLinkedInPlan}
Hashtag plan: ${strategy.hashtagPlan}

Use these exact dates and day labels for the next 14 days:
${dates.map((entry) => `- ${entry.date} (${entry.dayLabel})`).join("\n")}

Build one helpful action per day. Return valid JSON only.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{
            message?: {
              content?: string | Array<{ text?: string }>;
            };
          }>;
        };

        const content = data.choices?.[0]?.message?.content;
        const rawContent = typeof content === "string" ? content : Array.isArray(content) ? content.map((item) => item.text || "").join("") : "";

        if (rawContent) {
          const calendar = parseCalendar(rawContent);
          const result: GenerateCalendarResponse = {
            source: "openrouter",
            calendar,
            meta: { model },
          };

          return NextResponse.json(result);
        }
      }
    } catch {
      // Fall back to a deterministic calendar so Schedule still works if the AI call fails.
    }

    const fallbackResult: GenerateCalendarResponse = {
      source: "openrouter",
      calendar: buildFallbackCalendar(brief, strategy),
      meta: { model: "fallback-calendar" },
    };

    return NextResponse.json(fallbackResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The 14-day calendar could not be generated right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

  const calendar: GeneratedCalendar = {
    title: cleanText(parsed.title || "14-day AI content calendar"),
    summary: cleanText(parsed.summary || ""),
    entries,
  };

  if (!calendar.summary) {
    throw new Error("The AI calendar summary was incomplete.");
  }

  return calendar;
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
      return NextResponse.json({ error: "OpenRouter is required to build the calendar right now." }, { status: 500 });
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
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content:
              "You are a senior content strategist. Return strict JSON only with keys: title, summary, entries. entries must be an array of exactly 14 objects with keys date, dayLabel, platform, contentType, task, hook, cta. Build a realistic two-week posting calendar from the provided saved strategy. Keep the advice specific, practical, and ready to execute.",
          },
          {
            role: "user",
            content: `Business type: ${brief.businessType}\nTarget audience: ${brief.targetAudience}\nGoal: ${brief.goal}\n\nSaved strategy title: ${strategy.title}\nOverview: ${strategy.overview}\nInstagram: ${strategy.instagramPlan}\nTikTok: ${strategy.tiktokPlan}\nFacebook or LinkedIn: ${strategy.facebookLinkedInPlan}\nHashtag plan: ${strategy.hashtagPlan}\n\nUse these exact dates and day labels for the next 14 days:\n${dates
              .map((entry) => `- ${entry.date} (${entry.dayLabel})`)
              .join("\n")}\n\nBuild one helpful action per day. Return valid JSON only.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "OpenRouter could not build the calendar right now." }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | Array<{ text?: string }>;
        };
      }>;
    };

    const content = data.choices?.[0]?.message?.content;
    const rawContent = typeof content === "string" ? content : Array.isArray(content) ? content.map((item) => item.text || "").join("") : "";

    if (!rawContent) {
      return NextResponse.json({ error: "OpenRouter returned an empty calendar response." }, { status: 500 });
    }

    const calendar = parseCalendar(rawContent);
    const result: GenerateCalendarResponse = {
      source: "openrouter",
      calendar,
      meta: { model },
    };

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The 14-day calendar could not be generated right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

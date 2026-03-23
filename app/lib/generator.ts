import { DEFAULT_OPENROUTER_MODEL, getBaseUrl, siteConfig } from "./site";
import type { GeneratePayload, GenerateContentResponse, GeneratedStrategy, StrategyDayPlan, VideoRecommendation } from "./types";

const openRouterEndpoint = "https://openrouter.ai/api/v1/chat/completions";

function cleanText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ");
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim().replace(/\s+/g, " ");
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => cleanText(part))
      .filter(Boolean)
      .join(" ")
      .trim()
      .replace(/\s+/g, " ");
  }

  if (value && typeof value === "object") {
    if ("text" in value) {
      return cleanText(value.text);
    }

    if ("content" in value) {
      return cleanText(value.content);
    }

    return JSON.stringify(value).trim().replace(/\s+/g, " ");
  }

  return "";
}

export function validateGeneratePayload(payload: GeneratePayload) {
  const businessType = cleanText(payload.businessType || "");
  const targetAudience = cleanText(payload.targetAudience || "");
  const goal = cleanText(payload.goal || "");

  if (!businessType || !targetAudience || !goal) {
    throw new Error("Please complete all three fields before generating content.");
  }

  if (businessType.length > 80 || targetAudience.length > 120 || goal.length > 140) {
    throw new Error("One or more fields are too long. Keep each answer short and focused.");
  }

  return { businessType, targetAudience, goal };
}

function extractContentText(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }

        return "";
      })
      .join("");
  }

  return "";
}

function toStringArray(value: unknown) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => cleanText(item)).filter(Boolean);
  }

  const cleaned = cleanText(value);
  return cleaned ? [cleaned] : [];
}

function toFiveDayPlan(value: unknown): StrategyDayPlan[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const day = cleanText("day" in item ? item.day : `Day ${index + 1}`);
      const platform = cleanText("platform" in item ? item.platform : "");
      const action = cleanText("action" in item ? item.action : "");

      if (!day || !platform || !action) {
        return null;
      }

      return { day, platform, action };
    })
    .filter((item): item is StrategyDayPlan => Boolean(item))
    .slice(0, 5);
}

function toVideoRecommendations(value: unknown): VideoRecommendation[] {
  return toStringArray(value).slice(0, 4).map((topic) => ({
    title: topic,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
  }));
}

function parseAiJson(raw: string) {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1] || raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

  if (!jsonText) {
    throw new Error("The AI response could not be parsed.");
  }

  const parsed = JSON.parse(jsonText) as {
    title?: unknown;
    overview?: unknown;
    instagram_plan?: unknown;
    tiktok_plan?: unknown;
    facebook_linkedin_plan?: unknown;
    hashtag_plan?: unknown;
    five_day_plan?: unknown;
    video_topics?: unknown;
  };

  const strategy: GeneratedStrategy = {
    title: cleanText(parsed.title || "Your next five-day social content move"),
    overview: cleanText(parsed.overview || ""),
    instagramPlan: cleanText(parsed.instagram_plan || ""),
    tiktokPlan: cleanText(parsed.tiktok_plan || ""),
    facebookLinkedInPlan: cleanText(parsed.facebook_linkedin_plan || ""),
    hashtagPlan: cleanText(parsed.hashtag_plan || ""),
    fiveDayPlan: toFiveDayPlan(parsed.five_day_plan),
    videoRecommendations: toVideoRecommendations(parsed.video_topics),
  };

  if (!strategy.overview || !strategy.instagramPlan || !strategy.tiktokPlan || !strategy.facebookLinkedInPlan || !strategy.hashtagPlan || strategy.fiveDayPlan.length < 5) {
    throw new Error("The AI response was incomplete.");
  }

  return strategy;
}

async function generateOpenRouterItems(payload: GeneratePayload) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter is required. Add OPENROUTER_API_KEY to .env.local and restart localhost to enable live content generation.");
  }

  const validated = validateGeneratePayload(payload);
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

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
            "You are a senior social media strategist for small businesses. Return strict JSON only. Be very specific. Tell the user exactly what to post, film, write, or publish on each platform. Use these keys exactly: title, overview, instagram_plan, tiktok_plan, facebook_linkedin_plan, hashtag_plan, five_day_plan, video_topics. five_day_plan must be an array of exactly 5 objects with keys day, platform, action. video_topics must be an array of 3 or 4 YouTube search topics that directly teach the user how to execute this plan. Keep every section practical and business-specific.",
        },
        {
          role: "user",
          content: `Business type: ${validated.businessType}\nTarget audience: ${validated.targetAudience}\nGoal: ${validated.goal}\n\nBuild one specific five-day content strategy. The output must:\n- explain exactly what the user should do on Instagram\n- explain exactly what the user should do on TikTok\n- explain what the user should do on Facebook or LinkedIn depending on what fits this business best\n- include a practical hashtag plan\n- include a five-day action plan with one clear task per day\n- include 3 to 4 exact YouTube search topics the user can click to learn more\n\nReturn valid JSON only.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("OpenRouter could not complete the request.");
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: unknown;
      };
    }>;
  };

  const rawContent = extractContentText(data.choices?.[0]?.message?.content);

  if (!rawContent) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return {
    source: "openrouter" as const,
    strategy: parseAiJson(rawContent),
    meta: {
      model,
    },
  };
}

export async function generateContent(payload: GeneratePayload): Promise<GenerateContentResponse> {
  const liveResponse = await generateOpenRouterItems(payload);
  return {
    ...liveResponse,
    remainingFreeGenerations: null,
  };
}

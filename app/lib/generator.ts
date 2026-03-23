import { DEFAULT_OPENROUTER_MODEL, getBaseUrl, siteConfig } from "./site";
import type { GeneratePayload, GenerateContentResponse, GeneratedItem } from "./types";

const openRouterEndpoint = "https://openrouter.ai/api/v1/chat/completions";

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
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

function parseAiJson(raw: string) {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1] || raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

  if (!jsonText) {
    throw new Error("The AI response could not be parsed.");
  }

  const parsed = JSON.parse(jsonText) as {
    caption?: string;
    idea?: string;
    hashtags?: string;
    calendar?: string;
  };

  const items: GeneratedItem[] = [
    {
      type: "caption",
      title: "Instagram Caption",
      content: cleanText(parsed.caption || ""),
    },
    {
      type: "idea",
      title: "TikTok / Reel Idea",
      content: cleanText(parsed.idea || ""),
    },
    {
      type: "hashtags",
      title: "Hashtag Stack",
      content: cleanText(parsed.hashtags || ""),
    },
    {
      type: "calendar",
      title: "Mini Content Plan",
      content: cleanText(parsed.calendar || ""),
    },
  ];

  if (items.some((item) => !item.content)) {
    throw new Error("The AI response was incomplete.");
  }

  return items;
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
            "You are a senior social media strategist for small businesses. Return strict JSON only with keys caption, idea, hashtags, and calendar. Keep each value concise, actionable, and polished.",
        },
        {
          role: "user",
          content: `Business type: ${validated.businessType}\nTarget audience: ${validated.targetAudience}\nGoal: ${validated.goal}\n\nGenerate:\n- 1 premium Instagram caption\n- 1 TikTok or Reel idea\n- 1 hashtag stack with 6 to 8 hashtags\n- 1 five-day mini content plan\n\nReturn valid JSON only.`,
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
    items: parseAiJson(rawContent),
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

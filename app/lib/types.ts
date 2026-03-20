export type GeneratePayload = {
  businessType: string;
  targetAudience: string;
  goal: string;
};

export type GeneratedItemType = "caption" | "idea" | "hashtags" | "calendar";

export type GeneratedItem = {
  type: GeneratedItemType;
  title: string;
  content: string;
};

export type GenerateContentResponse = {
  source: "openrouter" | "demo";
  items: GeneratedItem[];
  remainingFreeGenerations?: number | null;
  meta?: {
    model?: string;
  };
};

export type PlanKey = "free" | "pro";

export type PlanConfig = {
  key: PlanKey;
  name: string;
  priceLabel: string;
  description: string;
  ctaLabel: string;
  features: string[];
};

export type UsageLimitState = {
  dateKey: string;
  count: number;
};

export type ContactLink = {
  label: string;
  href: string;
};

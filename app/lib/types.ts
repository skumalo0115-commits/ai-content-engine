export type GeneratePayload = {
  businessType: string;
  targetAudience: string;
  goal: string;
};

export type SavedStrategy = {
  id: string;
  createdAt: string;
  brief: GeneratePayload;
  strategy: GeneratedStrategy;
};

export type StrategyDayPlan = {
  day: string;
  platform: string;
  action: string;
};

export type VideoRecommendation = {
  title: string;
  url: string;
  thumbnailUrl?: string;
  channel?: string;
};

export type GeneratedStrategy = {
  title: string;
  overview: string;
  instagramPlan: string;
  tiktokPlan: string;
  facebookLinkedInPlan: string;
  hashtagPlan: string;
  fiveDayPlan: StrategyDayPlan[];
  videoRecommendations: VideoRecommendation[];
};

export type GenerateContentResponse = {
  source: "openrouter";
  strategy: GeneratedStrategy;
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

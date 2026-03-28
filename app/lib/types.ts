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
  calendar?: GeneratedCalendar | null;
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

export type CalendarEntry = {
  date: string;
  dayLabel: string;
  platform: string;
  contentType: string;
  task: string;
  hook: string;
  cta: string;
};

export type GeneratedCalendar = {
  title: string;
  summary: string;
  entries: CalendarEntry[];
};

export type GenerateContentResponse = {
  source: "openrouter";
  strategy: GeneratedStrategy;
  remainingFreeGenerations?: number | null;
  meta?: {
    model?: string;
  };
};

export type GenerateCalendarResponse = {
  source: "openrouter";
  calendar: GeneratedCalendar;
  meta?: {
    model?: string;
  };
};

export type PlanKey = "free" | "pro";

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
};

export type PlanConfig = {
  key: PlanKey;
  name: string;
  priceLabel: string;
  description: string;
  ctaLabel: string;
  features: string[];
};

export type UsageLimitState = {
  count: number;
};

export type StoredSubscription = {
  provider: "paystack";
  customerId: string;
  customerCode?: string;
  subscriptionCode?: string;
  email?: string;
  reference?: string;
  status: string;
};

export type AccountRecord = {
  plan: PlanKey;
  profile: AccountProfile;
  subscription: StoredSubscription | null;
  updatedAt: string;
};

export type ContactLink = {
  label: string;
  href: string;
};

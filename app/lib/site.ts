import type { ContactLink, PlanConfig } from "./types";

export const FREE_DAILY_GENERATIONS = 3;
export const PRO_MONTHLY_PRICE_USD = 10;
export const DEFAULT_SITE_URL = "http://localhost:3000";
export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";

export const siteConfig = {
  name: "AI Content Engine",
  shortName: "ACE",
  description:
    "Generate social captions, TikTok ideas, hashtags, saved strategies, and simple content plans with an AI marketing workflow that stays attached to your account across devices.",
  heroTitle: "Your AI content workspace for every device",
  heroSubtitle: "Generate content ideas, save your best strategies, and pick up where you left off when you log back into the same account.",
  trustBadge: "Built for small businesses, creators, salons, agencies, cafes, and local service brands that need account-based content planning.",
  pricingBlurb:
    "Start free with three total generations on your account, then upgrade to Pro when you want unlimited output, saved-content tools, and the same plan following that paid account on every device.",
  companyName: "AI Content Engine",
  email: "s.kumalo0115@gmail.com",
  phoneDisplay: "082 774 4933",
  phoneHref: "tel:+27827744933",
  whatsappHref: "https://wa.me/27827744933",
  facebookHref: "https://www.facebook.com/IssUrSlime",
  linkedinHref: "https://www.linkedin.com/in/sbahle-kumalo-b4b498267",
  portfolioHref: "https://sbahle-kumalo-emerging-technologies.base44.app/",
} as const;

export const primaryNavLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerPageLinks: ContactLink[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const contactLinks: ContactLink[] = [
  { href: siteConfig.whatsappHref, label: "WhatsApp" },
  { href: `mailto:${siteConfig.email}`, label: "Email" },
];

export const planConfigs: PlanConfig[] = [
  {
    key: "free",
    name: "Free",
    priceLabel: "$0",
    description: `For testing ideas and validating your next post angle with ${FREE_DAILY_GENERATIONS} total generations and account-based saved content sync.`,
    ctaLabel: "Start Free",
    features: [
      `${FREE_DAILY_GENERATIONS} total generations on your account`,
      "Saved content follows the same signed-in account across devices",
      "Caption, TikTok idea, hashtag stack, and content mini-plan",
      "Launch-ready dashboard workflow",
      "Perfect for testing and first campaigns",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    priceLabel: `$${PRO_MONTHLY_PRICE_USD}/month`,
    description: "For businesses that need unlimited generation, AI scheduling, better campaign velocity, and premium positioning.",
    ctaLabel: "Upgrade to Pro",
    features: [
      "Unlimited generations on the paid account",
      "Pro follows the same paying account every time you log in",
      "Priority-quality output positioning",
      "14-day AI content calendar from any saved strategy",
      "Launch beta access to saved content and exports",
      "Ideal for fast-moving content teams",
    ],
  },
];

export const faqItems = [
  {
    question: "How does the free plan work?",
    answer: `The free plan gives you ${FREE_DAILY_GENERATIONS} total generations on your signed-in account. Once those are used, you can upgrade to Pro for unlimited access.`,
  },
  {
    question: "Will my saved content appear on another device?",
    answer:
      "Yes. When you save content while signed in, it is attached to that account so it can load again when you log into the same account on another device.",
  },
  {
    question: "What does Pro unlock?",
    answer:
      "Pro unlocks unlimited generation, premium positioning inside the dashboard, and advanced saved-content features like the 14-day AI schedule calendar for that paid account.",
  },
  {
    question: "Can I use this for any kind of small business?",
    answer:
      "Yes. The prompts and live outputs are designed for service businesses, local brands, online stores, personal brands, agencies, and creators.",
  },
] as const;

export function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

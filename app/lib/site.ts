import type { ContactLink, PlanConfig } from "./types";

export const FREE_DAILY_GENERATIONS = 5;
export const PRO_MONTHLY_PRICE_USD = 29;
export const DEFAULT_SITE_URL = "http://localhost:3000";
export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";

export const siteConfig = {
  name: "AI Content Engine",
  shortName: "ACE",
  description:
    "Generate social captions, TikTok ideas, hashtags, and simple content plans with an AI marketing workflow built for small businesses.",
  heroTitle: "Your AI Marketing Genius",
  heroSubtitle: "Generate viral social media content for your business instantly.",
  trustBadge: "Built for small businesses, creators, cafes, salons, agencies, and local service brands.",
  pricingBlurb:
    "Start free with five generations every day, then upgrade to Pro when you need unlimited output and faster campaign momentum.",
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
  { href: siteConfig.portfolioHref, label: "Portfolio" },
  { href: `mailto:${siteConfig.email}`, label: "Email" },
];

export const planConfigs: PlanConfig[] = [
  {
    key: "free",
    name: "Free",
    priceLabel: "$0",
    description: `For testing ideas and validating your next post angle with ${FREE_DAILY_GENERATIONS} generations per day.`,
    ctaLabel: "Start Free",
    features: [
      `${FREE_DAILY_GENERATIONS} generations every day`,
      "Caption, TikTok idea, hashtag stack, and content mini-plan",
      "Launch-ready dashboard workflow",
      "Perfect for testing and first campaigns",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    priceLabel: `$${PRO_MONTHLY_PRICE_USD}/month`,
    description: "For businesses that need unlimited generation, better campaign velocity, and premium positioning.",
    ctaLabel: "Upgrade to Pro",
    features: [
      "Unlimited generations",
      "Priority-quality output positioning",
      "Launch beta access to saved content and exports",
      "Ideal for fast-moving content teams",
    ],
  },
];

export const faqItems = [
  {
    question: "How does the free plan work?",
    answer: `The free plan gives you ${FREE_DAILY_GENERATIONS} generations per day per browser. It resets daily and is great for testing content angles before you scale up.`,
  },
  {
    question: "What does Pro unlock?",
    answer:
      "Pro unlocks unlimited generation, premium positioning inside the dashboard, and first access to launch-beta features like saved content and exports.",
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

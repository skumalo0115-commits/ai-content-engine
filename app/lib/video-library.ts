import type { GeneratePayload, GeneratedStrategy, VideoRecommendation } from "./types";

type CuratedVideo = VideoRecommendation & {
  keywords: string[];
};

const curatedVideos: CuratedVideo[] = [
  {
    title: "Best Instagram Marketing Strategy For Small Business 2026 (PROVEN & PROFITABLE)",
    channel: "Adam Erhart",
    url: "https://www.youtube.com/watch?v=iiDYFRQpHE0",
    thumbnailUrl: "https://i.ytimg.com/vi/iiDYFRQpHE0/mqdefault.jpg",
    keywords: ["instagram", "small business", "strategy", "sales", "followers", "engagement", "marketing", "online store", "reels"],
  },
  {
    title: "5 Steps to Grow Your Instagram Organically in 2025 (Small Business Strategy)",
    channel: "HubSpot Marketing",
    url: "https://www.youtube.com/watch?v=Zaz-sR-rBhs",
    thumbnailUrl: "https://i.ytimg.com/vi/Zaz-sR-rBhs/mqdefault.jpg",
    keywords: ["instagram", "organic", "growth", "small business", "followers", "engagement", "content", "reels"],
  },
  {
    title: "Grow your small business on TikTok | 5 proven tactics",
    channel: "Jade Beason",
    url: "https://www.youtube.com/watch?v=NnZ4uHkiXHw",
    thumbnailUrl: "https://i.ytimg.com/vi/NnZ4uHkiXHw/mqdefault.jpg",
    keywords: ["tiktok", "small business", "strategy", "content", "sales", "reach", "hooks", "followers", "marketing"],
  },
  {
    title: "TikTok For Business: Beginner's Guide To TikTok Marketing!",
    channel: "Justin Brown - Primal Video",
    url: "https://www.youtube.com/watch?v=lFpqTrnnHI4",
    thumbnailUrl: "https://i.ytimg.com/vi/lFpqTrnnHI4/mqdefault.jpg",
    keywords: ["tiktok", "business", "beginner", "marketing", "strategy", "video", "brand", "online store"],
  },
  {
    title: "How to create a social media content calendar for your business",
    channel: "Jelena Ostrovska",
    url: "https://www.youtube.com/watch?v=VtoaoI8l4sk",
    thumbnailUrl: "https://i.ytimg.com/vi/VtoaoI8l4sk/mqdefault.jpg",
    keywords: ["content calendar", "posting plan", "schedule", "social media", "consistency", "five day plan", "content plan"],
  },
  {
    title: "content ideas for small business owners // one month of social media posts for small business owners",
    channel: "Hannah Skye Creative",
    url: "https://www.youtube.com/watch?v=da8uRS1U5AA",
    thumbnailUrl: "https://i.ytimg.com/vi/da8uRS1U5AA/mqdefault.jpg",
    keywords: ["content ideas", "small business", "post ideas", "instagram", "tiktok", "social media", "captions", "campaign"],
  },
  {
    title: "How to always find the most RELEVANT hashtags to use on your Instagram",
    channel: "Learn With Shopify",
    url: "https://www.youtube.com/watch?v=sLfv8zbdd0s",
    thumbnailUrl: "https://i.ytimg.com/vi/sLfv8zbdd0s/mqdefault.jpg",
    keywords: ["hashtags", "instagram", "relevant hashtags", "discoverability", "reach", "small business", "seo"],
  },
  {
    title: "How to Write Instagram Captions That Convert",
    channel: "High Season Co.",
    url: "https://www.youtube.com/watch?v=qEpT41CGPow",
    thumbnailUrl: "https://i.ytimg.com/vi/qEpT41CGPow/mqdefault.jpg",
    keywords: ["captions", "instagram", "sales", "conversion", "small business", "copywriting", "online store"],
  },
  {
    title: "What is Instagram Shop & how to use it",
    channel: "Learn With Shopify",
    url: "https://www.youtube.com/watch?v=Tw3d60f1_dw",
    thumbnailUrl: "https://i.ytimg.com/vi/Tw3d60f1_dw/mqdefault.jpg",
    keywords: ["instagram shop", "shopify", "online store", "ecommerce", "sales", "product selling", "instagram"],
  },
  {
    title: "BEST Instagram Growth Strategy for Small Business 2026",
    channel: "Adam Erhart",
    url: "https://www.youtube.com/watch?v=sjKjbSLN4VI",
    thumbnailUrl: "https://i.ytimg.com/vi/sjKjbSLN4VI/mqdefault.jpg",
    keywords: ["instagram", "growth", "small business", "followers", "reels", "engagement", "organic growth"],
  },
  {
    title: "How To Make Any Reel Go Viral",
    channel: "Modern Millie",
    url: "https://www.youtube.com/watch?v=LdudG-_-q0s",
    thumbnailUrl: "https://i.ytimg.com/vi/LdudG-_-q0s/mqdefault.jpg",
    keywords: ["reels", "viral", "instagram", "short video", "hooks", "engagement", "content strategy"],
  },
  {
    title: "How to market your business using social media",
    channel: "Erica Martin | Marketing & Social Media Expert",
    url: "https://www.youtube.com/watch?v=x1ioqjSNNe0",
    thumbnailUrl: "https://i.ytimg.com/vi/x1ioqjSNNe0/mqdefault.jpg",
    keywords: ["social media", "business", "marketing", "small business", "strategy", "content", "awareness"],
  },
  {
    title: "Why Your Instagram Hashtags Aren't Working & How To Fix Them",
    channel: "Modern Millie",
    url: "https://www.youtube.com/watch?v=R1lmX3Ypa4k",
    thumbnailUrl: "https://i.ytimg.com/vi/R1lmX3Ypa4k/mqdefault.jpg",
    keywords: ["hashtags", "instagram", "discoverability", "reach", "strategy", "small business", "engagement"],
  },
  {
    title: "TikTok Live Shopping: How to sell your products and services live on TikTok",
    channel: "Learn With Shopify",
    url: "https://www.youtube.com/watch?v=-SzX6fkjnmM",
    thumbnailUrl: "https://i.ytimg.com/vi/-SzX6fkjnmM/mqdefault.jpg",
    keywords: ["tiktok", "live shopping", "products", "services", "sales", "ecommerce", "online store"],
  },
];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function buildSearchText(payload: GeneratePayload, strategy: GeneratedStrategy, suggestedTopics: string[]) {
  return [
    payload.businessType,
    payload.targetAudience,
    payload.goal,
    strategy.title,
    strategy.overview,
    strategy.instagramPlan,
    strategy.tiktokPlan,
    strategy.facebookLinkedInPlan,
    strategy.hashtagPlan,
    ...suggestedTopics,
  ].join(" ");
}

function toVideoRecommendation(video: CuratedVideo): VideoRecommendation {
  return {
    title: video.title,
    url: video.url,
    thumbnailUrl: video.thumbnailUrl,
    channel: video.channel,
  };
}

export function getDefaultVideoRecommendations(): VideoRecommendation[] {
  return curatedVideos.slice(0, 4).map(toVideoRecommendation);
}

export function pickCuratedVideoRecommendations({
  payload,
  strategy,
  suggestedTopics,
}: {
  payload: GeneratePayload;
  strategy: GeneratedStrategy;
  suggestedTopics: string[];
}): VideoRecommendation[] {
  const tokens = tokenize(buildSearchText(payload, strategy, suggestedTopics));
  const uniqueTokens = new Set(tokens);

  const ranked = curatedVideos
    .map((video) => {
      const score = video.keywords.reduce((total, keyword) => {
        const keywordTokens = tokenize(keyword);
        return total + keywordTokens.filter((token) => uniqueTokens.has(token)).length;
      }, 0);

      return { video, score };
    })
    .sort((a, b) => b.score - a.score);

  const candidatePool = ranked.filter(({ score }, index) => score > 0 || index < 6).slice(0, 8);
  const shuffledPool = [...candidatePool];

  for (let index = shuffledPool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledPool[index], shuffledPool[randomIndex]] = [shuffledPool[randomIndex], shuffledPool[index]];
  }

  const anchor = candidatePool[0] ? [candidatePool[0]] : [];
  const rotatingCandidates = shuffledPool.filter(({ video }) => !anchor.some((entry) => entry.video.url === video.url));
  const selected = [...anchor, ...rotatingCandidates].slice(0, 4).map(({ video }) => toVideoRecommendation(video));

  return selected.length > 0 ? selected : getDefaultVideoRecommendations();
}

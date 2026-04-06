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

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
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

function toTopicSearchRecommendation(topic: string): VideoRecommendation {
  return {
    title: topic,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
    channel: "YouTube search",
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
  const seedSource = [payload.businessType, payload.targetAudience, payload.goal, strategy.title, ...suggestedTopics].join("|");
  const seed = hashString(seedSource);
  const tokens = tokenize(buildSearchText(payload, strategy, suggestedTopics));
  const uniqueTokens = new Set(tokens);

  const ranked = curatedVideos
    .map((video) => {
      const keywordScore = video.keywords.reduce((total, keyword) => {
        const keywordTokens = tokenize(keyword);
        return total + keywordTokens.filter((token) => uniqueTokens.has(token)).length;
      }, 0);

      const directPhraseScore = suggestedTopics.reduce((total, topic) => {
        const normalizedTopic = topic.toLowerCase();
        return total + (video.title.toLowerCase().includes(normalizedTopic) ? 4 : 0);
      }, 0);

      const businessFitScore = video.keywords.some((keyword) => payload.businessType.toLowerCase().includes(keyword) || payload.goal.toLowerCase().includes(keyword))
        ? 3
        : 0;

      const score = keywordScore + directPhraseScore + businessFitScore;

      return { video, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return hashString(`${seed}:${a.video.url}`) - hashString(`${seed}:${b.video.url}`);
    });

  const candidatePool = ranked.filter(({ score }) => score > 0);
  const sortedPool = (candidatePool.length > 0 ? candidatePool : ranked)
    .slice(0, 10)
    .sort((a, b) => hashString(`${seed}:${a.video.url}`) - hashString(`${seed}:${b.video.url}`));

  const exactSearches = suggestedTopics
    .slice(0, 2)
    .map((topic) => topic.trim())
    .filter(Boolean)
    .map(toTopicSearchRecommendation);

  const curatedMatches = sortedPool
    .slice(0, Math.max(0, 4 - exactSearches.length))
    .map(({ video }) => toVideoRecommendation(video));

  const selected = [...exactSearches, ...curatedMatches].slice(0, 4);

  return selected.length > 0 ? selected : getDefaultVideoRecommendations();
}

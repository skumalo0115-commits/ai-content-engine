import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = ["/", "/dashboard", "/pricing", "/faq", "/contact", "/privacy", "/terms"];

  return routes.map((route, index) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}

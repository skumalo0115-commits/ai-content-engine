import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/components/AuthProvider";
import { PointerGlow } from "@/app/components/PointerGlow";
import { getBaseUrl, siteConfig } from "@/app/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "AI content generator",
    "social media captions",
    "small business marketing",
    "TikTok ideas",
    "Instagram captions",
    "hashtag generator",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-[#181614] antialiased">
        <AuthProvider>
          <PointerGlow />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

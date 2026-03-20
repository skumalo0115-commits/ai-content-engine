import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at top left, rgba(97,231,255,0.34), transparent 30%), radial-gradient(circle at top right, rgba(255,92,184,0.26), transparent 32%), linear-gradient(135deg, #060913 0%, #0b1230 46%, #050816 100%)",
          color: "#f8fbff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#8ceeff",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 74, fontWeight: 700, lineHeight: 1.04, maxWidth: 850 }}>
            Your AI Marketing Genius
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#d7e5f8", maxWidth: 900 }}>
            Generate captions, TikTok ideas, hashtags, and campaign plans with a premium AI workflow built for small businesses.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#f4a3cf" }}>
          <span>Free plan included</span>
          <span>Pro from $29/month</span>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#181614",
          borderRadius: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 14,
            background: "linear-gradient(180deg, rgba(109,224,194,0.2), rgba(109,224,194,0.05))",
          }}
        />
        <div
          style={{
            color: "#fff5ec",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          ACE
        </div>
      </div>
    ),
    size,
  );
}

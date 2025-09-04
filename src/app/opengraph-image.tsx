// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111 60%), radial-gradient(800px 600px at 80% 80%, rgba(0,255,255,.18), transparent 60%)",
          color: "white",
          padding: "80px",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.6, letterSpacing: 6, marginBottom: 12 }}>SIAWSH STUDIO</div>
        <div>Design that feels calm—and works.</div>
      </div>
    ),
    size
  );
}

// src/app/case-studies/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getAllCases } from "@/lib/cases";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Edge/runtime friendly — no external fonts needed
export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const cases = await getAllCases().catch(() => []);
  const cs = cases.find((c: any) => c.slug === params.slug);

  const title = cs?.title ?? "Case study";
  const tagLine = Array.isArray(cs?.tags) ? cs.tags.join(" • ") : "";

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
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.6, letterSpacing: 6, marginBottom: 12 }}>
          SIAWSH STUDIO
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 960 }}>{title}</div>
        {tagLine ? (
          <div style={{ marginTop: 18, fontSize: 28, opacity: 0.8 }}>{tagLine}</div>
        ) : null}
      </div>
    ),
    size
  );
}

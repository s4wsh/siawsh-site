// src/app/sitemap.ts
import type { MetadataRoute } from "next";

function coerceDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  const t = Date.parse(String(v));
  return Number.isNaN(t) ? undefined : new Date(t);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/services`, lastModified: new Date() },
    { url: `${base}/case-studies`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  // Include dynamic case studies when available
  try {
    const mod = await import("@/lib/cases");
    if (typeof mod.getAllCases === "function") {
      const items = (await mod.getAllCases()) as Array<Record<string, unknown>>;
      for (const c of items) {
        const slug = String(c.slug ?? "");
        if (!slug) continue;

        const last =
          coerceDate((c as any).updatedAt) ??
          coerceDate((c as any).lastModified) ??
          coerceDate((c as any).date) ??
          new Date();

        routes.push({ url: `${base}/case-studies/${slug}`, lastModified: last });
      }
    }
  } catch {
    // ok if lib/cases isn't present
  }

  return routes;
}

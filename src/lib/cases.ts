import fs from "node:fs/promises";
import path from "node:path";

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  year: number;
  tags: string[];
  cover?: string;
  blueprint?: string;
  framework?: string;
  finish?: string;
  images?: string[];
  video?: string;
  channels?: {
    blog?: boolean;
    behance?: boolean;
    linkedin?: boolean;
    facebook?: boolean;
    instagram?: boolean;
  };
  socialCaption?: string;
};

const CASES_DIR = path.join(process.cwd(), "content", "case-studies");

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string") {
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeCase(raw: any, slugFromFile: string): CaseStudy {
  const slug = String(raw?.slug || slugFromFile).trim();
  const title = String(raw?.title || "").trim();
  const yearNum = Number.parseInt(String(raw?.year ?? ""), 10);
  const year = Number.isFinite(yearNum) ? yearNum : 0;

  return {
    slug,
    title,
    client: raw?.client ? String(raw.client) : undefined,
    year,
    tags: toStringArray(raw?.tags),
    cover: raw?.cover ? String(raw.cover) : undefined,
    blueprint: raw?.blueprint ? String(raw.blueprint) : undefined,
    framework: raw?.framework ? String(raw.framework) : undefined,
    finish: raw?.finish ? String(raw.finish) : undefined,
    images: Array.isArray(raw?.images) ? raw.images.map(String) : undefined,
    video: raw?.video ? String(raw.video) : undefined,
    channels: raw?.channels ? {
      blog: !!raw.channels.blog,
      behance: !!raw.channels.behance,
      linkedin: !!raw.channels.linkedin,
      facebook: !!raw.channels.facebook,
      instagram: !!raw.channels.instagram,
    } : undefined,
    socialCaption: raw?.socialCaption ? String(raw.socialCaption) : undefined,
  };
}

async function safeParse(filePath: string): Promise<CaseStudy | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    if (!raw.trim()) {
      console.error("[cases] Empty JSON:", filePath);
      return null;
    }
    const parsed = JSON.parse(raw);
    const slug = path.basename(filePath, ".json");
    const normalized = normalizeCase(parsed, slug);

    if (!normalized.slug || !normalized.title) {
      console.error("[cases] Missing slug/title:", filePath);
      return null;
    }
    return normalized;
  } catch (err) {
    console.error("[cases] JSON parse failed:", filePath, err);
    return null;
  }
}

export async function getCaseSlugs(): Promise<string[]> {
  const files = await fs.readdir(CASES_DIR).catch(() => []);
  return files
    .filter((f) => f.toLowerCase().endsWith(".json"))
    .map((f) => f.replace(/\.json$/i, ""));
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy> {
  const filePath = path.join(CASES_DIR, `${slug}.json`);
  const cs = await safeParse(filePath);
  if (!cs) throw new Error(`Invalid or missing case JSON: ${slug}`);
  return cs;
}

export async function getAllCases(): Promise<CaseStudy[]> {
  const files = await fs.readdir(CASES_DIR).catch(() => []);
  const items = await Promise.all(
    files
      .filter((f) => f.toLowerCase().endsWith(".json"))
      .map((f) => safeParse(path.join(CASES_DIR, f)))
  );
  // newest year first, then title
  return (items.filter(Boolean) as CaseStudy[]).sort((a, b) => {
    if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
    return a.title.localeCompare(b.title);
  });
}

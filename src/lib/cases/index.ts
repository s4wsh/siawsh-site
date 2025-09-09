import { promises as fs } from "node:fs";
import path from "node:path";

export type CaseDoc = {
  slug: string;
  title: string;
  year?: number | string;
  tags?: string[];
  // NEW: support both shapes
  category?: string;
  categories?: string[];
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

const CASE_DIR = path.join(process.cwd(), "content", "case-studies");
const SAFE_SLUG = /^[a-z0-9-]+$/;

function toSafeSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCase(parsed: any, fallbackSlug: string): CaseDoc {
  const slug = parsed?.slug ? toSafeSlug(String(parsed.slug)) : toSafeSlug(fallbackSlug);
  const title = String(parsed?.title || "").trim();
  // Normalize categories: accept either `category` (string) or `categories` (array)
  const catSingle = parsed?.category ? String(parsed.category).trim().toLowerCase() : undefined;
  const catArray: string[] | undefined = Array.isArray(parsed?.categories)
    ? (parsed.categories as unknown[])
        .map((s) => String(s).trim().toLowerCase())
        .filter(Boolean) as string[]
    : undefined;
  const categories: string[] | undefined = (catArray && catArray.length > 0)
    ? Array.from(new Set<string>(catArray))
    : (catSingle ? [catSingle] : undefined);
  return {
    slug,
    title,
    year: parsed?.year,
    tags: Array.isArray(parsed?.tags) ? parsed.tags.map(String) : undefined,
    // Keep both shapes available for compatibility across the app
    category: categories?.[0],
    categories,
    cover: parsed?.cover ? String(parsed.cover) : undefined,
    blueprint: parsed?.blueprint ? String(parsed.blueprint) : undefined,
    framework: parsed?.framework ? String(parsed.framework) : undefined,
    finish: parsed?.finish ? String(parsed.finish) : undefined,
    images: Array.isArray(parsed?.images) ? parsed.images.map(String) : undefined,
    video: parsed?.video ? String(parsed.video) : undefined,
    channels: parsed?.channels
      ? {
          blog: !!parsed.channels.blog,
          behance: !!parsed.channels.behance,
          linkedin: !!parsed.channels.linkedin,
          facebook: !!parsed.channels.facebook,
          instagram: !!parsed.channels.instagram,
        }
      : undefined,
    socialCaption: parsed?.socialCaption ? String(parsed.socialCaption) : undefined,
  };
}

async function readFileIfExists(fp: string): Promise<string | null> {
  try { return await fs.readFile(fp, "utf8"); } catch { return null; }
}

async function safeParseFromFile(filePathOrSlug: string): Promise<CaseDoc | null> {
  const jsonPath = filePathOrSlug.endsWith(".json")
    ? filePathOrSlug
    : path.join(CASE_DIR, `${filePathOrSlug}.json`);

  const raw = await readFileIfExists(jsonPath);
  const fallbackSlug = path.basename(jsonPath, ".json");
  if (!raw || !raw.trim()) { console.error("[cases] Empty or missing JSON:", jsonPath); return null; }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeCase(parsed, fallbackSlug);
    if (!normalized.slug || !normalized.title) {
      console.error("[cases] Missing slug/title:", jsonPath);
      return null;
    }
    return normalized;
  } catch (e) {
    console.error("[cases] JSON parse failed:", jsonPath, e);
    return null;
  }
}

export async function getCaseBySlug(slug: string): Promise<CaseDoc> {
  const safe = SAFE_SLUG.test(slug) ? slug : toSafeSlug(slug);
  const doc = await safeParseFromFile(safe);
  if (!doc) throw new Error(`Invalid or missing case JSON: ${encodeURIComponent(slug)}`);
  return doc;
}

export async function getCaseSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CASE_DIR);
    const jsons = files.filter((f) => f.endsWith(".json"));
    const results: string[] = [];
    for (const f of jsons) {
      const full = path.join(CASE_DIR, f);
      const raw = await readFileIfExists(full);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const slug = parsed?.slug
          ? toSafeSlug(String(parsed.slug))
          : toSafeSlug(path.basename(f, ".json"));
        if (SAFE_SLUG.test(slug)) results.push(slug);
      } catch { /* skip bad JSON */ }
    }
    return Array.from(new Set(results));
  } catch {
    return [];
  }
}

/* ---- required by your pages ---- */
export async function getAllCases(): Promise<CaseDoc[]> {
  const slugs = await getCaseSlugs();
  const items = await Promise.all(slugs.map((s) => safeParseFromFile(s)));
  const cases = items.filter(Boolean) as CaseDoc[];
  return cases.sort((a, b) => {
    const ay = typeof a.year === "number" ? a.year : parseInt(String(a.year || "0"), 10) || 0;
    const by = typeof b.year === "number" ? b.year : parseInt(String(b.year || "0"), 10) || 0;
    if (by !== ay) return by - ay;
    return a.title.localeCompare(b.title);
  });
}

export { getCaseSlugs as getAllSlugs }; // legacy alias


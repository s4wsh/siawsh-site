cat > src/lib/cases.ts <<'TS'
import { promises as fs } from "node:fs";
import path from "node:path";

export type CaseDoc = {
  slug: string;
  title: string;
  year?: number | string;
  tags?: string[];
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
  return {
    slug,
    title,
    year: parsed?.year,
    tags: Array.isArray(parsed?.tags) ? parsed.tags.map(String) : undefined,
    cover: parsed?.cover ? String(parsed.cover) : undefined,
    blueprint: parsed?.blueprint ? String(parsed.blueprint) : undefined,
    framework: parsed?.framework ? String(parsed.framework) : undefined,
    finish: parsed?.finish ? String(parsed.finish) : undefined,
    images: Array.isArray(parsed?.images) ? parsed.images.map(String) : undefined,
    video: parsed?.video ? String(parsed.video) : undefined,
    channels: parsed?.channels ? {
      blog: !!parsed.channels.blog,
      behance: !!parsed.channels.behance,
      linkedin: !!parsed.channels.linkedin,
      facebook: !!parsed.channels.facebook,
      instagram: !!parsed.channels.instagram,
    } : undefined,
    socialCaption: parsed?.socialCaption ? String(parsed.socialCaption) : undefined,
  };
}

async function readFileIfExists(fp: string): Promise<string | null> {
  try { return await fs.readFile(fp, "utf8"); } catch { return null; }
}

async function safeParseFromFile(filePathOrSlug: string): Promise<CaseDoc | null> {
  // Accept either a full path to .json or a slug name
  let jsonPath = filePathOrSlug.endsWith(".json")
    ? filePathOrSlug
    : path.join(CASE_DIR, `${filePathOrSlug}.json`);

  const raw = await readFileIfExists(jsonPath);
  const fallbackSlug = path.basename(jsonPath, ".json");

  if (!raw || !raw.trim()) {
    console.error("[cases] Empty or missing JSON");
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeCase(parsed, fallbackSlug);
    if (!normalized.slug || !normalized.title) {
      console.error("[cases] Missing slug/title");
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
    const jsons = files.filter(f => f.endsWith(".json"));
    // Prefer slug from inside file; fall back to filename
    const results: string[] = [];
    for (const f of jsons) {
      const full = path.join(CASE_DIR, f);
      const raw = await readFileIfExists(full);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const slug = parsed?.slug ? toSafeSlug(String(parsed.slug)) : toSafeSlug(path.basename(f, ".json"));
        if (SAFE_SLUG.test(slug)) results.push(slug);
      } catch {
        // skip bad JSON
      }
    }
    return Array.from(new Set(results));
  } catch {
    // directory missing → empty list
    return [];
  }
}
TS

// src/app/api/admin/case/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getStorage } from "@/server/storage/adapter";

// Ensure filenames and stored slugs are safe and consistent
function toSafeSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

const CASES_DIR = path.join(process.cwd(), "content", "case-studies"); // used only for local history backups
const HISTORY_DIR = path.join(CASES_DIR, ".history");

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

// normalize helpers
const toStr = (v: unknown) => (v == null ? "" : String(v));
const toNum = (v: unknown) => {
  const n = Number.parseInt(toStr(v), 10);
  return Number.isFinite(n) ? n : 0;
};
const toStrArr = (v: unknown) =>
  Array.isArray(v)
    ? v.map(String).filter(Boolean)
    : toStr(v)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

export async function POST(req: Request) {
  try {
    // auth
    const token = req.headers.get("x-admin-token") || "";
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return bad("Unauthorized", 401);
    }

    let body: any = null;

    // try JSON first
    const ctype = (req.headers.get("content-type") || "").toLowerCase();
    if (ctype.includes("application/json")) {
      try {
        body = await req.json();
      } catch {
        return bad("Invalid JSON body");
      }
    } else if (ctype.includes("multipart/form-data") || ctype.includes("application/x-www-form-urlencoded")) {
      // accept form posts too
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
    } else {
      // graceful message if someone hits the endpoint in the browser
      return bad("Send JSON or form-data to this endpoint.");
    }

    // normalize
    const prevSlug = toStr((body as any).prevSlug).trim();
    const slug = toStr(body.slug).trim();
    const safeSlug = toSafeSlug(slug);
    const title = toStr(body.title).trim();
    const year = toNum(body.year);
    const tags = toStrArr(body.tags);
    // categories: accept string or array; keep legacy `category` as primary
    const allowed = ["interior","graphic","motion"] as const;
    const fromSingle = toStr((body as any).category).toLowerCase();
    let categories: string[] = Array.isArray((body as any).categories)
      ? (body as any).categories.map((x: any) => toStr(x).toLowerCase())
      : [];
    if (!categories.length && fromSingle) categories = [fromSingle];
    categories = Array.from(new Set(categories.filter(c => (allowed as readonly string[]).includes(c))));
    const category = categories[0] || undefined;

    if (!slug || !title) return bad("Missing slug/title");

    const data: any = {
      slug: safeSlug,
      title,
      category,            // legacy primary
      categories,          // preferred multi
      client: toStr(body.client) || undefined,
      year,
      tags,
      cover: toStr(body.cover) || undefined,
      blueprint: toStr(body.blueprint) || undefined,
      framework: toStr(body.framework) || undefined,
      finish: toStr(body.finish) || undefined,
      images: Array.isArray(body.images)
        ? body.images.map(String)
        : toStr(body.images)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
      video: toStr(body.video) || undefined,
      imagesAlt: typeof (body.imagesAlt) === 'object' && body.imagesAlt ? body.imagesAlt : undefined,
      seo: typeof (body.seo) === 'object' && body.seo ? body.seo : undefined,
    };

    // optional channels + social caption
    const channels = {
      blog: String(body.publishBlog || body.blog || "").toLowerCase() === "true" || body.publishBlog === true,
      behance: String(body.publishBehance || body.behance || "").toLowerCase() === "true" || body.publishBehance === true,
      linkedin: String(body.publishLinkedin || body.linkedin || "").toLowerCase() === "true" || body.publishLinkedin === true,
      facebook: String(body.publishFacebook || body.facebook || "").toLowerCase() === "true" || body.publishFacebook === true,
      instagram: String(body.publishInstagram || body.instagram || "").toLowerCase() === "true" || body.publishInstagram === true,
    };
    if (Object.values(channels).some(Boolean)) data.channels = channels;
    const socialCaption = toStr(body.socialCaption);
    if (socialCaption) data.socialCaption = socialCaption;

    const storage = getStorage();

    // backup previous version if exists
    try {
      const prevSafe = prevSlug ? toSafeSlug(prevSlug) : "";
      const prev = await storage.getCase(prevSafe || safeSlug);
      if (prev) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const dir = path.join(HISTORY_DIR, prevSafe || safeSlug);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, `${ts}.json`), JSON.stringify(prev, null, 2), "utf8");
      }
    } catch {}

    // If renaming from prevSlug -> slug OR previous filename normalization differs
    const prevSafe = prevSlug ? toSafeSlug(prevSlug) : "";
    const isRename = !!prevSlug && (prevSlug !== slug || prevSafe !== safeSlug);
    if (isRename) {
      // Write new JSON, delete previous, and try to move assets folder via adapter
      await storage.putCase(safeSlug, data);
      await storage.deleteCase(prevSafe);
      if (typeof (storage as any).moveAssetsFolder === 'function') {
        try { await (storage as any).moveAssetsFolder(prevSafe, safeSlug); } catch {}
      }
    } else {
      await storage.putCase(safeSlug, data);
    }

    // scaffold public folder for assets (non-fatal if fails)
    // With local adapter, ensure folder exists (adapter will also create on upload)
    try { await fs.mkdir(path.join(process.cwd(), "public", "cases", safeSlug), { recursive: true }); } catch {}

    // optional n8n ping
    const hook = process.env.N8N_WEBHOOK_URL;
    if (hook) {
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "case.createdOrUpdated", case: data }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, slug: safeSlug });
  } catch (err) {
    console.error("admin/case error:", err);
    return bad("Server error", 500);
  }
}

// GET /api/admin/case?slug=...       -> returns specific JSON
// GET /api/admin/case                -> returns list of {slug,title,year}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return bad("Unauthorized", 401);
  }
  const slug = (searchParams.get("slug") || "").trim();
  try {
    const storage = getStorage();
    if (slug) {
      const data = await storage.getCase(slug);
      if (!data) return bad("Not found", 404);
      return NextResponse.json(data);
    }
    const slugs = await storage.listCaseSlugs();
    const items = await Promise.all(
      slugs.map(async (s) => {
        const raw = await storage.getCase(s);
        if (!raw) return null;
        return {
          slug: raw.slug || s,
          title: raw.title || "",
          year: raw.year || 0,
          category: raw.category,
          categories: Array.isArray(raw.categories) ? raw.categories : (raw.category ? [raw.category] : []),
          blog: !!(raw?.channels?.blog),
        };
      })
    );
    return NextResponse.json((items.filter(Boolean) as any[]).sort((a, b) => (b.year || 0) - (a.year || 0)));
  } catch (err) {
    console.error("admin/case GET error:", err);
    return bad("Server error", 500);
  }
}

// DELETE /api/admin/case?slug=... -> deletes the JSON file (assets are left intact)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return bad("Unauthorized", 401);
  }
  const slug = (searchParams.get("slug") || "").trim();
  if (!slug) return bad("Missing slug");
  try {
    const storage = getStorage();
    await storage.deleteCase(slug);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return bad("Server error", 500);
  }
}

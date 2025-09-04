// src/app/api/admin/case/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const CASES_DIR = path.join(process.cwd(), "content", "case-studies");
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
    const title = toStr(body.title).trim();
    const year = toNum(body.year);
    const tags = toStrArr(body.tags);

    if (!slug || !title) return bad("Missing slug/title");

    const data: any = {
      slug,
      title,
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

    await fs.mkdir(CASES_DIR, { recursive: true });
    const filePath = path.join(CASES_DIR, `${slug}.json`);
    const prevFilePath = prevSlug && prevSlug !== slug
      ? path.join(CASES_DIR, `${prevSlug}.json`)
      : filePath;

    // backup previous version if exists
    try {
      const prevRaw = await fs.readFile(prevFilePath, "utf8").catch(() => "");
      if (prevRaw) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const dir = path.join(HISTORY_DIR, prevSlug && prevSlug !== slug ? prevSlug : slug);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, `${ts}.json`), prevRaw, "utf8");
      }
    } catch {}

    // If renaming from prevSlug -> slug, handle JSON + assets directory move
    if (prevSlug && prevSlug !== slug) {
      const prevFile = path.join(CASES_DIR, `${prevSlug}.json`);
      try {
        // Write new first, then clean up old JSON
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
        // Remove old JSON if exists
        await fs.unlink(prevFile).catch(() => {});
        // Try to move public assets folder if present
        const prevPub = path.join(process.cwd(), "public", "cases", prevSlug);
        const newPub = path.join(process.cwd(), "public", "cases", slug);
        try {
          await fs.mkdir(path.join(process.cwd(), "public", "cases"), { recursive: true });
          // Only rename if destination doesn't exist
          await fs.rename(prevPub, newPub).catch(() => {});
        } catch {}
      } catch (e) {
        // If anything failed, attempt to still write the new file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
      }
    } else {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    }

    // scaffold public folder for assets (non-fatal if fails)
    try {
      const pub = path.join(process.cwd(), "public", "cases", slug);
      await fs.mkdir(pub, { recursive: true });
    } catch {}

    // optional n8n ping
    const hook = process.env.N8N_WEBHOOK_URL;
    if (hook) {
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "case.createdOrUpdated", case: data }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, slug });
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
    const base = path.join(process.cwd(), "content", "case-studies");
    if (slug) {
      const file = path.join(base, `${slug}.json`);
      const raw = await fs.readFile(file, "utf8");
      return NextResponse.json(JSON.parse(raw));
    }
    const files = await fs.readdir(base).catch(() => []);
    const items = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const raw = JSON.parse(await fs.readFile(path.join(base, f), "utf8"));
            return { slug: raw.slug || f.replace(/\.json$/, ""), title: raw.title || "", year: raw.year || 0 };
          } catch { return null; }
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
    const file = path.join(CASES_DIR, `${slug}.json`);
    await fs.unlink(file);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e && e.code === "ENOENT") return bad("Not found", 404);
    return bad("Server error", 500);
  }
}

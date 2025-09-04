// src/app/api/admin/case/summary/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

async function ensureAuth(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return false;
  return true;
}

const CASES_DIR = path.join(process.cwd(), "content", "case-studies");
const PUB_CASES = path.join(process.cwd(), "public", "cases");

export async function GET(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  try {
    const files = await fs.readdir(CASES_DIR).catch(() => []);
    const items = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const slug = f.replace(/\.json$/i, "");
          try {
            const raw = JSON.parse(await fs.readFile(path.join(CASES_DIR, f), "utf8"));
            const stat = await fs.stat(path.join(CASES_DIR, f)).catch(() => null);
            const adir = path.join(PUB_CASES, slug);
            const names = await fs.readdir(adir).catch(() => []);
            let images = 0, videos = 0, other = 0;
            for (const n of names) {
              if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(n)) images++;
              else if (/\.(mp4|mov|webm|ogg|m4v)$/i.test(n)) videos++;
              else other++;
            }
            return {
              slug,
              title: raw.title || "",
              year: raw.year || 0,
              hasCover: !!raw.cover,
              tagCount: Array.isArray(raw.tags) ? raw.tags.length : 0,
              imageCount: images,
              videoCount: videos,
              otherCount: other,
              mtimeMs: stat?.mtimeMs ?? 0,
            };
          } catch {
            return null;
          }
        })
    );

    const list = (items.filter(Boolean) as any[]).sort((a, b) => (b.mtimeMs || 0) - (a.mtimeMs || 0));
    const totals = list.reduce(
      (acc, it) => {
        acc.projects++;
        acc.images += it.imageCount;
        acc.videos += it.videoCount;
        if (!it.hasCover) acc.missingCover++;
        if ((it.imageCount || 0) === 0) acc.noImages++;
        return acc;
      },
      { projects: 0, images: 0, videos: 0, missingCover: 0, noImages: 0 }
    );

    return NextResponse.json({ ok: true, totals, items: list });
  } catch (e) {
    return bad("Server error", 500);
  }
}


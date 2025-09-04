// src/app/api/admin/backup/route.ts
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
const HISTORY_DIR = path.join(CASES_DIR, ".history");
const PUB_CASES = path.join(process.cwd(), "public", "cases");

export async function GET(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  try {
    const files = await fs.readdir(CASES_DIR).catch(() => []);
    const cases: Array<{ slug: string; content: any }> = [];
    for (const f of files.filter((x) => x.endsWith(".json"))) {
      const slug = f.replace(/\.json$/i, "");
      const raw = await fs.readFile(path.join(CASES_DIR, f), "utf8").catch(() => "");
      if (raw) {
        try { cases.push({ slug, content: JSON.parse(raw) }); } catch {}
      }
    }

    // history
    const history: Record<string, Array<{ name: string; content: any }>> = {};
    const histSlugs = await fs.readdir(HISTORY_DIR).catch(() => []);
    for (const s of histSlugs) {
      const dir = path.join(HISTORY_DIR, s);
      const items = await fs.readdir(dir).catch(() => []);
      const list: Array<{ name: string; content: any }> = [];
      for (const name of items.filter((x) => x.endsWith(".json"))) {
        const raw = await fs.readFile(path.join(dir, name), "utf8").catch(() => "");
        if (raw) { try { list.push({ name, content: JSON.parse(raw) }); } catch {} }
      }
      if (list.length) history[s] = list.sort((a, b) => a.name < b.name ? 1 : -1);
    }

    // assets index (no file data, just metadata)
    const assets: Record<string, Array<{ name: string; size: number; type: string }>> = {};
    const assetSlugs = await fs.readdir(PUB_CASES).catch(() => []);
    for (const s of assetSlugs) {
      const dir = path.join(PUB_CASES, s);
      const names = await fs.readdir(dir).catch(() => []);
      const list: Array<{ name: string; size: number; type: string }> = [];
      for (const n of names) {
        try {
          const stat = await fs.stat(path.join(dir, n));
          if (!stat.isFile()) continue;
          const type = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(n)
            ? "image"
            : /\.(mp4|mov|webm|ogg|m4v)$/i.test(n)
            ? "video"
            : "other";
          list.push({ name: n, size: stat.size, type });
        } catch {}
      }
      if (list.length) assets[s] = list;
    }

    return NextResponse.json({ ok: true, cases, history, assets });
  } catch (e) {
    return bad("Server error", 500);
  }
}

// Import backup (writes case JSONs back). Useful for restore/migration.
export async function POST(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  let body: any = null;
  try { body = await req.json(); } catch { return bad("Invalid JSON body"); }
  const list: Array<{ slug: string; content: any }> = Array.isArray(body?.cases) ? body.cases : [];
  if (!list.length) return bad("Missing cases to import");

  await fs.mkdir(CASES_DIR, { recursive: true });
  await fs.mkdir(HISTORY_DIR, { recursive: true });

  let count = 0;
  for (const item of list) {
    const slug = String(item?.slug || "").trim();
    if (!slug) continue;
    const data = item?.content ?? null;
    if (!data || typeof data !== "object") continue;
    try {
      // backup current before overwrite
      const dst = path.join(CASES_DIR, `${slug}.json`);
      const current = await fs.readFile(dst, "utf8").catch(() => "");
      if (current) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        await fs.mkdir(path.join(HISTORY_DIR, slug), { recursive: true });
        await fs.writeFile(path.join(HISTORY_DIR, slug, `${ts}-import.json`), current, "utf8");
      }
      await fs.writeFile(dst, JSON.stringify(data, null, 2), "utf8");
      count++;
    } catch {}
  }
  return NextResponse.json({ ok: true, imported: count });
}


// src/app/api/admin/backup/route.ts
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getStorage } from "@/server/storage/adapter";

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
    const storage = getStorage();
    const slugs = await storage.listCaseSlugs();
    const cases: Array<{ slug: string; content: any }> = [];
    for (const slug of slugs) {
      const obj = await storage.getCase(slug);
      if (obj) cases.push({ slug, content: obj });
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
    for (const s of slugs) {
      try {
        const items = await storage.listAssets(s);
        if (items.length) assets[s] = items.map(it => ({ name: it.name, size: it.size, type: it.type || 'other' }));
      } catch {}
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
      const storage = getStorage();
      const prev = await storage.getCase(slug);
      if (prev) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        await fs.mkdir(path.join(HISTORY_DIR, slug), { recursive: true });
        await fs.writeFile(path.join(HISTORY_DIR, slug, `${ts}-import.json`), JSON.stringify(prev, null, 2), "utf8");
      }
      await storage.putCase(slug, data);
      count++;
    } catch {}
  }
  return NextResponse.json({ ok: true, imported: count });
}

// src/app/api/admin/case/history/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

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

export async function GET(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim();
  if (!slug) return bad("Missing slug");
  try {
    const dir = path.join(HISTORY_DIR, slug);
    const names = await fs.readdir(dir).catch(() => []);
    const items = await Promise.all(
      names
        .filter((n) => n.endsWith(".json"))
        .map(async (name) => {
          try {
            const stat = await fs.stat(path.join(dir, name));
            return { name, size: stat.size, mtimeMs: stat.mtimeMs };
          } catch { return null; }
        })
    );
    return NextResponse.json({ ok: true, versions: (items.filter(Boolean) as any[]).sort((a, b) => (b.mtimeMs || 0) - (a.mtimeMs || 0)) });
  } catch {
    return bad("Server error", 500);
  }
}

export async function POST(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  try {
    const body = await req.json().catch(() => null);
    if (!body) return bad("Invalid JSON body");
    const slug = String(body.slug || "").trim();
    const name = String(body.name || "").trim();
    if (!slug || !name) return bad("Missing slug or name");

    const src = path.join(HISTORY_DIR, slug, name);
    const dst = path.join(CASES_DIR, `${slug}.json`);

    // backup current before restore
    try {
      const cur = await fs.readFile(dst, "utf8").catch(() => "");
      if (cur) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const dir = path.join(HISTORY_DIR, slug);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, `${ts}.json`), cur, "utf8");
      }
    } catch {}

    const raw = await fs.readFile(src, "utf8");
    await fs.writeFile(dst, raw, "utf8");
    return NextResponse.json({ ok: true });
  } catch {
    return bad("Server error", 500);
  }
}

export async function DELETE(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim();
  const name = (searchParams.get("name") || "").trim();
  if (!slug || !name) return bad("Missing slug or name");
  try {
    await fs.unlink(path.join(HISTORY_DIR, slug, name));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e && e.code === "ENOENT") return bad("Not found", 404);
    return bad("Server error", 500);
  }
}


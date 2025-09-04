// src/app/api/admin/backup/snapshot/route.ts
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

export async function POST(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  try {
    const storage = getStorage();
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const snapDir = path.join(HISTORY_DIR, "_snapshots", ts);
    await fs.mkdir(snapDir, { recursive: true });
    const slugs = await storage.listCaseSlugs();
    let count = 0;
    for (const slug of slugs) {
      const obj = await storage.getCase(slug);
      if (!obj) continue;
      await fs.writeFile(path.join(snapDir, `${slug}.json`), JSON.stringify(obj, null, 2), "utf8");
      count++;
    }
    return NextResponse.json({ ok: true, snapshot: ts, files: count });
  } catch {
    return bad("Server error", 500);
  }
}

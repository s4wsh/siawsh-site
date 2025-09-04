// src/app/api/admin/case/assets/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

function isImage(name: string) {
  return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
}
function isVideo(name: string) {
  return /\.(mp4|mov|webm|ogg|m4v)$/i.test(name);
}

async function ensureAuth(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return false;
  return true;
}

const PUB_CASES = path.join(process.cwd(), "public", "cases");

export async function GET(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim();
  if (!slug) return bad("Missing slug");
  try {
    const dir = path.join(PUB_CASES, slug);
    const names = await fs.readdir(dir).catch(() => []);
    const items = await Promise.all(
      names.map(async (name) => {
        try {
          const stat = await fs.stat(path.join(dir, name));
          if (!stat.isFile()) return null;
          const t = isImage(name) ? "image" : isVideo(name) ? "video" : "other";
          return {
            name,
            url: `/cases/${slug}/${name}`,
            size: stat.size,
            mtime: stat.mtimeMs,
            type: t,
          };
        } catch { return null; }
      })
    );
    return NextResponse.json({ ok: true, assets: items.filter(Boolean) });
  } catch (e) {
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
    const file = path.join(PUB_CASES, slug, name);
    await fs.unlink(file);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e && e.code === "ENOENT") return bad("Not found", 404);
    return bad("Server error", 500);
  }
}

export async function POST(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  const ctype = (req.headers.get("content-type") || "").toLowerCase();
  if (!ctype.includes("multipart/form-data")) return bad("Send multipart/form-data with file and slug");

  const fd = await req.formData();
  const slug = String(fd.get("slug") || "").trim();
  if (!slug) return bad("Missing slug");
  const file = fd.get("file");
  if (!(file instanceof Blob)) return bad("Missing file");
  const nameOverride = String(fd.get("name") || "").trim();
  const origName = (file as any).name || "upload.bin";
  const name = nameOverride || origName;

  try {
    const dir = path.join(PUB_CASES, slug);
    await fs.mkdir(dir, { recursive: true });
    const arrayBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    await fs.writeFile(path.join(dir, name), buf);
    return NextResponse.json({ ok: true, name, url: `/cases/${slug}/${name}` });
  } catch (e) {
    return bad("Server error", 500);
  }
}


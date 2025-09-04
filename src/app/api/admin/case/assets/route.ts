// src/app/api/admin/case/assets/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { getStorage } from "@/server/storage/adapter";

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

const PUB_CASES = path.join(process.cwd(), "public", "cases"); // local adapter only

export async function GET(req: Request) {
  if (!(await ensureAuth(req))) return bad("Unauthorized", 401);
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim();
  if (!slug) return bad("Missing slug");
  try {
    const storage = getStorage();
    const items = await storage.listAssets(slug);
    return NextResponse.json({ ok: true, assets: items });
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
    const storage = getStorage();
    await storage.deleteAsset(slug, name);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
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
    const storage = getStorage();
    const arrayBuf = await (file as Blob).arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    const out = await storage.putAsset(slug, name, buf, (file as any).type || undefined);
    return NextResponse.json({ ok: true, name, url: out.url });
  } catch (e) {
    return bad("Server error", 500);
  }
}

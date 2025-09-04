// src/app/api/admin/selftest/route.ts
import { NextResponse } from "next/server";
import { getStorage } from "@/server/storage/adapter";

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return bad("Unauthorized", 401);
  const started = Date.now();
  const provider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  const res: Record<string, any> = { ok: true, provider };
  try {
    const store = getStorage();
    // list slugs
    const slugs = await store.listCaseSlugs().catch((e: any) => { res.listError = String(e?.message || e); return []; });
    res.slugs = slugs;

    // write/delete a tiny case
    const tmpSlug = `zz-selftest-${Math.random().toString(36).slice(2,8)}`;
    const sample = { slug: tmpSlug, title: "Selftest", year: 2000, tags: [] };
    try {
      await store.putCase(tmpSlug, sample);
      const got = await store.getCase(tmpSlug);
      res.caseWrite = !!got && got.slug === tmpSlug;
    } catch (e: any) {
      res.caseWrite = false; res.caseError = String(e?.message || e);
    } finally {
      try { await store.deleteCase(tmpSlug); } catch {}
    }

    // write/delete a tiny asset
    try {
      const buf = Buffer.from("hello", "utf8");
      const put = await store.putAsset(tmpSlug, "test.txt", buf, "text/plain");
      res.assetUrl = put.url;
      await store.deleteAsset(tmpSlug, "test.txt");
      res.assetWrite = true;
    } catch (e: any) {
      res.assetWrite = false; res.assetError = String(e?.message || e);
    }

    res.ms = Date.now() - started;
    return NextResponse.json(res);
  } catch (e: any) {
    return bad(`Selftest failed: ${String(e?.message || e)}`, 500);
  }
}


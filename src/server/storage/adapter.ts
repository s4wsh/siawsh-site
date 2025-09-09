import fs from "node:fs/promises";
import path from "node:path";

// Minimal S3 client import is dynamic to avoid loading in local-only flows.
// We import only when STORAGE_PROVIDER === 's3'.

export type AssetItem = { name: string; size: number; mtime?: number; type?: string; url?: string };

export interface StorageAdapter {
  // JSON cases
  getCase(slug: string): Promise<any | null>;
  putCase(slug: string, data: any): Promise<void>;
  deleteCase(slug: string): Promise<void>;
  listCaseSlugs(): Promise<string[]>;

  // Assets for a case
  listAssets(slug: string): Promise<AssetItem[]>;
  putAsset(slug: string, name: string, buf: Buffer, contentType?: string): Promise<{ url: string }>;
  deleteAsset(slug: string, name: string): Promise<void>;
  moveAssetsFolder?(fromSlug: string, toSlug: string): Promise<void>;

  // Helper for building public URL for an asset
  getAssetUrl(slug: string, name: string): string;
}

function isImage(name: string) { return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name); }
function isVideo(name: string) { return /\.(mp4|mov|webm|ogg|m4v)$/i.test(name); }

class LocalAdapter implements StorageAdapter {
  private CASES_DIR = path.join(process.cwd(), "content", "case-studies");
  private PUB_CASES = path.join(process.cwd(), "public", "cases");

  private toSafeSlug(s: string) {
    return (s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
  }

  private async resolveAssetsDir(slug: string): Promise<string> {
    const safe = this.toSafeSlug(slug);
    const primary = path.join(this.PUB_CASES, safe);
    try {
      const st = await fs.stat(primary).catch(() => null);
      if (st && st.isDirectory()) return primary;
    } catch {}
    // Fallback: find a folder whose normalized name matches, then move it to the safe path
    try {
      const parent = this.PUB_CASES;
      const names = await fs.readdir(parent).catch(() => []);
      for (const name of names) {
        const dir = path.join(parent, name);
        const st = await fs.stat(dir).catch(() => null);
        if (!st || !st.isDirectory()) continue;
        const norm = this.toSafeSlug(name);
        if (norm === safe && name !== safe) {
          // Move to normalized path for future stability
          await fs.mkdir(path.dirname(primary), { recursive: true }).catch(() => {});
          await fs.rename(dir, primary).catch(() => {});
          return primary;
        }
      }
    } catch {}
    return primary; // default path (may not exist yet)
  }

  async getCase(slug: string): Promise<any | null> {
    try { const raw = await fs.readFile(path.join(this.CASES_DIR, `${slug}.json`), "utf8"); return JSON.parse(raw); } catch { return null; }
  }
  async putCase(slug: string, data: any): Promise<void> {
    await fs.mkdir(this.CASES_DIR, { recursive: true });
    await fs.writeFile(path.join(this.CASES_DIR, `${slug}.json`), JSON.stringify(data, null, 2), "utf8");
  }
  async deleteCase(slug: string): Promise<void> {
    await fs.unlink(path.join(this.CASES_DIR, `${slug}.json`)).catch(() => {});
  }
  async listCaseSlugs(): Promise<string[]> {
    const files = await fs.readdir(this.CASES_DIR).catch(() => []);
    return files.filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/i, ''));
  }
  async listAssets(slug: string): Promise<AssetItem[]> {
    const dir = await this.resolveAssetsDir(slug);
    const names = await fs.readdir(dir).catch(() => []);
    const out: AssetItem[] = [];
    for (const name of names) {
      try {
        const st = await fs.stat(path.join(dir, name));
        if (!st.isFile()) continue;
        out.push({ name, size: st.size, mtime: st.mtimeMs, type: isImage(name) ? 'image' : isVideo(name) ? 'video' : 'other', url: this.getAssetUrl(slug, name) });
      } catch {}
    }
    return out;
  }
  async putAsset(slug: string, name: string, buf: Buffer): Promise<{ url: string }> {
    const dir = await this.resolveAssetsDir(slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), buf);
    const safe = this.toSafeSlug(slug);
    return { url: this.getAssetUrl(safe, name) };
  }
  async deleteAsset(slug: string, name: string): Promise<void> {
    const dir = await this.resolveAssetsDir(slug);
    await fs.unlink(path.join(dir, name)).catch(() => {});
  }
  async moveAssetsFolder(fromSlug: string, toSlug: string): Promise<void> {
    const from = await this.resolveAssetsDir(fromSlug);
    const safeTo = this.toSafeSlug(toSlug);
    const to = path.join(this.PUB_CASES, safeTo);
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.rename(from, to).catch(() => {});
  }
  getAssetUrl(slug: string, name: string): string { return `/cases/${this.toSafeSlug(slug)}/${name}`; }
}

class S3Adapter implements StorageAdapter {
  private bucket: string;
  private region: string;
  private prefixJson: string;
  private prefixAssets: string;
  private publicBase?: string; // e.g. https://cdn.example.com/cases-assets
  private client: any;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "";
    this.region = process.env.S3_REGION || "auto";
    this.prefixJson = process.env.S3_JSON_PREFIX || "cases-json";
    this.prefixAssets = process.env.S3_ASSETS_PREFIX || "cases-assets";
    this.publicBase = process.env.ASSETS_BASE_URL || process.env.NEXT_PUBLIC_ASSETS_BASE_URL || undefined;
    const { S3Client } = require("@aws-sdk/client-s3");
    this.client = new S3Client({
      region: this.region,
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: String(process.env.S3_FORCE_PATH_STYLE || "true").toLowerCase() !== "false",
      credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      } : undefined,
    });
  }

  private keyJson(slug: string) { return `${this.prefixJson}/${slug}.json`; }
  private keyAsset(slug: string, name: string) { return `${this.prefixAssets}/${slug}/${name}`; }

  async getCase(slug: string): Promise<any | null> {
    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: this.keyJson(slug) }));
      const buf = await res.Body.transformToString();
      return JSON.parse(buf);
    } catch { return null; }
  }
  async putCase(slug: string, data: any): Promise<void> {
    const { PutObjectCommand } = require("@aws-sdk/client-s3");
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.keyJson(slug), Body: Buffer.from(JSON.stringify(data, null, 2)), ContentType: "application/json" }));
  }
  async deleteCase(slug: string): Promise<void> {
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: this.keyJson(slug) })).catch(() => {});
  }
  async listCaseSlugs(): Promise<string[]> {
    const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
    const prefix = `${this.prefixJson}/`;
    const res = await this.client.send(new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix }));
    const items = (res.Contents || []).map((o: any) => o.Key as string).filter(Boolean);
    return items.filter((k: string) => k.endsWith(".json")).map((k: string) => k.slice(prefix.length).replace(/\.json$/i, ""));
  }
  async listAssets(slug: string): Promise<AssetItem[]> {
    const { ListObjectsV2Command, HeadObjectCommand } = require("@aws-sdk/client-s3");
    const prefix = `${this.prefixAssets}/${slug}/`;
    const res = await this.client.send(new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix }));
    const out: AssetItem[] = [];
    for (const obj of res.Contents || []) {
      const key = obj.Key as string;
      if (!key || key.endsWith("/")) continue;
      const name = key.slice(prefix.length);
      let size = obj.Size || 0;
      // Some providers may not return Size/LastModified consistently; fallback to HEAD.
      if (!size) {
        try { const h = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key })); size = h.ContentLength || 0; } catch {}
      }
      const type = isImage(name) ? 'image' : isVideo(name) ? 'video' : 'other';
      out.push({ name, size, type, url: this.getAssetUrl(slug, name) });
    }
    return out;
  }
  async putAsset(slug: string, name: string, buf: Buffer, contentType?: string): Promise<{ url: string }> {
    const { PutObjectCommand } = require("@aws-sdk/client-s3");
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.keyAsset(slug, name), Body: buf, ContentType: contentType }));
    return { url: this.getAssetUrl(slug, name) };
  }
  async deleteAsset(slug: string, name: string): Promise<void> {
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: this.keyAsset(slug, name) })).catch(() => {});
  }
  async moveAssetsFolder(fromSlug: string, toSlug: string): Promise<void> {
    const { ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
    const srcPrefix = `${this.prefixAssets}/${fromSlug}/`;
    const dstPrefix = `${this.prefixAssets}/${toSlug}/`;
    const res = await this.client.send(new ListObjectsV2Command({ Bucket: this.bucket, Prefix: srcPrefix }));
    for (const obj of res.Contents || []) {
      const key = obj.Key as string;
      if (!key || key.endsWith("/")) continue;
      const tail = key.slice(srcPrefix.length);
      await this.client.send(new CopyObjectCommand({ Bucket: this.bucket, CopySource: `/${this.bucket}/${key}`, Key: `${dstPrefix}${tail}` })).catch(() => {});
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key })).catch(() => {});
    }
  }
  getAssetUrl(slug: string, name: string): string {
    if (this.publicBase) return `${this.publicBase.replace(/\/$/, "")}/${slug}/${encodeURIComponent(name)}`;
    // Fallback to bucket URL (may require public bucket or signed URLs which we don't generate here)
    const base = process.env.S3_ENDPOINT?.replace(/\/$/, "") || `https://s3.${this.region}.amazonaws.com`;
    return `${base}/${this.bucket}/${this.prefixAssets}/${slug}/${encodeURIComponent(name)}`;
  }
}

let cached: StorageAdapter | null = null;
export function getStorage(): StorageAdapter {
  if (cached) return cached;
  const provider = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  if (provider === "s3") cached = new S3Adapter();
  else cached = new LocalAdapter();
  return cached;
}

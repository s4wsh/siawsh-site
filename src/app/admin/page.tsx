"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

type CaseListItem = { slug: string; title: string; year?: number };

export default function AdminPage() {
  const [form, setForm] = useState({
    token: "",
    slug: "",
    title: "",
    year: "",
    tags: "",
    client: "",
    cover: "",
    blueprint: "",
    framework: "",
    finish: "",
    images: "",
    video: "",
    publishBlog: false,
    publishBehance: false,
    publishLinkedin: false,
    publishFacebook: false,
    publishInstagram: false,
    socialCaption: "",
  });
  const [status, setStatus] = useState<string>("");
  const [auth, setAuth] = useState<"unknown"|"ok"|"bad">("unknown");
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loadedSlug, setLoadedSlug] = useState<string>("");
  const [assets, setAssets] = useState<Array<{name:string;url:string;size:number;mtime:number;type:string}>>([]);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"dashboard"|"editor"|"assets"|"versions"|"backup">("dashboard");
  const [summary, setSummary] = useState<{ totals?: any; items?: any[] }>({});
  const [versions, setVersions] = useState<Array<{name:string;size:number;mtimeMs:number}>>([]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fetchCases = (t: string) => {
    if (!t) { setCases([]); return; }
    fetch("/api/admin/case", { headers: { "x-admin-token": t } })
      .then(async (r) => {
        if (r.status === 401) { setAuth("bad"); return []; }
        if (r.ok) { setAuth("ok"); return r.json(); }
        return [];
      })
      .then((list) => setCases(Array.isArray(list) ? list : []))
      .catch(() => setCases([]));
  };

  const fetchSummary = (t: string) => {
    if (!t) { setSummary({}); return; }
    fetch("/api/admin/case/summary", { headers: { "x-admin-token": t } })
      .then(async (r) => {
        if (r.status === 401) { setAuth("bad"); return {}; }
        if (r.ok) { setAuth("ok"); return r.json(); }
        return {};
      })
      .then((d) => setSummary({ totals: (d as any)?.totals, items: (d as any)?.items }))
      .catch(() => setSummary({}));
  };

  // Fetch list when token changes
  useEffect(() => {
    const t = form.token.trim();
    // debounce fetch while typing token
    const id = setTimeout(() => {
      if (t.length >= 8) {
        fetchCases(t);
        fetchSummary(t);
      } else {
        setAuth("unknown");
      }
    }, 400);
    // persist token for convenience
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("admin-token", t);
      else localStorage.removeItem("admin-token");
    }
    return () => clearTimeout(id);
  }, [form.token]);

  // Load token from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("admin-token");
    if (saved) setForm((f) => ({ ...f, token: saved }));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving…");

    const payload: any = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      year: Number.parseInt(form.year || "0", 10) || 0,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      client: form.client.trim() || undefined,
      cover: form.cover.trim() || undefined,
      blueprint: form.blueprint.trim() || undefined,
      framework: form.framework.trim() || undefined,
      finish: form.finish.trim() || undefined,
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      video: form.video.trim() || undefined,
    };

    payload.publishBlog = !!form.publishBlog;
    payload.publishBehance = !!form.publishBehance;
    payload.publishLinkedin = !!form.publishLinkedin;
    payload.publishFacebook = !!form.publishFacebook;
    payload.publishInstagram = !!form.publishInstagram;
    payload.socialCaption = form.socialCaption.trim();

    const payloadAny: any = payload;
    if (loadedSlug && loadedSlug !== form.slug.trim()) payloadAny.prevSlug = loadedSlug;

    const res = await fetch("/api/admin/case", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": form.token.trim(),
      },
      body: JSON.stringify(payloadAny),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus("Saved ✔");
      setLoadedSlug(form.slug.trim());
      fetchCases(form.token.trim());
    } else {
      setStatus(`Error: ${data?.error || res.statusText}`);
    }
  }

  const loadCase = async (slug: string) => {
    setStatus("Loading…");
    try {
      const res = await fetch(`/api/admin/case?slug=${encodeURIComponent(slug)}`, {
        headers: { "x-admin-token": form.token.trim() },
      });
      const data = await res.json();
      setForm((f) => ({
        ...f,
        slug: data.slug || slug,
        title: data.title || "",
        year: String(data.year || ""),
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        client: data.client || "",
        cover: data.cover || "",
        blueprint: data.blueprint || "",
        framework: data.framework || "",
        finish: data.finish || "",
        images: Array.isArray(data.images) ? data.images.join("\n") : "",
        video: data.video || "",
        publishBlog: !!data?.channels?.blog,
        publishBehance: !!data?.channels?.behance,
        publishLinkedin: !!data?.channels?.linkedin,
        publishFacebook: !!data?.channels?.facebook,
        publishInstagram: !!data?.channels?.instagram,
        socialCaption: data.socialCaption || "",
      }));
      setLoadedSlug(slug);
      // load assets for slug
      fetchAssets(slug, form.token.trim());
      fetchVersions(slug);
      setStatus("");
      setTab("editor");
    } catch {
      setStatus("Failed to load");
    }
  };

  const fetchAssets = (slug: string, token: string) => {
    if (!slug || !token) { setAssets([]); return; }
    fetch(`/api/admin/case/assets?slug=${encodeURIComponent(slug)}`, { headers: { "x-admin-token": token.trim() } })
      .then(r => r.ok ? r.json() : { assets: [] })
      .then(d => setAssets(Array.isArray(d.assets) ? d.assets : []))
      .catch(() => setAssets([]));
  };

  const fetchVersions = (slug: string) => {
    if (!slug || !form.token) { setVersions([]); return; }
    fetch(`/api/admin/case/history?slug=${encodeURIComponent(slug)}`, { headers: { "x-admin-token": form.token.trim() } })
      .then(r => r.ok ? r.json() : { versions: [] })
      .then(d => setVersions(Array.isArray(d.versions) ? d.versions : []))
      .catch(()=> setVersions([]));
  };

  const restoreVersion = async (name: string) => {
    if (!loadedSlug) return;
    if (!confirm(`Restore version ${name}? Current will be backed up.`)) return;
    const res = await fetch(`/api/admin/case/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": form.token.trim() },
      body: JSON.stringify({ slug: loadedSlug, name }),
    });
    if (res.ok) {
      setStatus("Version restored ✔");
      loadCase(loadedSlug);
    } else {
      const d = await res.json().catch(()=>({}));
      setStatus(`Restore failed: ${d?.error || res.statusText}`);
    }
  };

  const deleteVersion = async (name: string) => {
    if (!loadedSlug) return;
    if (!confirm(`Delete version ${name}?`)) return;
    const res = await fetch(`/api/admin/case/history?slug=${encodeURIComponent(loadedSlug)}&name=${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { "x-admin-token": form.token.trim() },
    });
    if (res.ok) { setStatus("Version deleted"); fetchVersions(loadedSlug); }
    else { const d = await res.json().catch(()=>({})); setStatus(`Delete failed: ${d?.error || res.statusText}`); }
  };

  const duplicate = () => {
    const base = form.slug.trim() || "new-project";
    const copySlug = `${base}-copy`;
    setForm(f => ({ ...f, slug: copySlug, title: f.title ? `${f.title} (Copy)` : "", }));
    setLoadedSlug("");
    setStatus("Prepared duplicate — adjust slug/title, then Save");
  };

  const onUpload = async (file: File, name?: string) => {
    if (!loadedSlug) { alert("Save a slug first"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("slug", loadedSlug);
      fd.set("file", file);
      if (name) fd.set("name", name);
      const res = await fetch("/api/admin/case/assets", {
        method: "POST",
        headers: { "x-admin-token": form.token.trim() },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        setStatus(`Upload error: ${d?.error || res.statusText}`);
      } else {
        setStatus("Uploaded ✔");
        fetchAssets(loadedSlug, form.token.trim());
      }
    } finally {
      setUploading(false);
    }
  };

  const onDeleteAsset = async (name: string) => {
    if (!confirm(`Delete asset ${name}?`)) return;
    const res = await fetch(`/api/admin/case/assets?slug=${encodeURIComponent(loadedSlug)}&name=${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { "x-admin-token": form.token.trim() },
    });
    const d = await res.json().catch(()=>({}));
    if (!res.ok) setStatus(`Delete error: ${d?.error || res.statusText}`);
    else { setStatus("Asset deleted ✔"); fetchAssets(loadedSlug, form.token.trim()); }
  };

  async function onDelete() {
    if (!loadedSlug) return;
    if (!confirm(`Delete project “${loadedSlug}”? This removes its JSON entry.`)) return;
    setStatus("Deleting…");
    try {
      const res = await fetch(`/api/admin/case?slug=${encodeURIComponent(loadedSlug)}`, {
        method: "DELETE",
        headers: { "x-admin-token": form.token.trim() },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(`Error: ${data?.error || res.statusText}`);
      } else {
        // Clear form
        setForm((f) => ({ ...f, slug: "", title: "", year: "", tags: "", client: "", cover: "", blueprint: "", framework: "", finish: "", images: "", video: "", publishBlog: false, publishBehance: false, publishLinkedin: false, publishFacebook: false, publishInstagram: false, socialCaption: "" }));
        setLoadedSlug("");
        fetchCases(form.token.trim());
        setStatus("Deleted ✔");
      }
    } catch {
      setStatus("Delete failed");
    }
  }

  return (
    <>
      <Header sticky={false} />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {/* Tabs */}
      <div className="flex gap-2 text-sm">
        {(["dashboard","editor","assets","versions","backup"] as const).map(k => (
          <button key={k} type="button" onClick={()=>setTab(k)} className={`px-3 py-1.5 rounded-lg border ${tab===k?"bg-ink text-paper":"hover:border-ink/40"}`}>{k[0].toUpperCase()+k.slice(1)}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 rounded-2xl border p-4 bg-paper/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Projects</h2>
            <button type="button" className="text-sm underline" onClick={() => {
              setForm((f) => ({ ...f, slug: "", title: "", year: "", tags: "", client: "", cover: "", blueprint: "", framework: "", finish: "", images: "", video: "", publishBlog: false, publishBehance: false, publishLinkedin: false, publishFacebook: false, publishInstagram: false, socialCaption: "" }));
              setLoadedSlug("");
            }}>New</button>
          </div>
          <ul className="space-y-1 max-h-[50vh] overflow-auto">
            {cases.map((c) => (
              <li key={c.slug}>
                <button type="button" className="w-full text-left px-2 py-1 rounded hover:bg-mist/40" onClick={() => loadCase(c.slug)}>
                  <span className="text-sm">{c.title || c.slug}</span>
                  {c.year ? <span className="text-xs opacity-60"> — {c.year}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <section className="md:col-span-2 space-y-4 rounded-2xl border border-mist p-6 bg-paper/80">
            <h2 className="font-medium">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border p-3"><div className="text-xs opacity-60">Projects</div><div className="text-2xl font-semibold">{summary?.totals?.projects ?? 0}</div></div>
              <div className="rounded-xl border p-3"><div className="text-xs opacity-60">Images</div><div className="text-2xl font-semibold">{summary?.totals?.images ?? 0}</div></div>
              <div className="rounded-xl border p-3"><div className="text-xs opacity-60">Videos</div><div className="text-2xl font-semibold">{summary?.totals?.videos ?? 0}</div></div>
              <div className="rounded-xl border p-3"><div className="text-xs opacity-60">Missing cover</div><div className="text-2xl font-semibold">{summary?.totals?.missingCover ?? 0}</div></div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Recently updated</h3>
              <ul className="divide-y rounded-xl border">
                {(summary?.items ?? []).slice(0,6).map((it:any) => (
                  <li key={it.slug} className="px-3 py-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.title || it.slug}</div>
                      <div className="text-xs opacity-60">{it.year || ''} · {it.imageCount} images · {it.videoCount} videos</div>
                    </div>
                    <button className="text-sm underline" onClick={()=>loadCase(it.slug)}>Open</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Editor */}
        {tab === "editor" && (
        <form onSubmit={onSubmit} className="md:col-span-2 space-y-4 rounded-2xl border border-mist p-6 bg-paper/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">Admin token</span>
            <input className="form-field mt-1" value={form.token} onChange={update("token")} placeholder="paste ADMIN_TOKEN" />
            <div className="mt-1 text-xs">
              {auth === "ok" && <span className="text-green-700">Connected</span>}
              {auth === "bad" && <span className="text-red-700">Unauthorized — check token and restart dev server after editing .env.local</span>}
              {auth === "unknown" && <span className="opacity-60">Enter token to connect…</span>}
            </div>
          </label>
          <label className="block">
            <span className="text-sm">Slug</span>
            <input className="form-field mt-1" value={form.slug} onChange={update("slug")} placeholder="e.g. calm-hotel" required />
          </label>
          <label className="block">
            <span className="text-sm">Title</span>
            <input className="form-field mt-1" value={form.title} onChange={update("title")} placeholder="Project title" required />
          </label>
          <label className="block">
            <span className="text-sm">Year</span>
            <input className="form-field mt-1" value={form.year} onChange={update("year")} placeholder="2025" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Tags (comma)</span>
            <input className="form-field mt-1" value={form.tags} onChange={update("tags")} placeholder="Interior, Motion" />
          </label>
          <label className="block">
            <span className="text-sm">Client</span>
            <input className="form-field mt-1" value={form.client} onChange={update("client")} />
          </label>
          <label className="block">
            <span className="text-sm">Cover (URL or /cases/...)</span>
            <input className="form-field mt-1" value={form.cover} onChange={update("cover")} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Images (one per line)</span>
            <textarea className="form-field mt-1" rows={4} value={form.images} onChange={update("images")} placeholder="/cases/slug/01.jpg&#10;/cases/slug/02.jpg" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Blueprint</span>
            <textarea className="form-field mt-1" rows={4} value={form.blueprint} onChange={update("blueprint")} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Framework</span>
            <textarea className="form-field mt-1" rows={4} value={form.framework} onChange={update("framework")} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Finish</span>
            <textarea className="form-field mt-1" rows={4} value={form.finish} onChange={update("finish")} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm">Video (URL)</span>
            <input className="form-field mt-1" value={form.video} onChange={update("video")} />
          </label>
          <fieldset className="block md:col-span-2">
            <legend className="text-sm font-medium">Publish to</legend>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.publishBlog} onChange={(e)=>setForm(f=>({...f,publishBlog:e.target.checked}))} /> Blog</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.publishBehance} onChange={(e)=>setForm(f=>({...f,publishBehance:e.target.checked}))} /> Behance</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.publishLinkedin} onChange={(e)=>setForm(f=>({...f,publishLinkedin:e.target.checked}))} /> LinkedIn</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.publishFacebook} onChange={(e)=>setForm(f=>({...f,publishFacebook:e.target.checked}))} /> Facebook</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.publishInstagram} onChange={(e)=>setForm(f=>({...f,publishInstagram:e.target.checked}))} /> Instagram</label>
            </div>
          </fieldset>
          <label className="block md:col-span-2">
            <span className="text-sm">Social caption (shared to integrations)</span>
            <textarea className="form-field mt-1" rows={3} value={form.socialCaption} onChange={update("socialCaption")} placeholder="Short caption used for social posts" />
          </label>
          {/* Quick analysis */}
          <div className="md:col-span-2 rounded-xl border p-4">
            <h3 className="text-sm font-medium mb-2">Review</h3>
            <ul className="text-sm space-y-1">
              <li className={form.title.trim()?"text-green-700":"text-red-700"}>{form.title.trim()?"✔ Title set":"✖ Title missing"}</li>
              <li className={(form.year||"").trim()?"text-green-700":"text-yellow-700"}>{(form.year||"").trim()?"✔ Year set":"• Year optional (empty)"}</li>
              <li className={form.cover.trim()?"text-green-700":"text-red-700"}>{form.cover.trim()?"✔ Cover set":"✖ Cover missing"}</li>
              <li className={form.tags.trim()?"text-green-700":"text-yellow-700"}>{form.tags.trim()?"✔ Tags present":"• Tags recommended"}</li>
              <li className={(form.images.split("\n").filter(s=>s.trim()).length + assets.filter(a=>a.type==='image').length) >= 3?"text-green-700":"text-yellow-700"}>
                {(form.images.split("\n").filter(s=>s.trim()).length + assets.filter(a=>a.type==='image').length) >= 3 ? "✔ Image count looks good" : "• Consider adding 3+ images"}
              </li>
              <li className={(!!form.video.trim() || assets.some(a=>a.type==='video'))?"text-green-700":"text-yellow-700"}>
                {(!!form.video.trim() || assets.some(a=>a.type==='video'))?"✔ Has video or link":"• Add a video for richer case"}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-4 py-2 rounded-lg bg-accent text-ink font-medium" data-cursor="Save">
            Save
          </button>
          <button type="button" onClick={duplicate} className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30" data-cursor="Duplicate">
            Duplicate
          </button>
          <button type="button" onClick={onDelete} disabled={!loadedSlug} className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30 disabled:opacity-40" data-cursor="Delete">
            Delete
          </button>
          <span className="text-sm text-neutral-600">{status}</span>
        </div>
        </form>
        )}

        {/* Assets manager */}
        {tab === "assets" && (
        <section className="md:col-span-2 rounded-2xl border p-6 bg-paper/80">
          <h2 className="font-medium mb-3">Assets {loadedSlug ? `— /cases/${loadedSlug}` : ""}</h2>
          {!loadedSlug ? (
            <p className="text-sm opacity-70">Save or load a project to manage its assets.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="file" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onUpload(f); e.currentTarget.value=""; }} />
                  <span>Upload</span>
                </label>
                {uploading ? <span className="text-sm">Uploading…</span> : null}
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map(a => (
                  <li key={a.name} className="rounded-xl border border-mist p-3 bg-paper/90">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 mr-2">
                        <div className="text-sm font-medium truncate" title={a.name}>{a.name}</div>
                        <div className="text-xs opacity-60 truncate" title={a.url}>{a.url}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs underline cursor-pointer">
                          <input type="file" className="sr-only" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onUpload(f, a.name); e.currentTarget.value=""; }} />
                          Replace
                        </label>
                        <button type="button" className="text-xs underline" onClick={()=>onDeleteAsset(a.name)}>Delete</button>
                      </div>
                    </div>
                    <div className="mt-2">
                      {a.type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.url} alt={a.name} className="w-full h-32 object-cover rounded-lg border border-mist" />
                      ) : a.type === 'video' ? (
                        <video src={a.url} className="w-full h-32 object-cover rounded-lg border border-mist" controls />
                      ) : (
                        <div className="text-xs opacity-60">{Math.round(a.size/1024)} KB</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {assets.length === 0 ? <p className="text-sm opacity-70">No assets in this folder yet.</p> : null}
            </>
          )}
        </section>
        )}

        {/* Versions */}
        {tab === "versions" && (
        <section className="md:col-span-2 rounded-2xl border p-6 bg-paper/80">
          <h2 className="font-medium mb-3">Versions {loadedSlug ? `— ${loadedSlug}` : ""}</h2>
          {!loadedSlug ? (
            <p className="text-sm opacity-70">Load a project to see version history.</p>
          ) : (
            <ul className="divide-y rounded-xl border">
              {versions.map(v => (
                <li key={v.name} className="px-3 py-2 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs opacity-60">{Math.round(v.size/1024)} KB</div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button className="underline" onClick={()=>restoreVersion(v.name)}>Restore</button>
                    <button className="underline" onClick={()=>deleteVersion(v.name)}>Delete</button>
                  </div>
                </li>
              ))}
              {versions.length === 0 && <li className="px-3 py-2 text-sm opacity-70">No versions yet.</li>}
            </ul>
          )}
        </section>
        )}

        {/* Backup */}
        {tab === "backup" && (
        <section className="md:col-span-2 rounded-2xl border p-6 bg-paper/80 space-y-4">
          <h2 className="font-medium mb-1">Backup & Restore</h2>
          <div className="text-sm opacity-80">Export all case JSON, version history metadata, and an index of assets. Snapshots copy current JSONs into a timestamped folder.</div>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30"
              onClick={async () => {
                const t = form.token.trim();
                if (!t) { setStatus("Enter admin token"); return; }
                try {
                  const res = await fetch("/api/admin/backup", { headers: { "x-admin-token": t } });
                  if (!res.ok) { const d = await res.json().catch(()=>({})); setStatus(`Backup failed: ${d?.error || res.statusText}`); return; }
                  const data = await res.json();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  const ts = new Date().toISOString().replace(/[:.]/g, "-");
                  a.href = url; a.download = `backup-${ts}.json`; a.click();
                  URL.revokeObjectURL(url);
                  setStatus("Backup downloaded ✔");
                } catch { setStatus("Backup failed"); }
              }}
            >Download Backup (JSON)</button>

            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30"
              onClick={async () => {
                const t = form.token.trim();
                if (!t) { setStatus("Enter admin token"); return; }
                const res = await fetch("/api/admin/backup/snapshot", { method: "POST", headers: { "x-admin-token": t } });
                if (!res.ok) { const d = await res.json().catch(()=>({})); setStatus(`Snapshot failed: ${d?.error || res.statusText}`); return; }
                const d = await res.json();
                setStatus(`Snapshot created ✔ (${d?.files ?? 0} files) :: ${d?.snapshot}`);
              }}
            >Create Snapshot</button>

            <label className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30 cursor-pointer">
              <input
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return; e.currentTarget.value = "";
                  const t = form.token.trim();
                  if (!t) { setStatus("Enter admin token"); return; }
                  try {
                    const raw = await f.text();
                    const payload = JSON.parse(raw);
                    const res = await fetch("/api/admin/backup", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "x-admin-token": t },
                      body: JSON.stringify({ cases: payload?.cases || [] }),
                    });
                    const d = await res.json().catch(()=>({}));
                    if (!res.ok) { setStatus(`Import failed: ${d?.error || res.statusText}`); return; }
                    setStatus(`Imported ✔ (${d?.imported ?? 0} cases)`);
                    fetchCases(t);
                    fetchSummary(t);
                  } catch { setStatus("Import failed: invalid file"); }
                }}
              />
              Import Backup…
            </label>
          </div>
          <p className="text-xs opacity-60">Tip: Assets (images/videos) are not embedded in the JSON backup. Keep your repository’s `public/cases/` folder under version control or back it up separately.</p>
          <div className="text-sm text-neutral-600">{status}</div>
        </section>
        )}
      </div>
      </main>
    </>
  );
}

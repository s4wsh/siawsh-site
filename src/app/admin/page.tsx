"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

type CaseListItem = { slug: string; title: string; year?: number; category?: "interior"|"graphic"|"motion"; categories?: Array<"interior"|"graphic"|"motion">; blog?: boolean };

export default function AdminPage() {
  const [form, setForm] = useState({
    token: "",
    slug: "",
    title: "",
    categories: [] as string[],
    year: "",
    tags: "",
    client: "",
    cover: "",
    blueprint: "",
    framework: "",
    finish: "",
    images: "",
    imagesAlt: {} as Record<string,string>,
    video: "",
    // SEO fields
    seoTitle: "",
    seoDescription: "",
    seoH1: "",
    seoSubheadings: "",
    seoPrimary: "",
    seoSecondary: "",
    seoCanonical: "",
    seoOgTitle: "",
    seoOgDesc: "",
    seoOgImage: "",
    seoTwTitle: "",
    seoTwDesc: "",
    seoTwImage: "",
    seoIndex: true,
    seoChecklist: { internalLinks:false, externalLinks:false, schema:false, toc:false, breadcrumbs:false, shareButtons:false, cta:false } as Record<string,boolean>,
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
  const [tab, setTab] = useState<"dashboard"|"editor"|"backup">("dashboard");
  const [categoryFilter, setCategoryFilter] = useState<"all"|"interior"|"graphic"|"motion">("all");
  const [summary, setSummary] = useState<{ totals?: any; items?: any[] }>({});
  const [versions, setVersions] = useState<Array<{name:string;size:number;mtimeMs:number}>>([]);
  const [showToken, setShowToken] = useState(false);
  const [editorTab, setEditorTab] = useState<'content'|'media'|'seo'|'analytics'>('content');

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

  // Minimal vs advanced tabs (hide extras by default)
  const TABS = ["dashboard","editor","backup"] as const;

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
      categories: form.categories.map((c) => c.toLowerCase()),
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
      imagesAlt: form.imagesAlt,
      seo: {
        title: form.seoTitle.trim() || undefined,
        description: form.seoDescription.trim() || undefined,
        h1: form.seoH1.trim() || undefined,
        subheadings: form.seoSubheadings.split('\n').map(s=>s.trim()).filter(Boolean),
        primary: form.seoPrimary.trim() || undefined,
        secondary: form.seoSecondary.split(',').map(s=>s.trim()).filter(Boolean),
        canonical: form.seoCanonical.trim() || undefined,
        og: { title: form.seoOgTitle.trim() || undefined, description: form.seoOgDesc.trim() || undefined, image: form.seoOgImage.trim() || undefined },
        twitter: { title: form.seoTwTitle.trim() || undefined, description: form.seoTwDesc.trim() || undefined, image: form.seoTwImage.trim() || undefined },
        index: !!form.seoIndex,
        checklist: form.seoChecklist,
      },
    };

    payload.publishBlog = !!form.publishBlog;
    payload.publishBehance = !!form.publishBehance;
    payload.publishLinkedin = !!form.publishLinkedin;
    payload.publishFacebook = !!form.publishFacebook;
    payload.publishInstagram = !!form.publishInstagram;
    payload.socialCaption = form.socialCaption.trim();

    const payloadAny: any = payload;
    if (loadedSlug) payloadAny.prevSlug = loadedSlug; // always send to allow server to normalize/rename safely

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
      const returnedSlug = (data?.slug as string) || form.slug.trim();
      setStatus("Saved ✔");
      setLoadedSlug(returnedSlug);
      if (returnedSlug !== form.slug.trim()) {
        setForm((f) => ({ ...f, slug: returnedSlug }));
      }
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
        categories: Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []),
        client: data.client || "",
        cover: data.cover || "",
        blueprint: data.blueprint || "",
        framework: data.framework || "",
        finish: data.finish || "",
        images: Array.isArray(data.images) ? data.images.join("\n") : "",
        video: data.video || "",
        imagesAlt: (data.imagesAlt || {}) as Record<string,string>,
        // SEO
        seoTitle: data.seo?.title || "",
        seoDescription: data.seo?.description || "",
        seoH1: data.seo?.h1 || "",
        seoSubheadings: Array.isArray(data.seo?.subheadings) ? data.seo.subheadings.join("\n") : "",
        seoPrimary: data.seo?.primary || "",
        seoSecondary: Array.isArray(data.seo?.secondary) ? data.seo.secondary.join(", ") : "",
        seoCanonical: data.seo?.canonical || "",
        seoOgTitle: data.seo?.og?.title || "",
        seoOgDesc: data.seo?.og?.description || "",
        seoOgImage: data.seo?.og?.image || "",
        seoTwTitle: data.seo?.twitter?.title || "",
        seoTwDesc: data.seo?.twitter?.description || "",
        seoTwImage: data.seo?.twitter?.image || "",
        seoIndex: data.seo?.index !== false,
        seoChecklist: {
          internalLinks: !!data.seo?.checklist?.internalLinks,
          externalLinks: !!data.seo?.checklist?.externalLinks,
          schema: !!data.seo?.checklist?.schema,
          toc: !!data.seo?.checklist?.toc,
          breadcrumbs: !!data.seo?.checklist?.breadcrumbs,
          shareButtons: !!data.seo?.checklist?.shareButtons,
          cta: !!data.seo?.checklist?.cta,
        },
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
        {TABS.map((k) => (
          <button key={k} type="button" onClick={()=>setTab(k as any)} className={`px-3 py-1.5 rounded-lg border ${tab===k?"bg-ink text-paper":"hover:border-ink/40"}`}>{(k as string)[0].toUpperCase()+(k as string).slice(1)}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 rounded-2xl border p-4 bg-paper/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Projects</h2>
            <button type="button" className="text-sm underline" onClick={() => {
              setForm((f) => ({ ...f,
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
                categories: categoryFilter !== 'all' ? [categoryFilter] : [],
              }));
              setLoadedSlug("");
              setTab('editor');
            }}>New</button>
          </div>
          <div className="mb-2 flex gap-2 text-xs">
            {["all","interior","graphic","motion"].map((k) => (
              <button key={k} type="button" onClick={()=>setCategoryFilter(k as any)} className={`px-2 py-1 rounded border ${categoryFilter===k?"bg-ink text-paper":"hover:border-ink/40"}`}>{k}</button>
            ))}
          </div>
          <ul className="space-y-1 max-h-[50vh] overflow-auto">
            {cases.filter(c => {
                if (categoryFilter==='all') return true;
                const cats = (c.categories && c.categories.length ? c.categories : (c.category ? [c.category] : []));
                return cats.includes(categoryFilter as any);
              }).map((c) => (
              <li key={c.slug}>
                <button type="button" className="w-full text-left px-2 py-1 rounded hover:bg-mist/40" onClick={() => loadCase(c.slug)}>
                  <span className="text-sm">{c.title || c.slug}</span>
                  <span className="text-xs opacity-60">
                    {c.year ? ` — ${c.year}` : ""}
                    {(() => { const list = (c.categories && c.categories.length ? c.categories : (c.category ? [c.category] : [])); return list.length ? ` • ${list.join('/')}` : '' })()}
                  </span>
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
        {/* Editor mini-nav */}
        <nav className="sticky top-0 z-10 -mt-2 mb-2 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/70 rounded-lg border p-2 flex flex-wrap gap-2 text-xs">
          {[
            ['#info','Information'],
            ['#visual','Visual'],
            ['#seo','SEO'],
            ['#analytics','Analytics'],
          ].map(([href,label]) => (
            <a key={href} href={href} className="px-2 py-1 rounded border hover:border-ink/40" data-cursor="Jump">{label}</a>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button type="submit" className="px-3 py-1.5 rounded bg-accent text-ink font-medium" data-cursor="Save">Save</button>
            <span className="text-neutral-600">{status}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 h-0" id="info" />
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
          <fieldset className="block md:col-span-2">
            <legend className="text-sm font-medium">Categories</legend>
            <div className="mt-2 flex gap-2 text-sm">
              {(["interior","graphic","motion"] as const).map((c) => (
                <label key={c} className={`px-3 py-2 rounded-lg border cursor-pointer ${form.categories.includes(c) ? 'bg-ink text-paper' : 'hover:border-ink/30'}`}>
                  <input type="checkbox" className="sr-only" checked={form.categories.includes(c)} onChange={()=>{
                    setForm(f=>{
                      const has = f.categories.includes(c);
                      return { ...f, categories: has ? f.categories.filter(x=>x!==c) : [...f.categories, c] };
                    });
                  }} />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="md:col-span-2 h-0" id="visual" />
          <label className="block">
            <span className="text-sm">Client</span>
            <input className="form-field mt-1" value={form.client} onChange={update("client")} />
          </label>
          <label className="block">
            <span className="text-sm">Cover (URL or /cases/...)</span>
            <input className="form-field mt-1" value={form.cover} onChange={update("cover")} />
          </label>
          {/* Live cover preview */}
          {form.cover?.trim() ? (
            <div className="block md:col-span-2">
              <div className="text-xs opacity-70 mb-1">Cover preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.cover.trim()}
                alt="Cover preview"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                className="w-full max-h-56 object-cover rounded-lg border"
              />
            </div>
          ) : null}
          {/* Quick attach from existing assets */}
          {loadedSlug ? (
            <div className="md:col-span-2 rounded-xl border p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Assets quick attach</h3>
                <button type="button" className="text-xs underline" onClick={()=>fetchAssets(loadedSlug, form.token.trim())}>Refresh</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {assets.filter(a=>a.type==='image').slice(0,12).map(a => (
                  <div key={a.name} className="rounded-lg border overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.url} alt={a.name} className="aspect-square object-cover" />
                    <div className="flex divide-x">
                      <button type="button" className="flex-1 text-xs py-1 hover:bg-mist/40" onClick={()=>{
                        setForm(f=>{
                          const list = f.images.split('\n').map(s=>s.trim()).filter(Boolean);
                          if (!list.includes(a.url)) list.push(a.url);
                          return { ...f, images: list.join('\n') };
                        });
                      }}>Add</button>
                      <button type="button" className="flex-1 text-xs py-1 hover:bg-mist/40" onClick={()=> setForm(f=>({ ...f, cover: a.url }))}>Cover</button>
                    </div>
                  </div>
                ))}
                {assets.filter(a=>a.type==='video').slice(0,4).map(a => (
                  <div key={a.name} className="rounded-lg border p-2 text-xs">
                    <div className="font-medium truncate" title={a.name}>{a.name}</div>
                    <div className="opacity-60">{Math.round(a.size/1024)} KB</div>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className="px-2 py-1 rounded border hover:border-ink/30" onClick={()=> setForm(f=>({ ...f, video: a.url }))}>Set video</button>
                      <a className="px-2 py-1 rounded border hover:border-ink/30" href={a.url} target="_blank" rel="noopener noreferrer">Open</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {/* Images list editor */}
          <div className="md:col-span-2 rounded-xl border p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Images</h3>
              <button
                type="button"
                className="text-xs underline"
                onClick={() => setForm(f=>({ ...f, images: (f.images? f.images+"\n" : "") + "/cases/slug/01.jpg" }))}
              >Add placeholder</button>
            </div>
            <ul className="space-y-3">
              {form.images.split('\n').map((s)=>s.trim()).filter(Boolean).map((url, i, arr) => (
                <li key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-14 w-14 rounded border object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none';}} />
                    <input
                      className="form-field"
                      value={url}
                      onChange={(e)=>{
                        const val = e.target.value;
                        setForm(f=>{
                          const list = f.images.split('\n').map(x=>x.trim()).filter(Boolean);
                          list[i] = val.trim();
                          return { ...f, images: list.join('\n') };
                        });
                      }}
                      placeholder="https://... or /cases/slug/img.jpg"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button type="button" className="text-xs underline" onClick={()=>{
                      setForm(f=>{
                        const list = f.images.split('\n').map(x=>x.trim()).filter(Boolean);
                        if (i>0){ const t=list[i-1]; list[i-1]=list[i]; list[i]=t; }
                        return { ...f, images: list.join('\n') };
                      });
                    }}>Up</button>
                    <button type="button" className="text-xs underline" onClick={()=>{
                      setForm(f=>{
                        const list = f.images.split('\n').map(x=>x.trim()).filter(Boolean);
                        if (i<list.length-1){ const t=list[i+1]; list[i+1]=list[i]; list[i]=t; }
                        return { ...f, images: list.join('\n') };
                      });
                    }}>Down</button>
                    <button type="button" className="text-xs underline" onClick={()=>{
                      setForm(f=>{
                        const list = f.images.split('\n').map(x=>x.trim()).filter(Boolean);
                        list.splice(i,1);
                        return { ...f, images: list.join('\n') };
                      });
                    }}>Remove</button>
                  </div>
                </li>
              ))}
              {/* Add new row */}
              <li className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded border bg-mist/40" />
                  <input
                    className="form-field"
                    value={""}
                    placeholder="Add new image URL, press Add"
                    onChange={()=>{}}
                    onKeyDown={(e)=>{
                      const target = e.currentTarget as HTMLInputElement;
                      if (e.key==='Enter' && target.value.trim()){
                        setForm(f=>({ ...f, images: (f.images? f.images+"\n" : "") + target.value.trim() }));
                        target.value='';
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button type="button" className="text-xs underline" onClick={(e)=>{
                    const input = (e.currentTarget.parentElement?.previousElementSibling as HTMLElement)?.querySelector('input') as HTMLInputElement | null;
                    if (input && input.value.trim()){
                      setForm(f=>({ ...f, images: (f.images? f.images+"\n" : "") + input.value.trim() }));
                      input.value='';
                    }
                  }}>Add</button>
                </div>
              </li>
            </ul>
          </div>
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
          <div className="md:col-span-2 h-0" id="seo" />
          {/* SEO */}
          <div className="md:col-span-2 rounded-xl border p-4 space-y-3">
            <h3 className="text-sm font-medium">SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm">SEO Title</span>
                <input className="form-field mt-1" value={form.seoTitle} onChange={update('seoTitle')} placeholder="Title Tag" />
              </label>
              <label className="block">
                <span className="text-sm">Canonical URL</span>
                <input className="form-field mt-1" value={form.seoCanonical} onChange={update('seoCanonical')} placeholder="https://example.com/..." />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm">Meta Description</span>
                <textarea className="form-field mt-1" rows={2} value={form.seoDescription} onChange={update('seoDescription')} />
              </label>
              <label className="block">
                <span className="text-sm">H1 Heading</span>
                <input className="form-field mt-1" value={form.seoH1} onChange={update('seoH1')} placeholder="Leave empty to use Title" />
              </label>
              <label className="block">
                <span className="text-sm">Subheadings (H2/H3, one per line)</span>
                <textarea className="form-field mt-1" rows={2} value={form.seoSubheadings} onChange={update('seoSubheadings')} />
              </label>
              <label className="block">
                <span className="text-sm">Primary Keyword</span>
                <input className="form-field mt-1" value={form.seoPrimary} onChange={update('seoPrimary')} />
              </label>
              <label className="block">
                <span className="text-sm">Secondary/LSI Keywords (comma)</span>
                <input className="form-field mt-1" value={form.seoSecondary} onChange={update('seoSecondary')} />
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.seoIndex} onChange={(e)=>setForm(f=>({...f, seoIndex: e.target.checked}))} />
                <span className="text-sm">Allow indexing</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-xs">OG Title</span>
                <input className="form-field mt-1" value={form.seoOgTitle} onChange={update('seoOgTitle')} />
              </label>
              <label className="block">
                <span className="text-xs">OG Description</span>
                <input className="form-field mt-1" value={form.seoOgDesc} onChange={update('seoOgDesc')} />
              </label>
              <label className="block">
                <span className="text-xs">OG Image</span>
                <input className="form-field mt-1" value={form.seoOgImage} onChange={update('seoOgImage')} />
              </label>
              <label className="block">
                <span className="text-xs">Twitter Title</span>
                <input className="form-field mt-1" value={form.seoTwTitle} onChange={update('seoTwTitle')} />
              </label>
              <label className="block">
                <span className="text-xs">Twitter Description</span>
                <input className="form-field mt-1" value={form.seoTwDesc} onChange={update('seoTwDesc')} />
              </label>
              <label className="block">
                <span className="text-xs">Twitter Image</span>
                <input className="form-field mt-1" value={form.seoTwImage} onChange={update('seoTwImage')} />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {([
                ['internalLinks','Internal links'],
                ['externalLinks','External links'],
                ['schema','Schema markup'],
                ['toc','Table of contents'],
                ['breadcrumbs','Breadcrumbs'],
                ['shareButtons','Share buttons'],
                ['cta','CTA present'],
              ] as const).map(([k,label]) => (
                <label key={k} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!form.seoChecklist[k]} onChange={(e)=>setForm(f=>({ ...f, seoChecklist: { ...f.seoChecklist, [k]: e.target.checked } }))} />
                  {label}
                </label>
              ))}
            </div>
          </div>

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

          {/* Analytics stub */}
          <div className="md:col-span-2 h-0" id="analytics" />
          <section className="md:col-span-2 rounded-2xl border p-4 space-y-3 bg-paper/80">
            <h3 className="text-sm font-medium">Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl border p-3"><div className="opacity-60 text-xs">Pageviews</div><div className="text-xl">—</div></div>
              <div className="rounded-xl border p-3"><div className="opacity-60 text-xs">Unique</div><div className="text-xl">—</div></div>
              <div className="rounded-xl border p-3"><div className="opacity-60 text-xs">Avg Time</div><div className="text-xl">—</div></div>
              <div className="rounded-xl border p-3"><div className="opacity-60 text-xs">CTR</div><div className="text-xl">—</div></div>
            </div>
            <p className="text-xs opacity-70">Hook up Plausible or GA to populate. We can pull metrics by slug.</p>
          </section>
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

        {tab === "backup" && (
        <section className="md:col-span-2 rounded-2xl border p-6 bg-paper/80 space-y-4">
          <h2 className="font-medium mb-1">Backup & Restore</h2>
          <div className="text-sm opacity-80">Export all case JSON, version history metadata, and an index of assets. Snapshots copy current JSONs into a timestamped folder.</div>
          {/* Token controls scoped to backup card */}
          <div className="flex flex-wrap items-end gap-3 text-sm">
            <label className="block">
              <div className="mb-1 opacity-70">Admin token</div>
              <input
                type="password"
                inputMode="text"
                autoComplete="off"
                placeholder="Paste your admin token…"
                value={form.token}
                onChange={update("token")}
                className="form-field !w-80"
              />
            </label>
            <div className="opacity-70">
              {auth === "ok" && <span className="inline-flex items-center gap-1 text-green-600">✔ Authorized</span>}
              {auth === "bad" && <span className="inline-flex items-center gap-1 text-red-600">✖ Unauthorized</span>}
              {auth === "unknown" && <span>Enter token to load projects</span>}
            </div>
            {form.token && (
              <button
                type="button"
                onClick={() => { setForm(f => ({ ...f, token: "" })); setAuth("unknown"); setCases([]); setSummary({}); }}
                className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30"
              >Clear</button>
            )}
          </div>
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
          {/* Inline token display + controls */}
          <div className="flex items-center gap-3 text-xs opacity-80">
            <span>Token:</span>
            <code className="px-2 py-1 rounded bg-mist/50 border">
              {showToken ? (form.token || "(empty)") : (form.token ? "••••••••" : "(empty)")}
            </code>
            <button
              type="button"
              className="underline"
              onClick={() => setShowToken((v) => !v)}
            >{showToken ? "Hide" : "Show"}</button>
            <button
              type="button"
              className="underline"
              onClick={() => { if (form.token) navigator.clipboard?.writeText(form.token); }}
              disabled={!form.token}
            >Copy</button>
          </div>
          <div className="text-sm text-neutral-600">{status}</div>
        </section>
        )}
      </div>
      </main>
    </>
  );
}

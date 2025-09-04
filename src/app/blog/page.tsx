import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCases } from "@/lib/cases";
import Link from "next/link";

export const metadata = {
  title: "Blog — Siawsh Studio",
  description: "Project write-ups and updates.",
};

export default async function Page(){
  const items = await getAllCases();
  const posts = items.filter((c) => c.channels?.blog);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold">Blog</h1>
        {posts.length === 0 ? (
          <p className="mt-4 text-neutral-600">No posts yet. Publish a case to Blog from Admin.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/case-studies/${p.slug}`} className="block rounded-2xl overflow-hidden border">
                {p.cover ? (
                  <img src={p.cover} alt={p.title} className="h-56 w-full object-cover" />
                ) : (
                  <div className="h-56 w-full bg-mist" />
                )}
                <div className="p-4">
                  <div className="text-sm opacity-70">
                    {p.year || ""}{p.tags?.length ? ` · ${p.tags.join(" / ")}` : ""}
                  </div>
                  <h3 className="mt-1 text-lg font-medium">{p.title}</h3>
                  {p.socialCaption && <p className="mt-1 text-sm opacity-80 line-clamp-2">{p.socialCaption}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// src/app/case-studies/[slug]/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCaseBySlug } from "@/lib/cases";
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const cs = await getCaseBySlug(slug).catch(() => null);
  if (!cs) return notFound();
  return {
    title: `${cs.title} — Case Study — Siawsh`,
    description: (cs.blueprint || cs.framework || cs.finish || "Case study by Siawsh Studio")
      .toString()
      .slice(0, 160),
  };
}

export default async function CasePage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const cs = await getCaseBySlug(slug);

  const isPlayableMedia = (u: string) => /\.(mp4|webm)([?#].*)?$/i.test(u) || u.startsWith("/");
  const toEmbed = (u: string): string | null => {
    try {
      const url = new URL(u);
      const host = url.hostname;
      if (host.includes("vimeo.com")) {
        const m = url.pathname.match(/\/(\d+)/);
        return m ? `https://player.vimeo.com/video/${m[1]}` : null;
      }
      if (host.includes("youtube.com")) {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (host === "youtu.be") {
        const id = url.pathname.replace(/^\//, "");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    } catch {}
    return null;
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs text-neutral-500">
          {cs.year ? cs.year : ""} {cs.tags?.length ? `• ${cs.tags.join(" / ")}` : ""}
        </p>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold">{cs.title}</h1>

        {/* Cover */}
        {cs.cover && (
          <div className="mt-6 rounded-2xl overflow-hidden bg-mist">
            <img src={cs.cover} alt={`${cs.title} cover`} className="w-full object-cover" />
          </div>
        )}

        {/* Sections */}
        {cs.blueprint && (
          <section className="mt-10 grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Blueprint</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.blueprint}</div>
          </section>
        )}

        {cs.framework && (
          <section className="mt-8 grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Framework</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.framework}</div>
          </section>
        )}

        {cs.finish && (
          <section className="mt-8 grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Finish</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.finish}</div>
          </section>
        )}

        {/* Gallery */}
        {cs.images?.length && (
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {cs.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${cs.title} ${i + 1}`}
                className="rounded-xl w-full object-cover"
              />
            ))}
          </div>
        )}

        {/* Video */}
        {cs.video && (
          <section className="mt-10">
            {isPlayableMedia(cs.video) ? (
              <video className="rounded-xl border w-full" controls src={cs.video} />
            ) : toEmbed(cs.video) ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border">
                <iframe
                  src={toEmbed(cs.video) as string}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={`${cs.title} video`}
                />
              </div>
            ) : (
              <a href={cs.video} className="underline" target="_blank" rel="noreferrer">
                Watch video
              </a>
            )}
          </section>
        )}

        {/* CTA */}
        <div className="mt-12">
          <a href="/contact" className="px-4 py-2 rounded-lg bg-accent text-ink font-medium">
            Work with us
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}

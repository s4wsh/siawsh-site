// src/app/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkSceneClient from "@/components/WorkSceneClient";
import { getCaseBySlug } from "@/lib/cases";

export const dynamic = 'force-dynamic';

export default async function CasePage({ params }: { params: { slug: string } }) {
  const cs = await getCaseBySlug(params.slug).catch(() => null);
  if (!cs) return notFound();

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <header className="space-y-2">
          <p className="text-xs tracking-widest text-neutral-500">CASE STUDY</p>
          <h1 className="text-3xl md:text-4xl font-semibold">{cs.title}</h1>
          <div className="text-sm opacity-60">
            {!!cs.year && <span>{cs.year}</span>}
            {!!cs.tags?.length && <span> · {cs.tags.join(" / ")}</span>}
          </div>
        </header>

        {/* Cover */}
        {cs.cover && (
          <div className="rounded-2xl overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cs.cover} alt={`${cs.title} cover`} className="w-full object-cover" />
          </div>
        )}

        {/* Narrative */}
        {cs.blueprint && (
          <section className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Blueprint</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.blueprint}</div>
          </section>
        )}
        {cs.framework && (
          <section className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Framework</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.framework}</div>
          </section>
        )}
        {cs.finish && (
          <section className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Finish</h2>
            <div className="md:col-span-2 text-neutral-700 whitespace-pre-line">{cs.finish}</div>
          </section>
        )}

        {/* Interactive preview (kept) */}
        <section id="preview" className="space-y-3 scroll-mt-24">
          <h2 className="text-lg font-medium">Interactive Preview</h2>
          <WorkSceneClient />
        </section>

        {/* Video */}
        {cs.video && (
          <section id="video" className="scroll-mt-24">
            <video className="rounded-xl border w-full" controls src={cs.video} />
          </section>
        )}

        {/* Gallery */}
        {!!cs.images?.length && (
          <section id="gallery" className="grid gap-6 md:grid-cols-2 scroll-mt-24">
            {cs.images.map((src: string, i: number) => (
              <img key={i} src={src} alt={`${cs.title} ${i + 1}`} className="w-full rounded-xl border" />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

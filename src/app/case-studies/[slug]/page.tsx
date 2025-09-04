// src/app/case-studies/[slug]/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCaseBySlug, getCaseSlugs } from "@/lib/cases";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const cs = await getCaseBySlug(slug);
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

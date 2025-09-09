import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { getAllCases, type CaseDoc } from "@/lib/cases";

export const metadata = {
  title: "Case Studies — Siawsh Studio",
  description: "Selected work and processes.",
};

export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage() {
  const cases: CaseDoc[] = await getAllCases();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <header className="flex flex-wrap items-end gap-3">
            <h1 className="text-3xl md:text-5xl font-semibold">Case studies</h1>
            <p className="text-neutral-500">{cases.length} projects</p>
          </header>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((cs: CaseDoc, i: number) => (
            <Reveal key={cs.slug} delay={i * 0.04}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group block rounded-2xl overflow-hidden border border-mist bg-paper/80"
                data-cursor="Explore"
              >
                <div className="aspect-[4/3] bg-mist overflow-hidden">
                  {cs.cover ? (
                    <img
                      src={cs.cover}
                      alt={cs.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{cs.title}</h3>
                    <span className="text-xs text-neutral-500">{cs.year ?? ""}</span>
                  </div>
                  {cs.tags?.length ? (
                    <p className="mt-1 text-xs text-neutral-500">{cs.tags.join(" / ")}</p>
                  ) : null}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

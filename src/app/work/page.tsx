// src/app/work/page.tsx
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCases } from "@/lib/cases";

export const dynamic = 'force-dynamic';

export default async function WorkPage() {
  const cases = await getAllCases();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold">Selected Work</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((cs) => (
            <Link key={cs.slug} href={`/work/${cs.slug}`} className="block rounded-2xl overflow-hidden border">
              {/* cover or first image string */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.cover || cs.images?.[0] || "/placeholder.svg"}
                alt={cs.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-4">
                <div className="text-sm opacity-70">
                  {!!cs.year && <span>{cs.year}</span>}
                  {!!(cs.tags?.length) && <span> · {cs.tags.join(" / ")}</span>}
                </div>
                <h3 className="mt-1 text-lg font-medium">{cs.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

// src/app/about/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About — Siawsh Studio",
  description: "The Studio, approach, awards, and clients.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">
        <Reveal>
          <section>
            <p className="text-xs text-neutral-500">THE STUDIO</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold">We design future-modern calm.</h1>
            <p className="mt-4 max-w-3xl text-neutral-600">
              We blend interior, graphic, and motion into one clear feeling: calm that works.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section id="approach" className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Our approach</h2>
            <div className="md:col-span-2 text-neutral-700 space-y-4">
              <p>Blueprint → Framework → Finish. Clear steps, less noise.</p>
              <p>We keep signals high and friction low across every surface.</p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section id="awards" className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Awards</h2>
            <ul className="md:col-span-2 text-neutral-700 list-disc pl-5 space-y-2">
              <li>Sample Award — 2024</li>
              <li>Another Nice Thing — 2023</li>
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section id="clients" className="grid md:grid-cols-3 gap-6">
            <h2 className="text-xl font-semibold">Clients</h2>
            <ul className="md:col-span-2 text-neutral-700 grid grid-cols-2 md:grid-cols-3 gap-2">
              <li>Client A</li><li>Client B</li><li>Client C</li>
              <li>Client D</li><li>Client E</li><li>Client F</li>
            </ul>
          </section>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

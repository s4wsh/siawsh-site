import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";

export const metadata = {
  title: "Services — Siawsh Studio",
  description: "Interior, graphic, and motion capabilities.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <header className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-semibold">Services</h1>
            <div className="ml-auto flex items-center gap-3">
              <Magnetic>
                <Link
                  href="/contact"
                  data-cursor="Start"
                  className="px-4 py-2 rounded-lg bg-accent text-ink font-medium"
                >
                  Start a project
                </Link>
              </Magnetic>
              <Link
                href="/case-studies"
                data-cursor="View"
                className="px-4 py-2 rounded-lg border border-mist"
              >
                Case studies
              </Link>
            </div>
          </header>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <Reveal>
            <div className="rounded-2xl border border-mist p-5 bg-paper/80">
              <h3 className="text-lg font-semibold">Interior</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Spaces with clean lines, light, and function.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-mist p-5 bg-paper/80">
              <h3 className="text-lg font-semibold">Graphic</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Branding and visuals that speak clearly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-mist p-5 bg-paper/80">
              <h3 className="text-lg font-semibold">Motion</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Smooth, satisfying animations for brands and spaces.
              </p>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

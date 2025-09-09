import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Link from "next/link";
import ServicesTabs from "@/components/ServicesTabs";
import { Suspense } from "react";

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

        {/* Wrap in Suspense because ServicesTabs uses useSearchParams */}
        <Suspense>
          <ServicesTabs />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

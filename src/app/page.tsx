// src/app/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import ServiceCardMedia from "@/components/ServiceCardMedia";
import GridOverlay from "@/components/GridOverlay";
import HomeHero3D from "@/components/HomeHero3D";
import Magnetic from "@/components/Magnetic";
import Magnet from "@/components/Magnet";
import Link from "next/link";
import { getAllCases, type CaseDoc } from "@/lib/cases";
import Reveal from "@/components/Reveal";
import ScrollSection from "@/components/ScrollSection";
import TypingText from "@/components/TypingText";

export const metadata = {
  title: "Siawsh — Interior, Graphic & Motion",
  description: "Minimal, future-modern design. Case studies, process, and updates.",
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cases: CaseDoc[] = await getAllCases();
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4">
        {/* 3D Hero with AURA video */}
        <HomeHero3D />

        {/* Slogan + Tagline (after hero) */}
        <section className="py-10">
          <p className="text-xs tracking-widest text-neutral-500">SIAWSH STUDIO</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight">
            <TypingText text="Creative Design That Breathes Life Into Space, Movement & Story." />
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-300 md:text-neutral-700">
            We bring clarity, craft with care, and stand by you every step of the way.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Magnet radius={140} strength={12} rotate={8} snapDistance={48} snapMaxOffset={28}>
              <Link
                href="/contact"
                data-cursor="Start"
                className="inline-flex items-center h-10 px-4 rounded-lg bg-accent text-ink font-medium"
              >
                Start a project
              </Link>
            </Magnet>
            <Link
              href="/work"
              data-cursor="View"
              className="inline-flex items-center h-10 px-4 rounded-lg border border-mist"
            >
              View projects
            </Link>
          </div>
        </section>

        {/* Services */}
        <ScrollSection className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Services</h2>
            <Link href="/services" className="text-sm underline opacity-80 hover:opacity-100">All services</Link>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[{t:"Interior",b:"Spaces with clean lines, light, and function.",h:"/services?category=interior",img:"/media/hero/hero-poster.jpg",f:["Spatial planning","Material & lighting direction","Furniture & signage"]},
              {t:"Graphic",b:"Branding and visuals that speak clearly.",h:"/services?category=graphic",img:"/cases/aura-speaker/stylish.png",f:["Identity systems","Campaign & print","Web and product visuals"]},
              {t:"Motion", b:"Smooth, satisfying animations for brands and spaces.",h:"/services?category=motion",img:"/cases/aura-speaker/zoomed.png",f:["Logo/brand motion","Product animation","Social & broadcast edits"]}]
              .map((it, i, arr) => {
                // deterministic pseudo-random delay (stable across renders)
                const hash = Array.from(it.t).reduce((a,c)=>a+c.charCodeAt(0),0);
                const order = hash % arr.length;
                const delay = 0.05 + order * 0.08;
                return (
                  <Reveal key={it.t} delay={delay}>
                    <ServiceCardMedia title={it.t} blurb={it.b} href={it.h} imgSrc={it.img} features={it.f} />
                  </Reveal>
                );
              })}
          </div>
        </ScrollSection>

        {/* Case Studies — latest 3 from JSON */}
        <ScrollSection className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Case studies</h2>
            <Link href="/case-studies" className="text-sm underline opacity-80 hover:opacity-100">View all</Link>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            {cases.slice(0, 3).map((cs, i, arr) => {
              const hash = Array.from(cs.slug).reduce((a,c)=>a+c.charCodeAt(0),0);
              const order = hash % arr.length;
              const delay = 0.06 + order * 0.08;
              return (
                <Reveal key={cs.slug} delay={delay}>
                  <Link href={`/case-studies/${cs.slug}`} className="group block rounded-2xl overflow-hidden border relative">
                    <div className="aspect-[4/3] bg-black/70">
                      {cs.cover ? (<img src={cs.cover} alt={cs.title} className="h-full w-full object-cover" />) : (<div className="h-full w-full bg-mist" />)}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium group-hover:underline">{cs.title}</h3>
                      {"socialCaption" in cs && (cs as any).socialCaption && (
                        <p className="mt-1 text-sm opacity-70">{(cs as any).socialCaption}</p>
                      )}
                    </div>
                    {/* subtle scanlines */}
                    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-5" style={{backgroundImage:"repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)"}} />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </ScrollSection>

        {/* Portfolio (mosaic from recent images) */}
        <ScrollSection className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">Portfolio</h2>
            <Link href="/work" className="text-sm underline opacity-80 hover:opacity-100">Explore work</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {cases.flatMap((c) => (c.images || []).map(src => ({ src, alt: `${c.title}` })))
              .slice(0, 8)
              .map((img, i) => (
                <Reveal key={i} delay={0.04 + (i % 4) * 0.05}>
                  <div className="aspect-square overflow-hidden rounded-xl border relative">
                    <img src={img.src} alt={img.alt || "Portfolio image"} className="h-full w-full object-cover" />
                    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-5" style={{backgroundImage:"repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)"}} />
                  </div>
                </Reveal>
              ))}
          </div>
        </ScrollSection>

        {/* Blog teaser */}
        <ScrollSection className="py-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">From the blog</h2>
            <Link href="/blog" className="text-sm underline opacity-80 hover:opacity-100">Read more</Link>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border p-4 bg-paper/60">
              <p className="text-sm opacity-80">No posts yet — coming soon.</p>
            </div>
          </div>
        </ScrollSection>
      </main>

      <Footer />
      <GridOverlay />
    </>
  );
}

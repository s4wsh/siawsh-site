// app/[lang]/work/page.tsx
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
      <section className="relative h-[80vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero/hero-poster.jpg"
        >
          <source src="/media/hero/hero-loop.webm" type="video/webm" />
          <source src="/media/hero/hero-loop.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex h-full items-center justify-center text-center p-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Siawsh Studio</h1>
            <p className="opacity-80 max-w-xl mx-auto">Minimal, future-modern design across Interior, Graphic, Motion.</p>
          </div>
        </div>
      </section>

      {/* ...rest of your sections */}
      </main>
    </>
  );
}

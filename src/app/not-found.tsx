// src/app/not-found.tsx
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-xs tracking-widest text-neutral-500">ERROR 404</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold">Page not found</h1>
        <p className="mt-4 text-neutral-600">The link may be broken or the page moved.</p>
        <div className="mt-8">
          <Link href="/" className="px-4 py-2 rounded-lg bg-accent text-ink font-medium" data-cursor="Home">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

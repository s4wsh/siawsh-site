// src/app/contact/thanks/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ThanksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold">Thanks — we got it.</h1>
        <p className="mt-3 text-neutral-600">We’ll review and get back to you shortly.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-accent text-ink font-medium"
            data-cursor="Home"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

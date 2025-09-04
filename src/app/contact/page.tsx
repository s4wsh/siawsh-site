import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import TurnstileWidget from "@/components/TurnstileWidget";

export const metadata = {
  title: "Contact — Siawsh Studio",
  description: "Start a project or ask a question.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-semibold">Let’s talk</h1>
        <p className="mt-3 text-neutral-600">
          Tell us a bit about your project. We’ll reply within 1–2 days.
        </p>

        <form
          action="/api/contact"
          method="post"
          className="mt-8 space-y-4 rounded-2xl border border-mist p-6 bg-paper/80"
        >
          {/* honeypot (anti-bot) */}
          <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              className="form-field caret-accent mt-1"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="form-field caret-accent mt-1"
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">What are you building?</label>
            <textarea
              name="message"
              required
              rows={5}
              className="form-field caret-accent mt-1"
              placeholder="A few lines about scope, timeline, goals…"
            />
          </div>

          {/* Cloudflare Turnstile */}
          <TurnstileWidget />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              data-cursor="Send"
              className="px-4 py-2 rounded-lg bg-accent text-ink font-medium"
            >
              Send message
            </button>
            <Link href="/" className="px-4 py-2 rounded-lg border border-mist">
              Cancel
            </Link>
          </div>
        </form>

        <p className="mt-4 text-xs text-neutral-500">
          This form uses Cloudflare Turnstile to prevent spam.
        </p>
      </main>
      <Footer />
    </>
  );
}

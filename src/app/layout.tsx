// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import CornerHomeHotspot from "@/components/CornerHomeHotspot";
import Analytics from "@/components/Analytics"; // optional (uses NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
import IntroSpotlight from "@/components/IntroSpotlight";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Siawsh — Interior, Graphic & Motion",
    template: "%s — Siawsh Studio",
  },
  description: "Minimal, future-modern design. Case studies, process, and updates.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    url: "/",
    siteName: "Siawsh Studio",
    title: "Siawsh — Interior, Graphic & Motion",
    description: "Minimal, future-modern design. Case studies, process, and updates.",
    images: ["/og.png"], // 1200×630 in /public/og.png
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siawsh — Interior, Graphic & Motion",
    description: "Minimal, future-modern design. Case studies, process, and updates.",
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="text-ink" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}>
        {/* Accessible skip link */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-3 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>

        <CornerHomeHotspot />
        <div id="content">{children}</div>
        <IntroSpotlight />
        <Cursor />
        <Analytics />
      </body>
    </html>
  );
}

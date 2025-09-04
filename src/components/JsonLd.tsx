// src/components/JsonLd.tsx
"use client";
import Script from "next/script";

export default function JsonLd() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sameAs = (process.env.NEXT_PUBLIC_SAME_AS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Siawsh Studio",
    url: site,
    logo: `${site}/logo-ss.png`,
    sameAs,
  };
  return (
    <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

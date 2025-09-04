"use client";

import Script from "next/script";

export default function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      {/* Cloudflare Turnstile injects a hidden input named cf-turnstile-response */}
      <div
        className="cf-turnstile mt-2"
        data-sitekey={siteKey}
        data-theme="auto"
        data-size="flexible"
      />
    </>
  );
}

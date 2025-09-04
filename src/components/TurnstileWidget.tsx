"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const bypassLocal = process.env.NEXT_PUBLIC_TURNSTILE_BYPASS_LOCAL === "1";
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (siteKey && !(bypassLocal && isLocal)) setShouldRender(true);
  }, [siteKey, bypassLocal]);

  if (!shouldRender) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile mt-2" data-sitekey={siteKey} data-theme="auto" data-size="flexible" />
      <noscript>
        <div className="text-xs text-red-600 mt-2">Please enable JavaScript to submit this form.</div>
      </noscript>
    </>
  );
}

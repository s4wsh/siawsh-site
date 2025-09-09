// next.config.ts
import type { NextConfig } from "next";

const PROD = process.env.NODE_ENV === "production";

const FIREBASE_MEDIA = [
  "https://firebasestorage.googleapis.com",
  "https://storage.googleapis.com",
].join(" ");

const ASSETS_BASE =
  process.env.NEXT_PUBLIC_ASSETS_BASE_URL || process.env.ASSETS_BASE_URL || "";
let ASSETS_ORIGIN = "";
try {
  if (ASSETS_BASE) ASSETS_ORIGIN = new URL(ASSETS_BASE).origin;
} catch { /* ignore */ }

const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `style-src 'self' 'unsafe-inline'`,
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io${PROD ? "" : " 'unsafe-eval'"}`,
  `img-src 'self' data: blob: https: ${ASSETS_ORIGIN}`,
  `media-src 'self' data: blob: ${FIREBASE_MEDIA} ${ASSETS_ORIGIN}`,
  `font-src 'self' data:`,
  `connect-src 'self' https: ws:`,
  `frame-src 'self' https://challenges.cloudflare.com`,
  `frame-ancestors 'none'`,
  `worker-src 'self' blob:`,
  `form-action 'self'`,
  ...(PROD ? [`upgrade-insecure-requests`] : []),
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },

  // SSR build (recommended for this app)

  // Applies only when a Next server is running (dev/SSR). For Netlify static,
  // mirror these in /public/_headers as well.
  async headers() {
    return [
      {
        source: "/((?!_next/).*)",
        headers: [
          ...(PROD
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
            : []),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;

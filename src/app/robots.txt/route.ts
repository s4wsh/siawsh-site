// src/app/robots.txt/route.ts
export const dynamic = 'force-static';
export const revalidate = false;
export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: https://siawsh.netlify.app/sitemap.xml`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}

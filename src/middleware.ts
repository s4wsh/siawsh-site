import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic auth gate for /admin (optional; enabled when creds are set)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;
  if (!user || !pass) return NextResponse.next(); // no creds configured -> allow, API still token-gated

  const header = req.headers.get("authorization") || "";
  const [scheme, value] = header.split(" ");
  if (scheme !== "Basic" || !value) {
    return new Response("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  try {
    const [u, p] = atob(value).split(":");
    if (u === user && p === pass) return NextResponse.next();
  } catch {}

  return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin"' } });
}

export const config = {
  matcher: ["/admin"],
};


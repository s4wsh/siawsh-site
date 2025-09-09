// src/app/api/contact/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ---- error helper
function errMsg(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}

// --- tiny in-memory rate limiter (per-IP, 10 req / 5 min) ---
const BUCKET = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 5 * 60 * 1000;

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "127.0.0.1").trim();
}
function rateLimit(ip: string) {
  const now = Date.now();
  const rec = BUCKET.get(ip);
  if (!rec || now > rec.resetAt) {
    BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count++;
  return rec.count > LIMIT;
}

function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}
async function verifyTurnstile(token: string | null, ip: string) {
  if (
    process.env.TURNSTILE_BYPASS_LOCAL === "1" &&
    (process.env.NEXT_PUBLIC_SITE_URL || "").includes("localhost")
  ) return true;

  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY!;
  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(6000),
    });
    const data = (await resp.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

function mask(s: string | undefined | null) {
  if (!s) return "(empty)";
  return `${s[0]}***${s.slice(-1)}`;
}

// Robust transporter (trims creds, forces SNI, allows AUTH LOGIN)
function makeTransport(opts?: { force465?: boolean; authMethod?: "LOGIN" | "PLAIN" }) {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = opts?.force465 ? 465 : Number(process.env.SMTP_PORT || 587);
  const secure = !!opts?.force465; // 587 uses STARTTLS
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: (process.env.SMTP_USER || "").trim(),
      pass: (process.env.SMTP_PASS || "").trim(),
    },
    authMethod: opts?.authMethod || "LOGIN",
    tls: { servername: "smtp.gmail.com" },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  } as any);
}

export async function POST(req: Request) {
  try {
    const DEV = process.env.NODE_ENV !== "production";
    const ip = getIp(req);
    if (rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Too many requests. Try again later." }, { status: 429 });
    }

    const form = await req.formData();
    if ((form.get("company") as string | null)?.trim()) {
      return NextResponse.json({ ok: true }, { status: 200 }); // honeypot
    }
    const name = (form.get("name") as string || "").trim();
    const email = (form.get("email") as string || "").trim();
    const message = (form.get("message") as string || "").trim();
    const cfToken = (form.get("cf-turnstile-response") as string) || null;

    if (!name || !isEmail(email) || !message) {
      return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });
    }

    const ok = await verifyTurnstile(cfToken, ip);
    if (!ok) return NextResponse.json({ ok: false, error: "Failed verification" }, { status: 400 });

    const SMTP_HOST = process.env.SMTP_HOST?.trim();
    const SMTP_USER = process.env.SMTP_USER?.trim();
    const SMTP_PASS = process.env.SMTP_PASS?.trim();
    const SMTP_FROM = process.env.SMTP_FROM;
    const CONTACT_TO = process.env.CONTACT_TO;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !CONTACT_TO) {
      const missing = [
        ["SMTP_HOST", SMTP_HOST],
        ["SMTP_USER", SMTP_USER],
        ["SMTP_PASS", SMTP_PASS],
        ["SMTP_FROM", SMTP_FROM],
        ["CONTACT_TO", CONTACT_TO],
      ].filter(([, v]) => !v).map(([k]) => k).join(", ");
      return NextResponse.json(
        { ok: false, error: DEV ? `Missing env: ${missing}` : "Server config error" },
        { status: 500 }
      );
    }

    // Dev-only debug removed: do not hard-fail on password mismatch

    // Try 587/LOGIN, then 465/LOGIN. Send directly (skip verify()).
    let transporter = makeTransport({ authMethod: "LOGIN" });
    async function safeSend(t = transporter) {
      return t.sendMail({
        from: SMTP_FROM,                 // must be the Gmail or verified alias
        to: CONTACT_TO!,
        replyTo: `${name} <${email}>`,
        subject: `New inquiry from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    }

    try {
      await safeSend(transporter);
    } catch (e587: unknown) {
      try {
        const t465 = makeTransport({ force465: true, authMethod: "LOGIN" });
        await safeSend(t465);
        transporter = t465;
      } catch (e465: unknown) {
        return NextResponse.json(
          {
            ok: false,
            error: DEV
              ? `Send failed on 587/LOGIN and 465/LOGIN: ${errMsg(e465)}`
              : "Mail service unavailable",
            envSeen: DEV ? {
              HOST: SMTP_HOST,
              USER: `${mask(SMTP_USER)} (len=${SMTP_USER.length})`,
              PASS_LEN: SMTP_PASS.length,
              FROM: SMTP_FROM,
              TO: CONTACT_TO,
            } : undefined,
          },
          { status: 502 }
        );
      }
    }

    if (process.env.CONTACT_AUTOREPLY === "1") {
      try {
        await transporter.sendMail({
          from: SMTP_FROM,
          to: `${name} <${email}>`,
          subject: "Thanks — we got your message",
          text:
            `Hi ${name},\n\n` +
            `Thanks for reaching out. We received your message and will get back to you within 1–2 days.\n\n` +
            `— Siawsh Studio\n${process.env.NEXT_PUBLIC_SITE_URL || ""}\n`,
        });
      } catch (e: unknown) {
        console.warn("auto-reply failed", errMsg(e));
      }
    }

    return NextResponse.redirect(new URL("/contact/thanks", req.url), { status: 303 });
  } catch (err: unknown) {
    const DEV = process.env.NODE_ENV !== "production";
    return NextResponse.json({ ok: false, error: DEV ? errMsg(err) : "Server error" }, { status: 500 });
  }
}

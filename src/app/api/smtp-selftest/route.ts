// app/api/smtp-selftest/route.ts
export const runtime = 'nodejs';
import nodemailer from 'nodemailer';

export async function GET() {
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 587);

  // mask values
  const mask = (s: string) => (s ? s[0] + '***' + s.slice(-1) : '(empty)');

  if (!user || !pass) {
    return new Response(
      JSON.stringify({
        ok: false,
        reason: 'Missing env',
        SMTP_USER: mask(user),
        SMTP_PASS_LEN: pass.length,
      }),
      { status: 500 }
    );
  }

  try {
    const t = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await t.verify();
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || `Siawsh Site <${user}>`,
      to: process.env.CONTACT_TO || user,
      subject: 'SMTP SELFTEST OK',
      text: 'This is a self-test from /api/smtp-selftest.',
    });

    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }));
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: e?.message || String(e),
        envSeen: {
          SMTP_USER: mask(user),
          SMTP_PASS_LEN: pass.length,
          HOST: host,
          PORT: port,
        },
      }),
      { status: 500 }
    );
  }
}

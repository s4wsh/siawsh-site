export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const ok = (req.headers.get("x-admin-token") || "") === process.env.ADMIN_TOKEN;
  if (!ok) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  return NextResponse.json({ ok:true, env:"selftest" });
}

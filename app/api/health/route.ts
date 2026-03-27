import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ai-content-engine",
    timestamp: new Date().toISOString(),
  });
}

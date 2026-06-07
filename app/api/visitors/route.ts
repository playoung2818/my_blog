import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_PATTERN =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless|preview/i;

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const salt = process.env.VISITOR_HASH_SALT;
  const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!ip || !salt || !databaseUrl) {
    return NextResponse.json(
      { count: null, error: "Visitor counter is not configured" },
      { status: 503 },
    );
  }

  try {
    const sql = neon(databaseUrl);
    const visitorHash = createHmac("sha256", salt).update(ip).digest("hex");

    await sql`
      CREATE TABLE IF NOT EXISTS unique_visitors (
        visitor_hash TEXT PRIMARY KEY,
        first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    if (!BOT_PATTERN.test(userAgent)) {
      await sql`
        INSERT INTO unique_visitors (visitor_hash)
        VALUES (${visitorHash})
        ON CONFLICT (visitor_hash) DO NOTHING
      `;
    }

    const rows = await sql`SELECT COUNT(*)::int AS count FROM unique_visitors`;
    const count = rows[0]?.count;

    if (typeof count !== "number") throw new Error("Visitor count was unavailable");

    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Unable to update visitor count", error);
    return NextResponse.json(
      { count: null, error: "Visitor count is temporarily unavailable" },
      { status: 502 },
    );
  }
}

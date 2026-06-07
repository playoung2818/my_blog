import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VISITOR_SET_KEY = "zyuan.org:unique-visitors:v1";
const BOT_PATTERN =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headless|preview/i;

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}

async function runRedisPipeline(commands: string[][]) {
  const config = getRedisConfig();

  if (!config) {
    throw new Error("Visitor counter storage is not configured");
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Visitor counter storage returned ${response.status}`);
  }

  return (await response.json()) as Array<{ result?: number; error?: string }>;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const salt = process.env.VISITOR_HASH_SALT;
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!ip || !salt || !getRedisConfig()) {
    return NextResponse.json(
      { count: null, error: "Visitor counter is not configured" },
      { status: 503 },
    );
  }

  try {
    const visitorHash = createHmac("sha256", salt).update(ip).digest("hex");
    const commands = BOT_PATTERN.test(userAgent)
      ? [["SCARD", VISITOR_SET_KEY]]
      : [
          ["SADD", VISITOR_SET_KEY, visitorHash],
          ["SCARD", VISITOR_SET_KEY],
        ];
    const results = await runRedisPipeline(commands);
    const count = results.at(-1)?.result;

    if (typeof count !== "number") {
      throw new Error(results.at(-1)?.error ?? "Visitor count was unavailable");
    }

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

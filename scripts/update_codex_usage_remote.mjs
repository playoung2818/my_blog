#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";

const DEFAULT_BASE_URL = "https://chatgpt.com/backend-api";
const CHATGPT_USAGE_PATH = "/wham/usage";
const CODEX_USAGE_PATH = "/api/codex/usage";
const DEFAULT_OUTPUT = path.join(process.cwd(), "data", "codex-usage-remote.json");

async function main() {
  const outputPath = resolveOutputPath(process.argv.slice(2));
  const config = loadConfig(process.env);
  const raw = await fetchUsage(config);
  const payload = normalizeUsage(raw, config);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
}

function resolveOutputPath(argv) {
  const outputFlagIndex = argv.indexOf("--output");
  if (outputFlagIndex >= 0 && argv[outputFlagIndex + 1]) {
    return path.resolve(process.cwd(), argv[outputFlagIndex + 1]);
  }
  return DEFAULT_OUTPUT;
}

function loadConfig(env) {
  const authFile = loadCodexAuthFile(env);
  const accessToken = trimToNull(env.CODEX_OAUTH_ACCESS_TOKEN) ?? authFile?.accessToken;
  if (!accessToken) {
    throw new Error(
      "Missing Codex OAuth credentials. Run `codex login` first or set CODEX_OAUTH_ACCESS_TOKEN."
    );
  }

  const accountId = trimToNull(env.CODEX_OAUTH_ACCOUNT_ID) ?? authFile?.accountId ?? null;
  const idToken = trimToNull(env.CODEX_OAUTH_ID_TOKEN) ?? authFile?.idToken ?? null;
  const baseURL = normalizeChatGPTBaseURL(trimToNull(env.CODEX_CHATGPT_BASE_URL) ?? DEFAULT_BASE_URL);
  const pathName = baseURL.includes("/backend-api") ? CHATGPT_USAGE_PATH : CODEX_USAGE_PATH;

  return {
    accessToken,
    accountId,
    idToken,
    endpoint: new URL(`${baseURL}${pathName}`).toString(),
    source: trimToNull(env.CODEX_OAUTH_ACCESS_TOKEN) ? "env" : authFile ? "auth.json" : "unknown",
  };
}

async function fetchUsage(config) {
  const response = await fetch(config.endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.accessToken}`,
      "User-Agent": "my_blog/static-codex-snapshot",
      ...(config.accountId ? { "ChatGPT-Account-Id": config.accountId } : {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Codex usage request failed with status ${response.status}: ${body}`);
  }

  return response.json();
}

function normalizeUsage(raw, config) {
  return {
    meta: {
      source: "codex-oauth",
      fetched_at: new Date().toISOString(),
      endpoint: config.endpoint,
      credential_source: config.source,
    },
    account: {
      email: parseEmailFromJwt(config.idToken),
      account_id: config.accountId,
    },
    usage: {
      plan_type: trimToNull(raw?.plan_type),
      primary_window: normalizeRateWindow(raw?.rate_limit?.primary_window),
      secondary_window: normalizeRateWindow(raw?.rate_limit?.secondary_window),
      credits: normalizeCredits(raw?.credits),
    },
    raw,
  };
}

function loadCodexAuthFile(env) {
  const codexHome = trimToNull(env.CODEX_HOME) ?? path.join(os.homedir(), ".codex");
  const authPath = path.join(codexHome, "auth.json");
  if (!fs.existsSync(authPath)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(authPath, "utf8"));
    const tokens = parsed?.tokens ?? {};
    return {
      accessToken: trimToNull(tokens.access_token),
      refreshToken: trimToNull(tokens.refresh_token),
      idToken: trimToNull(tokens.id_token),
      accountId: trimToNull(tokens.account_id),
    };
  } catch {
    return null;
  }
}

function normalizeRateWindow(window) {
  if (!window) return null;
  const usedPercent = clampPercent(Number(window.used_percent ?? 0));
  const resetAtUnix = Number(window.reset_at ?? 0);
  const limitWindowSeconds = Number(window.limit_window_seconds ?? 0);

  return {
    used_percent: usedPercent,
    remaining_percent: Math.max(0, 100 - usedPercent),
    reset_at: resetAtUnix > 0 ? new Date(resetAtUnix * 1000).toISOString() : new Date(0).toISOString(),
    reset_at_unix: resetAtUnix,
    limit_window_seconds: limitWindowSeconds,
    limit_window_minutes: Math.floor(limitWindowSeconds / 60),
  };
}

function normalizeCredits(credits) {
  if (!credits) return null;
  return {
    has_credits: Boolean(credits.has_credits),
    unlimited: Boolean(credits.unlimited),
    balance: parseBalance(credits.balance),
  };
}

function parseBalance(balance) {
  if (typeof balance === "number" && Number.isFinite(balance)) return balance;
  if (typeof balance === "string") {
    const parsed = Number(balance);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseEmailFromJwt(token) {
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload !== "object") return null;

  const email = trimToNull(payload.email);
  if (email) return email;

  const profile = payload["https://api.openai.com/profile"];
  if (profile && typeof profile === "object" && !Array.isArray(profile)) {
    return trimToNull(profile.email);
  }

  return null;
}

function parseJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function normalizeChatGPTBaseURL(value) {
  let normalized = value.trim();
  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  if (
    (normalized.startsWith("https://chatgpt.com") || normalized.startsWith("https://chat.openai.com")) &&
    !normalized.includes("/backend-api")
  ) {
    normalized = `${normalized}/backend-api`;
  }

  return normalized;
}

function trimToNull(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

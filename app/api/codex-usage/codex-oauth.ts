type CodexUsageResponse = {
  plan_type?: string;
  rate_limit?: {
    primary_window?: {
      used_percent?: number;
      reset_at?: number;
      limit_window_seconds?: number;
    };
    secondary_window?: {
      used_percent?: number;
      reset_at?: number;
      limit_window_seconds?: number;
    };
  };
  credits?: {
    has_credits?: boolean;
    unlimited?: boolean;
    balance?: number | string | null;
  };
};

type RateWindowSnapshot = {
  used_percent?: number;
  reset_at?: number;
  limit_window_seconds?: number;
};

export type CodexUsageEnvelope = {
  meta: {
    source: "codex-oauth";
    fetched_at: string;
    endpoint: string;
  };
  account: {
    email: string | null;
    account_id: string | null;
  };
  usage: {
    plan_type: string | null;
    primary_window: NormalizedRateWindow | null;
    secondary_window: NormalizedRateWindow | null;
    credits: {
      has_credits: boolean;
      unlimited: boolean;
      balance: number | null;
    } | null;
  };
  raw: CodexUsageResponse;
};

type NormalizedRateWindow = {
  used_percent: number;
  remaining_percent: number;
  reset_at: string;
  reset_at_unix: number;
  limit_window_seconds: number;
  limit_window_minutes: number;
};

type CodexOAuthConfig = {
  accessToken: string;
  accountId: string | null;
  idToken: string | null;
  endpoint: URL;
};

export class CodexOAuthConfigError extends Error {}

export class CodexOAuthFetchError extends Error {
  status: number;
  body: string | null;

  constructor(status: number, body: string | null) {
    super(`Codex OAuth usage request failed with status ${status}`);
    this.name = "CodexOAuthFetchError";
    this.status = status;
    this.body = body;
  }
}

const DEFAULT_BASE_URL = "https://chatgpt.com/backend-api";
const CHATGPT_USAGE_PATH = "/wham/usage";
const CODEX_USAGE_PATH = "/api/codex/usage";

export function loadCodexOAuthConfig(env: NodeJS.ProcessEnv = process.env): CodexOAuthConfig {
  const accessToken = env.CODEX_OAUTH_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new CodexOAuthConfigError(
      "Missing CODEX_OAUTH_ACCESS_TOKEN. Set a ChatGPT/Codex OAuth access token on the server."
    );
  }

  const accountId = emptyToNull(env.CODEX_OAUTH_ACCOUNT_ID);
  const idToken = emptyToNull(env.CODEX_OAUTH_ID_TOKEN);
  const baseURL = normalizeChatGPTBaseURL(emptyToNull(env.CODEX_CHATGPT_BASE_URL) ?? DEFAULT_BASE_URL);
  const path = baseURL.includes("/backend-api") ? CHATGPT_USAGE_PATH : CODEX_USAGE_PATH;
  const endpoint = new URL(`${baseURL}${path}`);

  return {
    accessToken,
    accountId,
    idToken,
    endpoint,
  };
}

export async function fetchCodexOAuthUsage(
  config: CodexOAuthConfig,
  fetchImpl: typeof fetch = fetch
): Promise<CodexUsageEnvelope> {
  const response = await fetchImpl(config.endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.accessToken}`,
      "User-Agent": "my_blog/nextjs-codex-usage",
      ...(config.accountId ? { "ChatGPT-Account-Id": config.accountId } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let body: string | null = null;
    try {
      body = await response.text();
    } catch {
      body = null;
    }
    throw new CodexOAuthFetchError(response.status, body);
  }

  const raw = (await response.json()) as CodexUsageResponse;
  return normalizeCodexUsage(raw, config);
}

function normalizeCodexUsage(raw: CodexUsageResponse, config: CodexOAuthConfig): CodexUsageEnvelope {
  return {
    meta: {
      source: "codex-oauth",
      fetched_at: new Date().toISOString(),
      endpoint: config.endpoint.toString(),
    },
    account: {
      email: parseEmailFromJwt(config.idToken),
      account_id: config.accountId,
    },
    usage: {
      plan_type: emptyToNull(raw.plan_type) ?? null,
      primary_window: normalizeRateWindow(raw.rate_limit?.primary_window),
      secondary_window: normalizeRateWindow(raw.rate_limit?.secondary_window),
      credits: normalizeCredits(raw.credits),
    },
    raw,
  };
}

function normalizeRateWindow(window: RateWindowSnapshot | undefined): NormalizedRateWindow | null {
  if (!window) return null;
  const usedPercent = clampPercent(window.used_percent ?? 0);
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

function normalizeCredits(credits: CodexUsageResponse["credits"]): CodexUsageEnvelope["usage"]["credits"] {
  if (!credits) return null;
  return {
    has_credits: Boolean(credits.has_credits),
    unlimited: Boolean(credits.unlimited),
    balance: parseBalance(credits.balance),
  };
}

function parseBalance(balance: number | string | null | undefined): number | null {
  if (typeof balance === "number" && Number.isFinite(balance)) return balance;
  if (typeof balance === "string") {
    const parsed = Number(balance);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeChatGPTBaseURL(value: string): string {
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

function parseEmailFromJwt(token: string | null): string | null {
  if (!token) return null;
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload !== "object") return null;

  const email = asNonEmptyString(payload.email);
  if (email) return email;

  const profile = payload["https://api.openai.com/profile"];
  if (profile && typeof profile === "object" && !Array.isArray(profile)) {
    return asNonEmptyString((profile as Record<string, unknown>).email);
  }

  return null;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

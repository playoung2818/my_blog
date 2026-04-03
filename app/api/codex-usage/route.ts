import {
  CodexOAuthConfigError,
  CodexOAuthFetchError,
  fetchCodexOAuthUsage,
  loadCodexOAuthConfig,
} from "./codex-oauth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = loadCodexOAuthConfig();
    const payload = await fetchCodexOAuthUsage(config);
    return Response.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof CodexOAuthConfigError) {
      return Response.json(
        {
          error: error.message,
          hint: [
            "Set CODEX_OAUTH_ACCESS_TOKEN on the server.",
            "Optional: CODEX_OAUTH_ACCOUNT_ID, CODEX_OAUTH_ID_TOKEN, CODEX_CHATGPT_BASE_URL.",
          ].join(" "),
        },
        { status: 500 }
      );
    }

    if (error instanceof CodexOAuthFetchError) {
      return Response.json(
        {
          error: error.message,
          status: error.status,
          upstream_body: error.body,
        },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : "Internal error";
    return Response.json({ error: message }, { status: 500 });
  }
}

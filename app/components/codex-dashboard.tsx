import usageData from "@/data/codex-usage-remote.json";

type RateWindow = {
  used_percent: number;
  remaining_percent: number;
  reset_at: string;
  reset_at_unix: number;
  limit_window_seconds: number;
  limit_window_minutes: number;
};

type Credits = {
  has_credits: boolean;
  unlimited: boolean;
  balance: number | null;
};

type CodexUsageSnapshot = {
  meta: {
    source: string;
    fetched_at: string;
    endpoint: string;
  };
  account: {
    email: string | null;
    account_id: string | null;
  };
  usage: {
    plan_type: string | null;
    primary_window: RateWindow | null;
    secondary_window: RateWindow | null;
    credits: Credits | null;
  };
  raw: Record<string, unknown>;
};

const dataset = usageData as CodexUsageSnapshot;

const DASHBOARD_STYLES = `
.codex-section {
  display: grid;
  gap: 20px;
}

.codex-grid {
  display: grid;
  gap: 22px;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
  align-items: start;
}

.codex-panel {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 26px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.codex-panel h2,
.codex-panel h3 {
  margin: 0;
}

.codex-intro,
.codex-note,
.codex-kicker,
.codex-meta-value,
.codex-window-subtitle,
.codex-list-subtitle {
  color: var(--text-muted);
}

.codex-intro {
  margin: 0;
  line-height: 1.7;
  max-width: 64ch;
}

.codex-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}

.codex-kicker {
  margin: 0 0 6px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.codex-headline {
  display: grid;
  gap: 10px;
}

.codex-account-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.codex-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(241, 245, 249, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 13px;
}

.codex-chip strong {
  color: #0f172a;
}

.codex-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.codex-stat {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 148px;
  padding: 18px 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.codex-stat-label {
  display: block;
  color: #64748b;
  font-size: 11px;
  letter-spacing: 0.12em;
  line-height: 1.45;
  text-transform: uppercase;
}

.codex-stat-value {
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.codex-stat-hint {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.codex-window-grid {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

.codex-window-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.codex-window-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
}

.codex-window-title {
  font-size: 18px;
  font-weight: 600;
}

.codex-window-value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.codex-window-subtitle {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.6;
}

.codex-meter {
  position: relative;
  margin-top: 16px;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #dbe4ef;
}

.codex-meter-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #0f766e, #34d399);
}

.codex-meter-labels {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
}

.codex-side {
  display: grid;
  gap: 18px;
  align-content: start;
}

.codex-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.codex-list-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.24);
}

.codex-list-item:first-child {
  border-top: 0;
  padding-top: 0;
}

.codex-list-main {
  display: grid;
  gap: 4px;
}

.codex-list-title {
  font-weight: 600;
  font-size: 15px;
}

.codex-list-subtitle {
  font-size: 13px;
  line-height: 1.5;
}

.codex-list-value {
  font-weight: 700;
  font-size: 15px;
  text-align: right;
}

.codex-meta-grid {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.codex-meta-row {
  display: grid;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.24);
}

.codex-meta-row:first-child {
  border-top: 0;
  padding-top: 0;
}

.codex-meta-label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
}

.codex-meta-value {
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

@media (max-width: 980px) {
  .codex-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .codex-panel {
    padding: 22px;
  }

  .codex-stat {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .codex-summary {
    grid-template-columns: 1fr;
  }

  .codex-list-item,
  .codex-window-header {
    flex-direction: column;
    align-items: stretch;
  }

  .codex-list-value {
    text-align: left;
  }

  .codex-panel {
    padding: 18px;
  }
}
`;

function formatPercent(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return `${Math.round(value)}%`;
}

function formatPlan(value: string | null) {
  if (!value) return "Unknown";
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTimestamp(value: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatBalance(value: number | null, unlimited: boolean | undefined) {
  if (unlimited) return "Unlimited";
  if (typeof value !== "number" || Number.isNaN(value)) return "Unavailable";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAccountId(value: string | null) {
  if (!value) return "Not provided";
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function windowRows(primary: RateWindow | null, secondary: RateWindow | null) {
  return [
    { label: "Primary Window", window: primary },
    { label: "Secondary Window", window: secondary },
  ].filter((item) => item.window);
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="codex-stat">
      <span className="codex-stat-label">{label}</span>
      <div className="codex-stat-value">{value}</div>
      <div className="codex-stat-hint">{hint}</div>
    </div>
  );
}

export function CodexDashboard() {
  const { meta, account, usage } = dataset;
  const windows = windowRows(usage.primary_window, usage.secondary_window);

  return (
    <section className="codex-section">
      <style dangerouslySetInnerHTML={{ __html: DASHBOARD_STYLES }} />
      <div className="section-header">Codex Dashboard</div>
      <p className="codex-intro">
        A static snapshot of Codex cloud usage pulled from the ChatGPT/Codex OAuth endpoint during
        the site build. This page shows the actual remote plan, rate-limit windows, and credits
        signal the upstream endpoint exposes.
      </p>
      <p className="codex-note">
        Source: {meta.source}. Snapshot refreshed: {formatTimestamp(meta.fetched_at)}.
      </p>

      <section className="codex-grid">
        <div className="codex-panel">
          <div className="codex-headline">
            <p className="codex-kicker">Remote Snapshot</p>
            <h2>{formatPlan(usage.plan_type)} Plan</h2>
            <div className="codex-account-row">
              <span className="codex-chip">
                Account <strong>{account.email ?? "Unknown"}</strong>
              </span>
              <span className="codex-chip">
                Credits{" "}
                <strong>{formatBalance(usage.credits?.balance ?? null, usage.credits?.unlimited)}</strong>
              </span>
            </div>
          </div>

          <div className="codex-summary">
            <SummaryCard
              label="Primary Used"
              value={formatPercent(usage.primary_window?.used_percent)}
              hint={
                usage.primary_window
                  ? `Resets ${formatTimestamp(usage.primary_window.reset_at)}`
                  : "Primary window not returned"
              }
            />
            <SummaryCard
              label="Secondary Used"
              value={formatPercent(usage.secondary_window?.used_percent)}
              hint={
                usage.secondary_window
                  ? `Resets ${formatTimestamp(usage.secondary_window.reset_at)}`
                  : "Secondary window not returned"
              }
            />
            <SummaryCard
              label="Credits Balance"
              value={formatBalance(usage.credits?.balance ?? null, usage.credits?.unlimited)}
              hint={
                usage.credits?.unlimited
                  ? "Upstream reports unlimited credits"
                  : usage.credits?.has_credits
                    ? "Credit balance returned by upstream"
                    : "No credit balance reported"
              }
            />
            <SummaryCard
              label="Account Id"
              value={formatAccountId(account.account_id)}
              hint="Useful when you scope usage to a ChatGPT account"
            />
          </div>

          <div className="codex-window-grid">
            {windows.length > 0 ? (
              windows.map((item) => (
                <div key={item.label} className="codex-window-card">
                  <div className="codex-window-header">
                    <div className="codex-window-title">{item.label}</div>
                    <div className="codex-window-value">
                      {formatPercent(item.window?.used_percent)} used
                    </div>
                  </div>
                  <div className="codex-window-subtitle">
                    {item.window?.limit_window_minutes} minute window. Resets{" "}
                    {formatTimestamp(item.window?.reset_at ?? null)}.
                  </div>
                  <div className="codex-meter" aria-hidden="true">
                    <div
                      className="codex-meter-fill"
                      style={{ width: `${item.window?.used_percent ?? 0}%` }}
                    />
                  </div>
                  <div className="codex-meter-labels">
                    <span>{formatPercent(item.window?.remaining_percent)} remaining</span>
                    <span>{item.window?.limit_window_seconds ?? 0} sec</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="codex-window-card">
                <div className="codex-window-title">No rate-limit windows returned</div>
                <div className="codex-window-subtitle">
                  The OAuth endpoint responded without primary or secondary rate-limit data.
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="codex-side">
          <div className="codex-panel">
            <h3>Snapshot Details</h3>
            <div className="codex-list">
              <div className="codex-list-item">
                <div className="codex-list-main">
                  <div className="codex-list-title">Plan</div>
                  <div className="codex-list-subtitle">Reported by the remote Codex usage API</div>
                </div>
                <div className="codex-list-value">{formatPlan(usage.plan_type)}</div>
              </div>
              <div className="codex-list-item">
                <div className="codex-list-main">
                  <div className="codex-list-title">Signed-in Email</div>
                  <div className="codex-list-subtitle">
                    Derived from the optional ID token snapshot
                  </div>
                </div>
                <div className="codex-list-value">{account.email ?? "Unavailable"}</div>
              </div>
              <div className="codex-list-item">
                <div className="codex-list-main">
                  <div className="codex-list-title">Credits Mode</div>
                  <div className="codex-list-subtitle">
                    How the upstream endpoint describes your credit state
                  </div>
                </div>
                <div className="codex-list-value">
                  {usage.credits?.unlimited
                    ? "Unlimited"
                    : usage.credits?.has_credits
                      ? "Metered"
                      : "Not reported"}
                </div>
              </div>
            </div>
          </div>

          <div className="codex-panel">
            <h3>Endpoint Diagnostics</h3>
            <div className="codex-meta-grid">
              <div className="codex-meta-row">
                <div className="codex-meta-label">Endpoint</div>
                <div className="codex-meta-value">{meta.endpoint}</div>
              </div>
              <div className="codex-meta-row">
                <div className="codex-meta-label">Fetch Timestamp</div>
                <div className="codex-meta-value">{formatTimestamp(meta.fetched_at)}</div>
              </div>
              <div className="codex-meta-row">
                <div className="codex-meta-label">Design Note</div>
                <div className="codex-meta-value">
                  This static page no longer pretends it has local prompt/session history. It only
                  renders what the remote Codex endpoint actually returns.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}

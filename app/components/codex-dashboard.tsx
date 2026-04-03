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
  grid-template-columns: minmax(0, 1fr);
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
  display: none;
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
}

@media (max-width: 560px) {
  .codex-window-header {
    flex-direction: column;
    align-items: stretch;
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

function windowRows(primary: RateWindow | null, secondary: RateWindow | null) {
  return [
    { label: "Primary Window", window: primary },
    { label: "Secondary Window", window: secondary },
  ].filter((item) => item.window);
}

export function CodexDashboard() {
  const { meta, usage } = dataset;
  const windows = windowRows(usage.primary_window, usage.secondary_window);

  return (
    <section className="codex-section">
      <style dangerouslySetInnerHTML={{ __html: DASHBOARD_STYLES }} />
      <div className="section-header">Codex Dashboard</div>
      <p className="codex-intro">
        A static snapshot of Codex cloud usage pulled from the ChatGPT/Codex OAuth endpoint during
        the site build. The two cards below are the current Codex usage windows returned by the
        upstream service.
      </p>
      <p className="codex-note">
        Source: {meta.source}. Snapshot refreshed: {formatTimestamp(meta.fetched_at)}.
      </p>

      <section className="codex-grid">
        <div className="codex-panel">
          <div className="codex-headline">
            <p className="codex-kicker">Remote Snapshot</p>
            <h2>{formatPlan(usage.plan_type)} Codex Usage Windows</h2>
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
      </section>
    </section>
  );
}

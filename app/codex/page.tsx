import Link from "next/link";
import usageData from "@/data/codex-usage.json";

export const metadata = {
  title: "Codex Usage | Zheyuan Chen",
  description: "A GitHub-style contribution board for my daily Codex usage.",
};

type UsageDay = {
  date: string;
  prompts: number;
  sessions: number;
  commands: number;
  active_minutes: number;
};

type UsageMonth = {
  label: string;
  prompts: number;
  sessions: number;
  commands: number;
  active_minutes: number;
};

type UsageYear = {
  summary: {
    total_prompts: number;
    total_sessions: number;
    total_commands: number;
    total_active_minutes: number;
  };
  months: UsageMonth[];
  days: UsageDay[];
};

type UsageDataset = {
  meta: {
    generated_at: string;
    timezone: string;
  };
  available_years: number[];
  years: Record<string, UsageYear>;
};

const dataset = usageData as UsageDataset;

const PAGE_STYLES = `
.codex-page {
  display: grid;
  gap: 24px;
}

.codex-hero {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(145deg, #0f1426, #0b1020);
  border: 1px solid #1d2542;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
}

.codex-kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-green);
}

.codex-lede {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
  max-width: 62ch;
}

.codex-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
}

.codex-panel {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  padding: 22px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.codex-panel h2,
.codex-panel h3 {
  margin: 0;
}

.codex-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.codex-stat {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.codex-stat-label {
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.codex-stat-value {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.05em;
}

.codex-heatmap-wrap {
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.codex-months {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 16px;
  gap: 6px;
  min-width: max-content;
  margin-left: 28px;
  margin-bottom: 8px;
}

.codex-months span {
  color: #64748b;
  font-size: 12px;
  white-space: nowrap;
}

.codex-heatmap-row {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  min-width: max-content;
}

.codex-weekday-labels {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  gap: 6px;
  width: 22px;
}

.codex-weekday-labels span {
  color: #94a3b8;
  font-size: 11px;
  line-height: 14px;
}

.codex-weeks {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 14px;
  gap: 6px;
}

.codex-week {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  gap: 6px;
}

.codex-cell {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: #e2e8f0;
}

.codex-cell.level-1 { background: #c7f9cc; }
.codex-cell.level-2 { background: #7dd3a7; }
.codex-cell.level-3 { background: #2db67c; }
.codex-cell.level-4 { background: #0b6e4f; }

.codex-legend {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
}

.codex-legend-swatches {
  display: flex;
  gap: 4px;
}

.codex-legend-swatches span {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(15, 23, 42, 0.06);
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
  gap: 12px;
  padding-top: 12px;
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
}

.codex-list-subtitle {
  color: #64748b;
  font-size: 13px;
}

.codex-list-value {
  font-weight: 700;
  white-space: nowrap;
}

.codex-note {
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 980px) {
  .codex-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .codex-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .codex-summary {
    grid-template-columns: 1fr;
  }

  .codex-panel,
  .codex-hero {
    padding: 18px;
  }
}
`;

function parseDateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function dayOfWeek(value: string) {
  const { year, month, day } = parseDateParts(value);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function buildCalendar(year: number, activeDays: UsageDay[]) {
  const map = new Map(activeDays.map((day) => [day.date, day]));
  const first = `${year}-01-01`;
  const last = `${year}-12-31`;
  const firstDate = new Date(Date.UTC(year, 0, 1));
  const lastDate = new Date(Date.UTC(year, 11, 31));
  const start = new Date(firstDate);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = new Date(lastDate);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const days: UsageDay[] = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const iso = cursor.toISOString().slice(0, 10);
    days.push(map.get(iso) ?? { date: iso, prompts: 0, sessions: 0, commands: 0, active_minutes: 0 });
  }

  const weeks: UsageDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabels = new Map<number, string>();
  weeks.forEach((week, index) => {
    const firstActive = week.find((day) => day.date >= first && day.date <= last);
    if (!firstActive) return;
    const month = parseDateParts(firstActive.date).month - 1;
    if (!monthLabels.has(month)) {
      monthLabels.set(month, `${index}:${new Date(Date.UTC(year, month, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" })}`);
    }
  });

  return { weeks, monthLabels };
}

function levelFor(value: number, max: number) {
  if (value <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = value / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMinutes(value: number) {
  return `${formatNumber(value)} min`;
}

function topDays(days: UsageDay[]) {
  return [...days]
    .sort((a, b) => b.prompts - a.prompts || b.active_minutes - a.active_minutes)
    .slice(0, 6);
}

export default function CodexPage() {
  const years = [...dataset.available_years].sort((a, b) => b - a);

  return (
    <div className="page-shell center-shell stacked">
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
      <div className="codex-page">
        <header className="header-nav">
          <span className="site-name">Codex Usage</span>
          <div className="nav-links">
            <Link href="/">home</Link>
          </div>
        </header>

        <section className="codex-hero">
          <span className="codex-kicker">Daily machine habit</span>
          <h1 className="headline compact">A contribution board for how I use Codex.</h1>
          <p className="codex-lede">
            This page is generated from my local Codex history and committed into the blog as a static snapshot.
            It tracks prompts, sessions, terminal commands, and estimated active minutes.
          </p>
          <p className="codex-note">
            Snapshot timezone: {dataset.meta.timezone}. Last refreshed: {dataset.meta.generated_at}.
          </p>
        </section>

        {years.map((year) => {
          const yearData = dataset.years[String(year)];
          const maxPrompts = Math.max(...yearData.days.map((day) => day.prompts), 0);
          const { weeks, monthLabels } = buildCalendar(year, yearData.days);

          return (
            <section key={year} className="codex-grid">
              <div className="codex-panel">
                <div className="section-header" style={{ marginTop: 0 }}>Contribution Calendar</div>
                <h2>{year}</h2>
                <div className="codex-summary">
                  <div className="codex-stat">
                    <span className="codex-stat-label">Prompts</span>
                    <div className="codex-stat-value">{formatNumber(yearData.summary.total_prompts)}</div>
                  </div>
                  <div className="codex-stat">
                    <span className="codex-stat-label">Sessions</span>
                    <div className="codex-stat-value">{formatNumber(yearData.summary.total_sessions)}</div>
                  </div>
                  <div className="codex-stat">
                    <span className="codex-stat-label">Commands</span>
                    <div className="codex-stat-value">{formatNumber(yearData.summary.total_commands)}</div>
                  </div>
                  <div className="codex-stat">
                    <span className="codex-stat-label">Active Time</span>
                    <div className="codex-stat-value">{formatMinutes(yearData.summary.total_active_minutes)}</div>
                  </div>
                </div>

                <div className="codex-heatmap-wrap">
                  <div className="codex-months">
                    {Array.from(monthLabels.values()).map((entry) => {
                      const [column, label] = entry.split(":");
                      return (
                        <span key={entry} style={{ gridColumn: String(Number(column) + 1) }}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="codex-heatmap-row">
                    <div className="codex-weekday-labels" aria-hidden="true">
                      <span></span>
                      <span>Mon</span>
                      <span></span>
                      <span>Wed</span>
                      <span></span>
                      <span>Fri</span>
                      <span></span>
                    </div>
                    <div className="codex-weeks">
                      {weeks.map((week, weekIndex) => (
                        <div key={`${year}-week-${weekIndex}`} className="codex-week">
                          {week.map((day) => {
                            const level = levelFor(day.prompts, maxPrompts);
                            const isCurrentYear = day.date.startsWith(String(year));
                            const title = `${day.date}: ${day.prompts} prompts, ${day.sessions} sessions, ${day.commands} commands, ${day.active_minutes} active min`;
                            return (
                              <div
                                key={day.date}
                                className={`codex-cell level-${isCurrentYear ? level : 0}`}
                                title={title}
                                style={isCurrentYear ? undefined : { opacity: 0.35 }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="codex-legend">
                  <span>Less</span>
                  <div className="codex-legend-swatches">
                    <span className="codex-cell level-0" />
                    <span className="codex-cell level-1" />
                    <span className="codex-cell level-2" />
                    <span className="codex-cell level-3" />
                    <span className="codex-cell level-4" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              <aside className="codex-side">
                <div className="codex-panel">
                  <h3>Strongest Days</h3>
                  <div className="codex-list">
                    {topDays(yearData.days).map((day) => (
                      <div key={day.date} className="codex-list-item">
                        <div className="codex-list-main">
                          <div className="codex-list-title">{day.date}</div>
                          <div className="codex-list-subtitle">
                            {formatNumber(day.sessions)} sessions, {formatNumber(day.commands)} commands
                          </div>
                        </div>
                        <div className="codex-list-value">{formatNumber(day.prompts)} prompts</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="codex-panel">
                  <h3>Monthly Rhythm</h3>
                  <div className="codex-list">
                    {yearData.months.map((month) => (
                      <div key={month.label} className="codex-list-item">
                        <div className="codex-list-main">
                          <div className="codex-list-title">{month.label}</div>
                          <div className="codex-list-subtitle">
                            {formatNumber(month.sessions)} sessions, {formatMinutes(month.active_minutes)}
                          </div>
                        </div>
                        <div className="codex-list-value">{formatNumber(month.prompts)} prompts</div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          );
        })}
      </div>
    </div>
  );
}

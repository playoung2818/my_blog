import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Code | Zheyuan Chen",
  description: "Public projects pulled from Zheyuan Chen's GitHub profile.",
};

export const revalidate = 3600;

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  default_branch: string;
  archived: boolean;
  topics: string[];
};

const languageColors: Record<string, string> = {
  Python: "#3572a5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#da5b0b",
  HTML: "#e34c26",
  CSS: "#663399",
  Swift: "#f05138",
};

async function getRepositories(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      "https://api.github.com/users/playoung2818/repos?sort=updated&per_page=100",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) return [];

    const repositories = (await response.json()) as GitHubRepo[];
    return repositories.filter((repository) => !repository.archived);
  } catch {
    return [];
  }
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="code-github-mark">
      <path
        fill="currentColor"
        d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.95 10.95 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  );
}

export default async function CodePage() {
  const repositories = await getRepositories();

  return (
    <main className="code-page-shell">
      <header className="code-topbar">
        <Link href="/" className="code-brand">
          <span className="code-brand-mark">ZC</span>
          <span>code</span>
        </Link>
        <a
          href="https://github.com/playoung2818"
          target="_blank"
          rel="noreferrer"
          className="code-github-link"
        >
          <GitHubMark />
          GitHub profile
        </a>
      </header>

      <section className="code-repo-header">
        <div className="code-owner-line">
          <GitHubMark />
          <a href="https://github.com/playoung2818" target="_blank" rel="noreferrer">
            playoung2818
          </a>
          <span>/</span>
          <strong>repositories</strong>
        </div>
        <p>Public code, experiments, and working projects pulled directly from GitHub.</p>
      </section>

      <nav className="code-tabs" aria-label="Code navigation">
        <span className="code-tab-active">Repositories</span>
        <a href="https://github.com/playoung2818?tab=stars" target="_blank" rel="noreferrer">
          Stars
        </a>
      </nav>

      <section className="code-panel" aria-labelledby="repositories-heading">
        <div className="code-panel-heading">
          <h1 id="repositories-heading">Repositories</h1>
          <span>{repositories.length} public</span>
        </div>

        {repositories.length > 0 ? (
          <div className="code-repo-list">
            {repositories.map((repository) => (
              <article className="code-repo-row" key={repository.id}>
                <div className="code-repo-main">
                  <div className="code-repo-title-line">
                    <span className="code-repo-icon" aria-hidden="true">⌑</span>
                    <a href={repository.html_url} target="_blank" rel="noreferrer">
                      {repository.name}
                    </a>
                    <span className="code-visibility">Public</span>
                    {repository.fork ? <span className="code-visibility">Fork</span> : null}
                  </div>
                  <p>{repository.description || "No description added yet."}</p>
                  {repository.topics.length > 0 ? (
                    <div className="code-topics">
                      {repository.topics.slice(0, 4).map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  ) : null}
                  <div className="code-repo-meta">
                    {repository.language ? (
                      <span>
                        <i
                          className="code-language-dot"
                          style={{ backgroundColor: languageColors[repository.language] || "#8b949e" }}
                        />
                        {repository.language}
                      </span>
                    ) : null}
                    <span>☆ {repository.stargazers_count}</span>
                    <span>⑂ {repository.forks_count}</span>
                    <span>Updated {formatUpdatedAt(repository.updated_at)}</span>
                  </div>
                </div>
                <div className="code-repo-side">
                  <span className="code-branch">{repository.default_branch}</span>
                  {repository.open_issues_count > 0 ? (
                    <span>{repository.open_issues_count} open</span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="code-empty">
            GitHub repositories are temporarily unavailable. Visit the GitHub profile directly.
          </div>
        )}
      </section>
    </main>
  );
}

type Post = {
  title: string;
  year: number;
  blurb: string;
  url?: string;
  external?: boolean;
  status?: "draft" | "live";
};

const posts: Post[] = [
  {
    title: "Inventory intelligence: 5s SKU lookup",
    year: 2025,
    blurb:
      "Flask + Postgres tool that cut inventory lookups from 30 minutes to 5 seconds for ops and sales.",
    status: "draft",
  },
  {
    title: "Liquidity risk notes",
    year: 2025,
    blurb:
      "LP risk surfaces and the relationship between ETH and U.S. Treasuries; models and dashboards.",
    status: "draft",
  },
  {
    title: "DeFi dashboards on Dune",
    year: 2024,
    blurb: "A living set of Web3 dashboards and SQL snippets I keep iterating on.",
    url: "https://dune.com/james0227",
    external: true,
    status: "live",
  },
  {
    title: "Prescriptive scheduling experiments",
    year: 2024,
    blurb:
      "ML + optimization to suggest better production schedules while keeping constraints explainable.",
    status: "draft",
  },
  {
    title: "Insightful interfaces",
    year: 2023,
    blurb:
      "Interface sketches for fast, intentional control panels inspired by grid-based layouts and mono type.",
    status: "draft",
  },
];

const years = Array.from(new Set(posts.map((post) => post.year))).sort(
  (a, b) => b - a,
);

export default function Home() {
  return (
    <div className="page-shell center-shell">
      <header className="header-nav">
        <span className="site-name">◯ Zheyuan (James) Chen</span>
        <div className="nav-links">
          <a href="https://www.linkedin.com/in/chen0227" target="_blank" rel="noreferrer">
            about
          </a>
          <span>∘</span>
          <a href="https://github.com/playoung2818" target="_blank" rel="noreferrer">
            code
          </a>
          <span>∘</span>
          <a href="https://dune.com/james0227" target="_blank" rel="noreferrer">
            dashboards
          </a>
        </div>
      </header>

      <div className="intro">
        <div className="nav-chip">
          <span className="dot" />
          Blog index
        </div>
        <h1 className="headline compact">
          Notes on data, markets, and intelligent systems.
        </h1>
        <p className="lede compact">
          Ops-focused analyst with a fintech &amp; Web3 bias. I write when I have something
          useful to ship or test.
        </p>
      </div>

      <div className="section-header">Writing</div>
      <div className="blog-list">
        {years.map((year) => (
          <section key={year} className="blog-year">
            <h2 className="blog-year-title">{year}</h2>
            <ul className="post-list">
              {posts
                .filter((post) => post.year === year)
                .map((post) => (
                  <li key={post.title} className="post-row">
                    <div>
                      {post.url ? (
                        <a
                          className="post-title-link"
                          href={post.url}
                          target={post.external ? "_blank" : undefined}
                          rel={post.external ? "noreferrer" : undefined}
                        >
                          {post.title}
                        </a>
                      ) : (
                        <span className="post-title">{post.title}</span>
                      )}
                      <p className="muted small">{post.blurb}</p>
                    </div>
                    {post.status && <span className="pill">{post.status}</span>}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="gradient-bar" />
      <div className="footer">
        <span>Still building and documenting. Reach out: chen0227 [at] gmail.com</span>
      </div>
    </div>
  );
}

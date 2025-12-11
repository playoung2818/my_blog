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
    title: "ERP System",
    year: 2025,
    blurb:
      "Inventory-driven ERP automating lead times, availability, and work-order allocation with real-time data.",
    url: "https://github.com/playoung2818/ERP_System",
    external: true,
    status: "live",
  },
  {
    title: "Inventory intelligence: 5s SKU lookup",
    year: 2024,
    blurb: "Flask + Postgres tool that cut inventory lookups from 30 minutes to 5 seconds for ops and sales.",
    url: "https://github.com/playoung2818/Lookup-Part-Name-by-Serial-Number",
    external: true,
    status: "live",
  },
  {
    title: "Bizarro Capital",
    year: 2023,
    blurb: "RL case study and notes (Bizarro Capital).",
    url: "/bizarro",
    status: "live",
  },
  {
    title: "Policy Pathways Driving Innovation in High-Tech Enterprises",
    year: 2022,
    blurb:
      "Analyzes how policy combinations influence innovation outcomes in Yangtze River Delta high-tech firms.",
    url: "/policy-pathways",
    status: "live",
  },
];

const years = Array.from(new Set(posts.map((post) => post.year))).sort(
  (a, b) => b - a,
);

export default function Home() {
  return (
    <div className="page-shell center-shell">
      <div className="cover-block" aria-hidden="true">
        <img
          src="/images/94509042-5F9A-4978-9E7B-B78558A3A655_1_105_c.jpeg"
          alt=""
          className="cover-img"
        />
      </div>
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
        <div className="intro-block">
          <p>
            Hi, I’m Zheyuan Chen. I grew up in{" "}
            <a className="inline-link" href="/childhood">
              Shanghai
            </a>
            , and now live in Chicago.
          </p>
          <p>
            At work, I focus on{" "}
            <a
              className="inline-link"
              href="https://github.com/playoung2818/ERP_System"
              target="_blank"
              rel="noreferrer"
            >
              automating tedious workflows
            </a>{" "}
            to make life easier. On weekends, you’ll usually find me{" "}
            <a
              className="inline-link"
              href="https://www.instagram.com/playoung2818?igsh=bHlwOWt5ZjN6d2xq&utm_source=qr"
              target="_blank"
              rel="noreferrer"
            >
              biking or reading to recharge
            </a>
            .
          </p>
          <p>
            I’m open to collaborating on any project — as long as it’s legal. You can reach me
            at <a className="inline-link" href="mailto:zyuanche@gmail.com">zyuanche@gmail.com</a>.
          </p>
        </div>
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
        <span />
      </div>
    </div>
  );
}

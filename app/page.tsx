import VisitorCount from "./components/VisitorCount";
import Fireworks from "./components/Fireworks";

type Post = {
  title: string;
  year: number;
  blurb: string;
  url?: string;
  external?: boolean;
  status?: "draft" | "open";
};

const posts: Post[] = [
  {
    title: "Reanimation-Jutsu",
    year: 2026,
    blurb:
      "Designed to let me talk with people I admire who have passed away.",
    url: "/luxun",
    status: "open",
  },
  {
    title: "ERP System",
    year: 2025,
    blurb:
      "TL;DR: An MRP system that automatically prioritizes sales orders, reallocates inventory, and calculates what to buy—so you keep service levels high without bloating inventory.",
    url: "https://github.com/playoung2818/ERP_System",
    external: true,
    status: "open",
  },
  {
    title: "Serial Number Lookup Tool",
    year: 2024,
    blurb: "Flask + Postgres tool that return serial number information, and used record",
    url: "https://github.com/playoung2818/Lookup-Part-Name-by-Serial-Number",
    external: true,
    status: "open",
  },
  {
    title: "Bizarro Capital",
    year: 2023,
    blurb: "RL case study and notes (Bizarro Capital).",
    url: "/bizarro",
    status: "open",
  },
];

const years = Array.from(new Set(posts.map((post) => post.year))).sort(
  (a, b) => b - a,
);

const before2022 = {
  title: "Before 2022",
  blurb: "Older work, notes, and studies collected in one place.",
  url: "/before-2022",
  status: "open" as const,
};

export default function Home() {
  return (
    <div className="page-shell center-shell">
      <div className="cover-block drawing-cover" aria-hidden="true">
        <img
          src="/images/drawing-figure-1-transparent.png"
          alt=""
          className="cover-figure"
        />
        <img
          src="/images/drawing-figure-2-transparent.png"
          alt=""
          className="cover-figure"
        />
      </div>
      <header className="header-nav">
        <Fireworks />
        <div className="nav-links">
          <a href="#about">
            about
          </a>
          <span>∘</span>
          <a href="/code">
            code
          </a>
          <span>∘</span>
          <a href="/notes">
            notes
          </a>
        </div>
      </header>

      <section id="about">
        <div className="section-header">About</div>
        <div className="intro">
          <div className="avatar">
            <img src="/images/Profile.png" alt="Zheyuan Chen" />
          </div>
          <div className="intro-block">
            <p>
              Hi, I’m ZC. I grew up in{" "}
              <a className="inline-link" href="/before-2022">
                China
              </a>
              , completed my studies in{" "}
              <a className="inline-link" href="/st-louis">
                St. Louis
              </a>
              , and now live in Chicago.
            </p>
            <p>
              At work, I spend lots of time on{" "}
              <a
                className="inline-link"
                href="https://github.com/playoung2818/ERP_System"
                target="_blank"
                rel="noreferrer"
              >
                automating tedious workflows
              </a>{" "}
              . On weekends, you’ll usually find me{" "}
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
        <div className="blog-list">
          <div className="section-header timeline-header">Timeline</div>
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
                      {post.status === "open" && post.url ? (
                        <a
                          className="pill pill-link"
                          href={post.url}
                          target={post.external ? "_blank" : undefined}
                          rel={post.external ? "noreferrer" : undefined}
                        >
                          OPEN
                        </a>
                      ) : post.status ? (
                        <span className="pill">{post.status}</span>
                      ) : null}
                    </li>
                  ))}
              </ul>
            </section>
          ))}

          <section className="blog-year">
            <h2 className="blog-year-title">{before2022.title}</h2>
            <ul className="post-list">
              <li className="post-row">
                <div>
                  <a className="post-title-link" href={before2022.url}>
                    {before2022.title}
                  </a>
                  <p className="muted small">{before2022.blurb}</p>
                </div>
                <a className="pill pill-link" href={before2022.url}>
                  OPEN
                </a>
              </li>
            </ul>
          </section>
        </div>
      </section>

      <div className="footer">
        <VisitorCount />
      </div>
    </div>
  );
}

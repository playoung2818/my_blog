import VisitorCount from "./components/VisitorCount";
import Fireworks from "./components/Fireworks";

type Post = {
  title: string;
  updatedAt: string;
  repository?: string;
  blurb: string;
  url?: string;
  external?: boolean;
  status?: "draft" | "open";
};

// Update updatedAt when the local project content changes.
const posts: Post[] = [
  {
    title: "Tradingewww",
    updatedAt: "2026-09-26T22:15:13-05:00",
    blurb: "Some visualiztions i have been using",
    url: "/stock-charts",
    status: "open",
  },
  {
    title: "Reanimation-Jutsu",
    updatedAt: "2026-10-04T22:57:40Z",
    repository: "Reanimation-Jutsu",
    blurb:
      "Designed to let me talk with people I admire who have passed away.",
    url: "/reanimation",
    status: "open",
  },
  {
    title: "MRP System",
    updatedAt: "2026-11-22T00:00:00-06:00",
    repository: "MRP_System",
    blurb:
      "An item ledger for future inventory and material planning decisions.",
    url: "/mrp-system",
    status: "open",
  },
  {
    title: "Serial Number Lookup Tool",
    updatedAt: "2026-11-06T23:37:26Z",
    repository: "Lookup-Part-Name-by-Serial-Number",
    blurb: "Flask + Postgres tool that return serial number information",
    url: "https://github.com/playoung2818/Lookup-Part-Name-by-Serial-Number",
    external: true,
    status: "open",
  },
  {
    title: "Bizarro Capital",
    updatedAt: "2026-09-17T20:52:28-05:00",
    blurb: "A Reference Letter from my Manager",
    url: "/bizarro",
    status: "open",
  },
  {
    title: "Before 2022",
    updatedAt: "2026-10-26T21:02:00-05:00",
    blurb: "nostalgia~~~",
    url: "/before-2022",
    status: "open",
  },
];

export const revalidate = 3600;

async function getUpdatedPosts(): Promise<Post[]> {
  let repositories: { name: string; updated_at: string }[] = [];
  try {
    const response = await fetch(
      "https://api.github.com/users/playoung2818/repos?sort=updated&per_page=100",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (response.ok) repositories = await response.json();
  } catch {
    // Use the saved dates if GitHub is unavailable.
  }

  return posts.map((post) => {
    const repository = repositories.find((entry) => entry.name === post.repository);
    const updatedAt = repository && Date.parse(repository.updated_at) > Date.parse(post.updatedAt)
      ? repository.updated_at
      : post.updatedAt;
    return { ...post, updatedAt };
  }).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Chicago",
});

export default async function Home() {
  const updatedPosts = await getUpdatedPosts();
  return (
    <div className="page-shell home-shell">
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
              Usually, you’ll find me{" "}
              <a
                className="inline-link"
                href="https://www.instagram.com/playoung2818?igsh=bHlwOWt5ZjN6d2xq&utm_source=qr"
                target="_blank"
                rel="noreferrer"
              >
                biking, reading, or simply daydreaming by Lake Michigan
              </a>{" "}
              when I need to recharge.
            </p>
            <p>
              I’m open to collaborating on any project — as long as it’s legal. You can reach me
              at <a className="inline-link" href="mailto:zyuanche@gmail.com">zyuanche@gmail.com</a>.
            </p>
          </div>
        </div>
        <section className="project-list" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="section-header">Projects</h2>
          <p className="muted small">Most recently updated first</p>
          <ul className="post-list">
            {updatedPosts.map((post) => (
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
                  <p className="project-updated">
                    Updated <time dateTime={post.updatedAt}>{dateFormatter.format(new Date(post.updatedAt))}</time>
                  </p>
                </div>
                {post.status === "draft" ? <span className="pill">{post.status}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      </section>

      <div className="footer">
        <VisitorCount />
      </div>
    </div>
  );
}

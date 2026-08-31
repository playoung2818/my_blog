import Link from "next/link";

export const metadata = {
  title: "Reanimation-Jutsu",
  description: "Talk with people I admire who have passed away.",
};

const SPACE_URL = "https://playoung2818-reanimation-jutsu.hf.space";

export default function ReanimationPage() {
  return (
    <div className="page-shell center-shell stacked">
      <header className="header-nav">
        <span className="site-name">Reanimation-Jutsu</span>
        <div className="nav-links">
          <Link href="/">home</Link>
        </div>
      </header>

      <p className="muted small" style={{ marginTop: 12 }}>
        Designed to let me talk with people I admire who have passed away. Style-imitation only —
        it never claims to be the person.
      </p>

      <section className="chat-panel" style={{ padding: 0, overflow: "hidden" }}>
        <iframe
          src={SPACE_URL}
          title="Reanimation-Jutsu chat"
          loading="lazy"
          allow="clipboard-write"
          style={{
            width: "100%",
            height: "720px",
            border: "none",
            display: "block",
          }}
        />
      </section>

      <p className="muted small" style={{ marginTop: 8 }}>
        Hosted on{" "}
        <a href={SPACE_URL} target="_blank" rel="noreferrer">
          Hugging Face Spaces
        </a>
        .
      </p>
    </div>
  );
}

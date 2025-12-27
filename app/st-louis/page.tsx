export const metadata = {
  title: "St. Louis | Zheyuan Chen",
  description: "Notes and memories from my academic years in St. Louis.",
};

export default function StLouisPage() {
  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <h1 className="headline compact">St. Louis</h1>
        <div className="doc-content">
          <p className="doc-paragraph">
            I graduated from WashU in 2023 with a major in Business Analytics and a focus on
            fintech. During that year and a half, I learned how to break business operations into
            clear questions and apply the right tools to answer them efficiently. I also served as
            a teaching assistant for the Big Data &amp; Cloud Computing class, with{" "}
            <a
              className="inline-link"
              href="/st-louis/big%20data%20final%20v4.ipynb"
              target="_blank"
              rel="noreferrer"
            >
              this final notebook
            </a>{" "}
            as a reference.
          </p>
          <p className="doc-paragraph">
            I led a team in the Venture Capital Practicum, where we spent a semester tackling real
            questions from{" "}
            <a className="inline-link" href="https://sixthirty.co/" target="_blank" rel="noreferrer">
              SixThirty
            </a>
            . They asked for data-driven insight into what successful collaborations between
            startups and large corporations should look like. We collected data from surveys and
            interviews, analyzed it in Python, and built scorecards for both startups and
            corporations to evaluate and monitor partnerships. The result was actionable guidance
            on how to stay aligned and reach shared outcomes, and we received positive feedback from
            both the professor and the venture capital team.
          </p>
        </div>
      </div>
    </div>
  );
}

const focusSignals = [
  {
    title: "Data-First Strategy",
    copy:
      "Economics and analytics background with a habit of validating every idea against data pipelines, dashboards, and market signals.",
    tags: ["Python", "SQL", "Tableau"],
  },
  {
    title: "Fintech + Web3",
    copy:
      "Curious about where markets, blockchains, and automation intersect — from liquidity risk research to on-chain dashboards.",
    tags: ["Solidity", "DeFi", "Research"],
  },
  {
    title: "Operational Rigor",
    copy:
      "Shipping tools that shrink time-to-answer. Inventory lookups went from 30 minutes to 5 seconds with the right interfaces.",
    tags: ["Flask", "APIs", "Automation"],
  },
];

const projects = [
  {
    title: "Inventory Intelligence",
    copy:
      "Flask tool that surfaces SKU availability instantly, removing manual spreadsheet hunting for ops and sales teams.",
    tags: ["Flask", "Postgres", "UI/UX"],
  },
  {
    title: "Liquidity Risk Notes",
    copy:
      "Investigated LP risk surfaces and the relationship between ETH and U.S. Treasuries; published visual dashboards along the way.",
    tags: ["Crypto Research", "Data Viz", "Markets"],
  },
  {
    title: "DeFi Dashboards",
    copy:
      "Dune-powered visualizations tracking Web3 metrics I care about — a living lab for experimentation with on-chain data.",
    tags: ["Dune", "SQL", "Analytics"],
  },
];

const experiments = [
  {
    title: "Prescriptive Scheduling",
    copy:
      "Applying ML + optimization to suggest better production schedules; balancing constraints with explainability.",
    tags: ["ML", "Optimization", "Explainability"],
  },
  {
    title: "Insightful Interfaces",
    copy:
      "Designing control panels that feel fast and intentional — inspired by Gensyn’s clean grid, purposeful gradients, and mono type.",
    tags: ["Design Systems", "Figma", "Storytelling"],
  },
];

export default function Home() {
  return (
    <div className="page-shell">
      <div className="stacked">
        <div className="nav-chip">
          <span className="dot" />
          Networked thinker · Inspired by Gensyn
        </div>

        <div className="hero-grid">
          <div>
            <h1 className="headline">
              Zheyuan (James) Chen <span className="accent">builds</span> with
              data, markets, and intelligent systems.
            </h1>
            <p className="lede">
              Data-driven analyst, fintech &amp; blockchain enthusiast, and
              operations problem solver. Currently shipping tools, dashboards,
              and research that shorten the path from question to decision.
            </p>
            <div className="cta-row">
              <a
                className="button"
                href="https://www.linkedin.com/in/chen0227"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn
              </a>
              <a
                className="button secondary"
                href="https://github.com/playoung2818"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="button secondary"
                href="https://dune.com/james0227"
                target="_blank"
                rel="noreferrer"
              >
                Dune Dashboards
              </a>
            </div>
          </div>

          <div className="meta-panel">
            <div className="chip">
              Current Focus <span>Operational analytics &amp; Web3</span>
            </div>
            <div className="chip">
              Location <span>Vancouver, Canada</span>
            </div>
            <div className="chip">
              Toolkit <span>Python · SQL · Flask · Solidity</span>
            </div>
          </div>
        </div>

        <div className="section-header">Focus Signals</div>
        <div className="list-grid">
          {focusSignals.map((signal) => (
            <div key={signal.title} className="panel">
              <div className="panel-content">
                <div className="eyebrow">Signal</div>
                <h3 className="card-title">{signal.title}</h3>
                <p className="muted">{signal.copy}</p>
                <div className="tag-row">
                  {signal.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">Active Work</div>
        <div className="list-grid">
          {projects.map((project) => (
            <div key={project.title} className="panel">
              <div className="panel-content">
                <div className="eyebrow">Build</div>
                <h3 className="card-title">{project.title}</h3>
                <p className="muted">{project.copy}</p>
                <div className="tag-row">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">Experiment Feed</div>
        <div className="list-grid">
          {experiments.map((experiment) => (
            <div key={experiment.title} className="panel">
              <div className="panel-content">
                <div className="eyebrow">In Flight</div>
                <h3 className="card-title">{experiment.title}</h3>
                <p className="muted">{experiment.copy}</p>
                <div className="tag-row">
                  {experiment.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gradient-bar" />

        <div className="footer">
          <span>Exploring the network for machine intelligence — one build at a time.</span>
          <span>Reach out: chen0227 [at] gmail.com</span>
        </div>
      </div>
    </div>
  );
}

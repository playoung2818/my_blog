import Link from "next/link";
import { CodexDashboard } from "../components/codex-dashboard";

export const metadata = {
  title: "Codex Usage | Zheyuan Chen",
  description: "A GitHub-style contribution board for my daily Codex usage.",
};

export default function CodexPage() {
  return (
    <div className="page-shell stacked">
      <header className="header-nav">
        <span className="site-name">Codex Usage</span>
        <div className="nav-links">
          <Link href="/">home</Link>
        </div>
      </header>
      <CodexDashboard />
    </div>
  );
}

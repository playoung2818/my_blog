import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { marked, Renderer } from "marked";
import styles from "./page.module.css";

export const metadata = {
  title: "MRP System: The Inventory Ledger | Zheyuan Chen",
  description:
    "How an item ledger combines inventory, supply, and sales demand into a timeline for material planning and customer quotations.",
};

export default async function MrpSystemPage() {
  const markdown = await fs.readFile(
    path.join(process.cwd(), "public", "mrp-system.md"),
    "utf-8",
  );
  const sections: { id: string; title: string }[] = [];
  const renderer = new Renderer();
  renderer.heading = function ({ tokens, depth, text }) {
    const content = this.parser.parseInline(tokens);
    if (depth !== 2) return `<h${depth}>${content}</h${depth}>`;
    const id = `section-${sections.length + 1}`;
    sections.push({ id, title: text });
    return `<h2 id="${id}">${content}</h2>`;
  };
  const html = await marked.parse(markdown, { renderer });

  return (
    <main className={`page-shell ${styles.shell}`}>
      <nav className={styles.navigation} aria-label="Article navigation">
        <Link href="/">← All posts</Link>
        <a href="https://github.com/playoung2818/ERP_System" target="_blank" rel="noreferrer">
          Project on GitHub ↗
        </a>
      </nav>
      <div className={styles.layout}>
        <nav className={styles.index} aria-label="Article sections">
          <p>On this page</p>
          <ol>
            {sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
            ))}
          </ol>
        </nav>
        <article className={styles.article} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}

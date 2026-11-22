import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
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
  const html = await marked.parse(markdown);

  return (
    <main className={`page-shell ${styles.shell}`}>
      <nav className={styles.navigation} aria-label="Article navigation">
        <Link href="/">← All posts</Link>
        <a href="https://github.com/playoung2818/ERP_System" target="_blank" rel="noreferrer">
          Project on GitHub ↗
        </a>
      </nav>
      <article className={styles.article} dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

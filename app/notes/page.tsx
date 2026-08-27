import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

export const metadata = {
  title: "Notes | Zheyuan Chen",
  description: "Notes.",
};

async function getNotesHtml() {
  const fullPath = path.join(process.cwd(), "public", "notes.md");
  const markdown = await fs.readFile(fullPath, "utf-8");
  return marked.parse(markdown);
}

export default async function NotesPage() {
  const html = await getNotesHtml();

  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <div
          className="doc-content markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

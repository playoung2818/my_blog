import fs from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

const decodeXml = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"');

export async function extractDocxParagraphs(fileName: string) {
  const fullPath = path.join(process.cwd(), "public", fileName);
  const buffer = await fs.readFile(fullPath);
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) return [];

  const paragraphs: string[] = [];
  const rawParagraphs = xml.split("</w:p>");

  for (const block of rawParagraphs) {
    const texts = Array.from(block.matchAll(/<w:t[^>]*>(.*?)<\/w:t>/g)).map((m) =>
      decodeXml(m[1])
    );
    const joined = texts.join("").trim();
    if (joined) paragraphs.push(joined);
  }

  return paragraphs;
}

import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type CorpusChunk = {
  title?: string;
  source?: string;
  content?: string;
};

const CORPUS_PATH = path.join(process.cwd(), "data", "luxun_chunks.json");

function loadCorpus(): CorpusChunk[] {
  try {
    const txt = fs.readFileSync(CORPUS_PATH, "utf8");
    const data = JSON.parse(txt);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function tokenize(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function retrieveTopK(query: string, corpus: CorpusChunk[], k = 4): (CorpusChunk & { overlap: number })[] {
  const qTokens = new Set(tokenize(query));
  const scored = corpus
    .map((doc) => {
      const text = `${doc.title || ""} ${doc.content || ""}`;
      const tTokens = tokenize(text);
      let overlap = 0;
      for (const t of tTokens) {
        if (qTokens.has(t)) overlap += 1;
      }
      return { ...doc, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap);

  const top = scored.filter((x) => x.overlap > 0).slice(0, k);
  if (top.length > 0) return top;
  return scored.slice(0, k);
}

function fallbackAnswer(message: string, chunks: (CorpusChunk & { overlap: number })[]): string {
  const cite = chunks
    .map((c, i) => `${i + 1}.《${c.title || "未命名"}》${c.source || ""}`)
    .join("\n");
  return [
    "我先照着你给的文本语气回一句：",
    "所谓热闹，往往只是围观的烟；所谓清醒，常常要付出孤独的价。",
    "",
    `你问的是：${message}`,
    "把问题再收窄一些，例如聚焦“创作者心理”或“平台机制”，我会更像鲁迅式地回答。",
    "",
    "参考片段：",
    cite || "（当前语料为空）",
  ].join("\n");
}

async function openaiAnswer(
  message: string,
  history: Array<{ role: string; content: string }>,
  chunks: (CorpusChunk & { overlap: number })[]
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const context = chunks
    .map(
      (c, i) =>
        `[${i + 1}] 标题:${c.title || "未命名"} 来源:${c.source || "未知"}\n内容:${c.content || ""}`
    )
    .join("\n\n");

  const system = [
    "你是一个文学风格助手。",
    "目标：用鲁迅式的冷峻、讽刺、克制语气回答，但不能声称你是鲁迅本人。",
    "必须基于给定语料回答，尽量引用语料观点。",
    "回答长度控制在120到220字，中文回答。",
    "最后附一行“引用: [编号]”。",
  ].join("\n");

  const userPrompt = JSON.stringify({
    question: message,
    chat_history: history || [],
    retrieved_context: context,
  });

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data?.output_text || null;
}

async function handleMessage(message: string, history: Array<{ role: string; content: string }>) {
  const corpus = loadCorpus();
  const topChunks = retrieveTopK(message, corpus, 4);
  const citations = topChunks.map((c) => ({
    title: c.title || "未命名",
    source: c.source || "未知",
  }));

  let answer = await openaiAnswer(message, history, topChunks);
  if (!answer) {
    answer = fallbackAnswer(message, topChunks);
  }
  return { answer, citations };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();
    const history = Array.isArray(body?.history) ? body.history : [];
    if (!message) {
      return new Response("message is required", { status: 400 });
    }
    const { answer, citations } = await handleMessage(message, history);
    return Response.json({ answer, citations });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(msg, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const message = String(url.searchParams.get("message") || "").trim();
    if (!message) {
      return new Response("message is required", { status: 400 });
    }
    const { answer, citations } = await handleMessage(message, []);
    return Response.json({ answer, citations });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(msg, { status: 500 });
  }
}

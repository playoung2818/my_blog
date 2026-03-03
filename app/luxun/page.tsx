"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; source: string }>;
};

const STARTER = "我读完你放入语料库的鲁迅文本后，可用鲁迅风格和你讨论。先问我一个问题。";

export default function LuxunPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([{ role: "assistant", content: STARTER }]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function requestChat(
    question: string,
    compactHistory: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; citations?: Array<{ title: string; source: string }> }> {
    const payload = JSON.stringify({ message: question, history: compactHistory });

    const res = await fetch("/api/luxun-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (res.ok) return res.json();

    const txt = await res.text();
    throw new Error(txt || `Request failed: ${res.status}`);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    const question = input.trim();
    const nextHistory = [...history, { role: "user" as const, content: question }];
    setHistory(nextHistory);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = (await requestChat(
        question,
        nextHistory.slice(-8).map((x) => ({ role: x.role, content: x.content }))
      )) as {
        answer: string;
        citations?: Array<{ title: string; source: string }>;
      };
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell center-shell stacked">
      <header className="header-nav">
        <span className="site-name">鲁迅语气对话</span>
        <div className="nav-links">
          <Link href="/">home</Link>
        </div>
      </header>

      <p className="muted small" style={{ marginTop: 12 }}>
        基于语料检索 + 大模型回答。目标是风格模仿与文本引用，不冒充作者本人。
      </p>

      <section className="chat-panel">
        <div className="chat-log">
          {history.map((turn, idx) => (
            <article key={idx} className={`chat-turn ${turn.role}`}>
              <div className="chat-role">{turn.role === "user" ? "你" : "鲁迅风格助手"}</div>
              <div className="chat-content">{turn.content}</div>
              {turn.citations && turn.citations.length > 0 ? (
                <ul className="chat-citations">
                  {turn.citations.map((c, i) => (
                    <li key={`${c.source}-${i}`}>
                      《{c.title}》 - {c.source}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：鲁迅如果评论今天的短视频文化，会怎么说？"
            rows={4}
          />
          <div className="chat-actions">
            <button className="button" type="submit" disabled={!canSend}>
              {loading ? "思考中..." : "发送"}
            </button>
            <span className="muted small">建议一次只问一个问题，便于引用文本。</span>
          </div>
        </form>

        {error ? <p style={{ color: "#b91c1c", marginTop: 12 }}>{error}</p> : null}
      </section>
    </div>
  );
}

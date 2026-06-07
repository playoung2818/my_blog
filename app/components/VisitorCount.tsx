"use client";

import { useEffect, useState } from "react";

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/visitors", {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Visitor counter request failed");
        }
        return response.json() as Promise<{ count: number | null }>;
      })
      .then((data) => setCount(data.count))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setUnavailable(true);
          console.warn("Visitor count is unavailable");
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <span className="visitor-count" aria-live="polite">
      {unavailable
        ? "Visitor count unavailable"
        : count === null
          ? "Visitor count loading"
        : `${count.toLocaleString()} unique visitor${count === 1 ? "" : "s"}`}
    </span>
  );
}

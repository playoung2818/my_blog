import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stock Charts | Zheyuan Chen",
  description: "Run a stock analysis notebook in Colab with a ticker of your choice.",
};

const colabUrl =
  "https://colab.research.google.com/drive/1RQRxRsn6JAmNTvt76qZIFUKtdQw2JNpx";

export default function StockChartsPage() {
  return (
    <main className="page-shell center-shell">
      <div className="doc-page">
        <Link className="inline-link" href="/">← Home</Link>
        <h1 className="headline compact">Stock Charts: MACD &amp; RSI</h1>
        <div className="doc-content">
          <p className="doc-paragraph">
            This Python notebook downloads adjusted daily stock prices from Yahoo Finance.
            It displays price, volume, and MACD charts, plus RSI values in a table.
            The analysis runs in Google Colab.
          </p>
          <p className="doc-paragraph">
            <a
              href={colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            >
              Open in Colab ↗
            </a>
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Open the notebook in Colab.</li>
            <li>Set SYMBOL to your ticker, for example <code>{'SYMBOL = "MSFT"'}</code>.</li>
            <li>Select Runtime → Run all.</li>
            <li>Scroll down to view the tables and chart.</li>
          </ol>
          <p className="doc-paragraph">
            To analyze another stock, change SYMBOL, then select Runtime → Run all again.
          </p>
          <p className="doc-paragraph">
            Colab can require a Google sign-in and permission to run the notebook.
            Data downloads depend on Yahoo Finance availability and request limits.
          </p>
        </div>
      </div>
    </main>
  );
}

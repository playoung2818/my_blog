import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stock Charts | Zheyuan Chen",
  description: "I find this notebook a good way to quickly get an update of the metrics i am interested by running through all the cells",
};

const colabUrl =
  "https://colab.research.google.com/drive/1RQRxRsn6JAmNTvt76qZIFUKtdQw2JNpx";

export default function StockChartsPage() {
  return (
    <main className="page-shell center-shell">
      <div className="doc-page">
        <Link className="inline-link" href="/">← Home</Link>
        <h1 className="headline compact">Trading Matrics Visualization</h1>
        <div className="doc-content">
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
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>MACD:</strong> Indicates momentum and potential trend changes.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

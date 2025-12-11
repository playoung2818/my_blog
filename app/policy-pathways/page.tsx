import { extractDocxParagraphs } from "../lib/docx";

export const metadata = {
  title: "Policy Pathways Driving Innovation | Zheyuan Chen",
  description:
    "Full text: Policy Pathways Driving Innovation in High-Tech Enterprises (Yangtze River Delta study).",
};

export default async function PolicyPage() {
  const paragraphs = await extractDocxParagraphs("Thesis.docx");

  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <h1 className="headline compact">
          Policy Pathways Driving Innovation in High-Tech Enterprises
        </h1>
        <div className="doc-content">
          {paragraphs.map((text, idx) => (
            <p key={idx} className="doc-paragraph">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

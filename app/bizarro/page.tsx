import { extractDocxParagraphs } from "../lib/docx";

export const metadata = {
  title: "Bizarro Capital | Zheyuan Chen",
  description: "Bizarro Capital RL case study and reference letter.",
};

export default async function BizarroPage() {
  const paragraphs = await extractDocxParagraphs("RL_Bizarro.docx");

  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <h1 className="headline compact">Bizarro Capital</h1>
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

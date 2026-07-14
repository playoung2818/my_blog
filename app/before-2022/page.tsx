import Image, { type StaticImageData } from "next/image";

import shanghai01 from "./IMG_1632.png";
import shanghai02 from "./6f3015efar1cc84003cf6353ca4911c2.jpg";
import shanghai03 from "./IMG_0219.jpg";
import shanghai04 from "./IMG_0240.jpg";
import shanghai05 from "./IMG_0261.jpg";
import shanghai06 from "./IMG_0433.jpg";
import shanghai07 from "./IMG_1006.jpeg";
import shanghai08 from "./IMG_1809.jpg";

export const metadata = {
  title: "Before 2022 | Zheyuan Chen",
  description: "Older work, notes, and studies collected in one place.",
};

const photos: { src: StaticImageData; alt: string; note: string }[] = [
  { src: shanghai01, alt: "A memory from Shanghai", note: "" },
  { src: shanghai02, alt: "A memory from Shanghai", note: "" },
  { src: shanghai03, alt: "A memory from Shanghai", note: "" },
  { src: shanghai04, alt: "A memory from Shanghai", note: "" },
  { src: shanghai05, alt: "A memory from Shanghai", note: "" },
  { src: shanghai06, alt: "A memory from Shanghai", note: "" },
  { src: shanghai07, alt: "A memory from Shanghai", note: "" },
  { src: shanghai08, alt: "A memory from Shanghai", note: "" },
];

export default function Before2022Page() {
  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <h1 className="headline compact">Before 2022</h1>
        <div className="doc-content">
          <p className="doc-paragraph">
            I grew up in Shanghai and majored in Economics at Shanghai Lixin University of Accounting
            and Finance. It was a bit of a whirlwind: I had great times with close friends, but the
            pandemic pulled everyone apart and the academic journey felt disjointed. Still, I
            completed a thesis I’m proud of on how government policies influence companies’ ability
            to innovate. The project took almost two years of data collection and analysis, and it
            taught me the basics of academic research, which was surprisingly fun and rewarding.
          </p>
        </div>
        <div className="photo-journal">
          {photos.map((photo, index) => (
            <figure className="photo-entry" key={photo.src.src}>
              <Image
                src={photo.src}
                alt={`${photo.alt} ${index + 1}`}
                className="photo-entry-image"
                sizes="(max-width: 760px) 100vw, 696px"
                priority={index === 0}
              />
              <figcaption className={`photo-note${photo.note ? "" : " photo-note-empty"}`}>
                {photo.note || "Add your note here."}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image, { type StaticImageData } from "next/image";

import shanghai01 from "./1.jpeg";
import shanghai02 from "./2.jpeg";
import shanghai03 from "./3.jpg";
import shanghai04 from "./4.jpg";
import shanghai05 from "./5.jpeg";
import shanghai06 from "./6.jpg";
import shanghai07 from "./7.png";
import shanghai08 from "./8.jpg";
import shanghai10 from "./10.jpg";

export const metadata = {
  title: "Before 2022 | Zheyuan Chen",
  description: "Older work, notes, and studies collected in one place.",
};

const photos: { src: StaticImageData; alt: string; note: string }[] = [
  { src: shanghai01, alt: "A memory from Shanghai", note: "Happy Birthday, Robin!" },
  { src: shanghai02, alt: "A memory from Shanghai", note: "I still dream about these guys occationally" },
  { src: shanghai03, alt: "A memory from Shanghai", note: "The Desk I have been sitting at for six years. I can still feel pressure just by looking it" },
  { src: shanghai04, alt: "A memory from Shanghai", note: "The sky is always breathtaking when I look up" },
  { src: shanghai05, alt: "A memory from Shanghai", note: "I used to ride to cycle along the Huangpu River in high school" },
  { src: shanghai06, alt: "A memory from Shanghai", note: "Me at top right 8" },
  { src: shanghai07, alt: "A memory from Shanghai", note: "Learned about Friendship" },
  { src: shanghai08, alt: "A memory from Shanghai", note: "Learned about Love" },
  { src: shanghai10, alt: "A memory from Shanghai", note: "Bizarre graduation ceremony in pandemic (Me at top right 1)" },
];

export default function Before2022Page() {
  return (
    <div className="page-shell center-shell">
      <div className="doc-page">
        <h1 className="headline compact">Before 2022</h1>
        <div className="doc-content">
          <p className="doc-paragraph">
            I was born in Changzhou, Jiangsu, China, on February 27, 2000. My kindergarten teacher gave me the English name Robin. I guess that was fair, since I did look and behave like a little girl…

My childhood was free from social media, and I grew up in a small water town, so the first 12 years of my life were very peaceful. I spent most of my childhood with my grandparents. They are typical working-class Chinese people—hardworking and able to fix almost anything. My grandpa was a lead engineer at an excavator factory, and my grandma was a textile worker. Both of them genuinely loved their underpaid jobs. Growing up in this environment, I became interested in figuring out how things worked and fixing them when they were not functioning properly.

After I finished elementary school, my parents took me to Shanghai for better educational resources. My middle school teacher gave me the English name James. I never asked her why. I guess it was simply because James is a popular name.
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

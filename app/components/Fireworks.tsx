"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

type Rocket = Point & {
  vx: number;
  target: number;
  trail: Point[];
  color: string;
  delay: number;
  climbSpeed: number;
};

type Petal = Point & {
  vx: number;
  vy: number;
  age: number;
  color: string;
  size: number;
};

// Warm fire palette — reds, oranges, golds and a white-hot core, closer to a
// real fireworks show than flat single-color sparks.
const colors = ["#ff3c38", "#ff6b35", "#ff9e00", "#ffc300", "#fff275", "#fff8e7"];

function pickColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Small glowing square — a chunky, blocky pixel of light rather than a
// smooth vector shape, closer to the pixelated look of a low-res burst.
function makePixelSprite(color: string) {
  const size = 10;
  const blockSize = 6;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;

  const spriteContext = sprite.getContext("2d");
  if (!spriteContext) return sprite;

  const offset = (size - blockSize) / 2;
  spriteContext.fillStyle = color;
  spriteContext.shadowColor = color;
  spriteContext.shadowBlur = 4;
  spriteContext.fillRect(offset, offset, blockSize, blockSize);

  return sprite;
}

function makePetals(x: number, y: number): Petal[] {
  const petals: Petal[] = [];
  const count = 32;

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 + Math.random() * 0.15;
    const speed = 2 + Math.random() * 2.2;

    petals.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0,
      color: pickColor(),
      size: 0.7 + Math.random() * 0.6,
    });
  }

  return petals;
}

function makeRockets(width: number, height: number): Rocket[] {
  const count = 11;
  const rockets: Rocket[] = [];

  for (let index = 0; index < count; index += 1) {
    rockets.push({
      x: width * (0.12 + Math.random() * 0.76),
      y: height - 24,
      vx: -0.6 + Math.random() * 1.2,
      target: height * (0.1 + Math.random() * 0.35),
      trail: [],
      color: pickColor(),
      delay: index * 4 + Math.random() * 10,
      climbSpeed: 3.4 + Math.random() * 1.4,
    });
  }

  return rockets;
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [launch, setLaunch] = useState(0);

  useEffect(() => {
    if (launch === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const petalSprites = new Map(
      colors.map((color) => [color, makePixelSprite(color)]),
    );
    let rockets: Rocket[] = makeRockets(width, height);
    let petals: Petal[] = [];
    let frameId = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const nextRockets: Rocket[] = [];
      for (const rocket of rockets) {
        if (rocket.delay > 0) {
          rocket.delay -= 1;
          nextRockets.push(rocket);
          continue;
        }

        rocket.trail.push({ x: rocket.x, y: rocket.y });
        rocket.trail = rocket.trail.slice(-6);
        rocket.x += rocket.vx;
        rocket.y -= rocket.climbSpeed;

        rocket.trail.forEach((point, index) => {
          context.globalAlpha = ((index + 1) / rocket.trail.length) * 0.35;
          context.fillStyle = rocket.color;
          context.fillRect(point.x - 1, point.y, 2, 7);
        });

        context.globalAlpha = 1;
        context.fillStyle = rocket.color;
        context.beginPath();
        context.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
        context.fill();

        if (rocket.y <= rocket.target) {
          petals.push(...makePetals(rocket.x, rocket.y));
        } else {
          nextRockets.push(rocket);
        }
      }
      rockets = nextRockets;

      const nextPetals: Petal[] = [];
      for (const petal of petals) {
        petal.age += 1;
        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.vy += 0.12;
        petal.vx *= 0.986;

        if (petal.x > 0 && petal.x < width && petal.y < height && petal.age < 70) {
          const scale =
            (petal.age < 8 ? 0.5 + (petal.age / 8) * 0.9 : Math.max(0.3, 1.4 - petal.age / 60)) * petal.size;
          context.globalAlpha = petal.age < 55 ? 1 : Math.max(0, (70 - petal.age) / 15);
          const sprite = petalSprites.get(petal.color);
          if (sprite) {
            const spriteWidth = sprite.width * scale;
            const spriteHeight = sprite.height * scale;
            context.drawImage(
              sprite,
              petal.x - spriteWidth / 2,
              petal.y - spriteHeight / 2,
              spriteWidth,
              spriteHeight,
            );
          }
          nextPetals.push(petal);
        }
      }
      petals = nextPetals;
      context.globalAlpha = 1;

      if (rockets.length || petals.length) {
        frameId = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      context.clearRect(0, 0, width, height);
    };
  }, [launch]);

  return (
    <>
      <button
        type="button"
        className="site-name fireworks-trigger"
        onClick={() => setLaunch((value) => value + 1)}
        aria-label="Launch fireworks"
      >
        ◯ Howdy!
      </button>
      <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />
    </>
  );
}

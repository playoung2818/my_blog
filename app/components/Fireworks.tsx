"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

type Rocket = Point & {
  vx: number;
  target: number;
  trail: Point[];
  color: string;
};

type Petal = Point & {
  vx: number;
  vy: number;
  age: number;
  color: string;
};

const colors = ["#00f5d4", "#00bbf9", "#f15bb5", "#fee440", "#9b5de5"];

const pompompurinFrame = [
  "⢠⠋⠒⠙⡄⠀⣀⢴⠛⡦⣀⠀⠀⢠⠢⠔⡄",
  "⠀⠑⣀⣊⠤⠯⣥⣄⣀⣠⣬⠵⣀⡈⠢⠔⠁",
  "⣰⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠓⠦⣄",
  "⣏⠀⢠⠟⠀⠛⠀⢠⣤⠀⠶⠀⠘⣇⠀⠀⣹",
  "⠙⠒⣾⠀⠀⠀⠘⠚⠓⠚⠀⠀⠀⠙⡲⠚⠁",
  "⠀⢀⡾⠀⣀⠔⠒⢞⣫⡷⠖⠢⡀⠀⢧⠀⠀",
  "⠀⣼⠥⡀⢀⡀⣀⡜⠀⢣⣀⣀⠀⡴⠚⢦⠀",
  "⢸⠁⠀⠙⡀⠀⠀⠙⠒⠋⠀⠀⠨⠀⠀⢸⠀",
  "⠀⠳⣄⣠⠴⠤⠤⠤⠤⠤⠤⠤⠦⣤⡤⠋⠀",
];

function pickColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function makePompompurinSprite(color: string) {
  const sprite = document.createElement("canvas");
  const spriteContext = sprite.getContext("2d");
  if (!spriteContext) return sprite;

  const font = '7px "SFMono-Regular", Menlo, Consolas, monospace';
  const lineHeight = 8;
  const padding = 2;
  spriteContext.font = font;
  sprite.width =
    Math.ceil(Math.max(...pompompurinFrame.map((line) => spriteContext.measureText(line).width))) +
    padding * 2;
  sprite.height = pompompurinFrame.length * lineHeight + padding * 2;

  spriteContext.font = font;
  spriteContext.fillStyle = color;
  spriteContext.textBaseline = "top";
  pompompurinFrame.forEach((line, index) => {
    spriteContext.fillText(line, padding, padding + index * lineHeight);
  });

  return sprite;
}

function makePetals(x: number, y: number): Petal[] {
  const petals: Petal[] = [];

  for (const side of [-1, 1]) {
    for (let index = 0; index < 10; index += 1) {
      const spread = 0.75 + (index / 9) * 1.45;
      const angle = -Math.PI / 2 + side * spread;
      const speed = 2.5 + Math.random() * 1.5;

      petals.push({
        x,
        y,
        vx: Math.cos(angle) * speed * 1.9,
        vy: Math.sin(angle) * speed * 0.8,
        age: 0,
        color: pickColor(),
      });
    }
  }

  return petals;
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
      colors.map((color) => [color, makePompompurinSprite(color)]),
    );
    const launchSpeeds = [-2.4, -1.2, 0, 1.2, 2.4];
    let rockets: Rocket[] = launchSpeeds.map((vx) => ({
      x: width / 2,
      y: height - 24,
      vx,
      target: height * (0.12 + Math.random() * 0.22),
      trail: [],
      color: pickColor(),
    }));
    let petals: Petal[] = [];
    let frameId = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const nextRockets: Rocket[] = [];
      for (const rocket of rockets) {
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        rocket.trail = rocket.trail.slice(-6);
        rocket.x += rocket.vx;
        rocket.y -= 4;

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

        if (petal.x > 0 && petal.x < width && petal.y < height) {
          context.globalAlpha = 1;
          const sprite = petalSprites.get(petal.color);
          if (sprite) {
            const scale = petal.age < 35 ? 0.7 : 0.55;
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

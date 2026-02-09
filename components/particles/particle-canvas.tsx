"use client";

import { useEffect, useRef } from "react";

import type { LanguageEntry } from "@/types/wrapped";

type ParticleCanvasProps = {
  count: number;
  languages: LanguageEntry[];
  gMorphColor: string;
  gMorphStart: number;
  morphProgress: number;
  calmProgress: number;
};

type Point = { x: number; y: number };
type Rgb = { r: number; g: number; b: number };

type Particle = {
  baseX: number;
  baseY: number;
  targetX: number;
  targetY: number;
  baseRgb: Rgb;
  radius: number;
  phase: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function easeInOutCubic(t: number) {
  if (t <= 0.5) {
    return 4 * t * t * t;
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace("#", "").trim();

  if (normalized.length === 3) {
    const r = Number.parseInt(`${normalized[0]}${normalized[0]}`, 16);
    const g = Number.parseInt(`${normalized[1]}${normalized[1]}`, 16);
    const b = Number.parseInt(`${normalized[2]}${normalized[2]}`, 16);
    return { r, g, b };
  }

  if (normalized.length === 6) {
    const value = Number.parseInt(normalized, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  return { r: 250, g: 243, b: 224 };
}

function mixRgb(from: Rgb, to: Rgb, amount: number): Rgb {
  return {
    r: Math.round(from.r + (to.r - from.r) * amount),
    g: Math.round(from.g + (to.g - from.g) * amount),
    b: Math.round(from.b + (to.b - from.b) * amount)
  };
}

function rgbToCss(rgb: Rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function buildFallbackPoints(count: number): Point[] {
  const cx = 50;
  const cy = 50;
  const rx = 42;
  const ry = 28;
  const gapStart = 0.52;
  const gapEnd = 1.22;
  const path: Point[] = [];

  for (let angle = gapEnd; angle < gapStart + Math.PI * 2; angle += 0.032) {
    path.push({
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle)
    });
  }

  const barY = 60;
  const barRight = 90;
  const innerX = 50;

  for (let step = 0; step <= 1; step += 0.025) {
    path.push({
      x: cx + rx * Math.cos(gapEnd) + (innerX - (cx + rx * Math.cos(gapEnd))) * step,
      y: cy + ry * Math.sin(gapEnd) + (barY - (cy + ry * Math.sin(gapEnd))) * step
    });
  }

  for (let step = 0; step <= 1; step += 0.025) {
    path.push({ x: innerX + (barRight - innerX) * step, y: barY });
  }

  for (let step = 0; step <= 1; step += 0.025) {
    path.push({ x: barRight, y: barY + (50 - barY) * step });
  }

  for (let step = 0; step <= 1; step += 0.025) {
    path.push({
      x: barRight + (cx + rx * Math.cos(gapStart) - barRight) * step,
      y: 50 + (cy + ry * Math.sin(gapStart) - 50) * step
    });
  }

  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const index = Math.min(Math.floor((i / count) * path.length), path.length - 1);
    points.push(path[index]);
  }

  return points;
}

function buildLanguagePool(languages: LanguageEntry[], count: number): string[] {
  const total = languages.reduce((sum, item) => sum + item.percentage, 0) || 100;
  const colors: string[] = [];

  languages.forEach((language, index) => {
    const bucketSize = Math.round((count * language.percentage) / total);
    for (let i = 0; i < bucketSize; i += 1) {
      colors.push(language.color || "#FAF3E0");
    }

    if (index === languages.length - 1) {
      while (colors.length < count) {
        colors.push(language.color || "#FAF3E0");
      }
    }
  });

  for (let i = colors.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = colors[i];
    colors[i] = colors[randomIndex];
    colors[randomIndex] = temp;
  }

  return colors;
}

export function ParticleCanvas({
  count,
  languages,
  gMorphColor,
  gMorphStart,
  morphProgress,
  calmProgress
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const morphRef = useRef(morphProgress);
  const calmRef = useRef(calmProgress);

  useEffect(() => {
    morphRef.current = morphProgress;
  }, [morphProgress]);

  useEffect(() => {
    calmRef.current = calmProgress;
  }, [calmProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let gPoints: Point[] = [];

    const toScreen = (point: Point) => {
      const logoSize = Math.min(width, height) * 0.62;
      const scale = logoSize / 100;
      return {
        x: width / 2 + (point.x - 50) * scale,
        y: height / 2 + (point.y - 50) * scale
      };
    };

    const samplePointsFromSvg = () => {
      const path = document.getElementById("uga-g-path") as SVGPathElement | null;
      if (!path || typeof path.getTotalLength !== "function") {
        return buildFallbackPoints(count);
      }

      const totalLength = path.getTotalLength();
      if (!totalLength || Number.isNaN(totalLength)) {
        return buildFallbackPoints(count);
      }

      const points: Point[] = [];
      const centerX = 189;
      const centerY = 122.5;
      const scale = 100 / 378;

      for (let i = 0; i < count; i += 1) {
        const lengthAtPoint = (i / (count - 1)) * totalLength;
        const point = path.getPointAtLength(lengthAtPoint);
        points.push({
          x: 50 + (point.x - centerX) * scale,
          y: 50 + (point.y - centerY) * scale
        });
      }

      return points;
    };

    const rebuildParticles = () => {
      if (!gPoints.length) {
        return;
      }

      const colorPool = buildLanguagePool(languages, count);
      particles = [];

      for (let i = 0; i < count; i += 1) {
        const target = toScreen(gPoints[i]);
        particles.push({
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          targetX: target.x,
          targetY: target.y,
          baseRgb: hexToRgb(colorPool[i] || "#FAF3E0"),
          radius: 1.25 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      gPoints = samplePointsFromSvg();
      rebuildParticles();
    };

    const draw = (time: number) => {
      const progress = easeInOutCubic(clamp(morphRef.current, 0, 1));
      const calm = clamp(calmRef.current, 0, 1);
      const morphStart = clamp(gMorphStart, 0, 0.98);
      const colorBlend = easeInOutCubic(
        clamp((progress - morphStart) / Math.max(0.0001, 1 - morphStart), 0, 1)
      );
      const targetRed = hexToRgb(gMorphColor);

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const driftX = Math.sin(time * 0.001 + particle.phase) * 16;
        const driftY = Math.cos(time * 0.0012 + particle.phase * 1.3) * 12;

        const fromX = particle.baseX + driftX;
        const fromY = particle.baseY + driftY;

        const x = fromX + (particle.targetX - fromX) * progress;
        const y = fromY + (particle.targetY - fromY) * progress;

        const alpha = 0.84 * (1 - calm * 0.45);
        const drawRgb = mixRgb(particle.baseRgb, targetRed, colorBlend);
        const drawColor = rgbToCss(drawRgb);

        context.globalAlpha = alpha * 0.32;
        const glow = context.createRadialGradient(x, y, 0, x, y, particle.radius * 3.2);
        glow.addColorStop(0, drawColor);
        glow.addColorStop(1, "transparent");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, particle.radius * 3.2, 0, Math.PI * 2);
        context.fill();

        context.globalAlpha = alpha;
        context.fillStyle = drawColor;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, [count, gMorphColor, gMorphStart, languages]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 block h-full w-full pointer-events-none" />;
}

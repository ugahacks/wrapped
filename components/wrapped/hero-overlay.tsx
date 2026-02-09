"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

type HeroOverlayProps = {
  title: string;
  dates: string;
  location: string;
  tagline: string;
  ctaLabel: string;
  opacity: number;
};

export function HeroOverlay({
  title,
  dates,
  location,
  tagline,
  ctaLabel,
  opacity
}: HeroOverlayProps) {
  return (
    <section
      className="pointer-events-none fixed inset-0 z-30 grid place-items-center px-5 transition-opacity duration-500"
      style={{ opacity }}
      aria-label={title}
    >
      <div className="w-full max-w-xl rounded-3xl border border-periwinkle/35 bg-indigo/30 p-6 text-center shadow-[0_20px_60px_rgba(9,10,36,0.45)] backdrop-blur-xl">
        <Image
          className="mx-auto mb-6 h-auto w-[86%] max-w-md"
          src="https://11.ugahacks.com/Logo-with-byte%201.svg"
          alt={title}
          width={456}
          height={113}
          priority
        />
        <h1 className="font-display text-4xl text-cream md:text-5xl">{title}</h1>
        <p className="mt-3 text-base text-cream/85">{tagline}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-periwinkle">
          {dates} · {location}
        </p>
        <div className="mt-6">
          <Button size="lg" className="pointer-events-none">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import type { StatSection } from "@/types/wrapped";

type StatsOverlayProps = {
  subtitle: string;
  title: string;
  signoff: string;
  sections: StatSection[];
  revealProgress: number;
  visibility: number;
  liftProgress: number;
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

function renderLabelWithBold(label: string) {
  const parts = label.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-cream">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function StatsOverlay({
  subtitle,
  title,
  signoff,
  sections,
  revealProgress,
  visibility,
  liftProgress
}: StatsOverlayProps) {
  const sectionOffsets = sections.map((_, sectionIndex) => {
    return sections
      .slice(0, sectionIndex)
      .reduce((sum, section) => sum + section.stats.length, 0);
  });

  return (
    <section
      className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden px-4 pb-12 pt-20 md:px-8"
      style={{
        opacity: visibility,
        transform: `translateY(${-20 * liftProgress}vh)`,
        pointerEvents: visibility > 0.1 ? "auto" : "none",
        background:
          "radial-gradient(circle at top, rgba(155,103,152,0.35) 0%, rgba(62,76,138,0.82) 48%, rgba(36,44,84,0.92) 100%)"
      }}
      aria-hidden={visibility < 0.1}
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-periwinkle">{subtitle}</p>
        <h2 className="mt-2 text-center font-display text-4xl text-cream md:text-5xl">{title}</h2>

        <div className="mt-8 space-y-5">
          {sections.map((section, sectionIndex) => {
            const sectionOffset = sectionOffsets[sectionIndex] ?? 0;
            return (
              <Card key={section.title} className="border-periwinkle/30 bg-indigo/35 p-4 md:p-5">
                <h3 className="font-display text-2xl text-cream">{section.title}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.stats.map((stat, statIndex) => {
                    const index = sectionOffset + statIndex;
                    const reveal = easeInOutCubic(
                      clamp((revealProgress - index * 0.025) / 0.55, 0, 1)
                    );
                    const animatedNumber =
                      typeof stat.number === "number" ? Math.round(reveal * stat.number) : null;
                    const displayNumber =
                      typeof stat.number === "number"
                        ? animatedNumber?.toLocaleString()
                        : typeof stat.number === "string"
                          ? stat.number
                          : null;

                    return (
                      <Card
                        key={`${section.title}-${stat.label}`}
                        className="border-periwinkle/25 bg-periwinkle/10 p-4"
                        style={{
                          borderLeftColor: stat.color,
                          borderLeftWidth: "4px",
                          borderLeftStyle: "solid",
                          opacity: reveal,
                          transform: `translateY(${14 - 14 * reveal}px)`
                        }}
                      >
                        {displayNumber !== null ? (
                          <p className="text-sm text-cream/90">
                            <span className="text-lg font-bold" style={{ color: stat.color }}>
                              {displayNumber}
                            </span>{" "}
                            {renderLabelWithBold(stat.label)}
                          </p>
                        ) : (
                          <p className="text-sm text-cream/90">{renderLabelWithBold(stat.label)}</p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 pb-6 text-center font-display text-2xl text-gold">{signoff}</p>
      </div>
    </section>
  );
}

"use client";

type ThankYouOverlayProps = {
  lines: string[];
  opacity: number;
  lineProgress: number;
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

function lineState(index: number, total: number, progress: number) {
  const gap = 1 / (total + 1.2);
  const start = gap * index;

  const stretch = index === 2 ? 1.1 : 1.0;
  const end = start + gap * stretch;
  const local = clamp((progress - start) / (end - start), 0, 1);
  const eased = easeInOutCubic(local);

  return {
    opacity: eased,
    translateY: 14 - 14 * eased
  };
}

export function ThankYouOverlay({ lines, opacity, lineProgress }: ThankYouOverlayProps) {
  return (
    <section
      className="pointer-events-none fixed inset-0 z-30 grid place-items-center px-5"
      aria-hidden="true"
      style={{ opacity }}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-periwinkle/35 bg-mystic/25 p-6 text-center shadow-[0_18px_60px_rgba(12,14,42,0.45)] backdrop-blur-xl md:p-9">
        {lines.map((line, index) => {
          const style = lineState(index, lines.length, lineProgress);
          const isLast = index === lines.length - 1;

          return (
            <p
              key={`${line}-${index}`}
              className={isLast ? "mt-6 text-lg font-semibold text-gold" : "mt-3 text-lg text-cream/90"}
              style={{ opacity: style.opacity, transform: `translateY(${style.translateY}px)` }}
            >
              {line}
            </p>
          );
        })}
      </div>
    </section>
  );
}

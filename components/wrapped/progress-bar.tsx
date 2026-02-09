"use client";

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-cream/10">
      <div
        className="h-full origin-left bg-gold transition-transform duration-75"
        style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
      />
    </div>
  );
}

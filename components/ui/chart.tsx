"use client";

import * as React from "react";
import { Tooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
};

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, style, ...props }, ref) => {
    const chartStyle = React.useMemo(() => {
      const cssVars: Record<string, string> = {};
      for (const key of Object.keys(config)) {
        const color = config[key]?.color;
        if (color) {
          cssVars[`--color-${key}`] = color;
        }
      }
      return cssVars;
    }, [config]);

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ ...chartStyle, ...style }}
        {...props}
      />
    );
  }
);
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = Tooltip;

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { fill?: string } }>;
};

export function ChartTooltipContent({ active, payload }: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload[0];
  const name = datum?.name ?? "";
  const value = datum?.value ?? 0;
  const color = datum?.payload?.fill ?? "#ffffff";

  return (
    <div className="rounded-md border border-periwinkle/35 bg-indigo/95 px-3 py-2 text-xs text-cream shadow-xl">
      <div className="flex items-center gap-2">
        <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold">{name}</span>
      </div>
      <p className="mt-1 text-cream/85">{value.toFixed(2)}%</p>
    </div>
  );
}

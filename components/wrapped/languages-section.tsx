"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SectionShell } from "@/components/wrapped/section-shell";

type LanguagesSectionProps = {
  title: string;
  items: { name: string; percentage: number; color: string }[];
};

export function LanguagesSection({ title, items }: LanguagesSectionProps) {
  const chartConfig = Object.fromEntries(
    items.map((item) => [item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), { color: item.color }])
  );

  return (
    <SectionShell title={title}>
      <div className="grid items-center gap-5 md:grid-cols-[1fr_1fr]">
        <ChartContainer config={chartConfig} className="mx-auto h-64 max-w-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={items}
                dataKey="percentage"
                nameKey="name"
                innerRadius={52}
                outerRadius={92}
                stroke="rgba(250,243,224,0.16)"
                strokeWidth={1}
              >
                {items.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-cream/90">
                <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold text-cream">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type HighlightsSectionProps = {
  title: string;
  items: { label: string; value: string }[];
};

export function HighlightsSection({ title, items }: HighlightsSectionProps) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.label}>
            <CardContent className="space-y-1 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-cream/65">{item.label}</p>
              <p className="text-sm font-semibold text-cream">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

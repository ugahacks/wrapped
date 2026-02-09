import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type OverviewSectionProps = {
  title: string;
  cards: { label: string; value: string }[];
};

export function OverviewSection({ title, cards }: OverviewSectionProps) {
  return (
    <SectionShell title={title}>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Card key={card.label} className="bg-periwinkle/12">
            <CardHeader className="pb-1">
              <CardTitle className="text-base text-cream/90">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs uppercase tracking-[0.15em] text-cream/70">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

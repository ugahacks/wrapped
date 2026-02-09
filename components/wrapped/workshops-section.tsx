import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type WorkshopsSectionProps = {
  title: string;
  items: { name: string; attendees: number; host: string }[];
};

export function WorkshopsSection({ title, items }: WorkshopsSectionProps) {
  return (
    <SectionShell title={title}>
      <div className="space-y-3">
        {items.map((workshop) => (
          <Card key={workshop.name}>
            <CardHeader>
              <CardTitle>{workshop.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-cream/85">
              <span>{workshop.host}</span>
              <span className="font-semibold text-gold">{workshop.attendees.toLocaleString()} attendees</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

import { SectionShell } from "@/components/wrapped/section-shell";

type LanguagesSectionProps = {
  title: string;
  items: { name: string; percentage: number; color: string }[];
};

export function LanguagesSection({ title, items }: LanguagesSectionProps) {
  return (
    <SectionShell title={title}>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm text-cream/90">
              <span>{item.name}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream/15">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

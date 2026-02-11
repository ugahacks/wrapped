import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type RepoHygieneSectionProps = {
  title: string;
  subtitle: string;
  items: {
    fileType: string;
    count: number;
    description: string;
  }[];
};

export function RepoHygieneSection({ title, subtitle, items }: RepoHygieneSectionProps) {
  return (
    <SectionShell title={title}>
      <p className="text-sm text-cream/80">{subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.fileType} className="border-red-500/45 bg-red-900/15">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center justify-between gap-2 text-sm text-cream">
                <span>
                  <strong>{item.fileType}</strong> committed
                </span>
                <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-300">
                  {item.count.toLocaleString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-cream/75">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

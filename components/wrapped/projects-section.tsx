import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type ProjectsSectionProps = {
  title: string;
  items: {
    name: string;
    team: string;
    description: string;
    tags: string[];
    highlight: string;
  }[];
};

export function ProjectsSection({ title, items }: ProjectsSectionProps) {
  return (
    <SectionShell title={title}>
      <div className="space-y-3">
        {items.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{project.name}</CardTitle>
                <Badge>{project.highlight}</Badge>
              </div>
              <CardDescription>{project.team}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-cream/85">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

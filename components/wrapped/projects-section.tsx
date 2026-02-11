import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/wrapped/section-shell";

type ProjectsSectionProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
};

export function ProjectsSection({ title, imageSrc, imageAlt, caption }: ProjectsSectionProps) {
  return (
    <SectionShell title={title}>
      <Card className="overflow-hidden border-periwinkle/25 bg-indigo/25">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] w-full">
            <Image unoptimized src={imageSrc} alt={imageAlt} fill className="object-cover" priority={false} />
          </div>
          {caption ? (
            <p className="px-4 py-3 text-sm text-cream/85 md:px-5">{caption}</p>
          ) : null}
        </CardContent>
      </Card>
    </SectionShell>
  );
}

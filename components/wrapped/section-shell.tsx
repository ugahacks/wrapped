import { ReactNode } from "react";

type SectionShellProps = {
  title: string;
  children: ReactNode;
};

export function SectionShell({ title, children }: SectionShellProps) {
  return (
    <section className="rounded-3xl border border-periwinkle/20 bg-indigo/30 p-5 shadow-[0_14px_40px_rgba(15,16,45,0.35)] backdrop-blur md:p-7">
      <h2 className="font-display text-2xl text-cream md:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-4">
        <span
          className="h-7 w-1.5 rounded-full"
          style={{ backgroundColor: "var(--section-line)" }}
        />
        <h3 className="font-heading text-[length:var(--resume-sidebar-size)] font-semibold tracking-tight">
          {title}
        </h3>
        <div className="h-px flex-1 rounded-full bg-stone-200" />
      </div>
      <div className="space-y-3 text-[length:var(--resume-body-size)] [line-height:var(--resume-line-height)]">
        {children}
      </div>
    </section>
  );
}

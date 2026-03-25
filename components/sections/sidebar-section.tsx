import type { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="font-heading text-[length:var(--resume-sidebar-size)] font-semibold tracking-tight">
          {title}
        </h3>
        <div className="h-px flex-1 bg-[color:var(--section-line)]" />
      </div>
      <div className="space-y-3 text-[length:var(--resume-body-size)] [line-height:var(--resume-line-height)]">
        {children}
      </div>
    </section>
  );
}

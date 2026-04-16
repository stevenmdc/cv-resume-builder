import type { ResumeEducation } from "@/types/resume";

interface EducationSectionProps {
  items: ResumeEducation[];
  title: string;
  primaryColor: string;
  mutedColor: string;
}

export function EducationSection({
  items,
  title,
  primaryColor,
  mutedColor,
}: EducationSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-4">
        <span
          className="h-8 w-1.5 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <h2 className="font-heading text-[length:var(--resume-section-size)] font-semibold tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-1 rounded-full bg-stone-200" />
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="border-b border-stone-200 pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <p
                className="text-[length:var(--resume-small-size)] font-semibold uppercase tracking-[0.25em]"
                style={{ color: primaryColor }}
              >
                {item.startDate} - {item.endDate}
              </p>
              <h3 className="font-heading text-[1.15rem] font-semibold tracking-tight">
                {item.degree}
              </h3>
              <p
                className="text-[length:var(--resume-body-size)]"
                style={{ color: mutedColor }}
              >
                {item.school}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

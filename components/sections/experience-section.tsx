import type { ResumeExperience } from "@/types/resume";

interface ExperienceSectionProps {
  items: ResumeExperience[];
  title: string;
  presentLabel: string;
  primaryColor: string;
  mutedColor: string;
}

export function ExperienceSection({
  items,
  title,
  presentLabel,
  primaryColor,
  mutedColor,
}: ExperienceSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span
          className="h-10 w-2 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <h2 className="font-heading text-[length:var(--resume-section-size)] font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <div className="space-y-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="space-y-3 border-b border-stone-200 pb-5 last:border-b-0 last:pb-0"
          >
            <div className="space-y-1">
              <div className="space-y-1">
                <p
                  className="text-[length:var(--resume-small-size)] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: primaryColor }}
                >
                  {item.startDate} - {item.current ? presentLabel : item.endDate}
                </p>
                <h3 className="font-heading text-[1.3rem] font-semibold tracking-tight">
                  {item.role}
                </h3>
                <p className="text-[length:var(--resume-body-size)] font-semibold">
                  {item.location
                    ? `${item.company}, ${item.location}`
                    : item.company}
                </p>
              </div>
            </div>
            <ul
              className="space-y-2 text-[length:var(--resume-body-size)] [line-height:var(--resume-line-height)]"
              style={{ color: mutedColor }}
            >
              {item.highlights
                .filter((highlight) => highlight.trim())
                .map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

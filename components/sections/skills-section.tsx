import type { ResumeSkill } from "@/types/resume";

interface SkillsSectionProps {
  items: ResumeSkill[];
  primaryColor: string;
  accentColor: string;
  mutedColor: string;
}

export function SkillsSection({
  items,
  primaryColor,
  accentColor,
  mutedColor,
}: SkillsSectionProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[length:var(--resume-body-size)] font-medium">
              {item.label}
            </span>
            <span
              className="text-[length:var(--resume-small-size)] font-semibold uppercase tracking-[0.22em]"
              style={{ color: mutedColor }}
            >
              {item.level}%
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: accentColor }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.level}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

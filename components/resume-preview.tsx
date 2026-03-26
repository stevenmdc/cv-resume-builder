import { forwardRef, type CSSProperties } from "react";

import { A4_PREVIEW_HEIGHT_PX, A4_PREVIEW_WIDTH_PX } from "@/lib/a4";
import { cvLabels } from "@/lib/i18n";
import { getResumeThemeStyle } from "@/lib/theme";
import type { ResumeData } from "@/types/resume";

import { EducationSection } from "./sections/education-section";
import { ExperienceSection } from "./sections/experience-section";
import { ResumeHeader } from "./sections/resume-header";
import { SidebarSection } from "./sections/sidebar-section";
import { SkillsSection } from "./sections/skills-section";

interface ResumePreviewProps {
  resume: ResumeData;
  onProfileImageChange: (nextValue: string) => void;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ resume, onProfileImageChange }, ref) {
    const { theme } = resume;
    const labels = cvLabels[resume.locale];
    const previewStyle = {
      ...getResumeThemeStyle(theme),
      "--section-line": theme.accentColor,
    } as CSSProperties & Record<"--section-line", string>;

    return (
      <div
        ref={ref}
        className="mx-auto overflow-hidden border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.12)]"
        style={{
          ...previewStyle,
          width: `${A4_PREVIEW_WIDTH_PX}px`,
          height: `${A4_PREVIEW_HEIGHT_PX}px`,
        }}
      >
        <ResumeHeader
          personal={resume.personal}
          summary={resume.summary}
          primaryColor={theme.primaryColor}
          accentColor={theme.accentColor}
          mutedColor={theme.mutedColor}
          onProfileImageChange={onProfileImageChange}
        />

        <div className="grid gap-8 px-10 py-8 md:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-8">
            <ExperienceSection
              items={resume.experience}
              title={labels.experience}
              presentLabel={labels.present}
              primaryColor={theme.primaryColor}
              mutedColor={theme.mutedColor}
            />
            <EducationSection
              items={resume.education}
              title={labels.education}
              primaryColor={theme.primaryColor}
              mutedColor={theme.mutedColor}
            />
          </div>

          <aside className="space-y-8">
            <SidebarSection title={labels.skills}>
              <SkillsSection
                items={resume.skills}
                primaryColor={theme.primaryColor}
                accentColor={theme.accentColor}
                mutedColor={theme.mutedColor}
              />
            </SidebarSection>

            <SidebarSection title={labels.certifications}>
              <div className="space-y-3">
                {resume.certifications.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <p className="font-semibold">{item.title}</p>
                    <p style={{ color: theme.mutedColor }}>
                      {item.issuer} · {item.year}
                    </p>
                  </div>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title={labels.languages}>
              <div className="space-y-2">
                {resume.languages.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span style={{ color: theme.mutedColor }}>{item.level}</span>
                  </div>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title={labels.interests}>
              <div
                className="flex flex-wrap gap-2"
                style={{ color: theme.mutedColor }}
              >
                {resume.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full px-3 py-1 text-[length:var(--resume-small-size)] font-semibold"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </SidebarSection>
          </aside>
        </div>
      </div>
    );
  },
);

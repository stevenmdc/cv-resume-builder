import type { CSSProperties } from "react";

import type { ResumeTheme } from "@/types/resume";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

const compactFontTokens: Record<`--${string}`, string> = {
  "--resume-name-size": "2.9rem",
  "--resume-title-size": "0.95rem",
  "--resume-body-size": "0.8rem",
  "--resume-small-size": "0.68rem",
  "--resume-section-size": "1.45rem",
  "--resume-sidebar-size": "1.2rem",
  "--resume-line-height": "1.55",
};

export const getResumeThemeStyle = (theme: ResumeTheme): ThemeStyle => ({
  ...compactFontTokens,
  backgroundColor: theme.backgroundColor,
  color: theme.textColor,
});

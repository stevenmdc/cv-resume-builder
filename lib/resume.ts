import type { ResumeData } from "@/types/resume";

export const SUMMARY_MAX_CHARACTERS = 134;

export const clampSummary = (value: string) =>
  value.slice(0, SUMMARY_MAX_CHARACTERS);

export const normalizeResume = (resume: ResumeData): ResumeData => ({
  ...resume,
  summary: clampSummary(resume.summary),
});

import type { ResumeLocale } from "@/types/resume";

export const cvLabels: Record<
  ResumeLocale,
  {
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    languages: string;
    interests: string;
    present: string;
  }
> = {
  fr: {
    experience: "Expérience",
    education: "Formation",
    skills: "Compétences",
    certifications: "Certifications",
    languages: "Langues",
    interests: "Centres d'intérêt",
    present: "Aujourd'hui",
  },
  en: {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    languages: "Languages",
    interests: "Interests",
    present: "Present",
  },
};

export type FontScale = "small" | "medium" | "large";
export type ResumeLocale = "fr" | "en";

export interface ResumePersonalDetails {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  avatar: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface ResumeSkill {
  id: string;
  label: string;
  level: number;
}

export interface ResumeCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface ResumeLanguage {
  id: string;
  label: string;
  level: string;
}

export interface ResumeLink {
  id: string;
  label: string;
  url: string;
}

export interface ResumeTheme {
  primaryColor: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  backgroundColor: string;
  fontScale: FontScale;
}

export interface ResumeData {
  locale: ResumeLocale;
  personal: ResumePersonalDetails;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  interests: string[];
  links: ResumeLink[];
  theme: ResumeTheme;
}

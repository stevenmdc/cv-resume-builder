import { defaultResumeData } from "@/data/default-resume";
import type { ResumeData } from "@/types/resume";

export const RESUME_STORAGE_KEY = "cv-builder:resume";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const normalizeResumeData = (value: unknown): ResumeData => {
  if (!isObject(value)) {
    return defaultResumeData;
  }

  const personalValue = isObject(value.personal) ? value.personal : {};

  return {
    ...defaultResumeData,
    ...value,
    locale: value.locale === "en" ? "en" : "fr",
    personal: {
      ...defaultResumeData.personal,
      ...personalValue,
      avatar: defaultResumeData.personal.avatar,
    },
    theme: {
      ...defaultResumeData.theme,
      ...(isObject(value.theme) ? value.theme : {}),
      fontScale: "small",
      headingFont:
        isObject(value.theme) && value.theme.headingFont === "lora"
          ? "lora"
          : "playfair",
    },
    experience: Array.isArray(value.experience)
      ? value.experience
      : defaultResumeData.experience,
    education: Array.isArray(value.education)
      ? value.education
      : defaultResumeData.education,
    skills: Array.isArray(value.skills) ? value.skills : defaultResumeData.skills,
    certifications: Array.isArray(value.certifications)
      ? value.certifications
      : defaultResumeData.certifications,
    languages: Array.isArray(value.languages)
      ? value.languages
      : defaultResumeData.languages,
    interests: Array.isArray(value.interests)
      ? value.interests
      : defaultResumeData.interests,
    links: Array.isArray(value.links) ? value.links : defaultResumeData.links,
  };
};

export const loadResumeFromStorage = (): ResumeData => {
  if (typeof window === "undefined") {
    return defaultResumeData;
  }

  try {
    const rawValue = window.localStorage.getItem(RESUME_STORAGE_KEY);

    if (!rawValue) {
      return defaultResumeData;
    }

    return normalizeResumeData(JSON.parse(rawValue));
  } catch {
    return defaultResumeData;
  }
};

export const saveResumeToStorage = (resume: ResumeData) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RESUME_STORAGE_KEY,
    JSON.stringify({
      ...resume,
      personal: {
        ...resume.personal,
        avatar: defaultResumeData.personal.avatar,
      },
    }),
  );
};

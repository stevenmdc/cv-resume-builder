"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  A4_EXPORT_HEIGHT_PX,
  A4_EXPORT_WIDTH_PX,
} from "@/lib/a4";
import { SUMMARY_MAX_CHARACTERS, clampSummary } from "@/lib/resume";

import type { ResumeData } from "@/types/resume";

interface SettingsModalProps {
  isOpen: boolean;
  resume: ResumeData;
  onClose: () => void;
  onChange: (nextResume: ResumeData) => void;
  onReset: () => void;
}

type SettingsSectionId =
  | "general"
  | "content"
  | "extras"
  | "appearance";

const settingsSections: Array<{
  id: SettingsSectionId;
  title: string;
}> = [
  {
    id: "general",
    title: "Informations",
  },
  {
    id: "content",
    title: "Contenu",
  },
  {
    id: "extras",
    title: "Compléments",
  },
  {
    id: "appearance",
    title: "Apparence",
  },
];

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[13px] text-stone-900 outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-200/60";

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);

const toExperienceText = (resume: ResumeData) =>
  resume.experience
    .map((item) =>
      [
        item.role,
        item.company,
        item.location,
        item.startDate,
        item.current ? "Present" : item.endDate,
        item.highlights.join("; "),
      ].join(" | "),
    )
    .join("\n");

const toEducationText = (resume: ResumeData) =>
  resume.education
    .map((item) =>
      [
        item.degree,
        item.school,
        item.location,
        item.startDate,
        item.endDate,
      ].join(" | "),
    )
    .join("\n");

const toSkillsText = (resume: ResumeData) =>
  resume.skills.map((item) => `${item.label} | ${item.level}`).join("\n");

const toCertificationsText = (resume: ResumeData) =>
  resume.certifications
    .map((item) => `${item.title} | ${item.issuer} | ${item.year}`)
    .join("\n");

const toLanguagesText = (resume: ResumeData) =>
  resume.languages.map((item) => `${item.label} | ${item.level}`).join("\n");

const headingFontOptions: Array<{
  value: ResumeData["theme"]["headingFont"];
  label: string;
  previewFontFamily: string;
}> = [
  {
    value: "playfair",
    label: "Playfair",
    previewFontFamily: "var(--font-playfair-display), serif",
  },
  {
    value: "lora",
    label: "Lora",
    previewFontFamily: "var(--font-lora), serif",
  },
];

export function SettingsModal({
  isOpen,
  resume,
  onClose,
  onChange,
  onReset,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("general");

  const handleClose = () => {
    setActiveSection("general");
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-stone-950">
                  Paramètres
                </h2>
                <span>
                  {A4_EXPORT_WIDTH_PX} x {A4_EXPORT_HEIGHT_PX} px @ 300 dpi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...resume,
                      locale: resume.locale === "fr" ? "en" : "fr",
                    })
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  <Globe className="h-4 w-4" />
                  Lang {resume.locale === "fr" ? "FR" : "EN"}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <aside className="overflow-x-auto border-b border-stone-200 bg-stone-50/80 px-3 py-3 lg:w-72 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
                <div className="flex gap-2 lg:flex-col">
                  {settingsSections.map((section) => {
                    const isActive = section.id === activeSection;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className="min-w-44 rounded-[1.35rem] border px-4 py-3 text-left transition lg:min-w-0"
                        style={{
                          borderColor: isActive ? "#1c1917" : "#e7e5e4",
                          backgroundColor: isActive ? "#1c1917" : "#ffffff",
                          color: isActive ? "#fafaf9" : "#1c1917",
                        }}
                      >
                        <span className="block text-sm font-semibold">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="resume-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8">
                <SettingsSectionContent
                  activeSection={activeSection}
                  resume={resume}
                  onChange={onChange}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="font-heading text-xl font-semibold tracking-tight text-stone-950">
      {title}
    </h3>
  );
}

function SettingsSectionContent({
  activeSection,
  resume,
  onChange,
}: {
  activeSection: SettingsSectionId;
  resume: ResumeData;
  onChange: (nextResume: ResumeData) => void;
}) {
  if (activeSection === "general") {
    return <GeneralSection resume={resume} onChange={onChange} />;
  }

  if (activeSection === "content") {
    return <ResumeContentSection resume={resume} onChange={onChange} />;
  }

  if (activeSection === "extras") {
    return <ExtrasSection resume={resume} onChange={onChange} />;
  }

  if (activeSection === "appearance") {
    return <AppearanceSection resume={resume} onChange={onChange} />;
  }

  return <GeneralSection resume={resume} onChange={onChange} />;
}

function GeneralSection({
  resume,
  onChange,
}: {
  resume: ResumeData;
  onChange: (nextResume: ResumeData) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Informations générales" />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nom complet"
          value={resume.personal.fullName}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, fullName: value },
            })
          }
        />
        <Field
          label="Titre"
          value={resume.personal.title}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, title: value },
            })
          }
        />
        <Field
          label="Email"
          value={resume.personal.email}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, email: value },
            })
          }
        />
        <Field
          label="Téléphone"
          value={resume.personal.phone}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, phone: value },
            })
          }
        />
        <Field
          label="Localisation"
          value={resume.personal.location}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, location: value },
            })
          }
        />
        <Field
          label="Liens"
          value={resume.personal.website}
          onChange={(value) =>
            onChange({
              ...resume,
              personal: { ...resume.personal, website: value },
            })
          }
        />
      </div>
      <TextAreaField
        label="Résumé"
        value={resume.summary}
        maxLength={SUMMARY_MAX_CHARACTERS}
        helperText="Limite pour rester visible sans troncature dans l'en-tête."
        onChange={(value) =>
          onChange({ ...resume, summary: clampSummary(value) })
        }
      />
    </section>
  );
}

function ResumeContentSection({
  resume,
  onChange,
}: {
  resume: ResumeData;
  onChange: (nextResume: ResumeData) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Données du CV" />
      <TextAreaField
        label="Expériences (Poste | Entreprise | Localisation | Début | Fin/Present | Highlight 1; Highlight 2)"
        value={toExperienceText(resume)}
        onChange={(value) =>
          onChange({
            ...resume,
            experience: parseLines(value).map((line, index) => {
              const [
                role = "",
                company = "",
                location = "",
                startDate = "",
                endDate = "",
                highlights = "",
              ] = line.split("|").map((entry) => entry.trim());
              const current = endDate.toLowerCase() === "present";
              return {
                id: `experience-${index}-${role}`,
                role,
                company,
                location,
                startDate,
                endDate: current ? "" : endDate,
                current,
                highlights: highlights
                  .split(";")
                  .map((entry) => entry.trim())
                  .filter(Boolean),
              };
            }),
          })
        }
      />
      <TextAreaField
        label="Formation (Diplôme | École | Localisation | Début | Fin)"
        value={toEducationText(resume)}
        onChange={(value) =>
          onChange({
            ...resume,
            education: parseLines(value).map((line, index) => {
              const [
                degree = "",
                school = "",
                location = "",
                startDate = "",
                endDate = "",
              ] = line.split("|").map((entry) => entry.trim());
              return {
                id: `education-${index}-${degree}`,
                degree,
                school,
                location,
                startDate,
                endDate,
              };
            }),
          })
        }
      />
      <TextAreaField
        label="Compétences (Nom | Niveau de 0 à 100)"
        value={toSkillsText(resume)}
        onChange={(value) =>
          onChange({
            ...resume,
            skills: parseLines(value).map((line, index) => {
              const [label = "", level = "80"] = line
                .split("|")
                .map((entry) => entry.trim());
              return {
                id: `skill-${index}-${label}`,
                label,
                level: Number(level) || 80,
              };
            }),
          })
        }
      />
    </section>
  );
}

function ExtrasSection({
  resume,
  onChange,
}: {
  resume: ResumeData;
  onChange: (nextResume: ResumeData) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Compléments" />
      <TextAreaField
        label="Certifications (Titre | Organisme | Année)"
        value={toCertificationsText(resume)}
        onChange={(value) =>
          onChange({
            ...resume,
            certifications: parseLines(value).map((line, index) => {
              const [title = "", issuer = "", year = ""] = line
                .split("|")
                .map((entry) => entry.trim());
              return {
                id: `cert-${index}-${title}`,
                title,
                issuer,
                year,
              };
            }),
          })
        }
      />
      <TextAreaField
        label="Langues (Langue | Niveau)"
        value={toLanguagesText(resume)}
        onChange={(value) =>
          onChange({
            ...resume,
            languages: parseLines(value).map((line, index) => {
              const [label = "", level = ""] = line
                .split("|")
                .map((entry) => entry.trim());
              return {
                id: `language-${index}-${label}`,
                label,
                level,
              };
            }),
          })
        }
      />
      <TextAreaField
        label="Centres d'intérêt (une ligne par item)"
        value={resume.interests.join("\n")}
        onChange={(value) =>
          onChange({
            ...resume,
            interests: parseLines(value),
          })
        }
      />
    </section>
  );
}

function AppearanceSection({
  resume,
  onChange,
}: {
  resume: ResumeData;
  onChange: (nextResume: ResumeData) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Apparence" />
      <div className="space-y-3">
        <span className="block text-sm font-medium text-stone-600">
          Police des titres
        </span>
        <div className="grid gap-3 md:grid-cols-2">
          {headingFontOptions.map((option) => {
            const isActive = resume.theme.headingFont === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onChange({
                    ...resume,
                    theme: { ...resume.theme, headingFont: option.value },
                  })
                }
                className="rounded-[1.35rem] border px-4 py-4 text-left transition"
                style={{
                  borderColor: isActive ? "#1c1917" : "#e7e5e4",
                  backgroundColor: isActive ? "#1c1917" : "#fafaf9",
                  color: isActive ? "#fafaf9" : "#1c1917",
                }}
              >
                <span
                  className="block text-lg font-semibold tracking-tight"
                  style={{ fontFamily: option.previewFontFamily }}
                >
                  {option.label}
                </span>
                <span className="mt-1 block text-xs opacity-75">
                  Titre de section
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ColorField
          label="Couleur principale"
          value={resume.theme.primaryColor}
          onChange={(value) =>
            onChange({
              ...resume,
              theme: { ...resume.theme, primaryColor: value },
            })
          }
        />
        <ColorField
          label="Couleur accent"
          value={resume.theme.accentColor}
          onChange={(value) =>
            onChange({
              ...resume,
              theme: { ...resume.theme, accentColor: value },
            })
          }
        />
        <ColorField
          label="Texte"
          value={resume.theme.textColor}
          onChange={(value) =>
            onChange({
              ...resume,
              theme: { ...resume.theme, textColor: value },
            })
          }
        />
        <ColorField
          label="Texte secondaire"
          value={resume.theme.mutedColor}
          onChange={(value) =>
            onChange({
              ...resume,
              theme: { ...resume.theme, mutedColor: value },
            })
          }
        />
        <ColorField
          label="Fond du CV"
          value={resume.theme.backgroundColor}
          onChange={(value) =>
            onChange({
              ...resume,
              theme: { ...resume.theme, backgroundColor: value },
            })
          }
        />
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  maxLength,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  helperText?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-stone-600">
        <span>{label}</span>
        {maxLength ? (
          <span className="text-xs font-semibold text-stone-400">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        maxLength={maxLength}
        className={`${inputClassName} min-h-32 resize-y`}
      />
      {helperText ? (
        <span className="mt-2 block text-xs text-stone-500">{helperText}</span>
      ) : null}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-600">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-10 rounded-xl border-0 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-[13px] text-stone-700 outline-none"
        />
      </div>
    </label>
  );
}

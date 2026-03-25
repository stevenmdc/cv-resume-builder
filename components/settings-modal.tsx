"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { useEffect } from "react";
import {
  A4_EXPORT_HEIGHT_PX,
  A4_EXPORT_WIDTH_PX,
} from "@/lib/a4";

import type { ResumeData } from "@/types/resume";

import { ProfileImageUpload } from "./profile-image-upload";

interface SettingsModalProps {
  isOpen: boolean;
  resume: ResumeData;
  onClose: () => void;
  onChange: (nextResume: ResumeData) => void;
  onReset: () => void;
}

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-200/60";

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

export function SettingsModal({
  isOpen,
  resume,
  onClose,
  onChange,
  onReset,
}: SettingsModalProps) {
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
          onClick={onClose}
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
                  Settings
                </h2>
                <span>
                  {A4_EXPORT_WIDTH_PX} x {A4_EXPORT_HEIGHT_PX} px @ 300 dpi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="resume-scroll overflow-y-auto px-6 py-6">
              <div className="space-y-8">
                <section className="space-y-4">
                  <SectionTitle title="Informations generales" />
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
                      label="Telephone"
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
                    label="Resume"
                    value={resume.summary}
                    onChange={(value) =>
                      onChange({ ...resume, summary: value })
                    }
                  />
                </section>

                <section className="space-y-4">
                  <SectionTitle title="Langue du CV" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onChange({ ...resume, locale: "fr" })}
                      className="rounded-[1.35rem] border px-4 py-4 text-left transition"
                      style={{
                        borderColor:
                          resume.locale === "fr" ? "#1c1917" : "#e7e5e4",
                        backgroundColor:
                          resume.locale === "fr" ? "#1c1917" : "#fafaf9",
                        color: resume.locale === "fr" ? "#fafaf9" : "#292524",
                      }}
                    >
                      <span className="block font-semibold">Francais</span>
                      <span className="mt-1 block text-sm opacity-80">
                        Libelles du CV en francais
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...resume, locale: "en" })}
                      className="rounded-[1.35rem] border px-4 py-4 text-left transition"
                      style={{
                        borderColor:
                          resume.locale === "en" ? "#1c1917" : "#e7e5e4",
                        backgroundColor:
                          resume.locale === "en" ? "#1c1917" : "#fafaf9",
                        color: resume.locale === "en" ? "#fafaf9" : "#292524",
                      }}
                    >
                      <span className="block font-semibold">English</span>
                      <span className="mt-1 block text-sm opacity-80">
                        CV labels in English
                      </span>
                    </button>
                  </div>
                </section>

                <section className="space-y-4">
                  <SectionTitle title="Donnees du CV" />
                  <TextAreaField
                    label="Experiences (Poste | Entreprise | Localisation | Debut | Fin/Present | Highlight 1; Highlight 2)"
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
                    label="Formation (Diplome | Ecole | Localisation | Debut | Fin)"
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
                    label="Competences (Nom | Niveau de 0 a 100)"
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

                <section className="space-y-4">
                  <TextAreaField
                    label="Certifications (Titre | Organisme | Annee)"
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
                    label="Centres d'interet (une ligne par item)"
                    value={resume.interests.join("\n")}
                    onChange={(value) =>
                      onChange({
                        ...resume,
                        interests: parseLines(value),
                      })
                    }
                  />
                </section>

                <section className="space-y-4">
                  <SectionTitle title="Apparence" />
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
                  <div className="rounded-[1.35rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                    Taille de police verrouillee sur la version compacte
                    <span className="ml-2 font-semibold text-stone-900">
                      Petite
                    </span>
                  </div>
                </section>

                <section className="space-y-4">
                  <SectionTitle title="Photo de profil" />
                  <ProfileImageUpload
                    value={resume.personal.avatar}
                    onChange={(value) =>
                      onChange({
                        ...resume,
                        personal: { ...resume.personal, avatar: value },
                      })
                    }
                  />
                </section>
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className={`${inputClassName} min-h-32 resize-y`}
      />
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
          className="w-full bg-transparent text-sm text-stone-700 outline-none"
        />
      </div>
    </label>
  );
}

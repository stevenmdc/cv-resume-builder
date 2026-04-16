"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Globe,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  A4_EXPORT_HEIGHT_PX,
  A4_EXPORT_WIDTH_PX,
} from "@/lib/a4";
import { SUMMARY_MAX_CHARACTERS, clampSummary } from "@/lib/resume";

import type {
  ResumeCertification,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeSkill,
} from "@/types/resume";

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

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id-${Math.random().toString(36).slice(2, 11)}`;

const clampPercentage = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

const createEmptyExperience = (): ResumeExperience => ({
  id: createId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  highlights: [""],
});

const createEmptyEducation = (): ResumeEducation => ({
  id: createId(),
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
});

const createEmptySkill = (): ResumeSkill => ({
  id: createId(),
  label: "",
  level: 80,
});

const createEmptyCertification = (): ResumeCertification => ({
  id: createId(),
  title: "",
  issuer: "",
  year: "",
});

const createEmptyLanguage = (): ResumeLanguage => ({
  id: createId(),
  label: "",
  level: "",
});

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
            className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.22)]"
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

function ArrayFieldEditor({
  title,
  addLabel,
  emptyMessage,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  emptyMessage: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-stone-200 bg-stone-50/40 p-3 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-stone-900">{title}</h4>
        <button
          type="button"
          onClick={onAdd}
          aria-label={addLabel}
          title={addLabel}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {hasItems ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-3 text-sm text-stone-500">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

function ArrayItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-stone-200 bg-white">
      <summary className="flex list-none items-center gap-2 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 text-stone-500 transition group-open:rotate-90" />
        <span className="text-sm font-semibold text-stone-700">{title}</span>
        <button
          type="button"
          aria-label={`Supprimer ${title.toLowerCase()}`}
          title="Supprimer"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-700 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </summary>
      <div className="space-y-4 border-t border-stone-200 p-4">
        {children}
      </div>
    </details>
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
  const updateExperienceAt = (
    index: number,
    patch: Partial<ResumeExperience>,
  ) =>
    onChange({
      ...resume,
      experience: resume.experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });

  const updateEducationAt = (index: number, patch: Partial<ResumeEducation>) =>
    onChange({
      ...resume,
      education: resume.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });

  const updateSkillAt = (index: number, patch: Partial<ResumeSkill>) =>
    onChange({
      ...resume,
      skills: resume.skills.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });

  return (
    <section className="space-y-5">
      <SectionTitle title="Données du CV" />
      <ArrayFieldEditor
        title="Expériences"
        addLabel="Ajouter une expérience"
        onAdd={() =>
          onChange({
            ...resume,
            experience: [...resume.experience, createEmptyExperience()],
          })
        }
        emptyMessage="Aucune expérience pour l'instant."
      >
        {resume.experience.map((item, index) => (
          <ArrayItemCard
            key={item.id || `experience-${index}`}
            title={`Expérience ${index + 1}`}
            onRemove={() =>
              onChange({
                ...resume,
                experience: resume.experience.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Poste"
                value={item.role}
                onChange={(value) => updateExperienceAt(index, { role: value })}
              />
              <Field
                label="Entreprise"
                value={item.company}
                onChange={(value) =>
                  updateExperienceAt(index, { company: value })
                }
              />
              <Field
                label="Localisation"
                value={item.location}
                onChange={(value) =>
                  updateExperienceAt(index, { location: value })
                }
              />
              <Field
                label="Date de début"
                value={item.startDate}
                onChange={(value) =>
                  updateExperienceAt(index, { startDate: value })
                }
              />
              <Field
                label="Date de fin"
                value={item.endDate}
                disabled={item.current}
                onChange={(value) =>
                  updateExperienceAt(index, { endDate: value })
                }
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(event) =>
                  updateExperienceAt(index, {
                    current: event.target.checked,
                    endDate: event.target.checked ? "" : item.endDate,
                  })
                }
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
              />
              En poste actuellement
            </label>
            <TextAreaField
              label="Points clés (une ligne par point)"
              rows={4}
              value={item.highlights.join("\n")}
              helperText="Chaque ligne devient une puce dans le CV."
              onChange={(value) =>
                updateExperienceAt(index, { highlights: parseLines(value) })
              }
            />
          </ArrayItemCard>
        ))}
      </ArrayFieldEditor>
      <ArrayFieldEditor
        title="Formations"
        addLabel="Ajouter une formation"
        onAdd={() =>
          onChange({
            ...resume,
            education: [...resume.education, createEmptyEducation()],
          })
        }
        emptyMessage="Aucune formation pour l'instant."
      >
        {resume.education.map((item, index) => (
          <ArrayItemCard
            key={item.id || `education-${index}`}
            title={`Formation ${index + 1}`}
            onRemove={() =>
              onChange({
                ...resume,
                education: resume.education.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Diplôme"
                value={item.degree}
                onChange={(value) => updateEducationAt(index, { degree: value })}
              />
              <Field
                label="École"
                value={item.school}
                onChange={(value) => updateEducationAt(index, { school: value })}
              />
              <Field
                label="Localisation"
                value={item.location}
                onChange={(value) =>
                  updateEducationAt(index, { location: value })
                }
              />
              <Field
                label="Date de début"
                value={item.startDate}
                onChange={(value) =>
                  updateEducationAt(index, { startDate: value })
                }
              />
              <Field
                label="Date de fin"
                value={item.endDate}
                onChange={(value) => updateEducationAt(index, { endDate: value })}
              />
            </div>
          </ArrayItemCard>
        ))}
      </ArrayFieldEditor>
      <ArrayFieldEditor
        title="Compétences"
        addLabel="Ajouter une compétence"
        onAdd={() =>
          onChange({
            ...resume,
            skills: [...resume.skills, createEmptySkill()],
          })
        }
        emptyMessage="Aucune compétence pour l'instant."
      >
        {resume.skills.map((item, index) => (
          <ArrayItemCard
            key={item.id || `skill-${index}`}
            title={`Compétence ${index + 1}`}
            onRemove={() =>
              onChange({
                ...resume,
                skills: resume.skills.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Nom"
                value={item.label}
                onChange={(value) => updateSkillAt(index, { label: value })}
              />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-600">
                  Niveau (0-100)
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={item.level}
                  onChange={(event) =>
                    updateSkillAt(index, {
                      level: clampPercentage(Number(event.target.value)),
                    })
                  }
                  className={inputClassName}
                />
              </label>
            </div>
          </ArrayItemCard>
        ))}
      </ArrayFieldEditor>
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
  const updateCertificationAt = (
    index: number,
    patch: Partial<ResumeCertification>,
  ) =>
    onChange({
      ...resume,
      certifications: resume.certifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });

  const updateLanguageAt = (index: number, patch: Partial<ResumeLanguage>) =>
    onChange({
      ...resume,
      languages: resume.languages.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });

  return (
    <section className="space-y-5">
      <SectionTitle title="Compléments" />
      <ArrayFieldEditor
        title="Certifications"
        addLabel="Ajouter une certification"
        onAdd={() =>
          onChange({
            ...resume,
            certifications: [...resume.certifications, createEmptyCertification()],
          })
        }
        emptyMessage="Aucune certification pour l'instant."
      >
        {resume.certifications.map((item, index) => (
          <ArrayItemCard
            key={item.id || `certification-${index}`}
            title={`Certification ${index + 1}`}
            onRemove={() =>
              onChange({
                ...resume,
                certifications: resume.certifications.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Titre"
                value={item.title}
                onChange={(value) =>
                  updateCertificationAt(index, { title: value })
                }
              />
              <Field
                label="Organisme"
                value={item.issuer}
                onChange={(value) =>
                  updateCertificationAt(index, { issuer: value })
                }
              />
              <Field
                label="Année"
                value={item.year}
                onChange={(value) =>
                  updateCertificationAt(index, { year: value })
                }
              />
            </div>
          </ArrayItemCard>
        ))}
      </ArrayFieldEditor>
      <ArrayFieldEditor
        title="Langues"
        addLabel="Ajouter une langue"
        onAdd={() =>
          onChange({
            ...resume,
            languages: [...resume.languages, createEmptyLanguage()],
          })
        }
        emptyMessage="Aucune langue pour l'instant."
      >
        {resume.languages.map((item, index) => (
          <ArrayItemCard
            key={item.id || `language-${index}`}
            title={`Langue ${index + 1}`}
            onRemove={() =>
              onChange({
                ...resume,
                languages: resume.languages.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Langue"
                value={item.label}
                onChange={(value) => updateLanguageAt(index, { label: value })}
              />
              <Field
                label="Niveau"
                value={item.level}
                onChange={(value) => updateLanguageAt(index, { level: value })}
              />
            </div>
          </ArrayItemCard>
        ))}
      </ArrayFieldEditor>
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
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
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
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  helperText?: string;
  rows?: number;
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
        rows={rows}
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

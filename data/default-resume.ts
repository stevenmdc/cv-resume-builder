import type {
  ResumeCertification,
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeLink,
  ResumeSkill,
} from "@/types/resume";

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `id-${Math.random().toString(36).slice(2, 11)}`;

export const createEmptyExperience = (): ResumeExperience => ({
  id: createId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  highlights: [""],
});

export const createEmptyEducation = (): ResumeEducation => ({
  id: createId(),
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
});

export const createEmptySkill = (): ResumeSkill => ({
  id: createId(),
  label: "",
  level: 80,
});

export const createEmptyCertification = (): ResumeCertification => ({
  id: createId(),
  title: "",
  issuer: "",
  year: "",
});

export const createEmptyLanguage = (): ResumeLanguage => ({
  id: createId(),
  label: "",
  level: "",
});

export const createEmptyLink = (): ResumeLink => ({
  id: createId(),
  label: "",
  url: "",
});

export const defaultResumeData: ResumeData = {
  locale: "fr",
  personal: {
    fullName: "Alicia Moreau",
    title: "Creative Product Designer",
    email: "alicia.moreau@studiofolio.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    website: "linkedin.com/in/aliciamoreau",
    avatar: "/images/profil-page.png",
  },
  summary:
    "Designer hybride entre produit, identite visuelle et narration de marque. Je concois des experiences claires, editoriales et orientees conversion, avec une vraie attention au detail, au rythme de lecture et a l'impact visuel.",
  experience: [
    {
      id: createId(),
      role: "Senior Product Designer",
      company: "Maison Nova",
      location: "Paris, France",
      startDate: "2022",
      endDate: "",
      current: true,
      highlights: [
        "Pilotage du redesign complet de la plateforme e-commerce premium et hausse de 24% du taux de conversion mobile.",
        "Mise en place d'un design system partage entre produit, marketing et contenu editorial.",
       ],
    },
    {
      id: createId(),
      role: "Lead Brand & Web Designer",
      company: "Atelier June",
      location: "Lyon, France",
      startDate: "2019",
      endDate: "2022",
      current: false,
      highlights: [
        "Creation d'identites visuelles et de sites vitrines pour des marques lifestyle et hospitality.",
        "Conception de templates editoriaux elegants pour newsletters, landing pages et dossiers presse.",
      ],
    },
    {
      id: createId(),
      role: "UI Designer",
      company: "Pixel Harbour",
      location: "Remote",
      startDate: "2016",
      endDate: "2019",
      current: false,
      highlights: [
        "Declinaison d'interfaces web et mobile pour des produits SaaS en forte croissance.",
        "Collaboration rapprochee avec l'equipe front pour transformer les maquettes en interfaces robustes.",
      ],
    },
  ],
  education: [
    {
      id: createId(),
      degree: "Master Direction Artistique Digitale",
      school: "ECV Creative Schools",
      location: "Paris, France",
      startDate: "2014",
      endDate: "2016",
    },
    {
      id: createId(),
      degree: "Bachelor Design Graphique",
      school: "Bellecour Ecole",
      location: "Lyon, France",
      startDate: "2011",
      endDate: "2014",
    },
  ],
  skills: [
    { id: createId(), label: "Direction artistique", level: 95 },
    { id: createId(), label: "UI Design", level: 92 },
    { id: createId(), label: "Design systems", level: 89 },
    { id: createId(), label: "Storytelling visuel", level: 88 },
    { id: createId(), label: "Prototypage", level: 84 },
    { id: createId(), label: "Collaboration produit", level: 86 },
  ],
  certifications: [
    {
      id: createId(),
      title: "Google UX Design Certificate",
      issuer: "Google",
      year: "2023",
    },
    {
      id: createId(),
      title: "Advanced Design Systems",
      issuer: "Memorisely",
      year: "2022",
    },
    {
      id: createId(),
      title: "Brand Strategy Essentials",
      issuer: "Domestika",
      year: "2021",
    },
  ],
  languages: [
    { id: createId(), label: "Francais", level: "Langue maternelle" },
    { id: createId(), label: "Anglais", level: "Professionnel courant" },
  ],
  interests: [
    "Typographie",
    "Edition",
    "Design d'espace",
    "Photographie",
    "Hospitality",
  ],
  links: [
    {
      id: createId(),
      label: "Portfolio",
      url: "https://www.aliciamoreau.design",
    },
    {
      id: createId(),
      label: "LinkedIn",
      url: "https://www.linkedin.com",
    },
  ],
  theme: {
    primaryColor: "#e1634f",
    accentColor: "#fbe7e0",
    textColor: "#1f1a17",
    mutedColor: "#6e625c",
    backgroundColor: "#fffdfa",
    fontScale: "small",
  },
};

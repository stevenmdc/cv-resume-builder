"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { defaultResumeData } from "@/data/default-resume";
import {
  A4_PREVIEW_HEIGHT_PX,
  A4_PREVIEW_WIDTH_PX,
} from "@/lib/a4";
import { exportResumeAsPdf, exportResumeAsPng } from "@/lib/export";
import { normalizeResume } from "@/lib/resume";
import { loadResumeFromStorage, saveResumeToStorage } from "@/lib/storage";
import type { ResumeData } from "@/types/resume";

import { ResumePreview } from "./resume-preview";
import { SettingsModal } from "./settings-modal";
import { TopbarActions } from "./topbar-actions";

const getExportFilename = (fullName: string) =>
  fullName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") || "resume";

export function CVBuilder() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [resume, setResume] = useState<ResumeData>(defaultResumeData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setResume(normalizeResume(loadResumeFromStorage()));
      setIsHydrated(true);
    });
  }, []);

  const persistResume = useEffectEvent((nextResume: ResumeData) => {
    saveResumeToStorage(nextResume);
  });

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    persistResume(resume);
  }, [isHydrated, resume]);

  const filename = useMemo(
    () => getExportFilename(resume.personal.fullName),
    [resume.personal.fullName],
  );

  const handleProfileImageChange = (nextValue: string) => {
    setResume((currentResume) => ({
      ...currentResume,
      personal: {
        ...currentResume.personal,
        avatar: nextValue,
      },
    }));
  };

  const handleResumeChange = (nextResume: ResumeData) => {
    setResume(normalizeResume(nextResume));
  };

  const handleReset = () => {
    setResume(normalizeResume(defaultResumeData));
  };

  const runExport = async (
    exporter: (node: HTMLElement, name: string) => Promise<void>,
  ) => {
    if (!previewRef.current) {
      return;
    }

    try {
      setIsExporting(true);
      await exporter(previewRef.current, filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <TopbarActions
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportPdf={() => void runExport(exportResumeAsPdf)}
          onExportPng={() => void runExport(exportResumeAsPng)}
          busy={isExporting}
        />

        <div
          className="mx-auto"
          style={{
            width: `${A4_PREVIEW_WIDTH_PX}px`,
            minWidth: `${A4_PREVIEW_WIDTH_PX}px`,
            minHeight: `${A4_PREVIEW_HEIGHT_PX}px`,
          }}
        >
          <ResumePreview
            ref={previewRef}
            resume={resume}
            onProfileImageChange={handleProfileImageChange}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExporting ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center p-6"
          >
            <div className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-stone-50 shadow-[0_18px_40px_rgba(28,25,23,0.2)]">
              Export en cours...
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SettingsModal
        isOpen={isSettingsOpen}
        resume={resume}
        onClose={() => setIsSettingsOpen(false)}
        onReset={handleReset}
        onChange={handleResumeChange}
      />
    </>
  );
}

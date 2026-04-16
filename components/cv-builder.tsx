"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
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
  const [previewScale, setPreviewScale] = useState(1);
  const [densityLevel, setDensityLevel] = useState(200);

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

  const updatePreviewScale = useEffectEvent(() => {
    if (typeof window === "undefined") {
      return;
    }

    const baseHorizontalPadding = window.innerWidth < 640 ? 32 : 56;
    const baseVerticalChrome = window.innerWidth < 1024 ? 210 : 250;
    const densityBias = (densityLevel - 100) / 100;
    const horizontalPadding = Math.max(
      -180,
      baseHorizontalPadding - densityBias * 220,
    );
    const verticalChrome = Math.max(20, baseVerticalChrome - densityBias * 450);
    const widthScale =
      (window.innerWidth - horizontalPadding) / A4_PREVIEW_WIDTH_PX;
    const heightScale =
      (window.innerHeight - verticalChrome) / A4_PREVIEW_HEIGHT_PX;
    const baseScale = Math.min(1, widthScale, heightScale);
    const densityMultiplier = 0.35 + (densityLevel / 200) * 1.4;
    const nextScale = baseScale * densityMultiplier;
    setPreviewScale(Math.min(1.6, Math.max(0.2, nextScale)));
  });

  useEffect(() => {
    updatePreviewScale();

    const onResize = () => updatePreviewScale();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    updatePreviewScale();
  }, [densityLevel]);

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
      <div className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-center">
        <div className="flex h-34 w-8 items-center justify-center">
          <input
            type="range"
            min={125}
            max={200}
            step={1}
            value={densityLevel}
            onChange={(event) => setDensityLevel(Number(event.target.value))}
            aria-label="Ajuster la densité d'affichage du CV"
            className="h-2 w-40 cursor-pointer accent-stone-800 rotate-[-90deg]"
          />
        </div>
        <button
          type="button"
          onClick={() => setDensityLevel(200)}
          aria-label="Reset"
          title="Reset"
          className="inline-flex h-8 w-8 items-center justify-center text-stone-700/80 transition hover:text-stone-900"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <TopbarActions
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportPdf={() => void runExport(exportResumeAsPdf)}
          onExportPng={() => void runExport(exportResumeAsPng)}
          busy={isExporting}
        />

        <div
          className="mx-auto"
          style={{
            width: `${A4_PREVIEW_WIDTH_PX * previewScale}px`,
            minHeight: `${A4_PREVIEW_HEIGHT_PX * previewScale}px`,
          }}
        >
          <div
            style={{
              width: `${A4_PREVIEW_WIDTH_PX}px`,
              height: `${A4_PREVIEW_HEIGHT_PX}px`,
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
            }}
          >
            <ResumePreview
              ref={previewRef}
              resume={resume}
              onProfileImageChange={handleProfileImageChange}
            />
          </div>
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

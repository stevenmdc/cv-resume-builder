"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileImage, FileText, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ExportMenuProps {
  onExportPng: () => void;
  onExportPdf: () => void;
  busy: boolean;
}

export function ExportMenu({
  onExportPng,
  onExportPdf,
  busy,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Export"
        title="Export"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 shadow-[0_10px_25px_rgba(28,25,23,0.08)] transition hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-[0_14px_32px_rgba(28,25,23,0.12)]"
        disabled={busy}
      >
        <Upload className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 z-20 mt-3 w-48 rounded-[1.35rem] border border-stone-200 bg-white p-2 shadow-[0_22px_50px_rgba(28,25,23,0.15)]"
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onExportPdf();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-100"
            >
              <FileText className="h-4 w-4" />
              Exporter en PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onExportPng();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-stone-800 transition hover:bg-stone-100"
            >
              <FileImage className="h-4 w-4" />
              Exporter en PNG
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

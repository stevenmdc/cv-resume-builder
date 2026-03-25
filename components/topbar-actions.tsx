"use client";

import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

import { ExportMenu } from "./export-menu";

interface TopbarActionsProps {
  onOpenSettings: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  busy: boolean;
}

export function TopbarActions({
  onOpenSettings,
  onExportPng,
  onExportPdf,
  busy,
}: TopbarActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex items-center justify-end gap-3"
    >
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Settings"
        title="Settings"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-stone-50 shadow-[0_12px_30px_rgba(28,25,23,0.16)] transition hover:-translate-y-0.5 hover:bg-stone-800"
      >
        <Settings2 className="h-4 w-4" />
      </button>

      <ExportMenu
        onExportPdf={onExportPdf}
        onExportPng={onExportPng}
        busy={busy}
      />
    </motion.div>
  );
}

"use client";

import { ImageUp } from "lucide-react";
import type { ReactNode } from "react";

interface ProfileImageUploadProps {
  value: string;
  onChange: (nextValue: string) => void;
  className?: string;
  children?: ReactNode;
}

export function ProfileImageUpload({
  value,
  onChange,
  className,
  children,
}: ProfileImageUploadProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Unable to read file"));
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    onChange(dataUrl);
    event.target.value = "";
  };

  return (
    <label
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
      }
      title={value.startsWith("data:") ? "Modifier la photo" : "Ajouter une photo"}
    >
      {children ?? (
        <>
          <ImageUp className="h-4 w-4" />
          <span>Changer</span>
        </>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </label>
  );
}

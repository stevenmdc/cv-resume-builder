"use client";

import { ImageUp } from "lucide-react";

interface ProfileImageUploadProps {
  value: string;
  onChange: (nextValue: string) => void;
}

export function ProfileImageUpload({
  value,
  onChange,
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
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[1.35rem] border border-dashed border-stone-300 bg-stone-50 px-4 py-3 transition-colors hover:border-stone-400 hover:bg-stone-100">
      <div className="space-y-1">
        <span className="block font-medium text-stone-900">
          Uploader une photo
        </span>
        <span className="block text-sm text-stone-500">
          JPG, PNG ou WebP. Elle sera stockee dans le navigateur.
        </span>
        <span className="block max-w-[18rem] truncate text-sm text-stone-500">
          {value.startsWith("data:") ? "Image locale importee" : value}
        </span>
      </div>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white">
        <ImageUp className="h-5 w-5" />
      </span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </label>
  );
}

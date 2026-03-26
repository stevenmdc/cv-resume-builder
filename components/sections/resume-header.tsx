import Image from "next/image";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { CSSProperties } from "react";

import type { ResumeData } from "@/types/resume";

import { ProfileImageUpload } from "../profile-image-upload";

interface ResumeHeaderProps {
  personal: ResumeData["personal"];
  summary: string;
  primaryColor: string;
  accentColor: string;
  mutedColor: string;
  onProfileImageChange: (nextValue: string) => void;
}

const contactItems = (personal: ResumeData["personal"]) => {
  const withProtocol = (value: string) =>
    /^https?:\/\//.test(value) ? value : `https://${value}`;

  const items = [
    { icon: Mail, label: personal.email, href: `mailto:${personal.email}` },
    { icon: Phone, label: personal.phone, href: `tel:${personal.phone}` },
    { icon: MapPin, label: personal.location },
    {
      icon: Globe,
      label: personal.website,
      href: personal.website ? withProtocol(personal.website) : undefined,
    },
  ];

  return items.filter((item) => item.label.trim());
};

export function ResumeHeader({
  personal,
  summary,
  primaryColor,
  accentColor,
  mutedColor,
  onProfileImageChange,
}: ResumeHeaderProps) {
  const items = contactItems(personal);
  const isDataAvatar = personal.avatar.startsWith("data:");
  const summaryClampStyle = {
    color: mutedColor,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as CSSProperties;

  return (
    <header className="h-[220px] overflow-hidden border-b border-stone-200 px-10 py-6">
      <div className="grid h-full grid-cols-[1.05fr_0.72fr_1fr] items-center">
        <div className="space-y-3 pb-1">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              {personal.fullName}
            </h1>
            <p
              className="max-w-xl text-base font-semibold uppercase tracking-[0.24em]"
              style={{ color: primaryColor }}
            >
              {personal.title}
            </p>
          </div>
          <p
            className="max-w-2xl text-xs [line-height:1.45]"
            style={summaryClampStyle}
          >
            {summary}
          </p>
        </div>

        <div className="flex items-center justify-center self-start pt-1">
          <div
            className="group/avatar relative h-28 w-28 overflow-hidden rounded-full border-4 shadow-[0_16px_32px_rgba(28,25,23,0.12)]"
            style={{
              backgroundColor: accentColor,
              borderColor: primaryColor,
            }}
          >
            <Image
              src={personal.avatar}
              alt={personal.fullName}
              fill
              sizes="112px"
              className="object-cover object-center"
              unoptimized={isDataAvatar}
            />
            <div
              data-export-ignore="true"
              className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-stone-950/72 via-stone-950/28 to-transparent opacity-100 transition md:opacity-0 md:group-hover/avatar:opacity-100 md:group-focus-within/avatar:opacity-100"
            >
              <ProfileImageUpload
                value={personal.avatar}
                onChange={onProfileImageChange}
                className="pointer-events-auto mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/96 px-3 py-2 text-[11px] font-semibold text-stone-900 shadow-[0_12px_24px_rgba(28,25,23,0.18)] transition hover:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-1">
          {items.map(({ icon: Icon, label, href }) => {
            const content = (
              <span className="flex items-center justify-end gap-3 text-right">
                <span className="break-all">{label}</span>
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{ color: primaryColor }}
                  strokeWidth={1.8}
                />
              </span>
            );

            return href ? (
              <a
                key={`${label}-${href}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="block text-[length:var(--resume-body-size)] transition-opacity hover:opacity-75"
                style={{ color: mutedColor }}
              >
                {content}
              </a>
            ) : (
              <div
                key={label}
                className="text-[length:var(--resume-body-size)]"
                style={{ color: mutedColor }}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

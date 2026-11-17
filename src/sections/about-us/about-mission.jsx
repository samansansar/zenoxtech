"use client";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

import { alpha, Reveal, SECTION_SPACING, SectionHeader, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

const TYPE_ICONS = {
  mission: "solar:target-bold-duotone",
  vision: "solar:eye-bold-duotone",
  values: "solar:heart-pulse-bold-duotone",
  goal: "solar:flag-bold-duotone",
};

const FALLBACK_ICONS = [
  "solar:target-bold-duotone",
  "solar:eye-bold-duotone",
  "solar:heart-pulse-bold-duotone",
  "solar:flag-bold-duotone",
  "solar:star-bold-duotone",
];

const getIcon = (type, index) =>
  TYPE_ICONS[type?.toLowerCase()] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];

// ----------------------------------------------------------------------

export function AboutMission() {
  const colors = useBrandColors();
  const { aboutData } = useGetAboutData();
  const items = aboutData?.mission_visions || [];

  if (!items.length) return null;

  const gridCols = items.length % 3 === 0 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <section className={SECTION_SPACING}>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:gap-14">
        <SectionHeader eyebrow="What drives us" lead="Our purpose &" highlight="principles" colors={colors} />

        <div className={`grid grid-cols-1 gap-5 md:gap-6 ${gridCols}`}>
          {items.map((item, index) => {
            const accent = index % 2 === 0 ? colors.primary : colors.secondary;

            return (
              <Reveal key={item.id || index} delay={index * 0.08} className="h-full">
                <article
                  className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9"
                >
                  {/* Accent bar */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: accent }}
                  />

                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: alpha(accent, 12), color: accent }}
                    >
                      <Iconify icon={getIcon(item.type, index)} width={28} />
                    </div>
                    <span className="text-4xl font-black text-slate-100">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{item.title}</h3>
                    <p className="whitespace-pre-line break-words text-base leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

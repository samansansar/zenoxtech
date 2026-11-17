"use client";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

import { alpha, Reveal, SECTION_SPACING, SectionHeader, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

const FA_TO_SOLAR_ICON_MAP = {
  "fa-star": "solar:star-bold-duotone",
  "fa-lightbulb": "solar:lightbulb-bolt-bold-duotone",
  "fa-headset": "solar:headphones-round-sound-bold-duotone",
  "fa-users-cog": "solar:users-group-rounded-bold-duotone",
  "fa-shield": "solar:shield-check-bold-duotone",
  "fa-rocket": "solar:rocket-bold-duotone",
  "fa-cog": "solar:settings-bold-duotone",
  "fa-check": "solar:verified-check-bold-duotone",
  "fa-heart": "solar:heart-bold-duotone",
  "fa-clock": "solar:clock-circle-bold-duotone",
  "fa-truck": "solar:delivery-bold-duotone",
  "fa-dollar-sign": "solar:tag-price-bold-duotone",
};

// ----------------------------------------------------------------------

export function AboutFeatures() {
  const colors = useBrandColors();
  const { aboutData } = useGetAboutData();
  const features = aboutData?.why_choose_us || [];

  if (!features.length) return null;

  return (
    <section className={SECTION_SPACING}>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:gap-14">
        <SectionHeader
          eyebrow="Why choose us"
          lead="Everything you need for a"
          highlight="better shopping experience"
          description="We've designed every part of our store to make your shopping journey smooth, secure, and satisfying."
          colors={colors}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ id, title, icon, description }, index) => (
            <Reveal key={id || index} delay={(index % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: alpha(colors.primary, 10), color: colors.primary }}
                >
                  <Iconify icon={FA_TO_SOLAR_ICON_MAP[icon] || "solar:star-bold-duotone"} width={26} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 md:text-xl">{title}</h3>

                <p className="whitespace-pre-line break-words text-[0.95rem] leading-relaxed text-slate-600">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

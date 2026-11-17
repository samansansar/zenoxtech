"use client";

import { useGetAboutData } from "@/api/about";

import { alpha, getInitials, gradient, Reveal, SECTION_SPACING, SectionHeader, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

export function AboutTeam() {
  const colors = useBrandColors();
  const { aboutData } = useGetAboutData();
  const teams = aboutData?.teams || [];

  if (!teams.length) return null;

  return (
    <section className={SECTION_SPACING}>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 md:gap-14">
        <SectionHeader
          eyebrow="Our team"
          lead={`Meet the people behind ${colors.vendor?.vendor_name || "us"}`}
          description="A passionate team dedicated to giving you the best shopping experience."
          colors={colors}
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {teams.map(({ id, name, designation, featured_image }, index) => (
            <Reveal key={id || index} delay={(index % 4) * 0.08}>
              <article className="group flex flex-col gap-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
                  {featured_image ? (
                    <img
                      src={featured_image}
                      alt={name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-4xl font-black md:text-5xl"
                      style={{ background: gradient(alpha(colors.primary, 12), alpha(colors.secondary, 12)), color: colors.primary }}
                    >
                      {getInitials(name)}
                    </div>
                  )}

                  {/* Brand-colored bottom fade on hover */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to top, ${alpha(colors.primary, 45)}, transparent)` }}
                  />
                </div>

                <div className="px-1">
                  <h3 className="break-words text-base font-bold text-slate-900 md:text-lg">{name}</h3>
                  {designation && (
                    <p className="text-sm font-medium" style={{ color: colors.primary }}>
                      {designation}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

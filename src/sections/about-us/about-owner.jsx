"use client";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";
import { Markdown } from "@/components/markdown";

import { alpha, Eyebrow, getInitials, gradient, Reveal, RICH_TEXT_CLASS, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

const FALLBACK_MESSAGE =
  "We lead with passion and dedication to provide the best possible service, pushing the boundaries of what's possible.";

function OwnerPortrait({ person, colors }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] md:max-w-[380px]">
      {/* Offset brand frame */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] md:translate-x-4 md:translate-y-4"
        style={{ background: gradient(colors.primary, colors.secondary), opacity: 0.85 }}
      />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-slate-100 shadow-xl">
        {person.featured_image ? (
          <img
            src={person.featured_image}
            alt={person.name || "Leadership"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-7xl font-black"
            style={{ backgroundColor: alpha(colors.primary, 10), color: colors.primary }}
          >
            {getInitials(person.name)}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

export function AboutOwner() {
  const colors = useBrandColors();
  const { aboutData } = useGetAboutData();
  const messages = aboutData?.message || [];

  if (!messages.length) return null;

  return (
    <section
      className="rounded-[28px] px-5 py-12 md:rounded-[40px] md:px-10 md:py-20"
      style={{ background: `linear-gradient(180deg, ${alpha(colors.primary, 5)}, ${alpha(colors.secondary, 5)})` }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
        {messages.map((person, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={person.id || index}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
            >
              <Reveal className="w-full lg:w-5/12">
                <OwnerPortrait person={person} colors={colors} />
              </Reveal>

              <Reveal delay={0.1} className="w-full min-w-0 lg:w-7/12">
                <div className="flex flex-col gap-6">
                  <Eyebrow color={colors.primary}>
                    {index === 0 ? "A message from our founder" : "From our leadership"}
                  </Eyebrow>

                  <Iconify
                    icon="fa-solid:quote-left"
                    width={40}
                    style={{ color: alpha(colors.primary, 35) }}
                  />

                  <div
                    className={`text-lg leading-relaxed text-slate-700 md:text-xl ${RICH_TEXT_CLASS}`}
                  >
                    <Markdown>{person.message || person.description || FALLBACK_MESSAGE}</Markdown>
                  </div>

                  {/* Signature */}
                  <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
                    <span className="h-10 w-1 rounded-full" style={{ background: gradient(colors.primary, colors.secondary, 180) }} />
                    <div>
                      <p className="text-lg font-bold text-slate-900">{person.name || "Leadership"}</p>
                      {person.designation && (
                        <p className="text-sm font-medium" style={{ color: colors.primary }}>
                          {person.designation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

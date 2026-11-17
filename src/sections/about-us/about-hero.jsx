"use client";

import { useGetAboutData } from "@/api/about";
import { Markdown } from "@/components/markdown";

import { DarkBand, Eyebrow, GradientText, RICH_TEXT_CLASS, Reveal, splitTitle, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

export function AboutHero() {
  const colors = useBrandColors();
  const { aboutData } = useGetAboutData();
  const { title = "About Us", subtitle, description } = aboutData || {};

  const { lead, highlight } = splitTitle(title);

  return (
    <DarkBand colors={colors}>
      {/* Oversized outline word in the background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex translate-y-[18%] justify-center overflow-hidden"
      >
        <span
          className="select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-tighter text-transparent opacity-[0.08] lg:text-[16rem]"
          style={{ WebkitTextStroke: "2px white" }}
        >
          {title}
        </span>
      </div>

      <div className="mx-auto flex min-h-[420px] max-w-4xl flex-col items-center justify-center gap-6 px-5 py-16 text-center md:min-h-[480px] md:gap-8 md:py-24">
        <Reveal>
          <Eyebrow color={colors.secondary} dark>
            {subtitle || "Who we are"}
          </Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {lead}
            {lead && " "}
            <GradientText from={colors.primary} to={colors.secondary}>
              {highlight}
            </GradientText>
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.16} className="w-full max-w-2xl">
            <div className={`text-base leading-relaxed text-zinc-300 md:text-lg ${RICH_TEXT_CLASS}`}>
              <Markdown>{description}</Markdown>
            </div>
          </Reveal>
        )}
      </div>
    </DarkBand>
  );
}

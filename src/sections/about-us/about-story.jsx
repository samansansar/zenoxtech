"use client";

import Link from "next/link";
import { m } from "framer-motion";

import { paths } from "@/routes/paths";
import { Iconify } from "@/components/iconify";
import { useGetOurStoryData } from "@/api/about";
import { Markdown } from "@/components/markdown";

import {
  alpha,
  Eyebrow,
  GradientText,
  gradient,
  Reveal,
  RICH_TEXT_CLASS,
  SECTION_SPACING,
  splitTitle,
  useBrandColors,
} from "./about-shared";

// ----------------------------------------------------------------------

function FloatingIcon({ icon, color, className, delay = 0 }) {
  return (
    <m.div
      aria-hidden
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-2xl bg-white p-3.5 shadow-xl ${className}`}
    >
      <Iconify icon={icon} width={28} style={{ color }} />
    </m.div>
  );
}

function StoryVisual({ image, title, colors }) {
  if (image) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 rounded-[36px] opacity-60 blur-2xl"
          style={{ background: gradient(alpha(colors.primary, 40), alpha(colors.secondary, 40)) }}
        />
        <div className="aspect-[4/3] overflow-hidden rounded-[28px] shadow-xl">
          <img src={image} alt={title || "Our story"} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[28px]"
      style={{ background: gradient(alpha(colors.primary, 10), alpha(colors.secondary, 10)) }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-2xl md:h-32 md:w-32">
          <Iconify icon="solar:shop-2-bold-duotone" width={56} style={{ color: colors.primary }} />
        </div>
      </div>
      <FloatingIcon icon="solar:cart-large-4-bold-duotone" color={colors.primary} className="left-[12%] top-[16%] rotate-6" />
      <FloatingIcon
        icon="solar:shield-check-bold-duotone"
        color={colors.secondary}
        className="bottom-[16%] right-[12%] -rotate-6"
        delay={1}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

export function AboutStory() {
  const colors = useBrandColors();
  const { ourStoryData } = useGetOurStoryData();
  const { title, description, subtitle, featured_image } = ourStoryData || {};

  if (!title && !description) return null;

  const { lead, highlight } = splitTitle(title, 2);

  return (
    <section className={SECTION_SPACING}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 flex min-w-0 flex-col gap-6 md:order-1">
          <Eyebrow color={colors.primary}>{subtitle || "Our story"}</Eyebrow>

          {title && (
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {lead}
              {lead && " "}
              <GradientText from={colors.primary} to={colors.secondary}>
                {highlight}
              </GradientText>
            </h2>
          )}

          {description && (
            <div className={`text-base leading-relaxed text-slate-600 md:text-lg ${RICH_TEXT_CLASS}`}>
              <Markdown>{description}</Markdown>
            </div>
          )}

          <div>
            <Link
              href={paths.category}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: gradient(colors.primary, colors.secondary) }}
            >
              Explore our products
              <Iconify
                icon="solar:arrow-right-linear"
                width={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 md:order-2">
          <StoryVisual image={featured_image} title={title} colors={colors} />
        </Reveal>
      </div>
    </section>
  );
}

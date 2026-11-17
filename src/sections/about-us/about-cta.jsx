"use client";

import Link from "next/link";

import { paths } from "@/routes/paths";
import { Iconify } from "@/components/iconify";

import { DarkBand, Eyebrow, GradientText, gradient, Reveal, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

export function AboutCta() {
  const colors = useBrandColors();

  return (
    <DarkBand colors={colors} className="mb-10 mt-4 md:mb-16">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-16 text-center md:gap-8 md:py-24">
        <Eyebrow color={colors.secondary} dark>
          Next steps
        </Eyebrow>

        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
          Ready to start{" "}
          <GradientText from={colors.primary} to={colors.secondary}>
            shopping?
          </GradientText>
        </h2>

        <p className="max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Join thousands of happy customers and discover great products at unbeatable prices.
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href={paths.category}
            className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
            style={{ background: gradient(colors.primary, colors.secondary) }}
          >
            Browse products
            <Iconify
              icon="solar:arrow-right-linear"
              width={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href={paths.auth.signUp}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-white/50 hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </Reveal>
    </DarkBand>
  );
}

"use client";

import { m } from "framer-motion";

import { useAppSelector } from "@/redux/hooks";

// ----------------------------------------------------------------------
// Shared design tokens & building blocks for the About Us page
// ----------------------------------------------------------------------

/** Background for the dark "band" sections (hero, stats, CTA) */
export const DARK_SURFACE = "#18181b";

/** Vertical rhythm for light sections */
export const SECTION_SPACING = "py-14 md:py-20";

/** Typography for CMS rich text (no @tailwindcss/typography plugin installed) */
export const RICH_TEXT_CLASS = [
  "min-w-0 max-w-full break-words [overflow-wrap:anywhere]",
  "[&_p:not(:last-child)]:mb-4",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mb-1.5",
  "[&_strong]:font-semibold",
  "[&_:is(h1,h2,h3,h4)]:mb-3 [&_:is(h1,h2,h3,h4)]:font-semibold",
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl",
].join(" ");

export function useBrandColors() {
  const { vendor } = useAppSelector((state) => state.vendor);

  return {
    vendor,
    primary: vendor?.primary_color || "#4f46e5",
    secondary: vendor?.secondary_color || "#06b6d4",
  };
}

/** Works with any CSS color (hex of any length, rgb(), named colors) */
export const alpha = (color, percent) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

export const gradient = (from, to, angle = 135) => `linear-gradient(${angle}deg, ${from}, ${to})`;

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Splits a title so the last word(s) can be highlighted */
export function splitTitle(title = "", highlightWords = 1) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= highlightWords) return { lead: "", highlight: words.join(" ") };
  return {
    lead: words.slice(0, -highlightWords).join(" "),
    highlight: words.slice(-highlightWords).join(" "),
  };
}

// ----------------------------------------------------------------------

export function Reveal({ children, delay = 0, className = "" }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function GradientText({ children, from, to }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: gradient(from, to), WebkitBackgroundClip: "text" }}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, color, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? "border-white/10 bg-white/5 text-white/80" : "bg-white"
      }`}
      style={dark ? undefined : { color, borderColor: alpha(color, 20) }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}

export function SectionHeader({ eyebrow, lead, highlight, description, colors, dark = false, align = "center" }) {
  const centered = align === "center";

  return (
    <Reveal
      className={`flex flex-col gap-4 ${centered ? "mx-auto max-w-3xl items-center text-center" : "items-start"}`}
    >
      {eyebrow && (
        <Eyebrow color={colors.primary} dark={dark}>
          {eyebrow}
        </Eyebrow>
      )}

      <h2
        className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {lead}
        {lead && highlight && " "}
        {highlight && (
          <GradientText from={colors.primary} to={colors.secondary}>
            {highlight}
          </GradientText>
        )}
      </h2>

      {description && (
        <p className={`max-w-2xl text-base md:text-lg ${dark ? "text-zinc-400" : "text-slate-500"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

/** Dark rounded band with brand-colored glows */
export function DarkBand({ children, colors, className = "" }) {
  return (
    <section
      className={`relative isolate overflow-hidden rounded-[28px] md:rounded-[40px] ${className}`}
      style={{ backgroundColor: DARK_SURFACE }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-[15%] -top-[30%] h-[70%] w-[60%] rounded-full blur-[110px]"
          style={{ background: alpha(colors.primary, 35) }}
        />
        <div
          className="absolute -bottom-[30%] -right-[15%] h-[70%] w-[60%] rounded-full blur-[110px]"
          style={{ background: alpha(colors.secondary, 30) }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>
      {children}
    </section>
  );
}

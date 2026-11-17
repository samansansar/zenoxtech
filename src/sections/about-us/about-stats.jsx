"use client";

import { useEffect, useRef, useState } from "react";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

import { alpha, DarkBand, Reveal, SectionHeader, useBrandColors } from "./about-shared";

// ----------------------------------------------------------------------

function AnimatedCounter({ value, duration = 2000 }) {
  const ref = useRef(null);
  const target = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  const isDecimal = target % 1 !== 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Skip the animation for users who prefer reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return undefined;
    }

    let frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 4;
          setCount(eased * target);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return (
    // tabular-nums keeps the width steady while the digits count up
    <span ref={ref} className="tabular-nums">
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
    </span>
  );
}

// ----------------------------------------------------------------------

function StatCard({ stat, index, accent }) {
  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 md:p-7"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
        style={{ background: accent }}
      />

      {/* Icon + index */}
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset md:h-12 md:w-12"
          style={{ backgroundColor: alpha(accent, 16), color: accent, "--tw-ring-color": alpha(accent, 30) }}
        >
          <Iconify icon={stat.icon || "solar:chart-2-bold-duotone"} width={24} />
        </div>
        <span className="text-xs font-semibold tabular-nums text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Number */}
      <p className="relative mt-8 flex flex-wrap items-baseline text-4xl font-black leading-none tracking-tight text-white md:mt-12 md:text-5xl xl:text-6xl">
        <AnimatedCounter value={stat.count} duration={2200} />
        {stat.symbol && (
          // Same size as the number so "+", "%", "K" sit flush; brand color lightened for contrast on dark
          <span
            className="whitespace-nowrap"
            style={{ color: `color-mix(in srgb, ${accent} 65%, white)` }}
          >
            {String(stat.symbol).trim()}
          </span>
        )}
      </p>

      {/* Label */}
      <p className="relative mt-3 break-words text-sm font-medium text-zinc-400 md:text-base">{stat.title}</p>

      {/* Bottom accent line — grows on hover */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] w-1/3 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  );
}

// ----------------------------------------------------------------------

export function AboutStats() {
  const colors = useBrandColors();
  const { aboutData, aboutLoading } = useGetAboutData();
  const counters = aboutData?.counters || [];

  if (aboutLoading || !counters.length) return null;

  // With an odd count, the last card spans the full row so the grid has no gap
  const isOdd = counters.length % 2 !== 0;

  return (
    <DarkBand colors={colors} className="my-4 md:my-6">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:col-span-5">
          <SectionHeader
            eyebrow="Our impact"
            lead="Trusted by"
            highlight="thousands"
            description="Numbers that reflect the trust our customers place in us every day — and the standard we hold ourselves to."
            colors={colors}
            align="left"
            dark
          />

          <Reveal delay={0.1} className="hidden lg:block">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: alpha(colors.secondary, 18), color: colors.secondary }}
              >
                <Iconify icon="solar:verified-check-bold" width={20} />
              </span>
              Growing every day with our customers
            </div>
          </Reveal>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:col-span-7">
          {counters.map((stat, index) => (
            <Reveal
              key={stat.id || index}
              delay={index * 0.08}
              className={`h-full ${isOdd && index === counters.length - 1 ? "col-span-2" : ""}`}
            >
              <StatCard
                stat={stat}
                index={index}
                accent={index % 2 === 0 ? colors.primary : colors.secondary}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </DarkBand>
  );
}

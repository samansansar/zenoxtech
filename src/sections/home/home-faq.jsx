"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

import { useAppSelector } from "@/redux/hooks";
import { useGetHomeFaqs } from "@/api";
import { Markdown } from "@/components/markdown";

// ----------------------------------------------------------------------

const DEFAULT_PRIMARY = "#1976d2";
const DEFAULT_SECONDARY = "#9c27b0";

const TEXT_DARK = "#1c252e";
const TEXT_MUTED = "#637381";
const GREY_BORDER = "rgba(145,158,171,0.12)";
const GREY_SHADOW = "0 2px 8px rgba(145,158,171,0.08)";

/** Typography for answer content (no @tailwindcss/typography plugin installed) */
const ANSWER_TEXT_CLASS = [
  "min-w-0 max-w-full break-words [overflow-wrap:anywhere]",
  "text-[0.9rem] leading-relaxed text-gray-600 md:text-[0.95rem]",
  "[&_p:not(:last-child)]:mb-3",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mb-1",
  "[&_strong]:font-semibold [&_strong]:text-gray-800",
  "[&_:is(h1,h2,h3,h4)]:mb-2 [&_:is(h1,h2,h3,h4)]:font-semibold [&_:is(h1,h2,h3,h4)]:text-gray-800",
].join(" ");

/** Keeps rich-text (HTML) answers inside the card on small screens */
const ANSWER_HTML_CLASS = [
  "[&_*]:max-w-full [&_*]:w-auto!",
  "[&_*:not(pre):not(code)]:whitespace-normal!",
  "[&_img]:h-auto",
  "[&_table]:block [&_table]:overflow-x-auto",
  "[&_pre]:overflow-x-auto",
].join(" ");

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// ----------------------------------------------------------------------

/** Converts a hex color + opacity (0–1) to rgba() */
function hexAlpha(hex, opacity) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/** True when the answer contains HTML tags (rich text from the editor) */
function isHtml(text = "") {
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

// ----------------------------------------------------------------------
// Inline SVG icons
// ----------------------------------------------------------------------

function QuestionCircleIcon({ size = 20, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path opacity={0.5} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
      <path d="M12 17.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zM12 7a2.5 2.5 0 0 0-2.5 2.5.75.75 0 0 0 1.5 0 1 1 0 1 1 1.957.294c-.15.417-.516.75-1.063 1.17C10.676 11.4 10 12.04 10 13.25a.75.75 0 0 0 1.5 0c0-.46.264-.754.822-1.168.574-.426 1.353-1.068 1.624-1.876A2.5 2.5 0 0 0 12 7z" />
    </svg>
  );
}

function ChatDotsIcon({ size = 22, className = "", style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path opacity={0.5} d="M12 2C6.477 2 2 6.253 2 11.5c0 2.117.75 4.07 2 5.643V21l4.047-2.024A11.27 11.27 0 0 0 12 19c5.523 0 10-3.253 10-7.5S17.523 2 12 2z" />
      <path d="M8 11.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  );
}

function PlusMinusIcon({ open, size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      {!open && <line x1="12" y1="5" x2="12" y2="19" />}
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ----------------------------------------------------------------------

function FaqAnswer({ answer }) {
  return (
    <div className={ANSWER_TEXT_CLASS}>
      {isHtml(answer) ? (
        <div className={ANSWER_HTML_CLASS}>
          <Markdown>{answer}</Markdown>
        </div>
      ) : (
        <p className="whitespace-pre-line">{answer?.trim()}</p>
      )}
    </div>
  );
}

function FaqItem({ faq, index, isOpen, accentColor, onToggle }) {
  const accentText = isOpen ? accentColor : TEXT_MUTED;

  return (
    <m.div {...fadeUp} transition={{ delay: index * 0.1 }}>
      <div
        className="overflow-hidden rounded-2xl border bg-white transition-all duration-300"
        style={{
          borderColor: isOpen ? hexAlpha(accentColor, 0.2) : GREY_BORDER,
          boxShadow: isOpen ? `0 8px 24px ${hexAlpha(accentColor, 0.12)}` : GREY_SHADOW,
        }}
      >
        {/* Question */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 p-3 text-left"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-xl sm:flex"
              style={{
                backgroundColor: isOpen ? hexAlpha(accentColor, 0.1) : "rgba(145,158,171,0.06)",
              }}
            >
              <ChatDotsIcon
                size={22}
                className="transition-colors duration-300"
                style={{ color: accentText }}
              />
            </div>

            <h3
              className="min-w-0 break-words text-[0.95rem] font-semibold transition-colors duration-300 md:text-[1.05rem]"
              style={{ color: isOpen ? accentColor : TEXT_DARK }}
            >
              {faq.question}
            </h3>
          </div>

          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
            style={{
              backgroundColor: isOpen ? hexAlpha(accentColor, 0.12) : "rgba(145,158,171,0.08)",
              color: accentText,
            }}
          >
            <PlusMinusIcon open={isOpen} />
          </div>
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-4 sm:pl-[52px] sm:pr-12">
                <FaqAnswer answer={faq.answer} />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
}

// ----------------------------------------------------------------------

export function HomeFaq() {
  const { vendor } = useAppSelector((state) => state.vendor);
  const { faqs } = useGetHomeFaqs();

  const primaryColor = vendor?.primary_color || DEFAULT_PRIMARY;
  const secondaryColor = vendor?.secondary_color || DEFAULT_SECONDARY;

  const [expanded, setExpanded] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Open the first FAQ once on load only — otherwise closing an item would re-open the first one
  useEffect(() => {
    if (faqs?.length && !initialized) {
      setExpanded(faqs[0].id);
      setInitialized(true);
    }
  }, [faqs, initialized]);

  const handleToggle = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (!faqs?.length) {
    return null;
  }

  return (
    <section
      className="relative my-2 overflow-hidden rounded-3xl py-8 md:py-12 lg:my-6 lg:mb-16"
      style={{
        background: `linear-gradient(135deg, ${hexAlpha(primaryColor, 0.02)} 0%, ${hexAlpha(secondaryColor, 0.02)} 100%)`,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -right-[100px] -top-[100px] h-[300px] w-[300px] rounded-full"
        style={{ background: `radial-gradient(circle, ${hexAlpha(primaryColor, 0.1)} 0%, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[400px] w-[400px] rounded-full"
        style={{ background: `radial-gradient(circle, ${hexAlpha(secondaryColor, 0.08)} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-5 px-4">
        {/* Header */}
        <m.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: hexAlpha(secondaryColor, 0.08), color: secondaryColor }}
          >
            <QuestionCircleIcon size={20} />
            <span className="text-sm font-semibold">FAQ</span>
          </div>

          <h2
            className="mb-2 text-[2rem] font-extrabold md:text-[2.5rem]"
            style={{ color: secondaryColor }}
          >
            Frequently Asked Questions
          </h2>

          <p className="mx-auto max-w-[600px] text-[0.95rem] text-gray-500 md:text-[1.05rem]">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </m.div>

        {/* FAQ list */}
        <m.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto flex w-full max-w-[900px] flex-col gap-3"
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              index={index}
              isOpen={expanded === faq.id}
              accentColor={secondaryColor}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </m.div>
      </div>
    </section>
  );
}

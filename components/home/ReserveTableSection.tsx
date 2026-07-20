// components/home/ReserveTableSection.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

const badgeList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const badgeItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } },
};

/**
 * Table reservation promo — sits right after the home-delivery panel and
 * shares its night background + button styling so the two CTA sections read
 * as a matched pair, while the floor-plan image gives it its own identity.
 */
export default function ReserveTableSection() {
  const prefersReducedMotion = useReducedMotion();
  const { dict: t } = useI18n();

  const features = [
    t.home.reserveFeatureInstant,
    t.home.reserveFeatureDining,
    t.home.reserveFeatureGroups,
    t.home.reserveFeatureEasy,
  ];

  return (
    <section className="relative py-14 md:py-20 bg-night px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      <div
        aria-hidden
        className="absolute w-80 h-80 sm:w-104 sm:h-104 -top-20 -right-20 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Floor plan image */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative flex justify-center"
        >
          <div
            aria-hidden
            className="absolute bottom-4 inset-x-10 h-8 rounded-full bg-black/60 blur-2xl"
          />
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { y: [0, -14, 0], rotate: [0, 1.2, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 6, ease: "easeInOut", repeat: Infinity }
            }
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 border border-white/10"
          >
            {/* Placeholder floor plan — swap src for the restaurant's real
                floor plan photo/render when available. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/floor-plan-placeholder.svg"
              alt={t.home.reserveImageAlt}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Copy + CTA */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center lg:text-left"
        >
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {t.home.reserveEyebrow}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mt-3 mb-4 text-cream leading-tight">
            {t.home.reserveTitle}
          </h2>
          <p className="text-sm md:text-base text-gray-400 font-light mb-8 max-w-md mx-auto lg:mx-0">
            {t.home.reserveDescription}
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={badgeList}
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
          >
            {features.map((feature) => (
              <motion.li
                key={feature}
                variants={badgeItem}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300"
              >
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-accent/20 text-accent shrink-0">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-2.5 h-2.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5L8 14.5L16 5.5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {feature}
              </motion.li>
            ))}
          </motion.ul>

          <Link href="/reservations" className="inline-block">
            <motion.span
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="relative inline-flex items-center overflow-hidden bg-accent text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-night"
            >
              <span className="relative z-10">{t.home.reserveCtaButton}</span>
              <motion.span
                aria-hidden
                variants={{
                  rest: { x: "-120%" },
                  hover: { x: "220%" },
                }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
              />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

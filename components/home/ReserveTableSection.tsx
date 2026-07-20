// components/home/ReserveTableSection.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useI18n } from "@/components/i18n/I18nProvider";
import type {
  DayHours,
  DayOfWeek,
  OperatingHours,
} from "@/lib/settings/operating-hours";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

// Monday-first display order for the hours list, matching how most
// restaurant hours cards read (the raw data is Sunday-first, day 0).
const DISPLAY_ORDER: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

function formatDayHours(day: DayHours, closedLabel: string): string {
  if (day.closed) return closedLabel;
  const shifts = [
    day.lunchOpen && day.lunchClose ? `${day.lunchOpen} – ${day.lunchClose}` : null,
    day.dinnerOpen && day.dinnerClose ? `${day.dinnerOpen} – ${day.dinnerClose}` : null,
  ].filter((shift): shift is string => Boolean(shift));
  return shifts.length ? shifts.join(" · ") : closedLabel;
}

type ReserveTableSectionProps = {
  operatingHours: OperatingHours;
  isOpenNow: boolean;
  todayDay: DayOfWeek;
};

/**
 * Table reservation section — sits right after the home-delivery panel.
 * Three columns (stacking on mobile): an opening-hours card with the full
 * weekly hours and booking CTA, a promotional blurb, and the floor-plan
 * image. Hours come from RestaurantSettings so they stay in sync with what
 * the owner edits in /dashboard/settings.
 */
export default function ReserveTableSection({
  operatingHours,
  isOpenNow,
  todayDay,
}: ReserveTableSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { dict: t } = useI18n();

  return (
    <section className="relative py-14 md:py-20 bg-night px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      {/* Top fade — blends this panel into whatever section sits above it. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-16 md:h-24 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, var(--color-night) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute w-80 h-80 sm:w-104 sm:h-104 -top-20 -right-20 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-stretch">
        {/* Opening hours card — full weekly hours + book button */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="glass rounded-3xl p-8 flex flex-col text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between gap-3 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t.home.reserveHoursTitle}
            </h3>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${
                isOpenNow
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? "bg-accent" : "bg-gray-500"}`}
              />
              {isOpenNow ? t.home.reserveOpenNow : t.home.reserveClosedNow}
            </div>
          </div>

          <ul className="divide-y divide-white/5 mb-8">
            {DISPLAY_ORDER.map((day) => {
              const hours = operatingHours.find((h) => h.day === day);
              const isToday = day === todayDay;
              return (
                <li
                  key={day}
                  className={`flex items-center justify-between gap-6 py-2.5 text-sm ${
                    isToday ? "text-cream font-medium" : "text-gray-400 font-light"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {isToday && <span aria-hidden className="w-1 h-1 rounded-full bg-accent" />}
                    {t.home.weekdays[day]}
                  </span>
                  <span>{hours ? formatDayHours(hours, t.home.reserveClosedDay) : t.home.reserveClosedDay}</span>
                </li>
              );
            })}
          </ul>

          <Link href="/reservations" className="inline-block mt-auto self-center lg:self-start">
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

        {/* Promotional text */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="flex flex-col justify-center text-center lg:text-left"
        >
          <span className="text-accent text-xs font-semibold uppercase tracking-widest">
            {t.home.reserveEyebrow}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mt-3 mb-4 text-cream leading-tight">
            {t.home.reserveTitle}
          </h2>
          <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
            {t.home.reserveDescription}
          </p>
        </motion.div>

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
            className="relative w-full max-w-xs sm:max-w-sm lg:max-w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 border border-white/10"
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
      </div>
    </section>
  );
}

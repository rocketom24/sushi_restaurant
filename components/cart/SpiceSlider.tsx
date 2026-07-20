"use client";

import { useCallback, useRef } from "react";

const LEVELS = ["MILD", "MEDIUM", "HOT"] as const;
export type SpiceLevel = (typeof LEVELS)[number];

/**
 * A small draggable heat slider — the same MILD/MEDIUM/HOT choice that
 * used to be three separate buttons, now a single track with a chili
 * thumb the customer can drag or step with +/- to the level they want.
 */
export default function SpiceSlider({
  value,
  onChange,
  labels,
}: {
  value: SpiceLevel;
  onChange: (level: SpiceLevel) => void;
  labels: Record<SpiceLevel, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const index = LEVELS.indexOf(value);
  const percent = (index / (LEVELS.length - 1)) * 100;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const nearest = LEVELS[Math.round(ratio * (LEVELS.length - 1))];
      if (nearest !== value) onChange(nearest);
    },
    [value, onChange]
  );

  function step(delta: number) {
    const next = LEVELS[Math.min(LEVELS.length - 1, Math.max(0, index + delta))];
    if (next !== value) onChange(next);
  }

  return (
    <div className="w-full select-none" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index === 0}
          aria-label={`${labels.MILD} -`}
          className="shrink-0 w-5 h-5 rounded-full border border-white/20 text-gray-400 flex items-center justify-center transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14" />
          </svg>
        </button>

        <div
          ref={trackRef}
          role="slider"
          aria-label="Spice level"
          aria-valuemin={0}
          aria-valuemax={LEVELS.length - 1}
          aria-valuenow={index}
          aria-valuetext={labels[value]}
          tabIndex={0}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 1) return;
            setFromClientX(e.clientX);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
          }}
          className="relative flex-1 h-1.5 rounded-full cursor-pointer touch-none"
          style={{ background: "linear-gradient(to right, #facc15, #f97316, var(--color-accent))" }}
        >
          <div
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cream shadow-md ring-2 ring-carbon flex items-center justify-center transition-[left] duration-200 ease-out"
            style={{ left: `${percent}%` }}
          >
            <span className="text-[8px] leading-none">🌶️</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={index === LEVELS.length - 1}
          aria-label={`${labels.HOT} +`}
          className="shrink-0 w-5 h-5 rounded-full border border-white/20 text-gray-400 flex items-center justify-center transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between mt-1 px-7">
        <span className="text-[8px] text-gray-500 uppercase tracking-wide">{labels.MILD}</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-wide">{labels.HOT}</span>
      </div>
    </div>
  );
}

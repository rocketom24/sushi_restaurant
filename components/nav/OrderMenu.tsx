"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";

const ICONS = {
  DELIVERY: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
    />
  ),
  DINE_IN: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 9l2-5h12l2 5M3 9h18M6 9v11M18 9v11"
    />
  ),
  TAKEAWAY: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 8l-9-4-9 4 9 4 9-4zM3 8v9l9 4 9-4V8M12 12v9"
    />
  ),
};

export default function OrderMenu() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const options = [
    { type: "DELIVERY", label: dict.nav.orderDelivery },
    { type: "DINE_IN", label: dict.nav.orderDineIn },
    { type: "TAKEAWAY", label: dict.nav.orderTakeaway },
  ] as const;

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative inline-flex items-center gap-1.5 py-1 transition-all duration-300 hover:text-accent hover:scale-110 after:content-[''] after:absolute after:left-1/2 after:-bottom-0.5 after:h-px after:w-0 after:-translate-x-1/2 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
      >
        {dict.nav.order}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        role="menu"
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="glass rounded-2xl p-2 w-60 shadow-2xl shadow-black/50">
          {options.map((opt) => (
            <Link
              key={opt.type}
              href={`/checkout?type=${opt.type}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-gray-300 hover:text-cream hover:bg-white/5 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {ICONS[opt.type]}
              </svg>
              {opt.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

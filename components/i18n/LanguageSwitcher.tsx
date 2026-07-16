"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n/dictionaries";
import { useI18n } from "./I18nProvider";

/** EN | IT toggle — sets the locale cookie and re-renders the tree. */
export default function LanguageSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center rounded-full border border-white/10 overflow-hidden text-[10px] font-semibold tracking-widest"
      aria-label="Language"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          disabled={isPending}
          aria-pressed={locale === l}
          className={`px-2.5 py-1.5 uppercase transition-colors duration-300 ${
            locale === l
              ? "bg-accent text-white"
              : "text-gray-400 hover:text-cream"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

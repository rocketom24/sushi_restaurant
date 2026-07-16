"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  dictionaries,
  type Dict,
  type Locale,
} from "@/lib/i18n/dictionaries";

const I18nContext = createContext<{ locale: Locale; dict: Dict }>({
  locale: DEFAULT_LOCALE,
  dict: dictionaries[DEFAULT_LOCALE],
});

/** Makes the server-resolved locale available to client components. */
export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

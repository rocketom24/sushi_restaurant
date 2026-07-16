"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function EmptyCart() {
  const { dict } = useI18n();

  return (
    <div className="text-center py-16">
      <p className="text-gray-400 font-light mb-6">{dict.cart.empty}</p>
      <Link
        href="/menu"
        className="inline-block bg-accent hover:bg-white hover:text-night text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
      >
        {dict.cart.browseMenu}
      </Link>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";

type NavUser = { name: string; role: "CUSTOMER" | "OWNER" | "KITCHEN" } | null;

export default function ProfileMenu({ user }: { user: NavUser }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const linkClass =
    "block px-3.5 py-2.5 rounded-xl text-sm text-gray-300 hover:text-cream hover:bg-white/5 transition-colors duration-200";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.nav.account}
        className="relative p-2 text-cream hover:text-accent transition-colors duration-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="8" r="3.5" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M4.5 20a7.5 7.5 0 0115 0" />
        </svg>
        {user && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
        )}
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-full pt-4 transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="glass rounded-2xl p-2 w-64 shadow-2xl shadow-black/50">
          {user ? (
            <>
              <p className="px-3.5 pt-2 pb-3 text-xs text-gray-500 uppercase tracking-widest">
                {dict.nav.hi}, <span className="text-cream normal-case">{user.name}</span>
              </p>
              <div className="space-y-0.5">
                {user.role === "CUSTOMER" && (
                  <>
                    <Link href="/profile" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                      {dict.nav.profile}
                    </Link>
                    <Link href="/orders" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                      {dict.nav.myOrders}
                    </Link>
                    <Link href="/reservations" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                      {dict.nav.myReservations}
                    </Link>
                    <Link href="/loyalty" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                      {dict.nav.loyalty}
                    </Link>
                  </>
                )}
                {user.role === "OWNER" && (
                  <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                    {dict.nav.dashboard}
                  </Link>
                )}
              </div>
              <div className="my-2 border-t border-white/5" />
              <div className="flex items-center justify-between px-3.5 py-1.5">
                <LanguageSwitcher />
                <LogoutButton
                  label={dict.nav.logout}
                  className="text-xs uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-0.5">
                <Link href="/login" role="menuitem" onClick={() => setOpen(false)} className={linkClass}>
                  {dict.nav.login}
                </Link>
                <Link
                  href="/register"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block mx-1 mt-1 px-3.5 py-2.5 rounded-xl text-sm text-center bg-accent hover:bg-white hover:text-night text-white font-semibold transition-all duration-300"
                >
                  {dict.nav.signup}
                </Link>
              </div>
              <div className="my-2 border-t border-white/5" />
              <div className="px-3.5 py-1.5">
                <LanguageSwitcher />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

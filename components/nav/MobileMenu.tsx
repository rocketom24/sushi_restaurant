"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";

type NavUser = { name: string; role: "CUSTOMER" | "OWNER" | "KITCHEN" } | null;

export default function MobileMenu({ user }: { user: NavUser }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  function close() {
    setOpen(false);
    setOrderOpen(false);
  }

  const linkClass =
    "block py-3.5 text-lg font-serif text-cream/90 hover:text-accent transition-colors duration-300 border-b border-white/5";

  const orderOptions = [
    { type: "DELIVERY", label: dict.nav.orderDelivery },
    { type: "DINE_IN", label: dict.nav.orderDineIn },
    { type: "TAKEAWAY", label: dict.nav.orderTakeaway },
  ] as const;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.openMenu}
        className="p-2 -ml-2 text-cream hover:text-accent transition-colors duration-300 lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-70 lg:hidden">
            <button
              type="button"
              aria-label={dict.nav.closeMenu}
              onClick={close}
              className="fixed inset-0 bg-night/85 backdrop-blur-md"
            />

            <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-carbon border-r border-white/5 h-full shadow-2xl flex flex-col overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <span className="font-serif text-xl tracking-widest font-bold text-cream">
                  NAGASAKI<span className="text-accent">.</span>
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={dict.nav.closeMenu}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-6 py-4">
                <Link href="/menu" onClick={close} className={linkClass}>
                  {dict.nav.menu}
                </Link>
                <Link href="/reservations/new" onClick={close} className={linkClass}>
                  {dict.nav.book}
                </Link>

                <button
                  type="button"
                  onClick={() => setOrderOpen((o) => !o)}
                  aria-expanded={orderOpen}
                  className="w-full flex items-center justify-between py-3.5 text-lg font-serif text-cream/90 hover:text-accent transition-colors duration-300 border-b border-white/5"
                >
                  {dict.nav.order}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${orderOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${orderOpen ? "max-h-40" : "max-h-0"}`}>
                  {orderOptions.map((opt) => (
                    <Link
                      key={opt.type}
                      href={`/checkout?type=${opt.type}`}
                      onClick={close}
                      className="block py-2.5 pl-4 text-sm text-gray-400 hover:text-accent transition-colors duration-300"
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-5 space-y-0.5">
                  {user ? (
                    <>
                      {user.role === "CUSTOMER" && (
                        <>
                          <Link href="/profile" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                            {dict.nav.profile}
                          </Link>
                          <Link href="/orders" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                            {dict.nav.myOrders}
                          </Link>
                          <Link href="/reservations" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                            {dict.nav.myReservations}
                          </Link>
                          <Link href="/loyalty" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                            {dict.nav.loyalty}
                          </Link>
                        </>
                      )}
                      {user.role === "OWNER" && (
                        <Link href="/dashboard" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                          {dict.nav.dashboard}
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                        {dict.nav.login}
                      </Link>
                      <Link href="/register" onClick={close} className="block py-2 text-sm text-gray-400 hover:text-accent transition-colors duration-300">
                        {dict.nav.signup}
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              <div className="px-6 py-5 border-t border-white/5 flex items-center justify-between">
                <LanguageSwitcher />
                {user && (
                  <LogoutButton
                    label={dict.nav.logout}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

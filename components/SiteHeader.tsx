import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import CartDrawer from "@/components/cart/CartDrawer";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default async function SiteHeader() {
  const [user, t] = await Promise.all([getCurrentUser(), getDict()]);

  return (
    <header className="sticky top-0 z-40 bg-night/70 backdrop-blur-md border-b border-white/3">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link
          href="/"
          className="text-xl md:text-2xl font-serif tracking-widest font-bold text-cream"
        >
          KURO<span className="text-accent">.</span>
        </Link>

        <nav className="order-last w-full md:order-0 md:w-auto flex flex-wrap items-center gap-x-7 gap-y-1 text-xs tracking-widest uppercase font-light text-cream/80">
          <Link href="/menu" className="hover:text-accent transition-colors duration-300">
            {t.nav.menu}
          </Link>
          <Link
            href="/reservations/new"
            className="hover:text-accent transition-colors duration-300"
          >
            {t.nav.book}
          </Link>
          {user && user.role === "CUSTOMER" && (
            <>
              <Link href="/orders" className="hover:text-accent transition-colors duration-300">
                {t.nav.myOrders}
              </Link>
              <Link
                href="/reservations"
                className="hover:text-accent transition-colors duration-300"
              >
                {t.nav.myReservations}
              </Link>
            </>
          )}
          {user && user.role === "OWNER" && (
            <Link href="/dashboard" className="hover:text-accent transition-colors duration-300">
              {t.nav.dashboard}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {(!user || user.role === "CUSTOMER") && <CartDrawer />}
          {user ? (
            <div className="flex items-center gap-4 text-xs tracking-wider">
              {user.role === "CUSTOMER" ? (
                <Link
                  href="/profile"
                  className="text-gray-400 hover:text-accent transition-colors duration-300 hidden sm:inline"
                >
                  {t.nav.hi}, {user.name}
                </Link>
              ) : (
                <span className="text-gray-500 hidden sm:inline">
                  {t.nav.hi}, {user.name}
                </span>
              )}
              <LogoutButton
                label={t.nav.logout}
                className="text-xs tracking-widest uppercase text-gray-400 hover:text-accent transition-colors duration-300"
              />
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase">
              <Link
                href="/login"
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="bg-accent hover:bg-white hover:text-night text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300"
              >
                {t.nav.signup}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

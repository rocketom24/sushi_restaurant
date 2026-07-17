import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import CartDrawer from "@/components/cart/CartDrawer";
import NavLogo from "@/components/nav/NavLogo";
import OrderMenu from "@/components/nav/OrderMenu";
import ProfileMenu from "@/components/nav/ProfileMenu";
import MobileMenu from "@/components/nav/MobileMenu";
import SearchOverlay from "@/components/search/SearchOverlay";

export default async function SiteHeader() {
  const [user, t] = await Promise.all([getCurrentUser(), getDict()]);

  const navUser = user ? { name: user.name, role: user.role } : null;

  return (
    <header className="sticky top-0 z-40 bg-night/70 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left: hamburger (mobile) + logo/name */}
        <div className="flex items-center gap-1">
          <MobileMenu user={navUser} />
          <NavLogo />
        </div>

        {/* Middle: primary nav, desktop only */}
        <nav className="hidden lg:flex items-center justify-center gap-9 text-xs tracking-widest uppercase font-light text-cream/80">
          <Link href="/menu" className="hover:text-accent transition-colors duration-300">
            {t.nav.menu}
          </Link>
          <Link href="/reservations/new" className="hover:text-accent transition-colors duration-300">
            {t.nav.book}
          </Link>
          <OrderMenu />
        </nav>

        {/* Right: search, cart, profile — exactly three icons */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <SearchOverlay />
          {(!user || user.role === "CUSTOMER") && <CartDrawer />}
          <ProfileMenu user={navUser} />
        </div>
      </div>
    </header>
  );
}

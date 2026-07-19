import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import { getDict } from "@/lib/i18n/server";
import CartDrawer from "@/components/cart/CartDrawer";
import NavLogo from "@/components/nav/NavLogo";
import OrderMenu from "@/components/nav/OrderMenu";
import ProfileMenu from "@/components/nav/ProfileMenu";
import MobileMenu from "@/components/nav/MobileMenu";
import SearchOverlay from "@/components/search/SearchOverlay";
import FloatingHeaderShell from "@/components/nav/FloatingHeaderShell";

const navLinkClass =
  "relative inline-block py-1 transition-all duration-300 hover:text-accent hover:scale-110 " +
  "after:content-[''] after:absolute after:left-1/2 after:-bottom-0.5 after:h-px after:w-0 " +
  "after:-translate-x-1/2 after:bg-accent after:transition-all after:duration-300 hover:after:w-full";

export default async function SiteHeader() {
  const [user, t] = await Promise.all([getCurrentUser(), getDict()]);

  const navUser = user ? { name: user.name, role: user.role } : null;

  return (
    <FloatingHeaderShell>
      <div className="mx-auto px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left: hamburger (mobile) + logo/name */}
        <div className="flex items-center gap-1">
          <MobileMenu user={navUser} />
          <NavLogo />
        </div>

        {/* Middle: primary nav, desktop only */}
        <nav className="hidden lg:flex items-center justify-center gap-10 text-sm tracking-wide uppercase font-semibold text-cream/90">
          <Link href="/menu" className={navLinkClass}>
            {t.nav.menu}
          </Link>
          <Link href="/reservations/new" className={navLinkClass}>
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
    </FloatingHeaderShell>
  );
}
